import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { Loader } from "lucide-react";
import * as React from "react";

const actionButtonVariants = cva("inline-flex items-center justify-center", {
  variants: {
    variant: {
      default: "",
      destructive: "",
      outline: "",
      secondary: "",
      ghost: "",
      link: "",
    },
    size: {
      default: "",
      sm: "",
      lg: "",
      icon: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ActionButtonProps extends ButtonProps {
  isLoading?: boolean;
  loaderClassName?: string;
}

const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ className, variant, size, isLoading, children, ...props }, ref) => {
    return (
      <Button
        className={cn(
          actionButtonVariants({ variant, size, className }),
          "relative"
        )}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <Loader className={cn("w-4 h-4 animate-spin absolute")} />
        )}
        <div className={isLoading ? "invisible" : ""}> {children}</div>
      </Button>
    );
  }
);

ActionButton.displayName = "ActionButton";

export { ActionButton, actionButtonVariants };
