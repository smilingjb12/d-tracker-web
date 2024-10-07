import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { VoteCount } from "./vote-count";
import { VoteOption } from "./vote-option";

export const ImageView = ({
  imageId,
  title,
}: {
  imageId: string;
  title: string;
}) => {
  const { thumbnailPollId } = useParams<{
    thumbnailPollId: Id<"thumbnailPolls">;
  }>();
  const poll = useQuery(api.thumbnailPolls.getThumbnailPoll, {
    thumbnailPollId,
  });

  const getVotesForImage = (imageId: string): number => {
    return poll?.aImageId === imageId ? poll!.aVotes : poll!.bVotes;
  };

  const getVotePercentage = (imageId: string) => {
    const totalVotes = poll!.aVotes + poll!.bVotes;
    return (
      100.0 * (getVotesForImage(imageId) / (totalVotes === 0 ? 1 : totalVotes))
    );
  };

  return (
    <div>
      <VoteOption imageId={imageId} title={title} />
      <div className="mt-3"></div>
      <VoteCount
        votes={getVotesForImage(imageId)}
        percentage={getVotePercentage(imageId)}
      />
    </div>
  );
};
