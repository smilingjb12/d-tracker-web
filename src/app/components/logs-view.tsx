"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LogsTable } from "../logs-table";
import { motion } from "framer-motion";

export default function LogsView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full"
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <LogsTable />
        </CardContent>
      </Card>
    </motion.div>
  );
}
