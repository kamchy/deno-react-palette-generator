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

export type PaletteData = {
  data: string;
  count: number;
  baseSaturation: number;
  baseLightness: number;
};

const p = (...s: any) => console.log(...s);
function genN(
  { data, count, baseSaturation = 80, baseLightness = 50 }: PaletteData,
): string[] {
  const sumd = md5sum(data);
  p(sumd);
  const res = [];
  for (let i = 0; i < count; i++) {
    const idx = (i * 2) % sumd.length;
    const hue = sumd.substring(idx, idx + 2);
    const hslvals = [parseInt(hue, 16), baseSaturation, baseLightness];

    p(`> hue: ${hue}, idx: ${idx},  hlsa: ${hslvals}`);
    res.push(new KolorWheel(hslvals));
  }
  return res.map((k) => k.getHex());
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

export function generateAbsoluteGradient(c: string, n: number): string[] {
  const res: string[] = [];
  (new KolorWheel(c)).abs(0, -1, -1, n).each(
    function (this: KolorWheel) {
      res.push(this.getHex());
    },
  );
  return res;
}
export { colToHsl, darker, genN, inverse, light, lighter, updateLight };

//console.log(genN("kamila", 5));
//let t = Deno.args[0];
//p(t, "encoded as ", genN(t, 10));
