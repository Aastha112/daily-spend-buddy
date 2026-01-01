import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mb-6 shadow-button">
        <Wallet className="w-10 h-10 text-primary-foreground" />
      </div>
      <h3 className="text-xl font-display font-semibold text-foreground mb-2">
        No expenses yet
      </h3>
      <p className="text-muted-foreground max-w-[260px]">
        Tap the + button to add your first expense and start tracking your spending.
      </p>
    </motion.div>
  );
}
