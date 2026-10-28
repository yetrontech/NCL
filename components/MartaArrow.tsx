"use client";

import { useEffect, useState } from "react";

type Arrow = {
  width: number;
  height: number;
  line: string;
  head: string;
};

export default function MartaArrow() {
  const [arrow, setArrow] = useState<Arrow | null>(null);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".marta-ad");
    if (!root) return;

    const draw = () => {
      const from = root.querySelector<HTMLElement>(".marta-from");
      const to = root.querySelector<HTMLElement>(".marta-cta");
      const aside = root.querySelector<HTMLElement>(".marta-aside");
      const steps = root.querySelector<HTMLElement>(".marta-steps");
      const step = from?.closest("li");
      if (!from || !to || !aside || !steps || !step) return;

      const ad = root.getBoundingClientRect();
      const titleRange = document.createRange();
      titleRange.selectNodeContents(from);
      const title = titleRange.getBoundingClientRect();
      const asideRange = document.createRange();
      asideRange.selectNodeContents(aside);
      const asideText = asideRange.getBoundingClientRect();
      const button = to.getBoundingClientRect();
      const stepsBox = steps.getBoundingClientRect();
      const stepBox = step.getBoundingClientRect();
      const x = (value: number) => value - ad.left;
      const y = (value: number) => value - ad.top;
      const twoCol = stepsBox.width > stepBox.width + 40;

      let startX: number;
      let startY: number;
      let c1x: number;
      let c1y: number;
      let c2x: number;
      let c2y: number;
      let endX: number;
      let endY: number;

      if (twoCol) {
        startX = x(title.right) + 8;
        startY = y(title.top) + title.height * 0.45;
        endX = Math.min(x(button.right) - 28, Math.max(x(asideText.right) + 40, startX + 36));
        endY = y(button.bottom) + 1;
        const laneY = y(stepsBox.top) - 14;
        c1x = startX;
        c1y = laneY;
        c2x = endX;
        c2y = laneY;
      } else {
        const gutter = Math.min(ad.width - 16, x(button.right) - 18);
        startX = Math.min(x(title.right) + 4, gutter - 20);
        startY = y(title.top) + title.height * 0.4;
        endX = gutter;
        endY = y(button.bottom) + 1;
        c1x = gutter;
        c1y = startY;
        c2x = gutter;
        c2y = endY + 34;
      }

      const line = `M ${startX.toFixed(1)} ${startY.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${endX.toFixed(1)} ${endY.toFixed(1)}`;
      const dx = endX - c2x;
      const dy = endY - c2y;
      const length = Math.hypot(dx, dy) || 1;
      const ux = dx / length;
      const uy = dy / length;
      const px = -uy;
      const py = ux;
      const size = 13;
      const wing = 6.5;
      const baseX = endX - ux * size;
      const baseY = endY - uy * size;
      const head = `M ${endX.toFixed(1)} ${endY.toFixed(1)} L ${(baseX + px * wing).toFixed(1)} ${(baseY + py * wing).toFixed(1)} L ${(baseX - px * wing).toFixed(1)} ${(baseY - py * wing).toFixed(1)} Z`;

      setArrow({ width: ad.width, height: ad.height, line, head });
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(root);
    window.addEventListener("resize", draw);
    const timers = [400, 900, 1600].map((ms) => window.setTimeout(draw, ms));
    document.fonts?.ready.then(draw).catch(() => undefined);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", draw);
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  if (!arrow) return null;

  return (
    <svg className="marta-arrow" viewBox={`0 0 ${arrow.width} ${arrow.height}`} aria-hidden="true">
      <path className="marta-arrow-halo" d={arrow.line} />
      <path className="marta-arrow-line" d={arrow.line} />
      <path className="marta-arrow-head" d={arrow.head} />
    </svg>
  );
}
