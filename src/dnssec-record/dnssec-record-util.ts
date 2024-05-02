
import {
  GetDNSSECCommand,
  ChangeResourceRecordSetsCommand,
  GetChangeCommand,
  ChangeStatus,
  KeySigningKey,
  Route53Client,
} from '@aws-sdk/client-route-53';
import { AssumeRoleCommand, STSClient } from '@aws-sdk/client-sts';

export class DnssecRecordUtil {

  async getClient(assumeRoleArn?: string) {
    // Do assume role if arn is provided
    if (assumeRoleArn) {
      const sts = new STSClient();
      const response = await sts.send(new AssumeRoleCommand({
        RoleArn: assumeRoleArn,
        RoleSessionName: 'dnssec-record-construct',
      }));
      if (!response.Credentials) {
        throw Error('Could not obtain credentials');
      }
      console.log('assumed role', response.Credentials.AccessKeyId);
      // Construct the client
      // Explicit assign, see https://github.com/aws/aws-sdk-js-v3/issues/3940
      return new Route53Client({
        credentials: {
          accessKeyId: response.Credentials.AccessKeyId!,
          secretAccessKey: response.Credentials.SecretAccessKey!,
          sessionToken: response.Credentials.SessionToken!,
        },
      });
    }

    return new Route53Client();
  }

  /**
   * Will search the hosted zone for active KeySigningKeys and
   * returns the DS record value from the first active KSK found.
   * @param hostedZoneId
   * @returns
   */
  async getDsRecordValue(hostedZoneId: string, keySigningKeyName: string, assumeRoleArn?: string) {
    // Obtain DNSSEC status from hosted zone
    const dnssecCommand = new GetDNSSECCommand({
      HostedZoneId: hostedZoneId,
    });
    const client = await this.getClient(assumeRoleArn);
    const dnssecInfo = await client.send(dnssecCommand);

    // Find the key signing key by name
    const keySigningKey = dnssecInfo.KeySigningKeys?.find((k: KeySigningKey) => k.Name == keySigningKeyName && k.Status == 'ACTIVE');
    if (!keySigningKey) {
      console.error('Could not find active KSK', keySigningKeyName, JSON.stringify(dnssecInfo.KeySigningKeys));
      throw Error(`Could not find an (active) KeySignigKey with name ${keySigningKeyName} (see logging for more details)`);
    }

    // Get the record value
    const dsRecordValue = keySigningKey.DSRecord;
    if (!dsRecordValue) {
      throw Error(`Value: ${dsRecordValue} is not a valid DS record value`);
    }

    return dsRecordValue;
  }


  /**
   * Tries to create the DS record in the parent hosted zone
   * @param parentHostedZoneId
   * @param dsRecordName
   * @param dsRecordValue
   */
  async createDsRecord(parentHostedZoneId: string, dsRecordName: string, dsRecordValue: string, assumeRoleArn?: string) {
    const createRecordCommand = new ChangeResourceRecordSetsCommand({
      HostedZoneId: parentHostedZoneId, // DS is in parent hosted zone!
      ChangeBatch: {
        Comment: 'Create DS record in parent hosted zone',
        Changes: [
          {
            Action: 'UPSERT', // Create if not exist update otherwise
            ResourceRecordSet: {
              Name: dsRecordName,
              Type: 'DS',
              ResourceRecords: [
                { Value: dsRecordValue },
              ],
              TTL: 3600,
            },
          },
        ],
      },
    });

    const client = await this.getClient(assumeRoleArn);
    const createRecordResult = await client.send(createRecordCommand);

    const changeId = createRecordResult.ChangeInfo?.Id;
    if (!changeId) {
      throw Error('No change ID returned while creating record');
    }

    return changeId;
  }


  /**
   * Wait for a chagne to be INSYNC
   * @param changeId
   * @param maxRetries
   * @param intervalMilis
   * @returns
   */
  async waitForChange(changeId: string, maxRetries: number, intervalMilis: number, assumeRoleArn?: string) {

    let retries = 0;
    while (retries <= maxRetries) {
      retries++;

      // Check if change is INSYNC
      const changeStatusCommand = new GetChangeCommand({
        Id: changeId,
      });

      const client = await this.getClient(assumeRoleArn);
      const status = await client.send(changeStatusCommand);

      if (status.ChangeInfo?.Status == ChangeStatus.INSYNC) {
        return true;
      }

      await this.sleep(intervalMilis);
    }
    return false;
  }

  private async sleep(millis: number) {
    return new Promise(resolve => setTimeout(resolve, millis));
  }

}
