# CDK custom resource for DNSSEC
This package contains a custom resource that will add the DS record to AWS Route53 based on the provied KeySigningKey name.

Problem this package solves: When enabling DNSSEC from the CDK one has to manually add te DS record related to the active KeySigningKey in the hosted zone to the parent hosted zone. This manual step complicates fresh deployments of CDK defined infrastructure as code. This package aims to solve this by providing a custom resource wrapped in a CDK construct that will obtain the DS record from the hosted zone and add is to the parent hosted zone, automatically, within a single deployment.

## Example
The example below demonstrates how to setup DNSSEC using CDK and how this package can be used to create the DS record in a single deployment. 

```typescript
setupDNSSEC(hostedZone: Route53.IHostedZone, parentHostedZone: Route53.IHostedZone) {

  const ksk = new Route53.CfnKeySigningKey(this, 'dnssec-ksk', {
    name: 'ksk_name',
    status: 'ACTIVE',
    hostedZoneId: hostedZone.hostedZoneId,
    keyManagementServiceArn: kmsKeyArn,
  });

  const dnssec = new Route53.CfnDNSSEC(this, 'dnssec', {
    hostedZoneId: hostedZone.hostedZoneId,
  });
  dnssec.node.addDependency(ksk);

  // Add the DS record using the struct provided by this package
  const dnssecRecord = new DnssecRecordStruct(this, 'dnssec-record', {
    keySigningKey: dnssecKeySigning,
    hostedZone: hostedZone,
    parentHostedZone: parentHostedZone,
  });
  dnssecRecord.node.addDependency(dnssec);

}
```