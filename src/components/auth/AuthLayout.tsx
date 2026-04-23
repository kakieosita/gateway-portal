import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, BookOpen, Users } from "lucide-react";
import upskillLogo from "@/assets/upskill-logo.png";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-hero p-12 text-primary-foreground">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary-glow/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-mint/30 blur-3xl" />

        <Link to="/" className="relative flex items-center gap-2 font-display text-xl font-bold">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
            <GraduationCap className="h-6 w-6" />
          </div>
          Lumen<span className="font-light opacity-80">Ed</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative space-y-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-3 py-1 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5" /> Learning, reimagined
            </div>
            <h2 className="mt-4 font-display text-4xl font-bold leading-tight xl:text-5xl">
              Where curious minds<br />become brilliant ones.
            </h2>
            <p className="mt-4 max-w-md text-base text-primary-foreground/80">
              Join 200,000+ students and instructors building skills that matter on LumenEd.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-md">
            <Feature icon={<BookOpen className="h-4 w-4" />} label="1,200+ courses" />
            <Feature icon={<Users className="h-4 w-4" />} label="Live cohorts" />
          </div>
        </motion.div>

        <p className="relative text-sm text-primary-foreground/70">
          © {new Date().getFullYear()} LumenEd Learning Inc.
        </p>
      </div>

      {/* Right — form panel */}
      <div className="flex flex-col bg-gradient-soft">
        <div className="flex items-center justify-between p-6 lg:hidden">
          <Link to="/" className="flex items-center gap-2 font-display font-bold">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            LumenEd
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-md"
          >
            <div className="mb-8">
              <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                {title}
              </h1>
              <p className="mt-2 text-muted-foreground">{subtitle}</p>
            </div>

            {children}

            {footer && <div className="mt-6 text-center text-sm">{footer}</div>}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm px-3 py-2 text-sm">
      {icon}
      {label}
    </div>
  );
}
