'use client';

import React, { useState } from 'react';
import { X, Upload, FileSpreadsheet, Download, Check, AlertCircle, RefreshCcw } from 'lucide-react';
import { DailyMenuDay } from '@/lib/types';
import { MESS_DISHES } from '@/lib/data/messDishes';
import { saveCustomMonthlyMenu, resetMenuToDefault } from '@/lib/storage';

interface AdminMenuImporterProps {
  isOpen: boolean;
  onClose: () => void;
  onMenuUpdated: () => void;
}

export const AdminMenuImporter: React.FC<AdminMenuImporterProps> = ({
  isOpen,
  onClose,
  onMenuUpdated,
}) => {
  const [csvText, setCsvText] = useState('');
  const [importStatus, setImportStatus] = useState<{ success?: string; error?: string } | null>(null);

  if (!isOpen) return null;

  const sampleCsv = `DayNumber,DayOfWeek,MealSlot,DishIds
1,Monday,breakfast,dish_poha;dish_boiled_eggs;dish_mess_chai
1,Monday,lunch,dish_tawa_roti_pair;dish_steamed_rice;dish_toor_dal_tadka;dish_aloo_gobi;dish_mess_curd
1,Monday,snacks,dish_mess_chai;dish_bread_butter
1,Monday,dinner,dish_tawa_roti_pair;dish_steamed_rice;dish_moong_dal_fry;dish_soya_chunks_curry
2,Tuesday,breakfast,dish_upma;dish_boiled_eggs;dish_mess_chai
2,Tuesday,lunch,dish_tawa_roti_pair;dish_steamed_rice;dish_kadhi_pakora;dish_bhindi_masala;dish_mess_curd
2,Tuesday,snacks,dish_mess_chai;dish_samosa
2,Tuesday,dinner,dish_tawa_roti_pair;dish_jeera_rice;dish_chana_masala;dish_lauki_chana_dal`;

  const handleDownloadSample = () => {
    const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'mess_mate_sample_monthly_menu.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleParseAndSave = () => {
    setImportStatus(null);
    if (!csvText.trim()) {
      setImportStatus({ error: 'Please paste CSV content or load sample format.' });
      return;
    }

    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) {
        setImportStatus({ error: 'CSV requires a header and at least 1 row of data.' });
        return;
      }

      const dayMap = new Map<number, DailyMenuDay>();

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const [dayNumStr, dayOfWeek, mealSlot, dishIdsStr] = line.split(',');
        const dayNumber = parseInt(dayNumStr.trim(), 10);
        const slot = mealSlot.trim().toLowerCase() as 'breakfast' | 'lunch' | 'snacks' | 'dinner';
        const dishIds = (dishIdsStr || '').split(';').map((d) => d.trim()).filter(Boolean);

        if (!dayMap.has(dayNumber)) {
          dayMap.set(dayNumber, {
            dayNumber,
            dayOfWeek: dayOfWeek ? dayOfWeek.trim() : 'Monday',
            slots: {
              breakfast: [],
              lunch: [],
              snacks: [],
              dinner: [],
            },
          });
        }

        const dayObj = dayMap.get(dayNumber)!;
        if (dayObj.slots[slot]) {
          dayObj.slots[slot] = dishIds;
        }
      }

      const importedDays = Array.from(dayMap.values()).sort((a, b) => a.dayNumber - b.dayNumber);

      if (importedDays.length === 0) {
        setImportStatus({ error: 'No valid days parsed from CSV.' });
        return;
      }

      saveCustomMonthlyMenu(importedDays);
      setImportStatus({ success: `Successfully imported ${importedDays.length} days of fixed mess menu!` });
      onMenuUpdated();
    } catch (e: any) {
      setImportStatus({ error: `Parse error: ${e.message || 'Invalid format'}` });
    }
  };

  const handleReset = () => {
    resetMenuToDefault();
    setImportStatus({ success: 'Reset to default 30-day university mess schedule.' });
    onMenuUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-campus-600" />
            <h2 className="text-base font-bold text-gray-900">
              Monthly Mess Menu Importer
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          <div className="bg-campus-50/70 border border-campus-200 p-3 rounded-xl text-campus-900 leading-relaxed">
            <strong className="block font-bold mb-0.5">Admin Once-a-Month Import:</strong>
            Mess managers upload the fixed 30-day schedule once. Dishes are automatically bound to IFCT 2017 nutritional datasets.
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleDownloadSample}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-gray-200 font-bold text-gray-700 hover:bg-gray-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV Template</span>
            </button>
            <button
              onClick={() => setCsvText(sampleCsv)}
              className="text-campus-700 font-bold underline hover:text-campus-800"
            >
              Load Sample Text
            </button>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">
              CSV Data (Columns: DayNumber, DayOfWeek, MealSlot, DishIds):
            </label>
            <textarea
              rows={8}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="Paste comma-separated mess schedule here..."
              className="w-full font-mono text-[11px] p-3 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-campus-500"
            />
          </div>

          {/* Status feedback */}
          {importStatus?.success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-2.5 rounded-xl flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{importStatus.success}</span>
            </div>
          )}
          {importStatus?.error && (
            <div className="bg-red-50 border border-red-200 text-red-900 p-2.5 rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{importStatus.error}</span>
            </div>
          )}

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={handleReset}
              className="flex items-center space-x-1 text-gray-500 hover:text-gray-800 font-semibold"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>

            <button
              onClick={handleParseAndSave}
              className="flex items-center space-x-1.5 px-4 py-2 bg-campus-600 text-white rounded-xl font-bold hover:bg-campus-700 shadow-sm"
            >
              <Upload className="w-4 h-4" />
              <span>Save & Apply Menu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
