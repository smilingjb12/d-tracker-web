import { Progress } from "@/components/ui/progress";

export const VoteCount = ({
  votes,
  percentage,
}: {
  votes: number;
  percentage: number;
}) => {
  return (
    <div className="flex flex-col items-center">
      <Progress value={percentage} />
      <div className="text-center mt-3">{votes} votes</div>
    </div>
  );
};
