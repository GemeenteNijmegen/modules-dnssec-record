import {
  Duration,
  CustomResource,
  aws_route53 as route53,
  aws_iam as iam,
  custom_resources as customresource,
  aws_logs as logs,
} from 'aws-cdk-lib';
import { Effect } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { DnssecRecordFunction } from './dnssec-record-function';


export interface DnssecRecordStructProps {
  readonly keySigningKey: route53.CfnKeySigningKey;
  readonly hostedZone: route53.IHostedZone;
  readonly parentHostedZone: route53.IHostedZone;
  /**
   * Set a role to assume for creating the DNSSEC record
   * Can be used for cross account DS record creation.
   */
  readonly roleToAssume?: string;

  /**
   * Force update
   * Pass a random string to trigger an update in this custom resource
   */
  readonly forceUpdate?: string;
}

export class DnssecRecordStruct extends Construct {


  constructor(scope: Construct, id: string, props: DnssecRecordStructProps) {
    super(scope, id);

    const lambda = new DnssecRecordFunction(this, 'lambda', {
      description: 'Custom resource to create a DNSSEC record in the parent hotstedzone',
      timeout: Duration.seconds(60),
    });

    // Allow to request the state of a change in route53
    lambda.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'route53:GetChange',
      ],
      resources: ['*'],
    }));

    // Allow obtaining info of DNSSEC on hosted zone
    lambda.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'route53:GetDNSSEC',
      ],
      resources: [
        props.hostedZone.hostedZoneArn,
      ],
    }));

    // Allow UPSERTING records on parent hosted zone
    lambda.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'route53:ChangeResourceRecordSets',
      ],
      resources: [
        props.parentHostedZone.hostedZoneArn,
      ],
    }));

    if (props.roleToAssume) {
      lambda.addToRolePolicy(new iam.PolicyStatement({
        actions: ['sts:AssumeRole'],
        effect: Effect.ALLOW,
        resources: [props.roleToAssume],
      }));
    }

    const customResourceProvider = new customresource.Provider(this, 'provider', {
      onEventHandler: lambda,
      logRetention: logs.RetentionDays.ONE_MONTH,
    });

    new CustomResource(this, 'custom-resource', {
      serviceToken: customResourceProvider.serviceToken,
      properties: {
        keySigningKeyName: props.keySigningKey.name,
        hostedZoneId: props.hostedZone.hostedZoneId,
        hostedZoneName: props.hostedZone.zoneName,
        parentHostedZoneId: props.parentHostedZone.hostedZoneId,
        roleToAssume: props.roleToAssume,
        forceUpdate: props.forceUpdate,
      },
    });

  }


}