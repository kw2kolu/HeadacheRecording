import type { DayRecord, MonthData } from './types';

const STORAGE_KEY = 'headache_records';

export function getAllRecords(): MonthData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as MonthData;
  } catch {
    return {};
  }
}

export function getRecord(date: string): DayRecord | null {
  const all = getAllRecords();
  return all[date] || null;
}

export function saveRecord(record: DayRecord): void {
  const all = getAllRecords();
  all[record.date] = record;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function deleteRecord(date: string): void {
  const all = getAllRecords();
  delete all[date];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function getMonthRecords(year: number, month: number): MonthData {
  const all = getAllRecords();
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  const result: MonthData = {};
  for (const [key, value] of Object.entries(all)) {
    if (key.startsWith(prefix)) {
      result[key] = value;
    }
  }
  return result;
}
