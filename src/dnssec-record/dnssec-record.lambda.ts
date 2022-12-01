import { Route53Client } from '@aws-sdk/client-route-53';
import {
  CloudFormationCustomResourceEvent,
  CloudFormationCustomResourceResponse,
} from 'aws-lambda';
import { DnssecRecordUtil } from './dnssec-record-util';

const route53Client = new Route53Client({});

/**
 * Entry point of the custom resource
 */
exports.handler = async (event: CloudFormationCustomResourceEvent): Promise<CloudFormationCustomResourceResponse> => {
  switch (event.RequestType) {
    case 'Create': return onCreateUpdate(event);
    case 'Update': return onCreateUpdate(event);
    case 'Delete': return response('SUCCESS', event, 'Note: DS record is not deleted from hosted zone');
  }
};

async function onCreateUpdate(
  event: CloudFormationCustomResourceEvent,
): Promise<CloudFormationCustomResourceResponse> {

  // Get parameters for custom resource
  const keySigningKeyName = event.ResourceProperties.keySigningKeyName;
  const hostedZoneId = event.ResourceProperties.hostedZoneId;
  const hostedZoneName = event.ResourceProperties.hostedZoneName;
  const parentHostedZoneId = event.ResourceProperties.parentHostedZoneId;

  console.info('KeySigningKey name:', keySigningKeyName);
  console.info('Hosted zone ID:', hostedZoneId);
  console.info('Hosted zone name:', hostedZoneName);
  console.info('Parent hosted zone ID:', parentHostedZoneId);

  const util = new DnssecRecordUtil(route53Client);

  try {

    const dsRecordValue = await util.getDsRecordValue(hostedZoneId, keySigningKeyName);
    const changeId = await util.createDsRecord(parentHostedZoneId, hostedZoneName, dsRecordValue);
    const successful = await util.waitForChange(changeId, 2, 3000);

    if (successful) {
      return response('SUCCESS', event);
    }

    return response('SUCCESS', event, 'Added DS record however change stats is not yet INSYNC');

  } catch (error) {
    console.error(error);
    return response('FAILED', event, JSON.stringify(error));
  }

}


/**
 * Return reponse to CloudFormation
 * @param status
 * @param event
 * @param reason
 * @returns
 */
function response(
  status: 'SUCCESS' | 'FAILED',
  event: CloudFormationCustomResourceEvent,
  reason?: string,
): CloudFormationCustomResourceResponse {
  return {
    Status: status,
    Reason: reason ? reason : '',
    LogicalResourceId: event.LogicalResourceId,
    PhysicalResourceId: event.ResourceProperties.PhysicalResourceId,
    RequestId: event.RequestId,
    StackId: event.StackId,
  };
}

