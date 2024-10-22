import { rals } from '@/assets/ralClassic';

export interface RalColor {
  id: string;
  name: string;
  hex: string;
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

export interface SimilarColor extends RalColor {
  distance: number;
}

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
