import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Mail, User, GraduationCap, Briefcase } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { FormField } from "@/components/auth/FormField";
import { PasswordField } from "@/components/auth/PasswordField";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { SocialButton } from "@/components/auth/SocialButton";
import { Divider } from "@/components/auth/Divider";
import { InlineAlert } from "@/components/auth/Alert";
import { authApi } from "@/lib/auth-api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your account — LumenEd" },
      { name: "description", content: "Join LumenEd as a student or instructor." },
    ],
  }),
  component: SignupPage,
});

const schema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(80),
  email: z.string().trim().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .regex(/[A-Z]/, "Add an uppercase letter")
    .regex(/[0-9]/, "Add a number"),
  role: z.enum(["student", "instructor"]),
  terms: z.boolean().refine((v) => v === true, { message: "You must accept the terms" }),
});
type FormData = z.infer<typeof schema>;

function SignupPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: { role: "student" },
  });

  const role = watch("role");
  const password = watch("password") ?? "";

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      await authApi.signup({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: data.role,
      });
      navigate({ to: "/verify-email", search: { email: data.email } });
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start learning or teaching on LumenEd today."
      footer={
        <span className="text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {serverError && <InlineAlert variant="error" message={serverError} />}

        {/* Role selector */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">I'm joining as a</label>
          <div className="grid grid-cols-2 gap-3">
            <RoleCard
              icon={<GraduationCap className="h-5 w-5" />}
              label="Student"
              description="Take courses"
              selected={role === "student"}
              onClick={() => setValue("role", "student", { shouldValidate: true })}
            />
            <RoleCard
              icon={<Briefcase className="h-5 w-5" />}
              label="Instructor"
              description="Teach courses"
              selected={role === "instructor"}
              onClick={() => setValue("role", "instructor", { shouldValidate: true })}
            />
          </div>
        </div>

        <FormField
          label="Full name"
          placeholder="Ada Lovelace"
          autoComplete="name"
          icon={<User className="h-4 w-4" />}
          error={errors.fullName?.message}
          {...register("fullName")}
        />

        <FormField
          label="Email address"
          type="email"
          placeholder="you@university.edu"
          autoComplete="email"
          icon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <PasswordField
          autoComplete="new-password"
          placeholder="Create a strong password"
          showStrength
          value={password}
          error={errors.password?.message}
          {...register("password")}
        />

        <label className="flex cursor-pointer items-start gap-2.5 text-sm text-muted-foreground">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
            {...register("terms")}
          />
          <span>
            I agree to the{" "}
            <a href="#" className="font-medium text-primary hover:underline">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="font-medium text-primary hover:underline">Privacy Policy</a>.
          </span>
        </label>
        {errors.terms && (
          <p className="text-xs font-medium text-destructive">{errors.terms.message}</p>
        )}

        <SubmitButton type="submit" loading={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </SubmitButton>

        <Divider />
        <SocialButton provider="google" />
      </form>
    </AuthLayout>
  );
}

function RoleCard({
  icon,
  label,
  description,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex flex-col items-start gap-1 rounded-xl border-2 p-4 text-left transition-all",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20",
        selected
          ? "border-primary bg-accent/40 shadow-soft"
          : "border-border bg-card hover:border-primary/40 hover:bg-muted",
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
          selected ? "bg-gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground",
        )}
      >
        {icon}
      </div>
      <span className="mt-1 font-semibold text-foreground">{label}</span>
      <span className="text-xs text-muted-foreground">{description}</span>
    </button>
  );
}
