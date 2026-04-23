export function Divider({ label = "or" }: { label?: string }) {
  return (
    <div className="relative my-6 flex items-center">
      <div className="flex-1 border-t border-border" />
      <span className="px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="flex-1 border-t border-border" />
    </div>
  );
}
