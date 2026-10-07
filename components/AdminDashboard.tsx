'use client';

import React, { useState } from 'react';
import {
  X,
  LayoutDashboard,
  FileSpreadsheet,
  Utensils,
  Database,
  Download,
  Upload,
  Check,
  AlertCircle,
  RefreshCcw,
  Scale,
  TrendingUp,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { DailyMenuDay, Dish, PortionStatus } from '@/lib/types';
import { MESS_DISHES } from '@/lib/data/messDishes';
import { IFCT_INGREDIENTS } from '@/lib/data/ifctIngredients';
import {
  getStoredLogs,
  saveCustomMonthlyMenu,
  resetMenuToDefault,
  getMonthlyMenu,
} from '@/lib/storage';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onDataUpdated: () => void;
}

type AdminTab = 'analytics' | 'menu_import' | 'dishes' | 'ifct';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onDataUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
  const [csvText, setCsvText] = useState('');
  const [importStatus, setImportStatus] = useState<{ success?: string; error?: string } | null>(null);
  const [dishesList, setDishesList] = useState<Dish[]>(MESS_DISHES);
  const [ifctSearch, setIfctSearch] = useState('');

  if (!isOpen) return null;

  // Pilot Analytics Calculations
  const logs = getStoredLogs();
  const messLogs = logs.filter((l) => l.source === 'mess');
  const foodCourtLogs = logs.filter((l) => l.source === 'food_court');
  const uniqueStudents = Array.from(new Set(logs.map((l) => l.dishId))).length; // sample proxy

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

  const handleExportLogs = () => {
    if (logs.length === 0) {
      alert('No student meal logs recorded yet.');
      return;
    }
    const headers = 'ID,Date,MealSlot,Source,DishName,Calories,Protein,Carbs,Fat\n';
    const rows = logs
      .map(
        (l) =>
          `"${l.id}","${l.dateStr}","${l.mealSlot}","${l.source}","${l.dishName}",${l.calories},${l.protein},${l.carbs},${l.fat}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `mess_mate_pilot_logs_${new Date().toISOString().slice(0, 10)}.csv`);
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
            slots: { breakfast: [], lunch: [], snacks: [], dinner: [] },
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
      onDataUpdated();
    } catch (e: any) {
      setImportStatus({ error: `Parse error: ${e.message || 'Invalid format'}` });
    }
  };

  const togglePortionStatus = (dishId: string) => {
    setDishesList((prev) =>
      prev.map((d) => {
        if (d.id === dishId) {
          const nextStatus: PortionStatus = d.portionStatus === 'measured' ? 'estimated' : 'measured';
          return { ...d, portionStatus: nextStatus };
        }
        return d;
      })
    );
  };

  const filteredIfct = IFCT_INGREDIENTS.filter(
    (i) =>
      i.name.toLowerCase().includes(ifctSearch.toLowerCase()) ||
      i.category.toLowerCase().includes(ifctSearch.toLowerCase()) ||
      i.code.toLowerCase().includes(ifctSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-campus-600 flex items-center justify-center text-white">
              <LayoutDashboard className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-black tracking-tight">Mess Mate Admin &amp; Founder Dashboard</h2>
                <span className="text-[9px] bg-campus-500/20 text-campus-300 font-bold px-1.5 py-0.2 rounded border border-campus-400/30">
                  Pilot v1
                </span>
              </div>
              <p className="text-[11px] text-gray-400">Hostel Mess Menu Engine &amp; Hypothesis Validation</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <a
              href="/admin"
              className="text-xs font-bold text-terracotta-400 hover:text-terracotta-300 underline transition-colors"
            >
              Open Dedicated /admin Portal →
            </a>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-100 bg-gray-50/70 text-xs font-bold text-gray-600 px-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-2.5 px-3 border-b-2 whitespace-nowrap flex items-center space-x-1.5 transition-colors ${
              activeTab === 'analytics'
                ? 'border-campus-600 text-campus-800 bg-white'
                : 'border-transparent hover:text-gray-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Pilot Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('menu_import')}
            className={`py-2.5 px-3 border-b-2 whitespace-nowrap flex items-center space-x-1.5 transition-colors ${
              activeTab === 'menu_import'
                ? 'border-campus-600 text-campus-800 bg-white'
                : 'border-transparent hover:text-gray-900'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Monthly Menu (CSV)</span>
          </button>

          <button
            onClick={() => setActiveTab('dishes')}
            className={`py-2.5 px-3 border-b-2 whitespace-nowrap flex items-center space-x-1.5 transition-colors ${
              activeTab === 'dishes'
                ? 'border-campus-600 text-campus-800 bg-white'
                : 'border-transparent hover:text-gray-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Dish Portions ({dishesList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ifct')}
            className={`py-2.5 px-3 border-b-2 whitespace-nowrap flex items-center space-x-1.5 transition-colors ${
              activeTab === 'ifct'
                ? 'border-campus-600 text-campus-800 bg-white'
                : 'border-transparent hover:text-gray-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>IFCT 2017 Ingredients</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* TAB 1: PILOT HYPOTHESIS & ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-4">
              {/* Core Hypothesis Card */}
              <div className="bg-gradient-to-br from-campus-900 to-slate-900 text-white p-4 rounded-2xl shadow-sm">
                <span className="text-[10px] font-bold text-campus-300 uppercase tracking-wider block">
                  Core MVP Hypothesis
                </span>
                <p className="text-sm font-semibold mt-1 leading-relaxed text-gray-100">
                  &ldquo;Do students change what they actually eat because of a recommendation, given a fixed real-world mess menu?&rdquo;
                </p>
                <div className="mt-3 pt-3 border-t border-campus-700/50 flex items-center justify-between text-xs">
                  <span className="text-gray-300">Target Pilot Group: <strong>15–20 students</strong></span>
                  <span className="bg-campus-500/20 text-campus-300 px-2 py-0.5 rounded font-bold">Phase 1 Live</span>
                </div>
              </div>

              {/* KPI Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 border border-gray-100 p-3 rounded-xl">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Total Check-ins</span>
                  <div className="text-xl font-black text-gray-900 mt-1">{logs.length}</div>
                  <span className="text-[10px] text-gray-500">Student &ldquo;I Ate This&rdquo;</span>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-100 p-3 rounded-xl">
                  <span className="text-[10px] text-emerald-700 font-bold uppercase block">Mess Counter</span>
                  <div className="text-xl font-black text-emerald-900 mt-1">{messLogs.length}</div>
                  <span className="text-[10px] text-emerald-700">Fixed menu choices</span>
                </div>

                <div className="bg-curry-50/70 border border-curry-100 p-3 rounded-xl">
                  <span className="text-[10px] text-curry-800 font-bold uppercase block">Food Court</span>
                  <div className="text-xl font-black text-curry-900 mt-1">{foodCourtLogs.length}</div>
                  <span className="text-[10px] text-curry-800">Campus stall orders</span>
                </div>
              </div>

              {/* Data Export Action */}
              <div className="bg-white border border-gray-200 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">Export Raw Pilot Logs</h4>
                  <p className="text-gray-500 text-[11px] mt-0.5">
                    Download complete timestamped behavioral data for dietitian review or research.
                  </p>
                </div>
                <button
                  onClick={handleExportLogs}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gray-900 text-white font-bold hover:bg-black transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: MONTHLY MENU SPREADSHEET IMPORTER */}
          {activeTab === 'menu_import' && (
            <div className="space-y-3">
              <div className="bg-campus-50/70 border border-campus-200 p-3 rounded-xl text-campus-900 leading-relaxed">
                <strong className="block font-bold mb-0.5">Monthly Spreadsheet Import:</strong>
                Upload once per month. Dishes automatically link to the IFCT 2017 base-ingredient composition table so portions and macros scale accurately.
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handleDownloadSample}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-gray-200 font-bold text-gray-700 hover:bg-gray-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Sample CSV</span>
                </button>
                <button
                  onClick={() => setCsvText(sampleCsv)}
                  className="text-campus-700 font-bold underline hover:text-campus-800"
                >
                  Load Sample Data
                </button>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  CSV Content (DayNumber, DayOfWeek, MealSlot, DishIds):
                </label>
                <textarea
                  rows={7}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  placeholder="Paste monthly CSV rows here..."
                  className="w-full font-mono text-[11px] p-3 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-campus-500"
                />
              </div>

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
                  onClick={() => {
                    resetMenuToDefault();
                    setImportStatus({ success: 'Reset to default 30-day university mess schedule.' });
                    onDataUpdated();
                  }}
                  className="flex items-center space-x-1 text-gray-500 hover:text-gray-800 font-semibold"
                >
                  <RefreshCcw className="w-3.5 h-3.5" />
                  <span>Reset to Default 30-Day Menu</span>
                </button>

                <button
                  onClick={handleParseAndSave}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-campus-600 text-white rounded-xl font-bold hover:bg-campus-700 shadow-sm"
                >
                  <Upload className="w-4 h-4" />
                  <span>Save &amp; Apply Schedule</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: DISHES & CALIBRATION */}
          {activeTab === 'dishes' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">Mess Dishes &amp; Serving Portions</h3>
                  <p className="text-gray-500 text-[11px]">
                    Calibrated once by weighing real mess servings (ladle/scoop reference).
                  </p>
                </div>
                <span className="text-[10px] bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded">
                  {dishesList.filter((d) => d.portionStatus === 'measured').length} Measured
                </span>
              </div>

              <div className="space-y-2">
                {dishesList.map((dish) => (
                  <div
                    key={dish.id}
                    className="p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900 text-xs">{dish.name}</span>
                        <span className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                          dish.category === 'veg' ? 'bg-emerald-100 text-emerald-800' : dish.category === 'egg' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {dish.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        {dish.portionDescription} ({dish.portionSizeGrams}g)
                      </div>
                      <div className="text-[11px] text-gray-600 mt-0.5">
                        <strong>{dish.calories} kcal</strong> • <span className="text-emerald-700 font-semibold">{dish.protein}g protein</span> • {dish.carbs}g carbs • {dish.fat}g fat
                      </div>
                    </div>

                    <button
                      onClick={() => togglePortionStatus(dish.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors shrink-0 ${
                        dish.portionStatus === 'measured'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-amber-50 border-amber-300 text-amber-800'
                      }`}
                    >
                      {dish.portionStatus === 'measured' ? '✓ Measured' : 'Estimated'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: IFCT 2017 BASE INGREDIENTS */}
          {activeTab === 'ifct' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">IFCT 2017 Nutrition Database</h3>
                  <p className="text-gray-500 text-[11px]">
                    ICMR - National Institute of Nutrition, Hyderabad (per 100g raw edible portion)
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="Search ingredient..."
                  value={ifctSearch}
                  onChange={(e) => setIfctSearch(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-gray-200 text-xs w-36"
                />
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead className="bg-gray-100 text-gray-600 font-bold sticky top-0">
                    <tr>
                      <th className="p-2">Ingredient</th>
                      <th className="p-2">Category</th>
                      <th className="p-2 text-right">Kcal</th>
                      <th className="p-2 text-right">Protein</th>
                      <th className="p-2 text-right">Carbs</th>
                      <th className="p-2 text-right">Fat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredIfct.map((ing) => (
                      <tr key={ing.id} className="hover:bg-gray-50">
                        <td className="p-2 font-semibold text-gray-800">
                          {ing.name} <span className="text-[10px] text-gray-400">({ing.code})</span>
                        </td>
                        <td className="p-2 text-gray-500">{ing.category}</td>
                        <td className="p-2 text-right font-medium">{ing.calories}</td>
                        <td className="p-2 text-right text-emerald-700 font-semibold">{ing.protein}g</td>
                        <td className="p-2 text-right text-gray-600">{ing.carbs}g</td>
                        <td className="p-2 text-right text-gray-600">{ing.fat}g</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
