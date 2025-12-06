"use client";

import { LogsTable } from "../logs-table";
import { motion } from "framer-motion";

export default function LogsView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      {/* Logs card */}
      <div className="bg-card/80 backdrop-blur-sm rounded-3xl border border-border/50 shadow-soft overflow-hidden">
        <div className="p-4 md:p-6">
          <LogsTable />
        </div>
      </div>
    </motion.div>
  );
}
