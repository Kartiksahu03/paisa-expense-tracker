// Builds a per-day series (1..daysInMonth) of totals for the current month.
export function dailySeries(items, type) {
  const now = new Date();
  const y = now.getFullYear(), m = now.getMonth();
  const days = new Date(y, m + 1, 0).getDate();
  const arr = Array.from({ length: days }, (_, i) => ({ day: i + 1, amount: 0 }));
  items.forEach((t) => {
    const d = new Date(t.date);
    if (d.getFullYear() === y && d.getMonth() === m && t.type === type) {
      arr[d.getDate() - 1].amount += t.amount;
    }
  });
  return arr;
}
