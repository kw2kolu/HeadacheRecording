const { createCanvas } = require('canvas');
const fs = require('fs');

function generateIcon(size, path) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#7c3aed';
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.2);
  ctx.fill();
  
  // Head emoji-style icon
  const center = size / 2;
  const r = size * 0.3;
  
  // Head circle
  ctx.fillStyle = '#fde68a';
  ctx.beginPath();
  ctx.arc(center, center - size * 0.05, r, 0, Math.PI * 2);
  ctx.fill();
  
  // Pain lines
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = size * 0.06;
  ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) {
    const angle = (-0.3 + i * 0.3) * Math.PI;
    const x1 = center + Math.cos(angle) * r;
    const y1 = (center - size * 0.05) + Math.sin(angle) * r;
    const x2 = center + Math.cos(angle) * (r + size * 0.12);
    const y2 = (center - size * 0.05) + Math.sin(angle) * (r + size * 0.12);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  
  fs.writeFileSync(path, canvas.toBuffer('image/png'));
}

try {
  generateIcon(192, '/home/user/HeadacheRecording/public/icon-192.png');
  generateIcon(512, '/home/user/HeadacheRecording/public/icon-512.png');
  console.log('Icons generated');
} catch(e) {
  console.error(e.message);
}
