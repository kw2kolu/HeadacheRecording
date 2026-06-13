import React, { useState, useEffect } from 'react';
import type { DayRecord, HeadacheLevel, Medication } from './types';
import { HEADACHE_LEVELS, MEDICATIONS } from './types';
import { getRecord, saveRecord, deleteRecord } from './storage';

interface DayModalProps {
  date: string; // YYYY-MM-DD
  onClose: () => void;
  onSaved: () => void;
}

export const DayModal: React.FC<DayModalProps> = ({ date, onClose, onSaved }) => {
  const [headacheLevel, setHeadacheLevel] = useState<HeadacheLevel | undefined>(undefined);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [notes, setNotes] = useState('');
  const [newMedName, setNewMedName] = useState(MEDICATIONS[0]);
  const [newMedTime, setNewMedTime] = useState('');

  const [year, month, day] = date.split('-').map(Number);
  const displayDate = `${year}年${month}月${day}日`;

  useEffect(() => {
    const record = getRecord(date);
    if (record) {
      setHeadacheLevel(record.headacheLevel);
      setMedications(record.medications || []);
      setNotes(record.notes || '');
    }
  }, [date]);

  const handleSave = () => {
    const record: DayRecord = {
      date,
      headacheLevel,
      medications,
      notes: notes || undefined,
    };
    saveRecord(record);
    onSaved();
    onClose();
  };

  const handleDelete = () => {
    deleteRecord(date);
    onSaved();
    onClose();
  };

  const handleAddMed = () => {
    if (!newMedTime) {
      alert('時間を入力してください');
      return;
    }
    setMedications(prev => [...prev, { name: newMedName, time: newMedTime }]);
    setNewMedTime('');
  };

  const handleRemoveMed = (idx: number) => {
    setMedications(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">{displayDate}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
          </div>

          {/* Headache Level */}
          <section className="mb-5">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">頭痛レベル</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="level"
                  checked={headacheLevel === undefined}
                  onChange={() => setHeadacheLevel(undefined)}
                  className="w-4 h-4"
                />
                <span className="text-gray-600">なし</span>
              </label>
              {HEADACHE_LEVELS.map(level => (
                <label key={level.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="level"
                    checked={headacheLevel === level.value}
                    onChange={() => setHeadacheLevel(level.value)}
                    className="w-4 h-4"
                  />
                  <span
                    className="px-2 py-0.5 rounded text-sm font-medium"
                    style={{ backgroundColor: level.bgColor, color: level.color }}
                  >
                    {level.label}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* Medications */}
          <section className="mb-5">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">頓服薬</h3>
            {medications.length > 0 && (
              <ul className="mb-3 space-y-1">
                {medications.map((med, idx) => (
                  <li key={idx} className="flex items-center justify-between bg-blue-50 rounded-lg px-3 py-2">
                    <span className="text-sm text-blue-800">{med.name} <span className="text-blue-500">{med.time}</span></span>
                    <button
                      onClick={() => handleRemoveMed(idx)}
                      className="text-red-400 hover:text-red-600 text-lg leading-none ml-2"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex gap-2 items-center flex-wrap">
              <select
                value={newMedName}
                onChange={e => setNewMedName(e.target.value)}
                className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm flex-1 min-w-0"
              >
                {MEDICATIONS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <input
                type="time"
                value={newMedTime}
                onChange={e => setNewMedTime(e.target.value)}
                className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm w-32"
              />
              <button
                onClick={handleAddMed}
                className="bg-blue-500 text-white rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-blue-600"
              >
                追加
              </button>
            </div>
          </section>

          {/* Notes */}
          <section className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">メモ</h3>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
              rows={3}
              placeholder="自由記述..."
            />
          </section>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm text-red-500 border border-red-300 rounded-lg hover:bg-red-50"
            >
              削除
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 font-medium"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
