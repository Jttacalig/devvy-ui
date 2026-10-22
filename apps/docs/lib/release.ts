import { version } from '../../../packages/react/package.json';

export const releaseVersion = version;
export const releaseChannel = version.split('-')[1]?.split('.')[0] ?? 'stable';
