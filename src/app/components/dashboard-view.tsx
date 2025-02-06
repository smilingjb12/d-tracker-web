"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Stats } from "../stats";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardView() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 h-fit"
    >
      <motion.div variants={item}>
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <Stats />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
