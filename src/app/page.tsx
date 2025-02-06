"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { LogsTable } from "./logs-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Stats } from "./stats";
import dynamic from "next/dynamic";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import LoadingIndicator from "@/components/loading-indicator";
import { GeocodedLocation } from "@/components/geocoded-location";
import { motion } from "framer-motion";

const LocationMap = dynamic(() => import("./location-map"), {
  ssr: false,
  loading: () => <LoadingIndicator />,
});

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

export default function Home() {
  const roles = useQuery(api.users.getRoles);
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 py-0">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isAuthenticated && !isLoading && (
          <div className="flex justify-center items-center min-h-[80vh]">
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
        )}
        {isAuthenticated && roles?.includes("reader") && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
          >
            <motion.div variants={item} className="lg:col-span-2">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="border-b bg-primary/5">
                  <h2 className="text-2xl font-bold text-primary">Summary</h2>
                </CardHeader>
                <CardContent className="p-6">
                  <Stats />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="h-full hover:shadow-lg transition-all duration-300">
                <CardHeader className="border-b bg-primary/5">
                  <h2 className="text-2xl font-bold text-primary">Location</h2>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <GeocodedLocation />
                    <Suspense fallback={<LoadingIndicator />}>
                      <LocationMap />
                    </Suspense>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="h-full hover:shadow-lg transition-all duration-300">
                <CardHeader className="border-b bg-primary/5">
                  <h2 className="text-2xl font-bold text-primary">Logs</h2>
                </CardHeader>
                <CardContent className="p-6">
                  <LogsTable />
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
