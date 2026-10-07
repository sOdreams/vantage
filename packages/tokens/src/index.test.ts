import { describe, expect, it } from 'vitest';
import {
  contrastRatio,
  contrastRequirements,
  hexToRgb,
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
    expect(contrastRatio('#0E0D0B', '#ECE8DF')).toBeCloseTo(contrastRatio('#ECE8DF', '#0E0D0B'), 10);
  });

  it('rejects malformed colours', () => {
    expect(() => hexToRgb('#FFF')).toThrow();
    expect(() => hexToRgb('red')).toThrow();
  });
});

describe('palettes', () => {
  const themes = Object.keys(palettes) as ThemeName[];

  for (const theme of themes) {
    for (const [token, min] of Object.entries(contrastRequirements)) {
      it(`${theme}.${token} keeps at least ${min}:1 on the ground`, () => {
        const p = palettes[theme];
        const ratio = contrastRatio(p[token as keyof typeof contrastRequirements], p.ground);
        expect(ratio).toBeGreaterThanOrEqual(min);
      });
    }
  }

  it('both themes define the same tokens', () => {
    expect(Object.keys(palettes.darkroom).sort()).toEqual(Object.keys(palettes.gallery).sort());
  });
});

describe('resolveTheme', () => {
  it('follows the phone when set to system', () => {
    expect(resolveTheme('system', 'light')).toBe('gallery');
    expect(resolveTheme('system', 'dark')).toBe('darkroom');
  });

  it('defaults to darkroom when the phone gives no preference', () => {
    expect(resolveTheme('system', null)).toBe('darkroom');
    expect(resolveTheme('system', 'unspecified')).toBe('darkroom');
  });

  it('respects an explicit choice', () => {
    expect(resolveTheme('gallery', 'dark')).toBe('gallery');
    expect(resolveTheme('darkroom', 'light')).toBe('darkroom');
  });
});
