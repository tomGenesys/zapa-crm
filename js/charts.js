// Lightweight inline-SVG chart helpers — no external chart library needed.

function svgBarChart(data, opts = {}) {
  const w = opts.width || 480, h = opts.height || 220;
  const padL = 40, padB = 24, padT = 10, padR = 10;
  const max = Math.max(...data.map(d => d.value), 1);
  const chartW = w - padL - padR, chartH = h - padT - padB;
  const barW = chartW / data.length * 0.6;
  const gap = chartW / data.length;

  let bars = "", labels = "", gridLines = "";
  for (let i = 0; i <= 4; i++) {
    const y = padT + chartH - (chartH * i / 4);
    gridLines += `<line x1="${padL}" y1="${y}" x2="${w - padR}" y2="${y}" stroke="#eee" stroke-width="1"/>`;
    gridLines += `<text x="${padL - 6}" y="${y + 3}" font-size="9" fill="#706e6b" text-anchor="end">${Math.round(max * i / 4 / 1000)}k</text>`;
  }
  data.forEach((d, i) => {
    const barH = (d.value / max) * chartH;
    const x = padL + i * gap + (gap - barW) / 2;
    const y = padT + chartH - barH;
    bars += `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" rx="3" fill="${d.color || '#0176d3'}"><title>${d.label}: ${d.value}</title></rect>`;
    labels += `<text x="${x + barW / 2}" y="${h - 6}" font-size="10" fill="#3e3e3c" text-anchor="middle">${d.label}</text>`;
  });
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}">${gridLines}${bars}${labels}</svg>`;
}

function svgDonutChart(data, opts = {}) {
  const size = opts.size || 160;
  const cx = size / 2, cy = size / 2, r = size / 2 - 8, rInner = r * 0.58;
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let angle = -90;
  let paths = "";
  data.forEach(d => {
    const slice = (d.value / total) * 360;
    const start = angle, end = angle + slice;
    paths += arcPath(cx, cy, r, rInner, start, end, d.color);
    angle = end;
  });
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">${paths}
    <text x="${cx}" y="${cy - 2}" font-size="16" font-weight="700" text-anchor="middle" fill="#181818">${total}</text>
    <text x="${cx}" y="${cy + 13}" font-size="9" text-anchor="middle" fill="#706e6b">Total</text>
  </svg>`;
}

function arcPath(cx, cy, rOuter, rInner, startDeg, endDeg, color) {
  if (endDeg - startDeg >= 359.999) endDeg = startDeg + 359.999;
  const toRad = d => (d * Math.PI) / 180;
  const p = (r, deg) => [cx + r * Math.cos(toRad(deg)), cy + r * Math.sin(toRad(deg))];
  const [x1, y1] = p(rOuter, startDeg);
  const [x2, y2] = p(rOuter, endDeg);
  const [x3, y3] = p(rInner, endDeg);
  const [x4, y4] = p(rInner, startDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `<path d="M ${x1} ${y1} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 ${largeArc} 0 ${x4} ${y4} Z" fill="${color}"/>`;
}

function svgLineChart(data, opts = {}) {
  const w = opts.width || 480, h = opts.height || 200;
  const padL = 40, padB = 22, padT = 12, padR = 12;
  const max = Math.max(...data.map(d => d.value), 1);
  const chartW = w - padL - padR, chartH = h - padT - padB;
  const stepX = chartW / (data.length - 1 || 1);

  let gridLines = "";
  for (let i = 0; i <= 3; i++) {
    const y = padT + chartH - (chartH * i / 3);
    gridLines += `<line x1="${padL}" y1="${y}" x2="${w - padR}" y2="${y}" stroke="#eee" stroke-width="1"/>`;
    gridLines += `<text x="${padL - 6}" y="${y + 3}" font-size="9" fill="#706e6b" text-anchor="end">${Math.round(max * i / 3 / 1000)}k</text>`;
  }
  const points = data.map((d, i) => [padL + i * stepX, padT + chartH - (d.value / max) * chartH]);
  const linePath = points.map((pt, i) => (i === 0 ? "M" : "L") + pt[0] + " " + pt[1]).join(" ");
  const areaPath = linePath + ` L ${points[points.length - 1][0]} ${padT + chartH} L ${points[0][0]} ${padT + chartH} Z`;
  let dots = "", labels = "";
  points.forEach((pt, i) => {
    dots += `<circle cx="${pt[0]}" cy="${pt[1]}" r="3.5" fill="#0176d3"/>`;
    labels += `<text x="${pt[0]}" y="${h - 4}" font-size="10" fill="#3e3e3c" text-anchor="middle">${data[i].label}</text>`;
  });
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}">
    ${gridLines}
    <path d="${areaPath}" fill="#0176d3" opacity="0.08"/>
    <path d="${linePath}" fill="none" stroke="#0176d3" stroke-width="2.5"/>
    ${dots}${labels}
  </svg>`;
}
