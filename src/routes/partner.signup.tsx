import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Mail, Briefcase, Handshake, BarChart3, ArrowRight, ShieldCheck, User } from "lucide-react";
import { motion } from "framer-motion";
import { FormField } from "@/components/auth/FormField";
import { PasswordField } from "@/components/auth/PasswordField";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { InlineAlert } from "@/components/auth/Alert";
import { authApi } from "@/lib/auth-api";
import { useAuthStore } from "@/stores/auth-store";
import { redirect } from "@tanstack/react-router";
import upskillLogo from "@/assets/upskill-logo.png";

export const Route = createFileRoute("/partner/signup")({
  beforeLoad: async () => {
    const { user, initialized } = useAuthStore.getState();
    if (initialized && user) {
      throw redirect({ to: authApi.getDashboardRoute(user.role) });
    }
  },
  head: () => ({
    meta: [
      { title: "Partner Registration — UST Portal" },
      {
        name: "description",
        content:
          "Register your organisation for the UST Partner Portal to manage training, impact, and invoicing.",
      },
    ],
  }),
  component: PartnerSignupPage,
});

const schema = z.object({
  fullName: z.string().trim().min(2, "Please enter your contact person name").max(80),
  email: z.string().trim().email("Enter a valid work email address"),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .regex(/[A-Z]/, "Add an uppercase letter")
    .regex(/[0-9]/, "Add a number"),
  terms: z.boolean().refine((v) => v === true, { message: "You must accept the terms" }),
});
type FormData = z.infer<typeof schema>;

function PartnerSignupPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>({ resolver: zodResolver(schema), mode: "onBlur" });

  const password = watch("password") ?? "";

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      await authApi.signup({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: "partner",
      });
      navigate({ to: "/verify-email", search: { email: data.email } });
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
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #0ea5e9, transparent)" }} />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #10b981, transparent)" }} />
        
        <Link to="/" className="relative flex items-center gap-3 font-bold text-xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm p-1.5 border border-white/20">
            <img src={upskillLogo} alt="Upskill" className="h-full w-full object-contain" />
          </div>
          <span>Upskill <span className="font-light opacity-70">Partners</span></span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative space-y-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 text-xs font-medium mb-4">
              <Handshake className="h-3.5 w-3.5 text-cyan-300" />
              Corporate Partnerships
            </div>
            <h2 className="font-bold text-4xl xl:text-5xl leading-tight">
              Scale your impact<br />
              <span className="text-cyan-300">with technology.</span>
            </h2>
            <p className="mt-4 text-white/70 max-w-sm leading-relaxed">
              Register your organisation to begin enrolling staff in high-impact training, tracking beneficiary progress, and managing partnerships seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 max-w-sm">
            {[
              { icon: <Briefcase className="h-4 w-4 text-cyan-300" />, label: "Centralised staff enrolment" },
              { icon: <BarChart3 className="h-4 w-4 text-emerald-300" />, label: "Custom impact reporting" },
              { icon: <ShieldCheck className="h-4 w-4 text-indigo-300" />, label: "Dedicated relationship support" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-3 rounded-xl bg-white/8 backdrop-blur-sm border border-white/10 px-4 py-3 text-sm">
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
        <div className="flex items-center justify-between p-6 lg:hidden">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white p-1 shadow-sm border border-border">
              <img src={upskillLogo} alt="Upskill" className="h-full w-full object-contain" />
            </div>
            <span>Upskill <span className="text-muted-foreground font-normal">Partners</span></span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-md"
          >
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300 mb-4">
                <Handshake className="h-3.5 w-3.5" />
                Partner Registration
              </div>
              <h1 className="font-bold text-3xl sm:text-4xl text-foreground">
                Get started
              </h1>
              <p className="mt-2 text-muted-foreground">
                Register your organisation to access the partner portal.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {serverError && <InlineAlert variant="error" message={serverError} />}

              <FormField
                label="Contact Person Full Name"
                placeholder="John Doe"
                autoComplete="name"
                icon={<User className="h-4 w-4" />}
                error={errors.fullName?.message}
                {...register("fullName")}
              />

              <FormField
                label="Work Email Address"
                type="email"
                placeholder="partnerships@organisation.com"
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
                <span className="flex items-center gap-2">
                  {isSubmitting ? "Registering..." : "Register Organisation"}
                  {!isSubmitting && <ArrowRight className="h-4 w-4" />}
                </span>
              </SubmitButton>
            </form>

            <div className="mt-6">
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/partner/login" className="font-semibold text-primary hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
