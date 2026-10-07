'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  DollarSign,
  UtensilsCrossed,
  Filter,
  Save,
  X,
  Sparkles,
} from 'lucide-react';
import { FoodCourtItem, FoodCourtShop, DietPreference } from '@/lib/types';
import { FOOD_COURT_SHOPS, FOOD_COURT_ITEMS } from '@/lib/data/foodCourtItems';
import { getStoredFoodCourtItems, saveStoredFoodCourtItems } from '@/lib/storage';
import { supabase } from '@/lib/supabaseClient';

interface ExtendedFoodCourtItem extends FoodCourtItem {
  isAvailable?: boolean;
}

export const AdminFoodCourtEditor: React.FC = () => {
  const [items, setItems] = useState<ExtendedFoodCourtItem[]>([]);
  const [selectedShopId, setSelectedShopId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExtendedFoodCourtItem | null>(null);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  // Form state for new / edited item
  const [formData, setFormData] = useState({
    shopId: 'shop_rolls',
    name: '',
    price: 80,
    category: 'veg' as DietPreference,
    calories: 300,
    protein: 10,
    carbs: 35,
    fat: 10,
    portionDescription: '1 standard portion',
    isAvailable: true,
  });

  useEffect(() => {
    const loaded = getStoredFoodCourtItems();
    const enriched = loaded.map((it: any) => ({
      ...it,
      isAvailable: it.isAvailable !== undefined ? it.isAvailable : true,
    }));
    setItems(enriched);
  }, []);

  const triggerSaveNotice = (msg: string) => {
    setSaveNotice(msg);
    setTimeout(() => setSaveNotice(null), 3500);
  };

  // Toggle availability in 1-click
  const handleToggleAvailability = (id: string) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        const nextState = !item.isAvailable;
        return { ...item, isAvailable: nextState };
      }
      return item;
    });

    setItems(updated);
    saveStoredFoodCourtItems(updated);
    triggerSaveNotice('Item availability updated.');
  };

  // Delete item
  const handleDeleteItem = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    saveStoredFoodCourtItems(updated);
    triggerSaveNotice(`Deleted "${name}".`);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: ExtendedFoodCourtItem) => {
    setEditingItem(item);
    setFormData({
      shopId: item.shopId,
      name: item.name,
      price: item.price,
      category: item.category,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
      portionDescription: item.portionDescription || '1 standard portion',
      isAvailable: item.isAvailable !== false,
    });
    setIsAddModalOpen(true);
  };

  // Save new or edited item
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedShop = FOOD_COURT_SHOPS.find((s) => s.id === formData.shopId);
    const shopName = selectedShop ? selectedShop.name : 'Campus Food Court';

    if (editingItem) {
      // Update existing
      const updated = items.map((item) => {
        if (item.id === editingItem.id) {
          return {
            ...item,
            shopId: formData.shopId,
            shopName,
            name: formData.name.trim(),
            price: Number(formData.price),
            category: formData.category,
            calories: Number(formData.calories),
            protein: Number(formData.protein),
            carbs: Number(formData.carbs),
            fat: Number(formData.fat),
            portionDescription: formData.portionDescription,
            isAvailable: formData.isAvailable,
          };
        }
        return item;
      });

      setItems(updated);
      saveStoredFoodCourtItems(updated);
      triggerSaveNotice(`Updated "${formData.name}".`);
    } else {
      // Create new
      const newItem: ExtendedFoodCourtItem = {
        id: `fc_custom_${Date.now()}`,
        shopId: formData.shopId,
        shopName,
        name: formData.name.trim(),
        price: Number(formData.price),
        category: formData.category,
        calories: Number(formData.calories),
        protein: Number(formData.protein),
        carbs: Number(formData.carbs),
        fat: Number(formData.fat),
        fiber: 2.0,
        allergens: [],
        portionDescription: formData.portionDescription,
        isAvailable: formData.isAvailable,
      };

      const updated = [newItem, ...items];
      setItems(updated);
      saveStoredFoodCourtItems(updated);
      triggerSaveNotice(`Added new item "${formData.name}".`);
    }

    setIsAddModalOpen(false);
    setEditingItem(null);
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesShop = selectedShopId === 'all' || item.shopId === selectedShopId;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shopName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesShop && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-obsidian-900 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-saffron-950/80 text-saffron-300 border border-saffron-800/60 text-xs font-bold mb-2">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Campus Food Court Management</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-white">
            Food Court Items & Real-Time Availability
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Toggle vendor availability, update student pricing (₹), or edit nutrition macros without re-uploading mess CSVs.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingItem(null);
            setFormData({
              shopId: 'shop_rolls',
              name: '',
              price: 80,
              category: 'veg',
              calories: 300,
              protein: 10,
              carbs: 35,
              fat: 10,
              portionDescription: '1 standard portion',
              isAvailable: true,
            });
            setIsAddModalOpen(true);
          }}
          className="px-5 py-3 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 active:scale-95 text-white text-xs font-bold flex items-center space-x-2 transition-all shadow-glow-terracotta shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Food Court Item</span>
        </button>
      </div>

      {/* Save Notification Toast */}
      {saveNotice && (
        <div className="p-3.5 bg-olive-950/70 border border-olive-500/40 rounded-2xl text-olive-200 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-olive-400 shrink-0" />
          <span>{saveNotice}</span>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Shop Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedShopId('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedShopId === 'all'
                ? 'bg-terracotta-500 text-white shadow-glow-terracotta'
                : 'bg-obsidian-900 border border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            All Shops ({items.length})
          </button>
          {FOOD_COURT_SHOPS.map((shop) => (
            <button
              key={shop.id}
              onClick={() => setSelectedShopId(shop.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center space-x-1.5 ${
                selectedShopId === shop.id
                  ? 'bg-terracotta-500 text-white shadow-glow-terracotta'
                  : 'bg-obsidian-900 border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <span>{shop.icon}</span>
              <span>{shop.name.split('/')[0].trim()}</span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items by name..."
            className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3.5 py-2 pl-9 text-xs text-white placeholder:text-gray-500 focus:border-terracotta-500 focus:outline-none transition-all"
          />
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Food Court Items Table */}
      <div className="bg-obsidian-900 border border-white/10 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-obsidian-950/80 border-b border-white/10 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Item Name</th>
                <th className="py-3.5 px-4">Shop</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price (₹)</th>
                <th className="py-3.5 px-4">Calories</th>
                <th className="py-3.5 px-4">Protein</th>
                <th className="py-3.5 px-4">Availability</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500 italic">
                    No items found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-bold text-white max-w-[180px] truncate">
                      {item.name}
                    </td>
                    <td className="py-3 px-4 text-gray-400 max-w-[140px] truncate">
                      {item.shopName}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          item.category === 'veg'
                            ? 'bg-olive-950 text-olive-300 border-olive-800'
                            : item.category === 'egg'
                            ? 'bg-saffron-950 text-saffron-300 border-saffron-800'
                            : 'bg-red-950 text-red-300 border-red-800'
                        }`}
                      >
                        {item.category.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-terracotta-400 text-sm">
                      ₹{item.price}
                    </td>
                    <td className="py-3 px-4 font-mono">{item.calories} kcal</td>
                    <td className="py-3 px-4 font-mono font-bold text-saffron-300">
                      {item.protein}g
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleAvailability(item.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center space-x-1 transition-all ${
                          item.isAvailable !== false
                            ? 'bg-olive-950/80 border border-olive-700/60 text-olive-300 hover:bg-olive-900'
                            : 'bg-red-950/80 border border-red-800/60 text-red-300 hover:bg-red-900'
                        }`}
                      >
                        {item.isAvailable !== false ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-olive-400" />
                            <span>In Stock</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-red-400" />
                            <span>Sold Out</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        title="Edit Item Details"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all inline-block"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id, item.name)}
                        title="Delete Item"
                        className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-200 transition-all inline-block"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Food Court Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-obsidian-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold font-display text-white">
                {editingItem ? 'Edit Food Court Item' : 'Add Food Court Item'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Campus Vendor</label>
                  <select
                    value={formData.shopId}
                    onChange={(e) => setFormData({ ...formData, shopId: e.target.value })}
                    className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-terracotta-500 focus:outline-none"
                  >
                    {FOOD_COURT_SHOPS.map((shop) => (
                      <option key={shop.id} value={shop.id}>
                        {shop.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Diet Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as DietPreference })
                    }
                    className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-terracotta-500 focus:outline-none"
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="egg">Egg</option>
                    <option value="non-veg">Non-Vegetarian</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Item Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Double Egg Chicken Roll"
                  required
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-terracotta-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                    className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-terracotta-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Calories</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: Number(e.target.value) })}
                    required
                    className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-terracotta-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Protein (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.protein}
                    onChange={(e) => setFormData({ ...formData, protein: Number(e.target.value) })}
                    required
                    className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-terracotta-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.carbs}
                    onChange={(e) => setFormData({ ...formData, carbs: Number(e.target.value) })}
                    required
                    className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-terracotta-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="availabilityToggle"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="rounded bg-obsidian-950 border-white/20 text-terracotta-500 focus:ring-0 w-4 h-4"
                />
                <label htmlFor="availabilityToggle" className="text-xs text-gray-300 font-medium">
                  Currently available for order (In Stock)
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold flex items-center space-x-1.5 shadow-glow-terracotta"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingItem ? 'Save Changes' : 'Create Item'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
