const { GemeenteNijmegenCdkLib } = require('@gemeentenijmegen/projen-project-type');

const projectName = '@gemeentenijmegen/dnssec-record';

const project = new GemeenteNijmegenCdkLib({
  cdkVersion: '2.1.0',
  name: projectName,
  author: 'GemeenteNijmegen',
  defaultReleaseBranch: 'main',
  depsUpgradeOptions: {
    workflowOptions: {
      branches: ['main'], // No acceptance branche
    },
  },
  bundledDeps: [
    '@aws-sdk/client-route-53',
    '@types/aws-lambda',
  ],
  devDeps: [
    'aws-sdk-client-mock',
    '@gemeentenijmegen/projen-project-type',
  ],
  packageName: projectName,
  enableAutoMergeDependencies: false, // No acceptance branch
});
project.synth();