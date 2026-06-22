import { ContrastResult } from '../types/contrast';

// Convert hex string like "#1A1D23" to RGB values
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
}

// Calculate relative luminance for a single color channel
function getChannelLuminance(value: number): number {
  const sRGB = value / 255;
  return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
}

// Calculate relative luminance of a color
export function getRelativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const r = getChannelLuminance(rgb.r);
  const g = getChannelLuminance(rgb.g);
  const b = getChannelLuminance(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function calculateContrastRatio(color1: string, color2: string): ContrastResult {
  const l1 = getRelativeLuminance(color1);
  const l2 = getRelativeLuminance(color2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  const ratio = (lighter + 0.05) / (darker + 0.05);
  const roundedRatio = Math.round(ratio * 100) / 100;

  return {
    ratio: roundedRatio,
    normalAA: { pass: roundedRatio >= 4.5, threshold: 4.5 },
    normalAAA: { pass: roundedRatio >= 7.0, threshold: 7.0 },
    largeAA: { pass: roundedRatio >= 3.0, threshold: 3.0 },
    largeAAA: { pass: roundedRatio >= 4.5, threshold: 4.5 }
  };
}
