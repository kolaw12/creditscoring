import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 whitespace-nowrap rounded-full font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-primary-light)] text-[var(--color-primary)]",
        secondary:
          "bg-gray-100 text-[var(--color-text-secondary)]",
        success:
          "bg-[var(--color-success-light)] text-[var(--color-success)]",
        warning:
          "bg-[var(--color-warning-light)] text-[var(--color-warning)]",
        danger:
          "bg-[var(--color-danger-light)] text-[var(--color-danger)]",
        info:
          "bg-[var(--color-info-light)] text-[var(--color-info)]",
        outline:
          "border border-[var(--color-border)] text-[var(--color-text-secondary)]",
        accent:
          "bg-[var(--color-accent-light)] text-[var(--color-accent)]",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px] leading-4",
        md: "px-2.5 py-0.5 text-xs leading-5",
        lg: "px-3 py-1 text-xs leading-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
