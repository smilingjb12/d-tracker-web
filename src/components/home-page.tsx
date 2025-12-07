import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/clerk-react";
import { useConvexAuth, useQuery } from "convex/react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, MapPin, ScrollText } from "lucide-react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import DashboardView from "./views/dashboard-view";
import LogsView from "./views/logs-view";
import MapView from "./views/map-view";

const navItems = [
  { id: "dashboard", label: "Home", icon: Home },
  { id: "map", label: "Location", icon: MapPin },
  { id: "logs", label: "History", icon: ScrollText },
];

export function HomePage() {
  const [activePage, setActivePage] = useState("dashboard");
  const roles = useQuery(api.users.getRoles);
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (!isAuthenticated && !isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen organic-bg">
        {/* Decorative background blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-breathe" />
          <div
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-warm/10 rounded-full blur-3xl animate-breathe"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 text-center px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8"
          >
            {/* Welcoming illustration */}
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-warm/20 flex items-center justify-center shadow-soft-lg">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-8 h-8 text-primary-foreground"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-medium text-foreground mb-3">
              Welcome back
            </h1>
            <p className="text-muted-foreground text-lg max-w-sm mx-auto">
              Sign in to stay connected with the ones you care about
            </p>
          </motion.div>

          <SignInButton mode="modal">
            <Button
              size="lg"
              className="rounded-full px-10 py-7 text-lg shadow-soft-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
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
    <div className="min-h-screen flex flex-col organic-bg">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-80 h-80 bg-warm/5 rounded-full blur-3xl" />
      </div>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 pb-28 relative z-10">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {activePage === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <DashboardView />
              </motion.div>
            )}
            {activePage === "map" && (
              <motion.div
                key="map"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <MapView />
              </motion.div>
            )}
            {activePage === "logs" && (
              <motion.div
                key="logs"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <LogsView />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom navigation - pill-shaped organic design */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-2 px-3 py-3 bg-card/90 backdrop-blur-xl rounded-full shadow-soft-lg border border-border/50">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`
                  relative flex items-center gap-2 px-5 py-3 rounded-full transition-all duration-300
                  ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }
                `}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span
                  className={`
                    text-sm font-medium overflow-hidden transition-all duration-300
                    ${isActive ? "max-w-24 opacity-100" : "max-w-0 opacity-0"}
                  `}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
