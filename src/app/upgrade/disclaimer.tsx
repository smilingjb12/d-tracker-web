import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import Link from "next/link";

export const Disclaimer = () => {
  return (
    <Alert className="mt-10 dark:bg-gray-800/10">
      <AlertDescription className="flex items-center">
        <InfoIcon className="size-5 mr-3" />
        <span>Please review our</span>
        <Link
          className="text-primary hover:text-primary/90"
          href="/legal/refund-policy"
        >
          &nbsp; Refund Policy &nbsp;
        </Link>
        before purchasing credits.
      </AlertDescription>
    </Alert>
  );
};
