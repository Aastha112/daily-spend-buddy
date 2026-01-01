import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Expense {
  id: string;
  amount: number;
  category_id: string | null;
  note: string | null;
  date: string;
  created_at: string;
  updated_at: string;
}

const DEFAULT_CATEGORIES = [
  { name: 'Food', icon: '🍔', color: 'hsl(35, 92%, 60%)' },
  { name: 'Transport', icon: '🚗', color: 'hsl(200, 70%, 50%)' },
  { name: 'Shopping', icon: '🛍️', color: 'hsl(320, 70%, 55%)' },
  { name: 'Bills', icon: '📄', color: 'hsl(0, 70%, 55%)' },
  { name: 'Entertainment', icon: '🎬', color: 'hsl(270, 70%, 55%)' },
];

export function useExpensesDB() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return;
    }

    // If no categories exist, create defaults
    if (data.length === 0) {
      const categoriesToInsert = DEFAULT_CATEGORIES.map((cat) => ({
        ...cat,
        user_id: user.id,
      }));

      const { data: newCats, error: insertError } = await supabase
        .from('categories')
        .insert(categoriesToInsert)
        .select();

      if (insertError) {
        console.error('Error creating default categories:', insertError);
        return;
      }

      setCategories(newCats || []);
    } else {
      setCategories(data);
    }
  }, [user]);

  // Fetch expenses
  const fetchExpenses = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching expenses:', error);
      return;
    }

    setExpenses(data || []);
  }, [user]);

  // Initial fetch
  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([fetchCategories(), fetchExpenses()]).finally(() => {
        setLoading(false);
      });
    } else {
      setCategories([]);
      setExpenses([]);
      setLoading(false);
    }
  }, [user, fetchCategories, fetchExpenses]);

  // Add category
  const addCategory = async (name: string, icon: string, color: string) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('categories')
      .insert({ name, icon, color, user_id: user.id })
      .select()
      .single();

    if (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
      return null;
    }

    setCategories((prev) => [...prev, data]);
    toast.success('Category added');
    return data;
  };

  // Delete category
  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
      return;
    }

    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    setExpenses((prev) => prev.filter((exp) => exp.category_id !== id));
    toast.success('Category deleted');
  };

  // Add expense
  const addExpense = async (amount: number, categoryId: string, note?: string) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('expenses')
      .insert({
        amount,
        category_id: categoryId,
        note: note || null,
        user_id: user.id,
        date: new Date().toISOString().split('T')[0],
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense');
      return null;
    }

    setExpenses((prev) => [data, ...prev]);
    toast.success('Expense added');
    return data;
  };

  // Update expense
  const updateExpense = async (
    id: string,
    updates: { amount?: number; category_id?: string; note?: string }
  ) => {
    const { data, error } = await supabase
      .from('expenses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating expense:', error);
      toast.error('Failed to update expense');
      return null;
    }

    setExpenses((prev) =>
      prev.map((exp) => (exp.id === id ? data : exp))
    );
    toast.success('Expense updated');
    return data;
  };

  // Delete expense
  const deleteExpense = async (id: string) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);

    if (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
      return;
    }

    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    toast.success('Expense deleted');
  };

  // Get category by ID
  const getCategoryById = (id: string | null) => {
    return categories.find((cat) => cat.id === id);
  };

  // Get current month total
  const getCurrentMonthTotal = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return expenses
      .filter((exp) => {
        const date = new Date(exp.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((sum, exp) => sum + Number(exp.amount), 0);
  };

  // Get month total
  const getMonthTotal = (month: number, year: number) => {
    return expenses
      .filter((exp) => {
        const date = new Date(exp.date);
        return date.getMonth() === month && date.getFullYear() === year;
      })
      .reduce((sum, exp) => sum + Number(exp.amount), 0);
  };

  // Get category breakdown
  const getCategoryBreakdown = (month: number, year: number) => {
    const monthExpenses = expenses.filter((exp) => {
      const date = new Date(exp.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });

    const breakdown: Record<string, number> = {};
    monthExpenses.forEach((exp) => {
      if (exp.category_id) {
        breakdown[exp.category_id] = (breakdown[exp.category_id] || 0) + Number(exp.amount);
      }
    });

    return breakdown;
  };

  return {
    categories,
    expenses,
    loading,
    addCategory,
    deleteCategory,
    addExpense,
    updateExpense,
    deleteExpense,
    getCategoryById,
    getCurrentMonthTotal,
    getMonthTotal,
    getCategoryBreakdown,
    refetch: () => Promise.all([fetchCategories(), fetchExpenses()]),
  };
}
