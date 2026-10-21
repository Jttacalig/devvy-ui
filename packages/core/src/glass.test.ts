import { describe, expect, it } from 'vitest';
import { resolveGlassQuality } from './glass';
describe('glass capability policy', () => {
  it('uses solid surfaces without backdrop support or when saving data', () => {
    expect(resolveGlassQuality({ backdropFilter: false })).toBe('reduced');
    expect(resolveGlassQuality({ backdropFilter: true, saveData: true })).toBe('reduced');
  });
  it('reduces effects for conservative CPU and memory hints', () => {
    expect(resolveGlassQuality({ backdropFilter: true, hardwareConcurrency: 4 })).toBe('reduced');
    expect(resolveGlassQuality({ backdropFilter: true, deviceMemory: 4 })).toBe('reduced');
    expect(
      resolveGlassQuality({ backdropFilter: true, hardwareConcurrency: 8, deviceMemory: 8 }),
    ).toBe('full');
  });
  it('does not invent a hardware capability when signals are missing', () => {
    expect(resolveGlassQuality({ backdropFilter: true })).toBe('full');
  });
});
