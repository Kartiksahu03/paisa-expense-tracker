import { AnimatePresence } from "framer-motion";
import TransactionItem from "./TransactionItem.jsx";

export default function TransactionList({ items = [], onDelete }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-baseline mb-2.5 px-1">
        <span className="text-[13px] font-medium">Recent transactions</span>
        <span className="text-[11px] text-muted">{items.length} total</span>
      </div>
      {items.length === 0 ? (
        <div className="text-center text-muted text-xs py-8">
          No transactions yet. Add one below using plain language.
        </div>
      ) : (
        <div>
          <AnimatePresence>
            {items.slice(0, 12).map((t) => (
              <TransactionItem key={t._id} txn={t} onDelete={onDelete} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
