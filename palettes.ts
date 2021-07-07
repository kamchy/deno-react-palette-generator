import {
  generateAbsoluteGradient,
  generatePalette,
  generateRelativeLightness,
  generateShadeWithOpposite,
  genN,
  middleColor,
} from "./colors.ts";

export type PaletteConfig = {
  baseCount: number;
  baseSaturation: number;
  baseLightness: number;
  gradientSize: number;
};

export type Color = string;
export type PaletteName =
  | "BasicColors"
  | "BasicGradient"
  | "AbsoluteGradient"
  | "RelativeLightness"
  | "HueAndOpposite";

export type Palette = Color[];
export const highestHue = (colors: Palette): Color => colors[0];
export function createPaletteMap(
  input: string,
  { baseCount, gradientSize, baseSaturation, baseLightness }: PaletteConfig,
  colors: string[],
): Map<PaletteName, Palette> {
  const m = new Map<PaletteName, Palette>();

  m.set(
    "BasicColors",
    genN(input, baseCount, baseSaturation, baseLightness),
  );
  m.set(
    "BasicGradient",
    generatePalette(colors[0], colors[baseCount - 1], gradientSize),
  );
  m.set(
    "AbsoluteGradient",
    generateAbsoluteGradient(middleColor(colors), gradientSize),
  );
  m.set(
    "RelativeLightness",
    generateRelativeLightness(highestHue(colors), gradientSize),
  );

  m.set(
    "HueAndOpposite",
    generateShadeWithOpposite(highestHue(colors), gradientSize),
  );
  return m;
}

export { middleColor };
