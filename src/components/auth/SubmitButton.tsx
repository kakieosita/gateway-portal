import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "outline";
}

export function SubmitButton({
  loading,
  children,
  variant = "primary",
  className,
  disabled,
  ...props
}: SubmitButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        "group relative inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-all",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30",
        variant === "primary" &&
          "bg-gradient-primary text-primary-foreground shadow-soft hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0",
        variant === "outline" &&
          "border border-border bg-card text-foreground hover:bg-muted",
        className,
      )}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
