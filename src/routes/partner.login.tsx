import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Mail, Briefcase, Handshake, BarChart3, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { FormField } from "@/components/auth/FormField";
import { PasswordField } from "@/components/auth/PasswordField";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { InlineAlert } from "@/components/auth/Alert";
import { authApi } from "@/lib/auth-api";
import upskillLogo from "@/assets/upskill-logo.png";

export const Route = createFileRoute("/partner/login")({
  head: () => ({
    meta: [
      { title: "Partner Sign In — UST Portal" },
      {
        name: "description",
        content:
          "Sign in to the UST Partner Portal to manage your partnership, enrolments, invoices, and impact reports.",
      },
    ],
  }),
  component: PartnerLoginPage,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

function PartnerLoginPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>({ resolver: zodResolver(schema), mode: "onBlur" });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      await authApi.login({ email: data.email, password: data.password });
      navigate({ to: "/partner" });
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — partner brand panel */}
      <div
        className="relative hidden lg:flex flex-col justify-between overflow-hidden p-12 text-white"
        style={{
          background:
            "linear-gradient(135deg, #0a1628 0%, #0f2447 40%, #1a3a6b 70%, #0e7490 100%)",
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute -top-24 -right-24 h-80 w-80 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #0ea5e9, transparent)" }}
        />
        <div
          className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #10b981, transparent)" }}
        />
        <div
          className="absolute top-1/2 right-0 h-56 w-56 rounded-full opacity-15 blur-3xl"
          style={{ background: "radial-gradient(circle, #6366f1, transparent)" }}
        />

        {/* Logo */}
        <Link to="/" className="relative flex items-center gap-3 font-bold text-xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm p-1.5 border border-white/20">
            <img
              src={upskillLogo}
              alt="Upskill School of Technology"
              className="h-full w-full object-contain"
            />
          </div>
          <span>
            Upskill <span className="font-light opacity-70">Partners</span>
          </span>
        </Link>

        {/* Hero content */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative space-y-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 text-xs font-medium mb-4">
              <Handshake className="h-3.5 w-3.5 text-cyan-300" />
              Corporate & NGO Partners
            </div>
            <h2 className="font-bold text-4xl xl:text-5xl leading-tight">
              Invest in talent.<br />
              <span className="text-cyan-300">Track impact.</span>
            </h2>
            <p className="mt-4 text-white/70 max-w-sm leading-relaxed">
              Manage your partnership with UST — enrol staff in programmes, monitor training progress, access impact reports, and handle invoicing from one dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 max-w-sm">
            {[
              {
                icon: <Briefcase className="h-4 w-4 text-cyan-300" />,
                label: "Enrol staff into UST programmes",
              },
              {
                icon: <BarChart3 className="h-4 w-4 text-emerald-300" />,
                label: "Real-time beneficiary progress reports",
              },
              {
                icon: <ShieldCheck className="h-4 w-4 text-indigo-300" />,
                label: "Secure invoice & payment management",
              },
            ].map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-3 rounded-xl bg-white/8 backdrop-blur-sm border border-white/10 px-4 py-3 text-sm"
              >
                {f.icon}
                <span className="text-white/80">{f.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <p className="relative text-sm text-white/40">
          © {new Date().getFullYear()} Upskill School of Technology, Owerri.
        </p>
      </div>

      {/* Right — form panel */}
      <div className="flex flex-col bg-gradient-soft">
        {/* Mobile header */}
        <div className="flex items-center justify-between p-6 lg:hidden">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white p-1 shadow-sm border border-border">
              <img src={upskillLogo} alt="Upskill" className="h-full w-full object-contain" />
            </div>
            <span>
              Upskill <span className="text-muted-foreground font-normal">Partners</span>
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-md"
          >
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300 mb-4">
                <Handshake className="h-3.5 w-3.5" />
                Partner Portal
              </div>
              <h1 className="font-bold text-3xl sm:text-4xl text-foreground">
                Partner sign in
              </h1>
              <p className="mt-2 text-muted-foreground">
                Access your organisation's partnership dashboard, reports, and invoices.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {serverError && <InlineAlert variant="error" message={serverError} />}

              <FormField
                label="Work email address"
                type="email"
                placeholder="you@organisation.com"
                autoComplete="email"
                icon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                {...register("email")}
              />

              <PasswordField
                autoComplete="current-password"
                placeholder="Enter your password"
                error={errors.password?.message}
                value={watch("password") ?? ""}
                {...register("password")}
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex cursor-pointer items-center gap-2 text-muted-foreground">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
                    {...register("remember")}
                  />
                  Remember me
                </label>
                <Link
                  to="/forgot-password"
                  className="font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <SubmitButton type="submit" loading={isSubmitting}>
                <span className="flex items-center gap-2">
                  {isSubmitting ? "Signing in..." : "Sign in to Partner Portal"}
                  {!isSubmitting && <ArrowRight className="h-4 w-4" />}
                </span>
              </SubmitButton>
            </form>

            {/* Help note */}
            <div className="mt-6 rounded-xl border border-border bg-muted/40 px-4 py-3">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Don't have an account?</span>{" "}
                Contact your UST Relationship Manager or email{" "}
                <a
                  href="mailto:partners@upskillsot.com"
                  className="font-medium text-primary hover:underline"
                >
                  partners@upskillsot.com
                </a>{" "}
                to get set up.
              </p>
            </div>

            {/* Footer links */}
            <div className="mt-4 space-y-2">
              <p className="text-center text-sm text-muted-foreground">
                Not a partner?{" "}
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  Student / Staff login
                </Link>
              </p>
              <p className="text-center text-sm text-muted-foreground">
                UST Alumni?{" "}
                <Link to="/alumni/login" className="font-semibold text-primary hover:underline">
                  Alumni login
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
