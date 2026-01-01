import { useState, useEffect } from 'react';
import { Category, Expense } from '@/types/expense';

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Food', icon: '🍔', color: 'hsl(35, 92%, 60%)' },
  { id: '2', name: 'Transport', icon: '🚗', color: 'hsl(200, 70%, 50%)' },
  { id: '3', name: 'Shopping', icon: '🛍️', color: 'hsl(320, 70%, 55%)' },
  { id: '4', name: 'Bills', icon: '📄', color: 'hsl(0, 70%, 55%)' },
  { id: '5', name: 'Entertainment', icon: '🎬', color: 'hsl(270, 70%, 55%)' },
];

const STORAGE_KEYS = {
  CATEGORIES: 'spendwise_categories',
  EXPENSES: 'spendwise_expenses',
};

export function useExpenses() {
  const [categories, setCategories] = useState<Category[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }, [expenses]);

  const addCategory = (name: string, icon: string, color: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      icon,
      color,
    };
    setCategories((prev) => [...prev, newCategory]);
    return newCategory;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    setExpenses((prev) => prev.filter((exp) => exp.categoryId !== id));
  };

  const addExpense = (amount: number, categoryId: string, note?: string) => {
    const now = new Date();
    const newExpense: Expense = {
      id: Date.now().toString(),
      amount,
      categoryId,
      note,
      date: now.toISOString().split('T')[0],
      createdAt: now.toISOString(),
    };
    setExpenses((prev) => [newExpense, ...prev]);
    return newExpense;
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  const getExpensesByMonth = (month: number, year: number) => {
    return expenses.filter((exp) => {
      const date = new Date(exp.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });
  };

  const getTodayExpenses = () => {
    const today = new Date().toISOString().split('T')[0];
    return expenses.filter((exp) => exp.date === today);
  };

  const getMonthTotal = (month: number, year: number) => {
    return getExpensesByMonth(month, year).reduce((sum, exp) => sum + exp.amount, 0);
  };

  const getCurrentMonthTotal = () => {
    const now = new Date();
    return getMonthTotal(now.getMonth(), now.getFullYear());
  };

  const getCategoryBreakdown = (month: number, year: number) => {
    const monthExpenses = getExpensesByMonth(month, year);
    const breakdown: Record<string, number> = {};
    
    monthExpenses.forEach((exp) => {
      breakdown[exp.categoryId] = (breakdown[exp.categoryId] || 0) + exp.amount;
    });
    
    return breakdown;
  };

  const getCategoryById = (id: string) => {
    return categories.find((cat) => cat.id === id);
  };

  return {
    categories,
    expenses,
    addCategory,
    updateCategory,
    deleteCategory,
    addExpense,
    deleteExpense,
    getExpensesByMonth,
    getTodayExpenses,
    getMonthTotal,
    getCurrentMonthTotal,
    getCategoryBreakdown,
    getCategoryById,
  };
}
