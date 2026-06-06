import React from 'react';
import type { MonthData } from './types';
import { getLevelInfo } from './types';

interface CalendarViewProps {
  year: number;
  month: number; // 1-12
  monthData: MonthData;
  onDayClick: (date: string) => void;
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

export const CalendarView: React.FC<CalendarViewProps> = ({ year, month, monthData, onDayClick }) => {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const startDow = firstDay.getDay(); // 0=Sun
  const daysInMonth = lastDay.getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  // pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <div id="calendar-view" className="w-full">
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((wd, i) => (
          <div
            key={wd}
            className={`text-center text-sm font-semibold py-2 ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-600'}`}
          >
            {wd}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="h-16 rounded-lg bg-gray-50" />;
          }
          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const record = monthData[dateStr];
          const levelInfo = record ? getLevelInfo(record.headacheLevel) : null;
          const hasMeds = record && record.medications.length > 0;
          const isToday = dateStr === todayStr;
          const dow = (startDow + day - 1) % 7;

          return (
            <button
              key={dateStr}
              onClick={() => onDayClick(dateStr)}
              className={`h-16 rounded-lg border-2 flex flex-col items-center justify-start pt-1 cursor-pointer transition-all hover:opacity-80 hover:shadow-md ${
                isToday ? 'border-blue-400' : 'border-transparent'
              }`}
              style={{
                backgroundColor: levelInfo ? levelInfo.bgColor : '#f9fafb',
              }}
            >
              <span
                className={`text-sm font-bold ${
                  dow === 0 ? 'text-red-600' : dow === 6 ? 'text-blue-600' : 'text-gray-700'
                } ${isToday ? 'underline' : ''}`}
              >
                {day}
              </span>
              {levelInfo && (
                <span className="text-xs mt-0.5 px-1 leading-tight text-center" style={{ color: levelInfo.color }}>
                  {record?.headacheLevel === 'neck' ? '首痛' : record?.headacheLevel === 'mild' ? '軽' : record?.headacheLevel === 'moderate' ? '中' : '重'}
                </span>
              )}
              {hasMeds && (
                <span className="text-xs mt-0.5">💊</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
