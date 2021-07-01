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

function getInitialColor(inp: string): (hslidx: number[]) => KolorWheel {
  return (arr: number[]) => {
    let hslarr = arr.map((i) => inp.codePointAt(i) ?? 330 & 0xFF);
    if (hslarr.length < 3) {
      hslarr = [60, 50, 60];
    }
    return new KolorWheel(hslarr);
  };
}

const p = (...s: any) => console.log(...s);
function genN(data: string, n: number): string[] {
  const sumd = md5sum(data);
  p(sumd);
  let res = [];
  for (let i = 0; i < n; i++) {
    let idx = (i * 2) % sumd.length;
    const hue = sumd.substring(idx, idx + 2);
    const hslvals = [parseInt(hue, 16), 80, 50];

    p(`> hue: ${hue}, idx: ${idx},  hlsa: ${hslvals}`);
    res.push(new KolorWheel(hslvals));
  }
  return res.map((k) => k.getHex());
}

export { colToHsl, darker, genN, inverse, light, lighter, updateLight };

//console.log(genN("kamila", 5));
//let t = Deno.args[0];
//p(t, "encoded as ", genN(t, 10));
