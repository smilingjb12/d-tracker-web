"use client";

import LoadingIndicator from "@/components/loading-indicator";
import { Button } from "@/components/ui/button";
import { useSession } from "@clerk/nextjs";
import { usePaginatedQuery } from "convex/react";
import { ThumbsUpIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";

export default function DashboardPage() {
  const { session } = useSession();
  const { results, isLoading } = usePaginatedQuery(
    api.thumbnailPolls.getRecentThumbnailPolls,
    {},
    { initialNumItems: 20 }
  );

  const alreadyVotedFor = (poll: Doc<"thumbnailPolls">) => {
    return session != null && poll.votedUserIds.includes(session!.user.id);
  };

  if (isLoading) {
    return <LoadingIndicator className="mt-40" />;
  }

  return (
    <div className="container items-center justify-center max-w-6xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {results?.map((i) => (
          <Link
            href={`/thumbnail-polls/${i._id}`}
            key={i._id}
            className="aspect-square relative overflow-hidden hover:opacity-90 transition-all"
          >
            <Image
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              src={(i as any).aImageUrl!}
              alt={i.title}
              fill
              className="object-cover rounded-lg transition-transform duration-300 ease-in-out hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-black bg-opacity-60 transition-all opacity-100 group-hover:opacity-100">
              <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col items-start justify-end h-full">
                <div className="flex flex-row justify-between w-full items-center">
                  <div>
                    <h3 className="text-white text-xl font-semibold mb-2 line-clamp-1">
                      <p className="text-lg">{i.title}</p>
                    </h3>
                  </div>
                  <div className="flex items-center">
                    <ThumbsUpIcon className="size-4 text-white mr-1" />
                    <p className="text-white">{i.aVotes + i.bVotes}</p>
                  </div>
                </div>
                <Button
                  variant="default"
                  className="w-3/4 mx-auto mt-3 bg-background text-foreground dark:bg-foreground dark:text-background hover:bg-background"
                >
                  {alreadyVotedFor(i) ? "View Results" : "Vote"}
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
