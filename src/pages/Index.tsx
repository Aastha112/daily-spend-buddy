import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExpenses } from '@/hooks/useExpenses';
import { Header } from '@/components/Header';
import { MonthSummary } from '@/components/MonthSummary';
import { ExpenseCard } from '@/components/ExpenseCard';
import { QuickAddExpense } from '@/components/QuickAddExpense';
import { CategoryManager } from '@/components/CategoryManager';
import { EmptyState } from '@/components/EmptyState';
import { cn } from '@/lib/utils';

const Index = () => {
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  
  const {
    categories,
    expenses,
    addCategory,
    deleteCategory,
    addExpense,
    deleteExpense,
    getCurrentMonthTotal,
    getCategoryBreakdown,
    getCategoryById,
    getMonthTotal,
  } = useExpenses();

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Get previous month total for comparison
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const previousMonthTotal = getMonthTotal(prevMonth, prevYear);

  const currentMonthTotal = getCurrentMonthTotal();
  const categoryBreakdown = getCategoryBreakdown(currentMonth, currentYear);

  // Get today's expenses
  const today = new Date().toISOString().split('T')[0];
  const todayExpenses = expenses.filter((exp) => exp.date === today);

  // Get this month's expenses (excluding today)
  const thisMonthExpenses = expenses
    .filter((exp) => {
      const date = new Date(exp.date);
      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear &&
        exp.date !== today
      );
    })
    .slice(0, 10);

  const handleAddExpense = (amount: number, categoryId: string, note?: string) => {
    addExpense(amount, categoryId, note);
  };

  return (
    <div className={cn(
      'min-h-screen gradient-hero',
      'pb-24' // Space for FAB
    )}>
      <div className="container max-w-md mx-auto px-4">
        <Header onSettingsClick={() => setShowCategoryManager(true)} />

        {/* Month Summary Card */}
        <section className="mt-4">
          <MonthSummary
            total={currentMonthTotal}
            categoryBreakdown={categoryBreakdown}
            categories={categories}
            previousMonthTotal={previousMonthTotal || undefined}
          />
        </section>

        {/* Today's Expenses */}
        <section className="mt-8">
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">
            Today
          </h2>
          
          {todayExpenses.length === 0 && expenses.length === 0 ? (
            <EmptyState />
          ) : todayExpenses.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-muted-foreground py-8"
            >
              No expenses logged today yet
            </motion.p>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {todayExpenses.map((expense, index) => (
                  <ExpenseCard
                    key={expense.id}
                    expense={expense}
                    category={getCategoryById(expense.categoryId)}
                    onDelete={() => deleteExpense(expense.id)}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* Earlier This Month */}
        {thisMonthExpenses.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-display font-semibold text-foreground mb-4">
              Earlier This Month
            </h2>
            <div className="space-y-3">
              <AnimatePresence>
                {thisMonthExpenses.map((expense, index) => (
                  <ExpenseCard
                    key={expense.id}
                    expense={expense}
                    category={getCategoryById(expense.categoryId)}
                    onDelete={() => deleteExpense(expense.id)}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>
          </section>
        )}
      </div>

      {/* Quick Add FAB */}
      <QuickAddExpense
        categories={categories}
        onAdd={handleAddExpense}
      />

      {/* Category Manager */}
      <CategoryManager
        isOpen={showCategoryManager}
        onClose={() => setShowCategoryManager(false)}
        categories={categories}
        onAddCategory={addCategory}
        onDeleteCategory={deleteCategory}
      />
    </div>
  );
};

export default Index;
