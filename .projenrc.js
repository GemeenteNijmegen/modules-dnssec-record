const { awscdk } = require('projen');
const { NpmAccess } = require('projen/lib/javascript');

const projectName = '@gemeentenijmegen/dnssec-record';

const project = new awscdk.AwsCdkConstructLibrary({
  cdkVersion: '2.1.0',
  author: 'GemeenteNijmegen',
  repository: 'github.com',
  defaultReleaseBranch: 'main',
  name: projectName,
  defaultReleaseBranch: 'main',
  license: 'EUPL-1.2',
  release: true,
  releaseToNpm: true,
  npmAccess: NpmAccess.PUBLIC,
  bundledDeps: [
    '@aws-sdk/client-route-53',
    '@types/aws-lambda',
  ],
  devDeps: [
    'aws-sdk-client-mock',
  ],
  packageName: projectName,
});
project.synth();