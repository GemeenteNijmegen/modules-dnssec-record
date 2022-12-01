# CDK custom resource for DNSSEC

This package contains a custom resource that will add the DS record to AWS Route53 based on the provied KeySigningKey name.


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