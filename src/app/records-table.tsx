import LoadingIndicator from "@/components/loading-indicator";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePaginatedQuery } from "convex/react";
import Link from "next/link";
import { api } from "../../convex/_generated/api";

export function RecordsTable() {
  const PAGE_SIZE = 30;
  const { results, isLoading, loadMore, status } = usePaginatedQuery(
    api.records.getRecordsPage,
    {},
    { initialNumItems: PAGE_SIZE }
  );

  function formatToDateTime(unixTimestamp: number): string {
    const date = new Date(unixTimestamp);

    return date.toLocaleString("en-UK", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }

  const PowerBar = ({ power }: { power: number }) => {
    const percentage = Math.min(Math.max(power, 0), 100);
    const color = `hsla(${percentage * 1.2}, 100%, 50%, 0.9)`;

    return (
      <>
        <span style={{ color: color }}>{power}</span>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 hidden sm:flex">
          <div
            className="h-2.5 rounded-full"
            style={{
              width: `${percentage}%`,
              backgroundColor: color,
            }}
          ></div>
        </div>
      </>
    );
  };

  return (
    <div className="max-w-screen-md mx-auto">
      {isLoading && <LoadingIndicator />}
      {!isLoading && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-fit">Coordinates</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Power</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results?.map((r) => (
                <TableRow key={r._id}>
                  <TableCell className="p-0">
                    <Button
                      variant="ghost"
                      asChild
                      className="p-0 hover:text-primary px-4 justify-start text-primary hover:bg-transparent hover:underline"
                    >
                      <Link
                        className="p-0 w-full"
                        target="_blank"
                        href={`https://www.google.com/maps?q=${r.latitude},${r.longitude}`}
                      >
                        {r.latitude.toFixed(2)} {r.longitude.toFixed(2)}
                      </Link>
                    </Button>
                  </TableCell>
                  <TableCell>{formatToDateTime(r._creationTime)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <PowerBar power={r.power} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-center">
            {status === "CanLoadMore" && (
              <Button
                variant="secondary"
                className="mt-3"
                onClick={() => loadMore(PAGE_SIZE)}
              >
                Load More
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
