import { motion } from 'framer-motion';
import { Category } from '@/types/expense';
import { cn } from '@/lib/utils';

interface CategoryPillProps {
  category: Category;
  selected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md';
}

export function CategoryPill({ category, selected, onClick, size = 'md' }: CategoryPillProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full transition-all duration-200',
        'border-2',
        size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-4 py-2 text-sm',
        selected
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-expense-card-border bg-category-pill text-category-pill-text hover:border-primary/50'
      )}
      style={selected ? {} : { borderColor: `${category.color}30`, backgroundColor: `${category.color}15` }}
    >
      <span>{category.icon}</span>
      <span className="font-medium">{category.name}</span>
    </motion.button>
  );
}
