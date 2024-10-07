"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { RecordsTable } from "./records-table";

export default function Home() {
  const isAdmin = useQuery(api.users.getIsAdmin);

  const { isAuthenticated, isLoading } = useConvexAuth();
  return (
    <>
      <div className="container items-center justify-center max-w-6xl">
        {!isAuthenticated && !isLoading && (
          <h1 className="text-2xl font-bold text-center">Sign In</h1>
        )}
        {isAuthenticated && isAdmin && <RecordsTable />}
      </div>
    </>
  );
}
