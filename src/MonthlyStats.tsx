import React from 'react';
import type { MonthData } from './types';
import { HEADACHE_LEVELS, MEDICATIONS } from './types';

interface MonthlyStatsProps {
  year: number;
  month: number;
  monthData: MonthData;
}

export const MonthlyStats: React.FC<MonthlyStatsProps> = ({ year, month, monthData }) => {
  const records = Object.values(monthData);

  const levelCounts = HEADACHE_LEVELS.map(level => ({
    ...level,
    count: records.filter(r => r.headacheLevel === level.value).length,
  }));

  const totalHeadacheDays = records.filter(r => r.headacheLevel !== undefined).length;

  const medCounts = MEDICATIONS.map(med => ({
    name: med,
    count: records.reduce((sum, r) => sum + r.medications.filter(m => m.name === med).length, 0),
    days: records.filter(r => r.medications.some(m => m.name === med)).length,
  }));

  const totalMedDays = records.filter(r => r.medications.length > 0).length;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4" id="monthly-stats">
      <h2 className="text-base font-bold text-gray-800 mb-3">{year}年{month}月 集計</h2>

      {/* Headache counts */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-500 mb-2">頭痛日数</h3>
        <table className="w-full text-sm">
          <tbody>
            {levelCounts.map(level => (
              <tr key={level.value} className="border-b border-gray-100 last:border-0">
                <td className="py-1.5 pr-2">
                  <span
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={{ backgroundColor: level.bgColor, color: level.color }}
                  >
                    {level.label}
                  </span>
                </td>
                <td className="py-1.5 text-right font-semibold text-gray-800 w-16">
                  {level.count} 日
                </td>
              </tr>
            ))}
            <tr className="border-t-2 border-gray-200">
              <td className="py-1.5 pr-2 text-gray-600 font-medium">合計（頭痛あり）</td>
              <td className="py-1.5 text-right font-bold text-gray-800 w-16">{totalHeadacheDays} 日</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Medication counts */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 mb-2">頓服薬使用</h3>
        {records.length === 0 || totalMedDays === 0 ? (
          <p className="text-sm text-gray-400">記録なし</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-200">
                <th className="text-left pb-1">薬</th>
                <th className="text-right pb-1 w-20">服用回数</th>
                <th className="text-right pb-1 w-16">服用日数</th>
              </tr>
            </thead>
            <tbody>
              {medCounts.map(med => (
                <tr key={med.name} className="border-b border-gray-100 last:border-0">
                  <td className="py-1.5 text-gray-700">{med.name}</td>
                  <td className="py-1.5 text-right font-semibold text-gray-800">{med.count} 回</td>
                  <td className="py-1.5 text-right font-semibold text-gray-800">{med.days} 日</td>
                </tr>
              ))}
              <tr className="border-t-2 border-gray-200">
                <td className="py-1.5 text-gray-600 font-medium">服用日数合計</td>
                <td className="py-1.5" />
                <td className="py-1.5 text-right font-bold text-gray-800">{totalMedDays} 日</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
