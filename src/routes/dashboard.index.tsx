import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle2, Clock, Award, TrendingUp, FileText, Calendar, Activity as ActivityIcon } from "lucide-react";
import { useDashboardStore } from "@/stores/dashboard-store";
import { CourseCard } from "@/components/dashboard/CourseCard";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardOverview,
});

function DashboardOverview() {
  const { courses, assignments, activity, certificates, user } = useDashboardStore();

  const inProgress = courses.filter((c) => c.progress > 0 && c.progress < 100);
  const completed = courses.filter((c) => c.progress === 100);
  const overall = Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length);
  const upcoming = assignments
    .filter((a) => a.status === "pending" || a.status === "overdue")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4);

  const stats = [
    { label: "Enrolled courses", value: courses.length, icon: BookOpen, color: "text-primary bg-accent" },
    { label: "Completed", value: completed.length, icon: CheckCircle2, color: "text-success bg-success/10" },
    { label: "Overall progress", value: `${overall}%`, icon: TrendingUp, color: "text-primary bg-accent" },
    { label: "Certificates", value: certificates.length, icon: Award, color: "text-mint-foreground bg-mint/30" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-3xl bg-gradient-hero p-8 text-primary-foreground shadow-card"
      >
        <p className="text-sm font-medium opacity-80">Welcome back,</p>
        <h1 className="mt-1 font-display text-3xl font-bold">{user.name.split(" ")[0]} 👋</h1>
        <p className="mt-2 max-w-xl text-sm opacity-90">
          You have {upcoming.length} upcoming {upcoming.length === 1 ? "assignment" : "assignments"} and{" "}
          {inProgress.length} courses in progress. Let's keep the streak going.
        </p>
        {inProgress[0] && (
          <Link
            to="/dashboard/courses/$courseId"
            params={{ courseId: inProgress[0].id }}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-soft transition hover:-translate-y-0.5"
          >
            Continue: {inProgress[0].title.slice(0, 32)}…
          </Link>
        )}
      </motion.section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-border bg-card p-5 shadow-card"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {s.label}
              </p>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.color}`}>
                <s.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 font-display text-3xl font-bold">{s.value}</p>
          </motion.div>
        ))}
      </section>

      {/* In progress */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Continue learning</h2>
          <Link to="/dashboard/courses" className="text-sm font-semibold text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {inProgress.slice(0, 3).map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </section>

      {/* Two-column: deadlines + activity */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-bold">Upcoming deadlines</h2>
          </div>
          <ul className="space-y-3">
            {upcoming.map((a) => (
              <li
                key={a.id}
                className="flex items-center gap-3 rounded-xl border border-border p-3 transition hover:bg-accent/40"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{a.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.course}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p
                    className={`text-xs font-semibold ${a.status === "overdue" ? "text-destructive" : "text-foreground"}`}
                  >
                    {new Date(a.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {a.status}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="mb-4 flex items-center gap-2">
            <ActivityIcon className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-bold">Recent activity</h2>
          </div>
          <ul className="space-y-4">
            {activity.map((a) => (
              <li key={a.id} className="flex gap-3">
                <div className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-primary" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">{a.text}</p>
                  <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {a.time}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
