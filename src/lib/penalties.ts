export const PENALTY_CONFIG = {
  DAILY_RATE: 0.5, // $0.50 per day
  MAX_PENALTY: 25, // Maximum $25 penalty
  GRACE_PERIOD_DAYS: 0, // No grace period
  LOAN_PERIOD_DAYS: 14, // 2 weeks default loan period
};

export function calculateDueDate(borrowedAt: Date = new Date()): Date {
  const dueDate = new Date(borrowedAt);
  dueDate.setDate(dueDate.getDate() + PENALTY_CONFIG.LOAN_PERIOD_DAYS);
  return dueDate;
}

export function calculateDaysLate(dueDate: Date, returnDate: Date = new Date()): number {
  const diffTime = returnDate.getTime() - dueDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays - PENALTY_CONFIG.GRACE_PERIOD_DAYS);
}

export function calculatePenalty(daysLate: number): number {
  if (daysLate <= 0) return 0;
  const penalty = daysLate * PENALTY_CONFIG.DAILY_RATE;
  return Math.min(penalty, PENALTY_CONFIG.MAX_PENALTY);
}

export function getPenaltyStatus(dueDate: Date, returnedAt?: Date | null): {
  isLate: boolean;
  daysLate: number;
  penalty: number;
  status: 'on-time' | 'overdue' | 'returned-late' | 'returned-on-time';
} {
  const now = new Date();
  const checkDate = returnedAt || now;
  const daysLate = calculateDaysLate(dueDate, checkDate);
  const penalty = calculatePenalty(daysLate);
  const isLate = daysLate > 0;

  let status: 'on-time' | 'overdue' | 'returned-late' | 'returned-on-time';
  if (returnedAt) {
    status = isLate ? 'returned-late' : 'returned-on-time';
  } else {
    status = isLate ? 'overdue' : 'on-time';
  }

  return { isLate, daysLate, penalty, status };
}
