import { version } from '../../../packages/react/package.json';

export const releaseVersion = version;
export const releaseChannel = version.split('-')[1]?.split('.')[0] ?? 'stable';
export const releaseLabel = `v${releaseVersion} Stable`;
// Verified against all six packages in the live npm registry on 23 October 2026.
// Keep this independent of workspace versions: a source release is not publication.
export const publishedNpmVersion = '0.3.1';
export const publishedNpmTag = 'latest';
export const installCommand = 'npm install @devvy-ui/react';
export const docsUrl = 'https://devvy-ui.dev-station.dev/ui';
export const npmPackageUrl = 'https://www.npmjs.com/package/@devvy-ui/react';
export const githubRepoUrl = 'https://github.com/Jttacalig/devvy-ui';
