import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, X } from 'lucide-react';
import { Category } from '@/types/expense';
import { CategoryPill } from './CategoryPill';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface QuickAddExpenseProps {
  categories: Category[];
  onAdd: (amount: number, categoryId: string, note?: string) => void;
}

export function QuickAddExpense({ categories, onAdd }: QuickAddExpenseProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    if (!amount || !selectedCategory) return;
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    onAdd(numAmount, selectedCategory, note || undefined);
    
    // Reset form
    setAmount('');
    setSelectedCategory(null);
    setNote('');
    setIsOpen(false);
  };

  const handleClose = () => {
    setAmount('');
    setSelectedCategory(null);
    setNote('');
    setIsOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
            onClick={handleClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
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
                Add Expense
              </h3>
              <button
                onClick={handleClose}
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

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={!amount || !selectedCategory}
              className={cn(
                'w-full py-6 text-lg font-semibold',
                'gradient-primary shadow-button',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              <Check className="w-5 h-5 mr-2" />
              Add Expense
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-30',
          'w-14 h-14 rounded-full',
          'gradient-primary shadow-button',
          'flex items-center justify-center',
          'text-primary-foreground',
          isOpen && 'hidden'
        )}
      >
        <Plus className="w-7 h-7" />
      </motion.button>
    </>
  );
}
