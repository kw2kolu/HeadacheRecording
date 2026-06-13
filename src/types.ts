export type HeadacheLevel = 'neck' | 'mild' | 'moderate' | 'severe';

export type Medication = {
  name: string;
  time: string;
};

export type DayRecord = {
  date: string; // YYYY-MM-DD
  headacheLevel?: HeadacheLevel;
  medications: Medication[];
  notes?: string;
};

export type MonthData = {
  [date: string]: DayRecord;
};

export const HEADACHE_LEVELS: { value: HeadacheLevel; label: string; color: string; bgColor: string }[] = [
  { value: 'neck', label: '首痛止まり', color: '#b8860b', bgColor: '#fefde8' },
  { value: 'mild', label: '頭痛（仕事できる）', color: '#c2410c', bgColor: '#fed7aa' },
  { value: 'moderate', label: '頭痛（ギリ仕事できる）', color: '#dc2626', bgColor: '#fecaca' },
  { value: 'severe', label: '頭痛（仕事できない）', color: '#991b1b', bgColor: '#ef4444' },
];

export const MEDICATIONS = ['ドンペリドン', 'ナラトリプタン'];

export const getLevelInfo = (level?: HeadacheLevel) => {
  if (!level) return null;
  return HEADACHE_LEVELS.find(l => l.value === level) || null;
};
