import { useState, useCallback } from 'react';
import './index.css';
import { CalendarView } from './CalendarView';
import { DayModal } from './DayModal';
import { MonthlyStats } from './MonthlyStats';
import { exportPDF } from './PDFExport';
import { getMonthRecords } from './storage';
import type { MonthData } from './types';

function App() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // 1-12
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [monthData, setMonthData] = useState<MonthData>(() =>
    getMonthRecords(today.getFullYear(), today.getMonth() + 1)
  );

  const refreshData = useCallback(() => {
    setMonthData(getMonthRecords(year, month));
  }, [year, month]);

  const goToPrevMonth = () => {
    let y = year, m = month - 1;
    if (m < 1) { m = 12; y--; }
    setYear(y); setMonth(m);
    setMonthData(getMonthRecords(y, m));
  };

  const goToNextMonth = () => {
    let y = year, m = month + 1;
    if (m > 12) { m = 1; y++; }
    setYear(y); setMonth(m);
    setMonthData(getMonthRecords(y, m));
  };

  const goToToday = () => {
    const t = new Date();
    setYear(t.getFullYear());
    setMonth(t.getMonth() + 1);
    setMonthData(getMonthRecords(t.getFullYear(), t.getMonth() + 1));
  };

  const handleDayClick = (date: string) => {
    setSelectedDate(date);
  };

  const handleModalClose = () => {
    setSelectedDate(null);
  };

  const handleModalSaved = () => {
    refreshData();
  };

  const handleExportPDF = async () => {
    await exportPDF(year, month, monthData);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevMonth}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 font-bold text-lg"
              aria-label="前の月"
            >
              ‹
            </button>
            <h1 className="text-xl font-bold text-gray-800 min-w-[120px] text-center">
              {year}年{month}月
            </h1>
            <button
              onClick={goToNextMonth}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 font-bold text-lg"
              aria-label="次の月"
            >
              ›
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={goToToday}
              className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600"
            >
              今日
            </button>
            <button
              onClick={handleExportPDF}
              className="text-sm px-3 py-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 font-medium"
            >
              PDF出力
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Calendar */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <CalendarView
            year={year}
            month={month}
            monthData={monthData}
            onDayClick={handleDayClick}
          />
        </div>

        {/* Legend */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">凡例</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { label: '記録なし', bg: '#f9fafb', border: '#e5e7eb' },
              { label: '首痛止まり', bg: '#fefde8', border: '#fef08a' },
              { label: '頭痛（仕事できる）', bg: '#fed7aa', border: '#fb923c' },
              { label: '頭痛（ギリ仕事できる）', bg: '#fecaca', border: '#f87171' },
              { label: '頭痛（仕事できない）', bg: '#ef4444', border: '#dc2626' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div
                  className="w-4 h-4 rounded border"
                  style={{ backgroundColor: item.bg, borderColor: item.border }}
                />
                <span className="text-xs text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <MonthlyStats year={year} month={month} monthData={monthData} />
      </main>

      {/* Modal */}
      {selectedDate && (
        <DayModal
          date={selectedDate}
          onClose={handleModalClose}
          onSaved={handleModalSaved}
        />
      )}
    </div>
  );
}

export default App;
