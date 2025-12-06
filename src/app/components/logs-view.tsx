"use client";

import { LogsTable } from "../logs-table";
import { motion } from "framer-motion";
import { History } from "lucide-react";

export default function LogsView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-medium text-foreground">
            History
          </h1>
          <p className="text-muted-foreground mt-1">
            Activity log and records
          </p>
        </div>
        <div className="p-3 rounded-xl bg-primary/10 text-primary">
          <History size={24} strokeWidth={1.5} />
        </div>
      </div>

      {/* Logs card */}
      <div className="bg-card/80 backdrop-blur-sm rounded-3xl border border-border/50 shadow-soft overflow-hidden">
        <div className="p-4 md:p-6">
          <LogsTable />
        </div>
      </div>
    </motion.div>
  );
}
