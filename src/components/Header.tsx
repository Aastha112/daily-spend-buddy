import { motion } from 'framer-motion';
import { Calendar, Settings, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onSettingsClick?: () => void;
  onLogout?: () => void;
}

export function Header({ onSettingsClick, onLogout }: HeaderProps) {
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
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors">
            <Settings className="w-5 h-5 text-secondary-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onSettingsClick}>
            <Settings className="w-4 h-4 mr-2" />
            Manage Categories
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.header>
  );
}
