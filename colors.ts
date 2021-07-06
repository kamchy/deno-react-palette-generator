import KolorWheel from "./KolorWheel.min.js";
import { md5sum } from "./hash.ts";

const chCol = (delta: number): (c: string) => string => (
  (c: string) => {
    const cw = new KolorWheel(c);
    cw.l += delta;
    return cw.getHex();
  }
);
const colToHsl = (c: string): number[] => new KolorWheel(c).getHsl();
const lighter = chCol(30);
const darker = chCol(-30);
const inverse = (c: string) =>
  new KolorWheel(c).isLight() ? darker(c) : lighter(c);
const light = (c: string) => new KolorWheel(c).l;
const updateLight = (c: string, delta: number) => chCol(delta)(c);

const p = (...s: any) => console.log(...s);
function genN(
  data: string,
  count: number,
  sat: number,
  lig: number,
): string[] {
  const sumd = md5sum(data);
  p(sumd);
  const res = [];
  for (let i = 0; i < count; i++) {
    const idx = (i * 2) % sumd.length;
    const hue = sumd.substring(idx, idx + 2);
    const hslvals = [parseInt(hue, 16), sat, lig];

    p(`> hue: ${hue}, idx: ${idx},  hlsa: ${hslvals}`);
    res.push(new KolorWheel(hslvals));
  }
  return sortedByHue(res.map((k) => k.getHex()));
}

export function generatePalette(
  cfrom: string,
  cto: string,
  count: number,
): string[] {
  const res = [];
  const base = new KolorWheel(cfrom);
  const target = base.abs(cto, count);

  for (let n = 0; n < count; n++) {
    res.push(target.get(n).getHex());
  } // for gradient
  return res;
}

export const middleColor = (colors: string[]): string =>
  colors[Math.round(colors.length / 2)];
export function generateAbsoluteGradient(c: string, n: number): string[] {
  const res: string[] = [];
  (new KolorWheel(c)).abs(0, -1, -1, n).each(
    function (this: KolorWheel) {
      res.push(this.getHex());
    },
  );
  return res;
}

export function generateRelativeLightness(c: string, n: number): string[] {
  const res: string[] = [];
  const col = new KolorWheel(c);
  col.l = 10;
  col.rel(0, 0, 80, n).each(
    function (this: KolorWheel) {
      res.push(this.getHex());
    },
  );
  return res;
}
export function sortedByHue(cs: string[]): string[] {
  const kws = cs.map((i) => new KolorWheel(i));
  kws.sort((k1, k2) => k2.h - k1.h);
  return kws.map((kw) => kw.getHex());
}

export function generateShadeWithOpposite(c: string, n: number): string[] {
  const res: string[] = [];
  const ckw = new KolorWheel(c);
  ckw.abs([ckw.h, ckw.h, ckw.h + 180], [100, 40, 100], 80, n).each(
    function (this: KolorWheel) {
      res.push(this.getHex());
    },
  );
  return res;
}
export { colToHsl, darker, genN, inverse, light, lighter, updateLight };
