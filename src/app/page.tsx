"use client";

import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { useConvexAuth, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { LayoutDashboard, List, Map } from "lucide-react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import DashboardView from "./components/dashboard-view";
import LogsView from "./components/logs-view";
import MapView from "./components/map-view";

export default function Home() {
  const [activePage, setActivePage] = useState("dashboard");
  const roles = useQuery(api.users.getRoles);
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (!isAuthenticated && !isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SignInButton mode="modal">
            <Button
              size="lg"
              className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Sign In to Continue
            </Button>
          </SignInButton>
        </motion.div>
      </div>
    );
  }

  if (!roles?.includes("reader")) {
    return null;
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-gradient-to-br from-background to-secondary/20">
      <main className="flex-1 overflow-y-auto px-4 py-2">
        {activePage === "dashboard" && <DashboardView />}
        {activePage === "map" && <MapView />}
        {activePage === "logs" && <LogsView />}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border">
        <div className="flex justify-between">
          <button
            onClick={() => setActivePage("dashboard")}
            className={`flex-1 py-4 flex justify-center ${
              activePage === "dashboard"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <LayoutDashboard size={24} />
          </button>
          <button
            onClick={() => setActivePage("map")}
            className={`flex-1 py-4 flex justify-center ${
              activePage === "map" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Map size={24} />
          </button>
          <button
            onClick={() => setActivePage("logs")}
            className={`flex-1 py-4 flex justify-center ${
              activePage === "logs" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <List size={24} />
          </button>
        </div>
      </nav>
    </div>
  );
}
