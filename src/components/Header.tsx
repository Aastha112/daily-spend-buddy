import { motion } from 'framer-motion';
import { Calendar, Settings } from 'lucide-react';

interface HeaderProps {
  onSettingsClick?: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between px-1 py-4"
    >
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          SpendWise
        </h1>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
        </div>
      </div>
      
      <button
        onClick={onSettingsClick}
        className="p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
      >
        <Settings className="w-5 h-5 text-secondary-foreground" />
      </button>
    </motion.header>
  );
}
