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
          ? `We sent a verification link to ${email}. Please check your inbox and click the link to activate your account.`
          : "Please check your inbox for a verification link to activate your account."
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
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-primary text-primary-foreground shadow-glow animate-pulse">
            <MailCheck className="h-10 w-10" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
          <p className="text-sm text-muted-foreground leading-relaxed">
            We've sent an activation link to your email address. 
            Please click the link in the message to verify your account.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            to="/login"
            className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-glow"
          >
            Back to Sign in
          </Link>
          
          <button 
            type="button"
            className="flex w-full items-center justify-center rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-all hover:bg-muted"
            onClick={() => {
              alert("Check your spam folder. If you still don't see it, try signing up again or contact support.");
            }}
          >
            Didn't receive email?
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
