import { describe, expect, it } from 'vitest';
import {
  contrastRatio,
  contrastRequirements,
  hexToRgb,
  mapPalettes,
  palettes,
  resolveTheme,
  type ThemeName,
} from './index';

describe('contrastRatio', () => {
  it('matches the WCAG reference values', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5);
  });

  it('is symmetric', () => {
    expect(contrastRatio('#0B0C0F', '#F2EFE9')).toBeCloseTo(contrastRatio('#F2EFE9', '#0B0C0F'), 10);
  });

  it('rejects malformed colours', () => {
    expect(() => hexToRgb('#FFF')).toThrow();
    expect(() => hexToRgb('red')).toThrow();
  });
});

describe('palettes', () => {
  const themes = Object.keys(palettes) as ThemeName[];

  for (const theme of themes) {
    for (const { token, on, min } of contrastRequirements) {
      it(`${theme}: ${token} on ${on} keeps at least ${min}:1`, () => {
        const p = palettes[theme];
        expect(contrastRatio(p[token], p[on])).toBeGreaterThanOrEqual(min);
      });
    }
  }

  it('both themes define the same tokens', () => {
    expect(Object.keys(palettes.dark).sort()).toEqual(Object.keys(palettes.light).sort());
    expect(Object.keys(mapPalettes.dark).sort()).toEqual(Object.keys(mapPalettes.light).sort());
  });
});

describe('resolveTheme', () => {
  it('follows the phone when set to system', () => {
    expect(resolveTheme('system', 'light')).toBe('light');
    expect(resolveTheme('system', 'dark')).toBe('dark');
  });

  it('defaults to dark when the phone gives no preference', () => {
    expect(resolveTheme('system', null)).toBe('dark');
    expect(resolveTheme('system', 'unspecified')).toBe('dark');
  });

  it('respects an explicit choice', () => {
    expect(resolveTheme('light', 'dark')).toBe('light');
    expect(resolveTheme('dark', 'light')).toBe('dark');
  });
});
