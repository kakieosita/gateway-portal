import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { PasswordField } from "@/components/auth/PasswordField";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { InlineAlert } from "@/components/auth/Alert";
import { authApi } from "@/lib/auth-api";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (s: Record<string, unknown>) => ({
    token: typeof s.token === "string" ? s.token : "demo-token",
  }),
  head: () => ({
    meta: [
      { title: "Set a new password — LumenEd" },
      { name: "description", content: "Choose a new password for your LumenEd account." },
    ],
  }),
  component: ResetPasswordPage,
});

const schema = z
  .object({
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Add an uppercase letter")
      .regex(/[0-9]/, "Add a number"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });
type FormData = z.infer<typeof schema>;

function ResetPasswordPage() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema), mode: "onBlur" });

  const onSubmit = async (data: FormData) => {
    await authApi.resetPassword(token, data.password);
    setSuccess(true);
    setTimeout(() => navigate({ to: "/login" }), 1500);
  };

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Choose something memorable but hard to guess."
      footer={
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {success && (
          <InlineAlert variant="success" message="Password updated. Redirecting to sign in..." />
        )}

        <PasswordField
          label="New password"
          autoComplete="new-password"
          showStrength
          value={watch("password") ?? ""}
          error={errors.password?.message}
          {...register("password")}
        />

        <PasswordField
          label="Confirm password"
          autoComplete="new-password"
          value={watch("confirm") ?? ""}
          error={errors.confirm?.message}
          {...register("confirm")}
        />

        <SubmitButton type="submit" loading={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update password"}
        </SubmitButton>
      </form>
    </AuthLayout>
  );
}
