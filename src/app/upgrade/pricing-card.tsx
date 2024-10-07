import { Button } from "@/components/ui/button";
import { useAction } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../convex/_generated/api";

export const PricingCard = ({
  iconGenerator,
  title,
  description,
  credits,
  stripePriceId,
}: {
  title?: string;
  description: string;
  iconGenerator: () => React.ReactNode;
  credits: number;
  stripePriceId: string;
}) => {
  const router = useRouter();
  const pay = useAction(api.stripe.pay);
  const handleUpgradeClick = async () => {
    const url = await pay({ stripePriceId });
    router.push(url!);
  };
  return (
    <div className="flex flex-col p-6 mx-auto lg:min-w-full max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
      {title && <h3 className="mb-4 text-2xl font-semibold">{title}</h3>}
      <div className="flex justify-center mt-4">{iconGenerator()}</div>
      <div className="flex justify-center items-baseline mt-8 mb-2">
        <span className="mr-2 text-3xl font-bold">{credits} Credits</span>
      </div>
      <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400 mb-8">
        {description}
      </p>
      <Button
        onClick={handleUpgradeClick}
        className="bg-primary hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:hover:bg-primary/90 dark:text-foreground dark:focus:ring-primary-900"
      >
        Purchase
      </Button>
    </div>
  );
};
