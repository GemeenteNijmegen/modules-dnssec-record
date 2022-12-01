import {
  App,
  Stack,
  aws_route53 as route53,
} from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Construct } from 'constructs';
import { DnssecRecordStruct } from '../src/dnssec-record/dnssec-record-struct';

test('snapshot', () => {

  class MyStack extends Stack {
    constructor(scope: Construct, id: string) {
      super(scope, id);

      const rootHz = route53.HostedZone.fromHostedZoneAttributes(this, 'root-hz', {
        hostedZoneId: 'OEIJGEOIJG2380JEFO',
        zoneName: 'example.com',
      });

      const subHz = route53.HostedZone.fromHostedZoneAttributes(this, 'sub-hz', {
        hostedZoneId: 'OEIJGEOIJG2380JEF1',
        zoneName: 'sub.example.com',
      });

      const ksk = new route53.CfnKeySigningKey(this, 'dnssec-keysigning-key', {
        name: 'ksk_name',
        status: 'ACTIVE',
        hostedZoneId: 'OEIJGEOIJG2380JEFO',
        keyManagementServiceArn: 'arn:aws:some:kms/key',
      });

      new DnssecRecordStruct(this, 'record', {
        keySigningKey: ksk,
        hostedZone: subHz,
        parentHostedZone: rootHz,
      });
    }
  }

  const app = new App();
  const stack = new MyStack(app, 'stack');

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();

});