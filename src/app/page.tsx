"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { LogsTable } from "./logs-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Stats } from "./stats";
import dynamic from "next/dynamic";

const LocationMap = dynamic(() => import("./location-map"), { ssr: false });

export default function Home() {
  const roles = useQuery(api.users.getRoles);

  const { isAuthenticated, isLoading } = useConvexAuth();
  return (
    <>
      <div className="container items-center justify-center max-w-screen-2xl">
        {!isAuthenticated && !isLoading && (
          <h1 className="text-2xl font-bold text-center">Sign In</h1>
        )}
        {isAuthenticated && roles?.includes("reader") && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
            <Card>
              <CardHeader className="font-bold text-2xl">Summary</CardHeader>
              <CardContent>
                <Stats />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="font-bold text-2xl">Location</CardHeader>
              <CardContent>
                <LocationMap />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="font-bold text-2xl">Logs</CardHeader>
              <CardContent>
                <LogsTable />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}
