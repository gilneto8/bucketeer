import { rals } from '@/assets/ralClassic';

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface LAB {
  l: number;
  a: number;
  b: number;
}

export interface RalColor {
  id: string;
  name: string;
  hex: string;
}

export interface SimilarColor extends RalColor {
  distance: number;
}

/**
 * Converts an RGB color value to LAB color space.
 * LAB color space is more perceptually uniform than RGB and better suited for color comparisons.
 *
 * @param rgb - Object containing r, g, b values (0-255)
 * @returns Object containing l (Lightness), a (green-red), b (blue-yellow) values
 */
export function rgbToLab(rgb: RGB): LAB {
  // Convert RGB to relative values (0-1)
  let r = rgb.r / 255;
  let g = rgb.g / 255;
  let b = rgb.b / 255;

  // Convert to sRGB
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  // Scale values
  r *= 100;
  g *= 100;
  b *= 100;

  // Convert to XYZ color space
  const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  const z = r * 0.0193 + g * 0.1192 + b * 0.9505;

  // XYZ to LAB conversion
  const xn = 95.047;
  const yn = 100.0;
  const zn = 108.883;

  const fx = x / xn > 0.008856 ? Math.pow(x / xn, 1 / 3) : (7.787 * x) / xn + 16 / 116;
  const fy = y / yn > 0.008856 ? Math.pow(y / yn, 1 / 3) : (7.787 * y) / yn + 16 / 116;
  const fz = z / zn > 0.008856 ? Math.pow(z / zn, 1 / 3) : (7.787 * z) / zn + 16 / 116;

  return {
    l: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
  };
}

/**
 * Calculates the color difference between two colors in LAB space using a simplified CIEDE2000 formula.
 * The result roughly corresponds to human perception of color difference.
 *
 * @param lab1 - First color in LAB space
 * @param lab2 - Second color in LAB space
 * @returns A number representing the difference between colors (lower = more similar)
 */
export function calculateDeltaE(lab1: LAB, lab2: LAB): number {
  const deltaL = lab2.l - lab1.l;
  const deltaA = lab2.a - lab1.a;
  const deltaB = lab2.b - lab1.b;

  return Math.sqrt(Math.pow(deltaL, 2) + Math.pow(deltaA, 2) + Math.pow(deltaB, 2));
}

/**
 * Calculates the resulting RGB color from mixing multiple colors with given quantities.
 * Uses simple linear interpolation in RGB space.
 *
 * @param colors - Array of objects containing color (hex) and quantity values
 * @returns The resulting mixed color in RGB format
 */
export function calculateMixedColor(colors: Array<{ hex: string; quantity: number }>): RGB {
  const totalQuantity = colors.reduce((sum, { quantity }) => sum + quantity, 0);
  let r = 0,
    g = 0,
    b = 0;

  colors.forEach(({ hex, quantity }) => {
    const rgb = hexToRgb(hex)!;
    r += rgb.r * (quantity / totalQuantity);
    g += rgb.g * (quantity / totalQuantity);
    b += rgb.b * (quantity / totalQuantity);
  });

  return {
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b),
  };
}

/**
 * Determines if white or black text should be used on a given background color
 * for optimal contrast.
 *
 * @param backgroundColor - Hex color code of the background
 * @returns '#000' for black or '#fff' for white
 */
export function getTextColorForBackground(backgroundColor: string): string {
  const rgb = hexToRgb(backgroundColor);
  if (!rgb) return '#000';

  // Calculate relative luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? '#000' : '#fff';
}

export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)!;
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

export const colorDistance = (color: string): SimilarColor[] => {
  const rgb = hexToRgb(color);

  const distances = rals.map(ral => {
    const ref = hexToRgb(ral.hex);
    const color = rals.find(_r => _r.id === ral.id)!;
    return {
      ...color,
      distance: Math.sqrt(Math.pow(rgb.r - ref.r, 2) + Math.pow(rgb.g - ref.g, 2) + Math.pow(rgb.b - ref.b, 2)),
    };
  });

  return distances;
};
