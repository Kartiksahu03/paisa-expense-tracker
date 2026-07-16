// Formats a number as Indian rupees, e.g. 45000 -> "₹45,000"
export const inr = (n) =>
  "₹" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });
