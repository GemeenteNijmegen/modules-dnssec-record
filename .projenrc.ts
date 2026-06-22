import { GemeenteNijmegenCdkLib } from '@gemeentenijmegen/projen-project-type';

const projectName = '@gemeentenijmegen/dnssec-record';

const project = new GemeenteNijmegenCdkLib({
  projenrcTs: true,
  cdkVersion: '2.253.0',
  constructsVersion: '10.6.0',
  name: projectName,
  repository: 'https://github.com/GemeenteNijmegen/modules-dnssec-record',
  repositoryUrl: 'git://github.com/GemeenteNijmegen/modules-dnssec-record',
  author: 'GemeenteNijmegen',
  authorAddress: 'devops@nijmegen.nl',
  defaultReleaseBranch: 'main',
  depsUpgradeOptions: {
    workflowOptions: {
      branches: ['main'], // No acceptance branche
    },
  },
  bundledDeps: [
    '@aws-sdk/client-route-53',
    '@aws-sdk/client-sts',
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