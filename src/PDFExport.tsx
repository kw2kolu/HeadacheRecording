import type { MonthData } from './types';
import { HEADACHE_LEVELS, MEDICATIONS, getLevelInfo } from './types';

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

function hexToRgb(hex: string): [number, number, number] {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return [r, g, b];
}

export async function exportPDF(year: number, month: number, monthData: MonthData): Promise<void> {
  // Dynamically import jsPDF to avoid SSR issues
  const { jsPDF } = await import('jspdf');

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`${year}年${month}月 頭痛記録`, margin, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  const exportDate = new Date();
  doc.text(`出力日: ${exportDate.getFullYear()}/${exportDate.getMonth() + 1}/${exportDate.getDate()}`, pageWidth - margin, 20, { align: 'right' });
  doc.setTextColor(0, 0, 0);

  // Separator line
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, 24, pageWidth - margin, 24);

  // Calendar section
  let y = 30;
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('カレンダー', margin, y);
  y += 6;

  // Draw calendar grid
  const cellW = contentWidth / 7;
  const cellH = 12;

  // Weekday headers
  WEEKDAYS.forEach((wd, i) => {
    const x = margin + i * cellW;
    doc.setFillColor(240, 240, 240);
    doc.rect(x, y, cellW, 7, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(x, y, cellW, 7, 'D');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    if (i === 0) doc.setTextColor(200, 50, 50);
    else if (i === 6) doc.setTextColor(50, 100, 200);
    else doc.setTextColor(80, 80, 80);
    doc.text(wd, x + cellW / 2, y + 5, { align: 'center' });
  });
  doc.setTextColor(0, 0, 0);
  y += 7;

  // Day cells
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const startDow = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const rows = Math.ceil(cells.length / 7);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < 7; col++) {
      const day = cells[row * 7 + col];
      const x = margin + col * cellW;
      const cy = y + row * cellH;

      if (day === null) {
        doc.setFillColor(248, 248, 248);
        doc.rect(x, cy, cellW, cellH, 'F');
        doc.setDrawColor(220, 220, 220);
        doc.rect(x, cy, cellW, cellH, 'D');
        continue;
      }

      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const record = monthData[dateStr];
      const levelInfo = record ? getLevelInfo(record.headacheLevel) : null;

      // Background
      if (levelInfo) {
        const [r, g, b] = hexToRgb(levelInfo.bgColor);
        doc.setFillColor(r, g, b);
      } else {
        doc.setFillColor(249, 250, 251);
      }
      doc.rect(x, cy, cellW, cellH, 'F');
      doc.setDrawColor(200, 200, 200);
      doc.rect(x, cy, cellW, cellH, 'D');

      // Day number
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      if (col === 0) doc.setTextColor(200, 50, 50);
      else if (col === 6) doc.setTextColor(50, 100, 200);
      else doc.setTextColor(50, 50, 50);
      doc.text(String(day), x + 2, cy + 4);

      // Level abbreviation
      if (levelInfo) {
        const abbr = record?.headacheLevel === 'neck' ? '首' : record?.headacheLevel === 'mild' ? '軽' : record?.headacheLevel === 'moderate' ? '中' : '重';
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        const [cr, cg, cb] = hexToRgb(levelInfo.color);
        doc.setTextColor(cr, cg, cb);
        doc.text(abbr, x + cellW / 2, cy + 8, { align: 'center' });
      }

      // Medication indicator
      if (record && record.medications.length > 0) {
        doc.setFontSize(6);
        doc.setTextColor(100, 100, 220);
        doc.text('薬', x + cellW - 3, cy + 4, { align: 'right' });
      }

      doc.setTextColor(0, 0, 0);
    }
  }

  y += rows * cellH + 8;

  // Color legend
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const legendItems = [
    { label: '記録なし', bg: '#f9fafb' },
    { label: '首痛止まり', bg: '#fefde8' },
    { label: '頭痛(仕事できる)', bg: '#fed7aa' },
    { label: '頭痛(ギリ仕事できる)', bg: '#fecaca' },
    { label: '頭痛(仕事できない)', bg: '#ef4444' },
  ];
  let lx = margin;
  legendItems.forEach(item => {
    const [r, g, b] = hexToRgb(item.bg);
    doc.setFillColor(r, g, b);
    doc.setDrawColor(180, 180, 180);
    doc.rect(lx, y - 3, 4, 4, 'FD');
    doc.setTextColor(60, 60, 60);
    doc.text(item.label, lx + 5, y);
    lx += doc.getTextWidth(item.label) + 12;
  });
  doc.setTextColor(0, 0, 0);
  y += 10;

  // Separator
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Statistics section
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('集計', margin, y);
  y += 7;

  // Headache stats
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('頭痛日数:', margin, y);
  y += 5;

  const records = Object.values(monthData);
  HEADACHE_LEVELS.forEach(level => {
    const count = records.filter(r => r.headacheLevel === level.value).length;
    const [r, g, b] = hexToRgb(level.bgColor);
    doc.setFillColor(r, g, b);
    doc.setDrawColor(180, 180, 180);
    doc.roundedRect(margin, y - 3.5, 70, 5.5, 1, 1, 'FD');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    doc.text(level.label, margin + 2, y);
    doc.setFont('helvetica', 'bold');
    doc.text(`${count} 日`, margin + 75, y, { align: 'left' });
    y += 6;
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  const totalHeadache = records.filter(r => r.headacheLevel !== undefined).length;
  doc.text(`合計（頭痛あり）: ${totalHeadache} 日`, margin, y);
  y += 8;

  // Medication stats
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('頓服薬使用:', margin, y);
  y += 5;

  MEDICATIONS.forEach(med => {
    const count = records.reduce((sum, r) => sum + r.medications.filter(m => m.name === med).length, 0);
    const days = records.filter(r => r.medications.some(m => m.name === med)).length;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(50, 50, 50);
    doc.text(`${med}:`, margin + 2, y);
    doc.setFont('helvetica', 'bold');
    doc.text(`${count} 回 / ${days} 日`, margin + 50, y);
    y += 6;
  });

  const totalMedDays = records.filter(r => r.medications.length > 0).length;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text(`服用日数合計: ${totalMedDays} 日`, margin, y);
  y += 10;

  // Medication day list
  const medDays = records
    .filter(r => r.medications.length > 0)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (medDays.length > 0) {
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('服薬リスト', margin, y);
    y += 6;

    medDays.forEach(record => {
      if (y > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }
      const [, m, d] = record.date.split('-').map(Number);
      const dow = new Date(record.date).getDay();
      const dowStr = WEEKDAYS[dow];
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(50, 50, 50);
      doc.text(`${m}/${d}（${dowStr}）`, margin, y);
      const medText = record.medications.map(med => `${med.name} ${med.time}`).join('、');
      doc.setFont('helvetica', 'normal');
      doc.text(medText, margin + 22, y);
      y += 6;
    });
  }

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(160, 160, 160);
  doc.text('頭痛記録アプリ', pageWidth / 2, pageHeight - 8, { align: 'center' });

  doc.save(`headache_${year}-${String(month).padStart(2, '0')}.pdf`);
}
