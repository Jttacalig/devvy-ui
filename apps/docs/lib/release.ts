import { version } from '../../../packages/react/package.json';

export const releaseVersion = version;
export const releaseChannel = version.split('-')[1]?.split('.')[0] ?? 'stable';
export const publishedNpmVersion = '0.1.0-beta.1';
export const publishedNpmTag = 'beta';
export const npmPackageUrl = 'https://www.npmjs.com/package/@devvy-ui/react';
export const githubRepoUrl = 'https://github.com/Jttacalig/devvy-ui';
