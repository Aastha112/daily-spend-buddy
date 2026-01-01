import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Trash2 } from 'lucide-react';
import { Category, Expense } from '@/hooks/useExpensesDB';
import { CategoryPill } from './CategoryPill';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface EditExpenseModalProps {
  expense: Expense | null;
  categories: Category[];
  onClose: () => void;
  onUpdate: (id: string, updates: { amount?: number; category_id?: string; note?: string }) => void;
  onDelete: (id: string) => void;
}

export function EditExpenseModal({
  expense,
  categories,
  onClose,
  onUpdate,
  onDelete,
}: EditExpenseModalProps) {
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (expense) {
      setAmount(String(expense.amount));
      setSelectedCategory(expense.category_id);
      setNote(expense.note || '');
    }
  }, [expense]);

  const handleSubmit = () => {
    if (!expense || !amount || !selectedCategory) return;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    onUpdate(expense.id, {
      amount: numAmount,
      category_id: selectedCategory,
      note: note || undefined,
    });
    onClose();
  };

  const handleDelete = () => {
    if (!expense) return;
    onDelete(expense.id);
    onClose();
  };

  return (
    <AnimatePresence>
      {expense && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              'fixed bottom-0 left-0 right-0 z-50',
              'bg-card rounded-t-3xl p-6 pb-8',
              'shadow-2xl border-t border-expense-card-border',
              'max-w-md mx-auto'
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-display font-semibold text-foreground">
                Edit Expense
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Amount Input */}
            <div className="mb-6">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-display font-bold text-muted-foreground">
                  ₹
                </span>
                <Input
                  type="number"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className={cn(
                    'text-3xl font-display font-bold pl-10 pr-4 py-6',
                    'bg-secondary/50 border-none',
                    'placeholder:text-muted-foreground/50'
                  )}
                  autoFocus
                />
              </div>
            </div>

            {/* Category Selection */}
            <div className="mb-6">
              <label className="text-sm font-medium text-muted-foreground mb-3 block">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <CategoryPill
                    key={category.id}
                    category={category}
                    selected={selectedCategory === category.id}
                    onClick={() => setSelectedCategory(category.id)}
                  />
                ))}
              </div>
            </div>

            {/* Note Input */}
            <div className="mb-6">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Note (optional)
              </label>
              <Input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What was this for?"
                className="bg-secondary/50 border-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleDelete}
                className="px-4 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!amount || !selectedCategory}
                className={cn(
                  'flex-1 py-6 text-lg font-semibold',
                  'gradient-primary shadow-button',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                <Check className="w-5 h-5 mr-2" />
                Save Changes
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
