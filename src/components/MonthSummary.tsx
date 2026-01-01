import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Category } from '@/types/expense';
import { cn } from '@/lib/utils';

interface MonthSummaryProps {
  total: number;
  categoryBreakdown: Record<string, number>;
  categories: Category[];
  previousMonthTotal?: number;
}

export function MonthSummary({ 
  total, 
  categoryBreakdown, 
  categories,
  previousMonthTotal 
}: MonthSummaryProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const sortedCategories = Object.entries(categoryBreakdown)
    .map(([catId, amount]) => ({
      category: categories.find((c) => c.id === catId),
      amount,
    }))
    .filter((item) => item.category)
    .sort((a, b) => b.amount - a.amount);

  const percentChange = previousMonthTotal 
    ? ((total - previousMonthTotal) / previousMonthTotal) * 100 
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-2xl p-6',
        'gradient-primary text-primary-foreground',
        'shadow-card'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-primary-foreground/80 text-sm font-medium mb-1">
            This Month
          </p>
          <p className="text-amount text-4xl">
            {formatAmount(total)}
          </p>
        </div>
        {percentChange !== null && (
          <div className={cn(
            'flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
            percentChange > 0 
              ? 'bg-destructive/20 text-destructive-foreground' 
              : 'bg-success/20 text-success-foreground'
          )}>
            {percentChange > 0 ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {Math.abs(percentChange).toFixed(0)}%
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      {sortedCategories.length > 0 && (
        <div className="space-y-3 mt-6">
          <p className="text-primary-foreground/70 text-xs font-medium uppercase tracking-wide">
            By Category
          </p>
          {sortedCategories.slice(0, 4).map(({ category, amount }, index) => {
            const percentage = (amount / total) * 100;
            return (
              <motion.div
                key={category!.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-1.5"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span>{category!.icon}</span>
                    <span className="font-medium">{category!.name}</span>
                  </span>
                  <span className="font-display font-semibold">
                    {formatAmount(amount)}
                  </span>
                </div>
                <div className="h-1.5 bg-primary-foreground/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                    className="h-full bg-primary-foreground/80 rounded-full"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
