export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Expense {
  id: string;
  amount: number;
  categoryId: string;
  note?: string;
  date: string;
  createdAt: string;
}

export interface MonthSummary {
  month: string;
  year: number;
  total: number;
  byCategory: Record<string, number>;
}
