import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "./card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "flat";
  trendValue?: string;
  trendLabel?: string;
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  trendValue,
  trendLabel,
  className,
  ...props
}: StatCardProps) {
  return (
    <Card className={cn("p-5", className)} {...props}>
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold text-[var(--color-text)] tracking-tight">
            {value}
          </p>
          {trend && trendValue && (
            <div className="mt-2 flex items-center gap-1.5">
              {trend === "up" && <TrendingUp className="h-3.5 w-3.5 text-[var(--color-success)]" />}
              {trend === "down" && <TrendingDown className="h-3.5 w-3.5 text-[var(--color-danger)]" />}
              {trend === "flat" && <Minus className="h-3.5 w-3.5 text-[var(--color-text-tertiary)]" />}
              <span
                className={cn(
                  "text-xs font-semibold",
                  trend === "up" && "text-[var(--color-success)]",
                  trend === "down" && "text-[var(--color-danger)]",
                  trend === "flat" && "text-[var(--color-text-tertiary)]"
                )}
              >
                {trendValue}
              </span>
              {trendLabel && (
                <span className="text-xs text-[var(--color-text-tertiary)]">{trendLabel}</span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent-light)] text-[var(--color-accent)] flex-shrink-0">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
