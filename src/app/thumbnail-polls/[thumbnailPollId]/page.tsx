"use client";

import LoadingIndicator from "@/components/loading-indicator";
import { Button } from "@/components/ui/button";
import { SignInButton, useSession } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { shuffle } from "lodash";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { ImageView } from "./image-view";
import { Comments } from "./comments";

export default function ThumbnailPage() {
  const { isSignedIn } = useSession();
  const params = useParams<{ thumbnailPollId: Id<"thumbnailPolls"> }>();
  const poll = useQuery(api.thumbnailPolls.getThumbnailPoll, {
    thumbnailPollId: params.thumbnailPollId,
  });

  const images = useMemo(() => {
    return shuffle([poll?.aImageId, poll?.bImageId]);
  }, [poll?.aImageId, poll?.bImageId]);

  if (poll == null) {
    return <LoadingIndicator className="mt-40" />;
  }

  return (
    <div className="container items-center justify-center max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ImageView imageId={images[0]!} title="Image A" />
        <ImageView imageId={images[1]!} title="Image B" />
      </div>
      <Comments poll={poll} />
      {!isSignedIn && (
        <div className="flex items-center justify-center mb-5">
          <Button asChild>
            <SignInButton>Sign in to Vote</SignInButton>
          </Button>
        </div>
      )}
    </div>
  );
}
