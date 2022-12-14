import { ChangeResourceRecordSetsCommand, ChangeResourceRecordSetsCommandInput, ChangeResourceRecordSetsCommandOutput, GetDNSSECCommand, GetDNSSECCommandOutput, Route53Client } from '@aws-sdk/client-route-53';
import { mockClient } from 'aws-sdk-client-mock';
import { DnssecRecordUtil } from '../src/dnssec-record/dnssec-record-util';

const route53Mock = mockClient(Route53Client);

beforeAll(() => {
  console.error = jest.fn();
  console.info = jest.fn();
  console.debug = jest.fn();
});

beforeEach(() => {
  route53Mock.reset();
});


test('get-ds-record', async () => {

  const hostedZoneId = '123FHEIUHG1249198';
  const kskName = 'ksk_name_';
  const dsRecord = '120948 12 120942fjewoihgfeo3280r390';

  const route53Client = new Route53Client({});
  const dnssecInfo: Partial<GetDNSSECCommandOutput> = {
    KeySigningKeys: [
      {
        Name: `${kskName}1`,
        DSRecord: `${dsRecord}00000`,
        Status: 'INACTIVE',
      },
      {
        Name: `${kskName}2`,
        DSRecord: `${dsRecord}11111`,
        Status: 'ACTIVE',
      },
    ],
  };
  route53Mock.on(GetDNSSECCommand).resolves(dnssecInfo);

  const util = new DnssecRecordUtil(route53Client);

  // Happy flow
  const dsRecordValue = await util.getDsRecordValue(hostedZoneId, `${kskName}2`);
  expect(dsRecordValue).toBe(`${dsRecord}11111`);

  // Nonexistent ksk
  await expect(util.getDsRecordValue(hostedZoneId, `${kskName}3`)).rejects.toThrow();

  // Inactive ksk
  await expect(util.getDsRecordValue(hostedZoneId, `${kskName}1`)).rejects.toThrow();

});


test('set-ds-record', async () => {

  const hostedZoneId = '123FHEIUHG1249198';
  const dsRecordName = 'dnssec.example.com';
  const dsRecordValue = '120948 12 120942fjewoihgfeo3280r390';

  const changeId = 'change/0239480192r2';

  const route53Client = new Route53Client({});
  const createDsRecordIn: Partial<ChangeResourceRecordSetsCommandInput> = {
    HostedZoneId: hostedZoneId,
    ChangeBatch: {
      Comment: 'Create DS record in parent hosted zone',
      Changes: [
        {
          Action: 'UPSERT',
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
  };
  const createDsRecordOut: Partial<ChangeResourceRecordSetsCommandOutput> = {
    ChangeInfo: {
      Id: changeId,
      Status: 'PENDING',
      SubmittedAt: undefined,
    },
  };
  const createDsRecordOut2: Partial<ChangeResourceRecordSetsCommandOutput> = {
    ChangeInfo: {
      Id: undefined,
      Status: undefined,
      SubmittedAt: undefined,
    },
  };

  const util = new DnssecRecordUtil(route53Client);

  route53Mock.on(ChangeResourceRecordSetsCommand, createDsRecordIn, true).resolves(createDsRecordOut);
  await expect(util.createDsRecord(hostedZoneId, dsRecordName, dsRecordValue)).resolves.toBe(changeId);

  route53Mock.on(ChangeResourceRecordSetsCommand).resolves(createDsRecordOut2);
  await expect(util.createDsRecord(hostedZoneId, 'random-name', 'random-value')).rejects.toThrow('No change ID returned while creating record');

});
