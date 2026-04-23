import * as React from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { FormField } from "./FormField";

interface PasswordFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  hint?: string;
  showStrength?: boolean;
  value?: string;
}

function scorePassword(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length >= 12) score++;
  return Math.min(score, 4);
}

const STRENGTH = [
  { label: "Too weak", color: "bg-destructive", w: "w-1/4" },
  { label: "Weak", color: "bg-destructive/80", w: "w-2/4" },
  { label: "Fair", color: "bg-amber-500", w: "w-3/4" },
  { label: "Strong", color: "bg-success", w: "w-full" },
];

export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label = "Password", error, hint, showStrength, value = "", ...props }, ref) => {
    const [visible, setVisible] = React.useState(false);
    const score = Math.max(0, scorePassword(String(value)) - 1);
    const strength = STRENGTH[score];

    return (
      <div className="space-y-2">
        <FormField
          ref={ref}
          label={label}
          type={visible ? "text" : "password"}
          icon={<Lock className="h-4 w-4" />}
          error={error}
          hint={hint}
          value={value}
          endAdornment={
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              aria-label={visible ? "Hide password" : "Show password"}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          {...props}
        />
        {showStrength && value && (
          <div className="space-y-1">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className={`h-full transition-all duration-300 ${strength.color} ${strength.w}`} />
            </div>
            <p className="text-xs text-muted-foreground">
              Password strength: <span className="font-medium text-foreground">{strength.label}</span>
            </p>
          </div>
        )}
      </div>
    );
  },
);
PasswordField.displayName = "PasswordField";
