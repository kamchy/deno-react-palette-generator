import { lightBg } from "./colors.ts";
function* smallRects(r: number, box: number[]) {
  const [bx, by, wi, hi] = box;
  let x = r, y = r;
  while (x < wi) {
    while (y < hi) {
      yield { x: bx + x, y: by + y };
      y += 2 * r;
    }
    y = r;
    x += 2 * r;
  }
}

function drawRandomShapes(ctx: any, box: number[], color: string) {
  const r = Math.round(box[2] / 8);
  const iter = smallRects(r, box);
  const rad = (n: number) => n * 360 / (2 * Math.PI);
  for (const pos of iter) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.translate(pos.x, pos.y);
    ctx.beginPath();
    ctx.arc(0, 0, 3 * r / 4, rad(90), rad(270), true);
    ctx.fill();
    ctx.restore();
  }
}

function _genDrop(data: string[], ctx: any) {
  const wi = ctx.canvas.width;
  const hi = ctx.canvas.height;
  const deltax = Math.round(wi / data.length);
  data.forEach((col, idx) => {
    ctx.fillStyle = col;
    const box = [deltax * idx, 0, deltax, hi];
    ctx.fillRect(...box);
    const colIdx = (idx + 1) % data.length;
    drawRandomShapes(ctx, box, data[colIdx]);
  });
}

const randVal = (f: number, t: number): number =>
  f + Math.round(Math.floor(Math.random() * (t - f)));

const randElem = function <T>(arr: T[]): T {
  const i = randVal(0, arr.length);
  const el = arr[i];
  console.log(`randElem:  arr.len=${arr.length} i=${i}`);
  return el;
};

function _genStroke(data: string[], ctx: any) {
  const wi = ctx.canvas.width;
  const hi = ctx.canvas.height;
  const count = 300;
  ctx.fillStyle = lightBg(data[0], 30, 95);
  ctx.fillRect(0, 0, wi, hi);
  const randBezier = function () {
    ctx.save();
    const px = randVal(0, wi);
    const py = randVal(0, hi);
    ctx.translate(px, py);
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
      randVal(0, wi / 10),
      randVal(0, hi / 10),
      randVal(0, wi / 10),
      randVal(0, hi / 10),
      randVal(0, wi / 10),
      randVal(0, hi / 10),
    );
    ctx.restore();
  };
  for (let i = 0; i < count; i++) {
    ctx.beginPath();
    ctx.strokeStyle = randElem(data);
    ctx.lineWidth = randVal(2, 20);
    ctx.lineCap = "round";
    randBezier();
    ctx.stroke();
  }
}

export function generateImage(data: string[], ctx: any) {
  if (!ctx) {
    return;
  }
  const fns = [_genDrop, _genStroke];
  randElem(fns).call(null, data, ctx);
}
