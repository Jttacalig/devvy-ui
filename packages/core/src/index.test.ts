import { describe, expect, it } from 'vitest';
import { cx, getNavigationIndex } from './index';

describe('keyboard navigation', () => {
  it('skips disabled entries and wraps', () => {
    expect(
      getNavigationIndex({ key: 'ArrowRight', currentIndex: 0, disabled: [false, true, false] }),
    ).toBe(2);
    expect(
      getNavigationIndex({ key: 'ArrowRight', currentIndex: 2, disabled: [false, true, false] }),
    ).toBe(0);
    expect(
      getNavigationIndex({ key: 'ArrowLeft', currentIndex: 0, disabled: [false, true, false] }),
    ).toBe(2);
  });
  it('handles boundaries, vertical and RTL layouts', () => {
    for (const [key, expected] of [
      ['Home', 1],
      ['End', 2],
    ] as const) {
      expect(getNavigationIndex({ key, currentIndex: 1, disabled: [true, false, false] })).toBe(
        expected,
      );
    }
    expect(
      getNavigationIndex({
        key: 'ArrowLeft',
        direction: 'rtl',
        currentIndex: 0,
        disabled: [false, false],
      }),
    ).toBe(1);
    expect(
      getNavigationIndex({
        key: 'ArrowDown',
        orientation: 'vertical',
        currentIndex: 0,
        disabled: [false, false],
      }),
    ).toBe(1);
    expect(
      getNavigationIndex({
        key: 'ArrowRight',
        orientation: 'vertical',
        currentIndex: 0,
        disabled: [false, false],
      }),
    ).toBeUndefined();
    expect(getNavigationIndex({ key: 'Home', currentIndex: 0, disabled: [true] })).toBeUndefined();
  });
  it('merges optional classes', () => expect(cx('one', false, undefined, 'two')).toBe('one two'));
});
