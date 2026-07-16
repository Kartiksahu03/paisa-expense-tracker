import { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import MobileBar from "./MobileBar.jsx";
import AddTransactionModal from "../transactions/AddTransactionModal.jsx";
import AssistantPanel from "../ai/AssistantPanel.jsx";

export default function AppLayout({ children }) {
  const [addOpen, setAddOpen] = useState(false);
  return (
    <div className="min-h-screen flex bg-base">
      <Sidebar onAdd={() => setAddOpen(true)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <MobileBar onAdd={() => setAddOpen(true)} />
        <main className="flex-1 px-4 lg:px-8 py-5 lg:py-7 pb-24 lg:pb-7 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
      {addOpen && <AddTransactionModal onClose={() => setAddOpen(false)} />}
      <AssistantPanel />
    </div>
  );
}
