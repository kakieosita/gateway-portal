import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";
import { MailCheck } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { InlineAlert } from "@/components/auth/Alert";
import { authApi } from "@/lib/auth-api";

export const Route = createFileRoute("/verify-email")({
  validateSearch: (s: Record<string, unknown>) => ({
    email: typeof s.email === "string" ? s.email : "",
  }),
  head: () => ({
    meta: [
      { title: "Verify your email — LumenEd" },
      { name: "description", content: "Confirm your email to activate your LumenEd account." },
    ],
  }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const { email } = Route.useSearch();
  const navigate = useNavigate();
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const setDigit = (i: number, val: string) => {
    const v = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };

  const onKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const next = Array(6).fill("");
    text.split("").forEach((c, i) => (next[i] = c));
    setDigits(next);
    refs.current[Math.min(text.length, 5)]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authApi.verifyEmail(digits.join(""));
      setSuccess(true);
      setTimeout(() => navigate({ to: "/" }), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={
        email
          ? `We sent a 6-digit code to ${email}.`
          : "Enter the 6-digit code we sent to your email."
      }
      footer={
        <span className="text-muted-foreground">
          Wrong email?{" "}
          <Link to="/signup" className="font-semibold text-primary hover:underline">
            Start over
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
            <MailCheck className="h-7 w-7" />
          </div>
        </div>

        {error && <InlineAlert variant="error" message={error} />}
        {success && <InlineAlert variant="success" message="Email verified! Redirecting..." />}

        <div className="flex justify-between gap-2" onPaste={onPaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKey(i, e)}
              inputMode="numeric"
              maxLength={1}
              aria-label={`Digit ${i + 1}`}
              className="h-14 w-12 rounded-xl border border-border bg-card text-center font-display text-2xl font-bold text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/15"
            />
          ))}
        </div>

        <SubmitButton type="submit" loading={loading} disabled={digits.join("").length !== 6}>
          {loading ? "Verifying..." : "Verify email"}
        </SubmitButton>

        <p className="text-center text-sm text-muted-foreground">
          Didn't get the code?{" "}
          <button type="button" className="font-semibold text-primary hover:underline">
            Resend in 30s
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}
