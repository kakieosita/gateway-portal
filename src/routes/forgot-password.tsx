import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Mail, ArrowLeft, MailCheck } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { FormField } from "@/components/auth/FormField";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { authApi } from "@/lib/auth-api";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset your password — LumenEd" },
      { name: "description", content: "Recover access to your LumenEd account." },
    ],
  }),
  component: ForgotPasswordPage,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email"),
});
type FormData = z.infer<typeof schema>;

function ForgotPasswordPage() {
  const [sent, setSent] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema), mode: "onBlur" });

  const onSubmit = async (data: FormData) => {
    await authApi.forgotPassword(data.email);
    setSent(data.email);
  };

  return (
    <AuthLayout
      title={sent ? "Check your inbox" : "Forgot password?"}
      subtitle={
        sent
          ? "If an account exists, you'll receive a password reset link shortly."
          : "Enter your email and we'll send you a reset link."
      }
      footer={
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-8 text-center shadow-card">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
              <MailCheck className="h-7 w-7" />
            </div>
            <p className="font-semibold text-foreground">We emailed a link to</p>
            <p className="text-sm text-primary">{sent}</p>
            <p className="text-sm text-muted-foreground">
              The link expires in 30 minutes. Don't see it? Check your spam folder.
            </p>
          </div>
          <button
            onClick={() => setSent(null)}
            className="w-full text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Use a different email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField
            label="Email address"
            type="email"
            placeholder="you@university.edu"
            autoComplete="email"
            icon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register("email")}
          />
          <SubmitButton type="submit" loading={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send reset link"}
          </SubmitButton>
        </form>
      )}
    </AuthLayout>
  );
}
