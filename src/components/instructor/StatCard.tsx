import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string;
  delta?: string;
  icon: React.ElementType;
  tone?: "primary" | "mint" | "success" | "warning" | "destructive";
}) {
  const toneMap = {
    primary: "bg-gradient-primary text-primary-foreground",
    mint: "bg-mint text-mint-foreground",
    success: "bg-success text-success-foreground",
    warning: "bg-warning text-warning-foreground",
    destructive: "bg-destructive text-destructive-foreground",
  };
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold">{value}</p>
          {delta && <p className="mt-1 text-xs font-medium text-success">{delta}</p>}
        </div>
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl shadow-soft", toneMap[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
