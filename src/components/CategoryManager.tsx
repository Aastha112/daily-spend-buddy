import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Check } from 'lucide-react';
import { Category } from '@/hooks/useExpensesDB';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onAddCategory: (name: string, icon: string, color: string) => void;
  onDeleteCategory: (id: string) => void;
}

const EMOJI_OPTIONS = ['🍔', '🚗', '🛍️', '📄', '🎬', '💊', '🏠', '✈️', '📱', '🎮', '💪', '📚', '☕', '🎁', '💼'];
const COLOR_OPTIONS = [
  'hsl(35, 92%, 60%)',
  'hsl(200, 70%, 50%)',
  'hsl(320, 70%, 55%)',
  'hsl(0, 70%, 55%)',
  'hsl(270, 70%, 55%)',
  'hsl(142, 71%, 45%)',
  'hsl(180, 60%, 45%)',
  'hsl(45, 90%, 50%)',
];

export function CategoryManager({
  isOpen,
  onClose,
  categories,
  onAddCategory,
  onDeleteCategory,
}: CategoryManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJI_OPTIONS[0]);
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAddCategory(newName.trim(), selectedEmoji, selectedColor);
    setNewName('');
    setSelectedEmoji(EMOJI_OPTIONS[0]);
    setSelectedColor(COLOR_OPTIONS[0]);
    setIsAdding(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              'fixed bottom-0 left-0 right-0 z-50',
              'bg-card rounded-t-3xl p-6 pb-8',
              'shadow-2xl border-t border-expense-card-border',
              'max-w-md mx-auto max-h-[80vh] overflow-y-auto'
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-display font-semibold text-foreground">
                Categories
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Existing Categories */}
            <div className="space-y-3 mb-6">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-secondary/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      {category.icon}
                    </div>
                    <span className="font-medium text-foreground">{category.name}</span>
                  </div>
                  <button
                    onClick={() => onDeleteCategory(category.id)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Category */}
            {!isAdding ? (
              <Button
                variant="outline"
                onClick={() => setIsAdding(true)}
                className="w-full py-5 border-dashed border-2"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Category
              </Button>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4 p-4 rounded-xl bg-secondary/30"
              >
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Category name"
                  className="bg-background"
                  autoFocus
                />

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Icon
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setSelectedEmoji(emoji)}
                        className={cn(
                          'w-10 h-10 rounded-lg text-lg flex items-center justify-center transition-all',
                          selectedEmoji === emoji
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted/80'
                        )}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COLOR_OPTIONS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          'w-8 h-8 rounded-full transition-all',
                          selectedColor === color && 'ring-2 ring-offset-2 ring-foreground'
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAdding(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAdd}
                    disabled={!newName.trim()}
                    className="flex-1 gradient-primary"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
