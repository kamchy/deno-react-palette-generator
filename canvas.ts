export function generateImage(data: string[], ctx: any) {
  console.log("GenerateImage called with ctx", ctx);
  if (!ctx) {
    return;
  }
  const wi = ctx.canvas.width;
  const hi = ctx.canvas.height;
  const deltax = Math.round(wi / data.length);
  data.forEach((col, idx) => {
    ctx.fillStyle = col;
    const box = [deltax * idx, 0, deltax, hi];
    ctx.fillRect(...box);
  });
}
