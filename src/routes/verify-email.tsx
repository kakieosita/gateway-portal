import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MailCheck, CheckCircle2, RefreshCw } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { InlineAlert } from "@/components/auth/Alert";
import { authApi } from "@/lib/auth-api";
import { supabase } from "@/integrations/supabase/client";

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

const RESEND_COOLDOWN = 60;

function VerifyEmailPage() {
  const { email } = Route.useSearch();
  const navigate = useNavigate();

  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(true);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // Detect verification: poll user + listen for auth state changes.
  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        const isVerified = await authApi.checkVerified();
        if (!cancelled && isVerified) {
          setVerified(true);
          setTimeout(() => navigate({ to: "/" }), 1500);
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setChecking(false);
      }
    };

    check();
    const interval = setInterval(check, 5000);

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email_confirmed_at) {
        setVerified(true);
        setTimeout(() => navigate({ to: "/" }), 1500);
      }
    });

    return () => {
      cancelled = true;
      clearInterval(interval);
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleResend = async () => {
    if (!email) {
      setError("No email on file. Please sign up again.");
      return;
    }
    setError(null);
    setInfo(null);
    setResending(true);
    try {
      await authApi.resendVerification(email);
      setInfo(`Verification link sent to ${email}.`);
      setCooldown(RESEND_COOLDOWN);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not resend email");
    } finally {
      setResending(false);
    }
  };

  if (verified) {
    return (
      <AuthLayout title="Email verified" subtitle="Redirecting you to your dashboard…">
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-primary text-primary-foreground shadow-glow">
            <CheckCircle2 className="h-10 w-10" />
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={
        email
          ? `We sent a verification link to ${email}. Click the link to activate your account.`
          : "Check your inbox for a verification link to activate your account."
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

        {error && <InlineAlert variant="error" message={error} />}
        {info && <InlineAlert variant="success" message={info} />}

        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {checking
              ? "Waiting for confirmation… this page will update automatically once you verify."
              : "Didn't get the email? Check your spam folder or resend it below."}
          </p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || cooldown > 0 || !email}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${resending ? "animate-spin" : ""}`} />
            {resending
              ? "Sending…"
              : cooldown > 0
              ? `Resend in ${cooldown}s`
              : "Resend verification email"}
          </button>

          <Link
            to="/login"
            className="flex w-full items-center justify-center rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-all hover:bg-muted"
          >
            Back to Sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
