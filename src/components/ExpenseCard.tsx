import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { Expense, Category } from '@/hooks/useExpensesDB';
import { cn } from '@/lib/utils';

interface ExpenseCardProps {
  expense: Expense;
  category?: Category;
  onDelete?: () => void;
  onClick?: () => void;
  index?: number;
}

export function ExpenseCard({ expense, category, onDelete, onClick, index = 0 }: ExpenseCardProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className={cn(
        'group flex items-center justify-between p-4 rounded-xl',
        'bg-expense-card border border-expense-card-border',
        'shadow-card hover:shadow-lg transition-all duration-200',
        onClick && 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]'
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
          style={{ backgroundColor: `${category?.color}20` }}
        >
          {category?.icon || '💰'}
        </div>
        <div>
          <p className="font-medium text-foreground">
            {category?.name || 'Uncategorized'}
          </p>
          {expense.note && (
            <p className="text-sm text-muted-foreground truncate max-w-[150px]">
              {expense.note}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatTime(expense.created_at)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-amount text-lg text-expense-amount">
          {formatAmount(Number(expense.amount))}
        </span>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
