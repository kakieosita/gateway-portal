import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  LogIn,
  UserPlus,
  KeyRound,
  ShieldCheck,
  MailCheck,
  Sparkles,
} from "lucide-react";
import upskillLogo from "@/assets/upskill-logo.png";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Upskill School of Technology — Owerri" },
      {
        name: "description",
        content: "Upskill School of Technology, Owerri — modern tech education for students and instructors.",
      },
      { property: "og:title", content: "Upskill School of Technology — Owerri" },
      {
        property: "og:description",
        content: "Sign up as a student or instructor and start learning today.",
      },
    ],
  }),
  component: Index,
});

const screens = [
  {
    to: "/login" as const,
    icon: LogIn,
    title: "Sign in",
    description: "Returning learners and instructors.",
  },
  {
    to: "/signup" as const,
    icon: UserPlus,
    title: "Create account",
    description: "Join as a student or instructor.",
  },
  {
    to: "/forgot-password" as const,
    icon: KeyRound,
    title: "Forgot password",
    description: "Email a recovery link.",
  },
  {
    to: "/reset-password" as const,
    icon: ShieldCheck,
    title: "Reset password",
    description: "Set a new password.",
  },
  {
    to: "/verify-email" as const,
    icon: MailCheck,
    title: "Verify email",
    description: "6-digit code confirmation.",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-gradient-soft">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-3 font-display text-lg font-bold">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-card p-1 shadow-soft ring-1 ring-border">
            <img src={upskillLogo} alt="Upskill School of Technology" className="h-full w-full object-contain" />
          </div>
          <span className="leading-tight">
            Upskill <span className="block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">School of Technology</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:block">
            Student
          </Link>
          <Link to="/instructor" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:block">
            Instructor
          </Link>
          <Link to="/admin" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:block">
            Admin
          </Link>
          <Link to="/alumni" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:block">
            Alumni
          </Link>
          <Link to="/partner" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:block">
            Partner
          </Link>
          <Link to="/library" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:block">
            E-Library
          </Link>
          <Link to="/login" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:block">
            Sign in
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition hover:shadow-glow hover:-translate-y-0.5"
          >
            Get started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-12">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Auth UI Kit
          </span>
          <h1 className="mt-5 font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            A modern auth experience<br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              for learners and teachers.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Five fully-built screens with form validation, loading states, password strength,
            social login, and accessible inputs — ready to wire to your backend.
          </p>
        </motion.section>

        <section className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {screens.map((s, i) => (
            <motion.div
              key={s.to}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link
                to={s.to}
                className="group flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary transition-transform group-hover:scale-110">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="mt-6">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {s.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                </div>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Open screen <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </section>
      </main>
    </div>
  );
}
