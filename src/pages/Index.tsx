import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useExpensesDB, Expense } from '@/hooks/useExpensesDB';
import { Header } from '@/components/Header';
import { MonthSummary } from '@/components/MonthSummary';
import { ExpenseCard } from '@/components/ExpenseCard';
import { QuickAddExpense } from '@/components/QuickAddExpense';
import { CategoryManager } from '@/components/CategoryManager';
import { EditExpenseModal } from '@/components/EditExpenseModal';
import { ChatBot } from '@/components/ChatBot';
import { EmptyState } from '@/components/EmptyState';
import { cn } from '@/lib/utils';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const {
    categories,
    expenses,
    loading: dataLoading,
    addCategory,
    deleteCategory,
    addExpense,
    updateExpense,
    deleteExpense,
    getCurrentMonthTotal,
    getCategoryBreakdown,
    getCategoryById,
    getMonthTotal,
  } = useExpensesDB();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Get previous month total for comparison
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const previousMonthTotal = getMonthTotal(prevMonth, prevYear);

  const currentMonthTotal = getCurrentMonthTotal();
  const categoryBreakdown = getCategoryBreakdown(currentMonth, currentYear);

  // Build expense summary for chatbot
  const expenseSummary = `
Current month total: $${currentMonthTotal.toFixed(2)}
Previous month total: $${(previousMonthTotal || 0).toFixed(2)}
Number of expenses this month: ${expenses.filter(exp => {
    const date = new Date(exp.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length}
Categories: ${categories.map(c => `${c.name} (${c.icon})`).join(', ')}
Category breakdown: ${Object.entries(categoryBreakdown).map(([catId, amount]) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? `${cat.name}: $${amount.toFixed(2)}` : '';
  }).filter(Boolean).join(', ')}
Recent expenses: ${expenses.slice(0, 5).map(exp => {
    const cat = categories.find(c => c.id === exp.category_id);
    return `$${exp.amount} on ${cat?.name || 'Unknown'}${exp.note ? ` (${exp.note})` : ''}`;
  }).join('; ')}
  `.trim();

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

  const handleAddExpense = async (amount: number, categoryId: string, note?: string) => {
    await addExpense(amount, categoryId, note);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className={cn(
      'min-h-screen gradient-hero',
      'pb-24' // Space for FAB
    )}>
      <div className="container max-w-md mx-auto px-4">
        <Header 
          onSettingsClick={() => setShowCategoryManager(true)}
          onLogout={handleLogout}
        />

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
                    category={getCategoryById(expense.category_id)}
                    onClick={() => setEditingExpense(expense)}
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
                    category={getCategoryById(expense.category_id)}
                    onClick={() => setEditingExpense(expense)}
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

      {/* Edit Expense Modal */}
      <EditExpenseModal
        expense={editingExpense}
        categories={categories}
        onClose={() => setEditingExpense(null)}
        onUpdate={updateExpense}
        onDelete={deleteExpense}
      />

      {/* ChatBot */}
      <ChatBot expenseSummary={expenseSummary} />
    </div>
  );
};

export default Index;
