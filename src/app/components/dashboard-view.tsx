"use client";

import { motion } from "framer-motion";
import { Stats } from "../stats";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function DashboardView() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Stats card with organic styling */}
      <motion.div variants={item}>
        <div className="bg-card/80 backdrop-blur-sm rounded-3xl border border-border/50 shadow-soft p-6 md:p-8 hover:shadow-soft-lg transition-all duration-500">
          <Stats />
        </div>
      </motion.div>
    </motion.div>
  );
}
