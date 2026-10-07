'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  FileSpreadsheet,
  UtensilsCrossed,
  Layers,
  ShieldCheck,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { AdminAnalyticsView } from '@/components/admin/AdminAnalyticsView';
import { AdminMenuManager } from '@/components/admin/AdminMenuManager';
import { AdminFoodCourtEditor } from '@/components/admin/AdminFoodCourtEditor';

type AdminTab = 'analytics' | 'menu_csv' | 'food_court';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Tab Switcher */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-4 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2 transition-all shrink-0 ${
            activeTab === 'analytics'
              ? 'bg-terracotta-500 text-white shadow-glow-terracotta'
              : 'bg-obsidian-900 border border-white/10 text-gray-400 hover:text-white hover:bg-obsidian-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Aggregate Analytics (Privacy-Guarded)</span>
        </button>

        <button
          onClick={() => setActiveTab('menu_csv')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2 transition-all shrink-0 ${
            activeTab === 'menu_csv'
              ? 'bg-terracotta-500 text-white shadow-glow-terracotta'
              : 'bg-obsidian-900 border border-white/10 text-gray-400 hover:text-white hover:bg-obsidian-800'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Monthly Mess Menu CSV Importer</span>
        </button>

        <button
          onClick={() => setActiveTab('food_court')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2 transition-all shrink-0 ${
            activeTab === 'food_court'
              ? 'bg-terracotta-500 text-white shadow-glow-terracotta'
              : 'bg-obsidian-900 border border-white/10 text-gray-400 hover:text-white hover:bg-obsidian-800'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Food Court Live Editor</span>
        </button>
      </div>

      {/* Tab 1: Aggregate Analytics */}
      {activeTab === 'analytics' && <AdminAnalyticsView />}

      {/* Tab 2: Monthly Menu CSV Importer */}
      {activeTab === 'menu_csv' && <AdminMenuManager />}

      {/* Tab 3: Food Court Manager */}
      {activeTab === 'food_court' && <AdminFoodCourtEditor />}
    </div>
  );
}
