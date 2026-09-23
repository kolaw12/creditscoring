import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";

const alertVariants = cva(
  "flex items-start gap-3 rounded-xl p-4 text-sm",
  {
    variants: {
      variant: {
        success: "bg-[var(--color-success-light)] text-[var(--color-success-dark)]",
        warning: "bg-[var(--color-warning-light)] text-[var(--color-warning-dark)]",
        danger: "bg-[var(--color-danger-light)] text-[var(--color-danger-dark)]",
        info: "bg-[var(--color-info-light)] text-[var(--color-info-dark)]",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

const iconMap = {
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: XCircle,
  info: Info,
};

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
  closable?: boolean;
  onClose?: () => void;
}

export function Alert({
  variant = "info",
  title,
  closable,
  onClose,
  children,
  className,
  ...props
}: AlertProps) {
  const Icon = iconMap[variant || "info"];

  return (
    <div className={cn(alertVariants({ variant }), className)} role="alert" {...props}>
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <p className="opacity-90">{children}</p>
      </div>
      {closable && onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 p-0.5 rounded-md hover:bg-black/5 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
