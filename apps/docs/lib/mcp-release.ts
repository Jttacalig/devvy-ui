import { devDependencies } from '../../../packages/mcp/package.json';

// Read only the reviewed alias string. MCP SDK/build code never enters the docs bundle.
const alias = devDependencies['@devvy-ui/published-registry'];
const match = /^npm:@devvy-ui\/registry@(\d+\.\d+\.\d+)$/.exec(alias);
if (!match) throw new Error('MCP published source must pin an exact stable registry version.');
export const mcpPublishedVersion = match[1];
