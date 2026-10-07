'use client';

import React, { useState, useRef } from 'react';
import {
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Calendar,
  Sparkles,
  ArrowRight,
  Utensils,
  Plus,
  Layers,
  ChevronRight,
  Eye,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';
import { DailyMenuDay, Dish, MealSlot, CsvMenuRow, MenuValidationError, DietPreference } from '@/lib/types';
import { MESS_DISHES } from '@/lib/data/messDishes';
import { saveCustomMonthlyMenu, getMonthlyMenu } from '@/lib/storage';
import { supabase } from '@/lib/supabaseClient';

const SAMPLE_CSV_TEMPLATE = `Date,Meal,Dish Name,Calories,Protein (g),Carbs (g),Fat (g),Category,Is Opt-In,Allergen Tags
Day 1,Breakfast,Poha with Peanuts,260,5.8,42.0,8.2,veg,false,nuts
Day 1,Breakfast,Boiled Eggs (2 pcs),140,12.6,0.8,9.8,egg,true,eggs
Day 1,Breakfast,Mess Special Chai,95,2.4,14.0,3.2,veg,false,dairy
Day 1,Lunch,Tawa Roti (2 pcs),170,5.2,34.0,1.2,veg,false,gluten
Day 1,Lunch,Steamed Basmati Rice,210,4.2,46.0,0.4,veg,false,
Day 1,Lunch,Toor Dal Tadka,165,8.4,24.0,4.2,veg,false,
Day 1,Lunch,Aloo Gobi Matar,135,3.2,18.0,6.0,veg,false,
Day 1,Lunch,Fresh Hostel Curd,75,3.8,4.5,4.0,veg,false,dairy
Day 1,Snacks,Mess Special Chai,95,2.4,14.0,3.2,veg,false,dairy
Day 1,Snacks,Crispy Vegetable Pakora,180,3.8,22.0,8.5,veg,false,gluten
Day 1,Dinner,Tawa Roti (2 pcs),170,5.2,34.0,1.2,veg,false,gluten
Day 1,Dinner,Steamed Basmati Rice,210,4.2,46.0,0.4,veg,false,
Day 1,Dinner,Moong Dal Fry,150,7.8,22.5,3.8,veg,false,
Day 1,Dinner,High-Protein Soya Curry,210,16.5,14.0,8.0,veg,false,soy
Day 2,Breakfast,Vegetable Upma,240,5.2,38.0,7.5,veg,false,gluten
Day 2,Breakfast,Boiled Eggs (2 pcs),140,12.6,0.8,9.8,egg,true,eggs
Day 2,Lunch,Tawa Roti (2 pcs),170,5.2,34.0,1.2,veg,false,gluten
Day 2,Lunch,Jeera Rice,220,4.0,45.0,2.5,veg,false,
Day 2,Lunch,Chole Masala,220,9.8,32.0,6.2,veg,false,
Day 2,Snacks,Mess Special Chai,95,2.4,14.0,3.2,veg,false,dairy
Day 2,Dinner,Tawa Roti (2 pcs),170,5.2,34.0,1.2,veg,false,gluten
Day 2,Dinner,Steamed Basmati Rice,210,4.2,46.0,0.4,veg,false,
Day 2,Dinner,Paneer Butter Masala,260,11.5,12.0,18.0,veg,true,dairy`;

export const AdminMenuManager: React.FC = () => {
  const [csvRawText, setCsvRawText] = useState('');
  const [parsedRows, setParsedRows] = useState<CsvMenuRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<MenuValidationError[]>([]);
  const [unmappedDishNames, setUnmappedDishNames] = useState<string[]>([]);
  const [dishMappings, setDishMappings] = useState<Record<string, string>>({});
  const [isResolvingUnmapped, setIsResolvingUnmapped] = useState(false);
  const [previewMenu, setPreviewMenu] = useState<DailyMenuDay[]>([]);
  const [previewDay, setPreviewDay] = useState<number>(1);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Download official CSV template
  const handleDownloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV_TEMPLATE], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'mess_mate_monthly_menu_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle file drop / upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        setCsvRawText(content);
        validateAndParseCsv(content);
      }
    };
    reader.readAsText(file);
  };

  // Robust Client-Side CSV Parser & Validator
  const validateAndParseCsv = (rawText: string) => {
    setPublishSuccess(null);
    const lines = rawText.trim().split(/\r?\n/);
    if (lines.length < 2) {
      setValidationErrors([
        {
          rowNumber: 1,
          field: 'File',
          message: 'CSV must contain a valid header and at least one data row.',
          severity: 'error',
        },
      ]);
      return;
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const expectedHeaders = ['date', 'meal', 'dish name', 'calories', 'protein (g)', 'carbs (g)', 'fat (g)'];
    const missingHeaders = expectedHeaders.filter((exp) => !headers.some((h) => h.includes(exp)));

    if (missingHeaders.length > 0) {
      setValidationErrors([
        {
          rowNumber: 1,
          field: 'Headers',
          message: `Missing required columns: ${missingHeaders.join(', ')}. Please use the downloadable template.`,
          severity: 'error',
        },
      ]);
      return;
    }

    const rows: CsvMenuRow[] = [];
    const errors: MenuValidationError[] = [];
    const unmappedSet = new Set<string>();

    // Build lookup for existing dishes
    const existingDishMap = new Map<string, Dish>();
    MESS_DISHES.forEach((d) => {
      existingDishMap.set(d.name.toLowerCase().trim(), d);
      existingDishMap.set(d.id.toLowerCase().trim(), d);
    });

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cols = line.split(',').map((c) => c.trim());
      const rowNum = i + 1;

      // Extract values
      const dateStr = cols[0] || '';
      const mealSlotRaw = (cols[1] || '').toLowerCase();
      const dishName = cols[2] || '';
      const calories = parseFloat(cols[3] || '0');
      const protein = parseFloat(cols[4] || '0');
      const carbs = parseFloat(cols[5] || '0');
      const fat = parseFloat(cols[6] || '0');
      const categoryRaw = (cols[7] || 'veg').toLowerCase();
      const isOptIn = cols[8]?.toLowerCase() === 'true';
      const allergens = (cols[9] || '')
        .split(';')
        .concat((cols[9] || '').split(' '))
        .map((a) => a.trim().toLowerCase())
        .filter(Boolean);

      // Validate required fields
      if (!dateStr) {
        errors.push({ rowNumber: rowNum, field: 'Date', message: 'Date or Day number is required.', severity: 'error' });
      }

      const validSlots: MealSlot[] = ['breakfast', 'lunch', 'snacks', 'dinner'];
      if (!validSlots.includes(mealSlotRaw as MealSlot)) {
        errors.push({
          rowNumber: rowNum,
          field: 'Meal',
          message: `Invalid meal slot "${mealSlotRaw}". Must be Breakfast, Lunch, Snacks, or Dinner.`,
          severity: 'error',
        });
      }

      if (!dishName) {
        errors.push({ rowNumber: rowNum, field: 'Dish Name', message: 'Dish name cannot be blank.', severity: 'error' });
      }

      if (isNaN(calories) || calories <= 0) {
        errors.push({
          rowNumber: rowNum,
          field: 'Calories',
          message: 'Calories must be a positive number.',
          severity: 'error',
        });
      }

      // Check for unmapped dish
      const matchedDish = existingDishMap.get(dishName.toLowerCase().trim());
      let matchedDishId = matchedDish?.id;
      let isNewDish = false;

      if (!matchedDishId) {
        if (dishMappings[dishName]) {
          matchedDishId = dishMappings[dishName];
        } else {
          unmappedSet.add(dishName);
          isNewDish = true;
          errors.push({
            rowNumber: rowNum,
            field: 'Dish Name',
            message: `Dish "${dishName}" is not currently in the nutritional database. Prompt: Map or create new.`,
            severity: 'warning',
          });
        }
      }

      rows.push({
        rowNumber: rowNum,
        date: dateStr,
        meal: (mealSlotRaw as MealSlot) || 'lunch',
        dishName,
        calories: isNaN(calories) ? 0 : calories,
        protein: isNaN(protein) ? 0 : protein,
        carbs: isNaN(carbs) ? 0 : carbs,
        fat: isNaN(fat) ? 0 : fat,
        category: (['veg', 'non-veg', 'egg'].includes(categoryRaw) ? categoryRaw : 'veg') as DietPreference,
        isOptIn,
        allergens,
        matchedDishId,
        isNewDish,
      });
    }

    setParsedRows(rows);
    setValidationErrors(errors);
    setUnmappedDishNames(Array.from(unmappedSet));

    // Construct Preview Menu Structure (30-day format)
    buildPreviewMenu(rows);
  };

  const buildPreviewMenu = (rows: CsvMenuRow[]) => {
    const daysMap = new Map<number, DailyMenuDay>();

    rows.forEach((r) => {
      // Extract day number, e.g. "Day 1" -> 1 or "2026-09-16" -> date modulo 30
      let dayNum = 1;
      const match = r.date.match(/\d+/);
      if (match) {
        dayNum = parseInt(match[0], 10);
        if (dayNum > 30) dayNum = (dayNum % 30) + 1;
      }

      if (!daysMap.has(dayNum)) {
        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        daysMap.set(dayNum, {
          dayNumber: dayNum,
          dayOfWeek: daysOfWeek[(dayNum - 1) % 7],
          slots: {
            breakfast: [],
            lunch: [],
            snacks: [],
            dinner: [],
          },
        });
      }

      const currentDay = daysMap.get(dayNum)!;
      const dishIdToUse = r.matchedDishId || `custom_${r.dishName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      if (!currentDay.slots[r.meal].includes(dishIdToUse)) {
        currentDay.slots[r.meal].push(dishIdToUse);
      }
    });

    const sortedDays = Array.from(daysMap.values()).sort((a, b) => a.dayNumber - b.dayNumber);
    setPreviewMenu(sortedDays);
    if (sortedDays.length > 0) {
      setPreviewDay(sortedDays[0].dayNumber);
    }
  };

  // Unmapped dish resolver: map or create
  const handleMapDish = (unmappedName: string, targetDishId: string) => {
    const updatedMappings = { ...dishMappings, [unmappedName]: targetDishId };
    setDishMappings(updatedMappings);

    // Update parsed rows
    const updatedRows = parsedRows.map((r) => {
      if (r.dishName === unmappedName) {
        return {
          ...r,
          matchedDishId: targetDishId,
          isNewDish: targetDishId.startsWith('new_'),
        };
      }
      return r;
    });

    setParsedRows(updatedRows);
    setUnmappedDishNames((prev) => prev.filter((name) => name !== unmappedName));
    buildPreviewMenu(updatedRows);
  };

  const handleCreateAsNewDish = (unmappedName: string) => {
    const newId = `dish_custom_${unmappedName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    handleMapDish(unmappedName, newId);
  };

  const handleResolveAllAsNew = () => {
    unmappedDishNames.forEach((name) => {
      const newId = `dish_custom_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      dishMappings[name] = newId;
    });
    setDishMappings({ ...dishMappings });

    const updatedRows = parsedRows.map((r) => ({
      ...r,
      matchedDishId: dishMappings[r.dishName] || r.matchedDishId,
      isNewDish: true,
    }));

    setParsedRows(updatedRows);
    setUnmappedDishNames([]);
    buildPreviewMenu(updatedRows);
  };

  // Publish to App & Database
  const handlePublishMenu = async () => {
    if (previewMenu.length === 0) return;
    setIsPublishing(true);

    try {
      // 1. Save to localStorage for instant web app availability
      saveCustomMonthlyMenu(previewMenu);

      // 2. Commit to Supabase monthly_menu table if online
      if (supabase) {
        for (const day of previewMenu) {
          for (const slot of ['breakfast', 'lunch', 'snacks', 'dinner'] as MealSlot[]) {
            await supabase.from('monthly_menu').upsert(
              {
                day_number: day.dayNumber,
                day_of_week: day.dayOfWeek,
                meal_slot: slot,
                dish_ids: day.slots[slot],
              },
              { onConflict: 'day_number, meal_slot' }
            );
          }
        }
      }

      setPublishSuccess(
        `Successfully published ${previewMenu.length} day(s) of menu rotations to the student app!`
      );
    } catch (err: any) {
      console.error('Publish error:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  const hasFatalErrors = validationErrors.some((e) => e.severity === 'error');
  const activeDayMenu = previewMenu.find((d) => d.dayNumber === previewDay);

  return (
    <div className="space-y-8">
      {/* Top Banner & Template Actions */}
      <div className="bg-obsidian-900 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-terracotta-950/80 text-terracotta-300 border border-terracotta-800/60 text-xs font-bold">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Monthly Mess Menu Importer</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-white">
            Upload & Publish Fixed Monthly Menu
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            Upload the 30-day fixed mess menu via standard CSV. The validator verifies nutrition tags, flags unmapped dish compositions, and lets you preview breakfast/lunch/snacks/dinner rotations before pushing to students.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={handleDownloadTemplate}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-200 hover:text-white flex items-center space-x-2 transition-all"
          >
            <Download className="w-4 h-4 text-terracotta-400" />
            <span>Download CSV Template</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv,text/csv"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-5 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 active:scale-95 text-xs font-bold text-white flex items-center space-x-2 transition-all shadow-glow-terracotta"
          >
            <Upload className="w-4 h-4" />
            <span>Choose CSV File</span>
          </button>
        </div>
      </div>

      {/* CSV Content Input & Quick Paste */}
      <div className="bg-obsidian-900 border border-white/10 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Layers className="w-4 h-4 text-terracotta-400" />
            <span>Paste CSV Data or Drag & Drop</span>
          </h3>
          <button
            onClick={() => {
              setCsvRawText(SAMPLE_CSV_TEMPLATE);
              validateAndParseCsv(SAMPLE_CSV_TEMPLATE);
            }}
            className="text-xs text-terracotta-400 hover:text-terracotta-300 underline font-medium"
          >
            Load Sample 2-Day Menu
          </button>
        </div>

        <textarea
          value={csvRawText}
          onChange={(e) => {
            setCsvRawText(e.target.value);
            validateAndParseCsv(e.target.value);
          }}
          rows={5}
          placeholder="Paste CSV rows here: Date, Meal, Dish Name, Calories, Protein, Carbs, Fat..."
          className="w-full bg-obsidian-950 border border-white/10 rounded-2xl p-4 text-xs font-mono text-gray-300 placeholder:text-gray-600 focus:border-terracotta-500 focus:outline-none transition-all"
        />
      </div>

      {/* Validation Feedback & Unmapped Dishes Resolver */}
      {validationErrors.length > 0 && (
        <div className="bg-obsidian-900 border border-white/10 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {hasFatalErrors ? (
                <XCircle className="w-5 h-5 text-red-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-saffron-400" />
              )}
              <h3 className="text-sm font-bold text-white">
                Validation Summary: {validationErrors.length} note(s) found
              </h3>
            </div>

            {unmappedDishNames.length > 0 && (
              <button
                onClick={handleResolveAllAsNew}
                className="px-3 py-1.5 rounded-xl bg-terracotta-950 border border-terracotta-700/50 text-terracotta-300 text-xs font-bold hover:bg-terracotta-900 transition-all flex items-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-saffron-400" />
                <span>Auto-Create All ({unmappedDishNames.length}) As New Dishes</span>
              </button>
            )}
          </div>

          {/* Unmapped Dish Prompt */}
          {unmappedDishNames.length > 0 && (
            <div className="bg-saffron-950/40 border border-saffron-500/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-start space-x-2.5">
                <HelpCircle className="w-4 h-4 text-saffron-400 shrink-0 mt-0.5" />
                <div className="text-xs text-saffron-200">
                  <span className="font-bold">Unmapped Dishes Detected:</span> The following dish names were not recognized in the standard mess database. You can create them as new items or map them to an existing dish:
                </div>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {unmappedDishNames.map((name) => (
                  <div
                    key={name}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 bg-obsidian-950/70 border border-white/5 rounded-xl gap-2 text-xs"
                  >
                    <span className="font-bold text-white">{name}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCreateAsNewDish(name)}
                        className="px-2.5 py-1 rounded-lg bg-terracotta-600 hover:bg-terracotta-500 text-white font-bold text-[11px] transition-all"
                      >
                        + Create as New Dish
                      </button>
                      <select
                        onChange={(e) => {
                          if (e.target.value) handleMapDish(name, e.target.value);
                        }}
                        defaultValue=""
                        className="bg-obsidian-900 border border-white/10 rounded-lg px-2 py-1 text-[11px] text-gray-300 focus:outline-none"
                      >
                        <option value="" disabled>
                          Map to existing...
                        </option>
                        {MESS_DISHES.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name} ({d.calories} kcal)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Errors list */}
          <div className="max-h-40 overflow-y-auto space-y-1.5 pr-2 font-mono text-[11px]">
            {validationErrors.map((err, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-xl border flex items-center justify-between ${
                  err.severity === 'error'
                    ? 'bg-red-950/40 border-red-500/30 text-red-200'
                    : 'bg-saffron-950/30 border-saffron-500/20 text-saffron-300'
                }`}
              >
                <span>
                  Row {err.rowNumber} [{err.field}]: {err.message}
                </span>
                <span className="uppercase text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/30">
                  {err.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Banner */}
      {publishSuccess && (
        <div className="p-4 bg-olive-950/60 border border-olive-500/40 rounded-2xl text-olive-200 text-xs font-bold flex items-center space-x-2.5 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-olive-400 shrink-0" />
          <span>{publishSuccess}</span>
        </div>
      )}

      {/* Interactive Calendar / Month Preview */}
      {previewMenu.length > 0 && !hasFatalErrors && (
        <div className="bg-obsidian-900 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-terracotta-400" />
                <h3 className="text-lg font-bold font-display text-white">
                  Monthly Menu Calendar Preview ({previewMenu.length} Days Validated)
                </h3>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Verify each meal slot before committing to live student clients.
              </p>
            </div>

            <button
              onClick={handlePublishMenu}
              disabled={isPublishing}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-terracotta-600 to-terracotta-500 hover:from-terracotta-500 hover:to-terracotta-400 active:scale-95 text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-glow-terracotta"
            >
              {isPublishing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Publishing to App...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish Menu to Live App</span>
                </>
              )}
            </button>
          </div>

          {/* Day selection tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
            {previewMenu.map((day) => (
              <button
                key={day.dayNumber}
                onClick={() => setPreviewDay(day.dayNumber)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  previewDay === day.dayNumber
                    ? 'bg-terracotta-500 text-white shadow-glow-terracotta'
                    : 'bg-obsidian-950 border border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                Day {day.dayNumber} ({day.dayOfWeek.slice(0, 3)})
              </button>
            ))}
          </div>

          {/* Slots Preview Grid */}
          {activeDayMenu && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(['breakfast', 'lunch', 'snacks', 'dinner'] as MealSlot[]).map((slot) => {
                const dishIds = activeDayMenu.slots[slot];
                return (
                  <div
                    key={slot}
                    className="bg-obsidian-950 border border-white/10 rounded-2xl p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-saffron-400 font-display">
                        {slot}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">
                        {dishIds.length} items
                      </span>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {dishIds.length === 0 ? (
                        <p className="text-[11px] text-gray-500 italic">No dishes assigned</p>
                      ) : (
                        dishIds.map((dishId) => {
                          const matched = MESS_DISHES.find((d) => d.id === dishId);
                          const cleanName = matched
                            ? matched.name
                            : dishId.replace('dish_custom_', '').replace(/_/g, ' ');
                          return (
                            <div
                              key={dishId}
                              className="p-2 rounded-xl bg-obsidian-900 border border-white/5 text-xs text-gray-200 flex items-center justify-between"
                            >
                              <span className="truncate max-w-[120px] font-medium capitalize">
                                {cleanName}
                              </span>
                              {matched && (
                                <span className="text-[10px] text-terracotta-400 font-mono font-bold">
                                  {matched.calories} kcal
                                </span>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
