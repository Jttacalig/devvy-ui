export type GlassQuality = 'full' | 'reduced';
export interface GlassCapabilities {
  backdropFilter: boolean;
  hardwareConcurrency?: number;
  deviceMemory?: number;
  saveData?: boolean;
}

/** Conservative hints, not a GPU benchmark. Missing hardware hints do not imply a slow device. */
export function resolveGlassQuality(capabilities: GlassCapabilities): GlassQuality {
  if (!capabilities.backdropFilter || capabilities.saveData) return 'reduced';
  if (capabilities.hardwareConcurrency !== undefined && capabilities.hardwareConcurrency <= 4)
    return 'reduced';
  if (capabilities.deviceMemory !== undefined && capabilities.deviceMemory <= 4) return 'reduced';
  return 'full';
}
