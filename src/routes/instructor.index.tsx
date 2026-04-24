import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, BookOpen, Banknote, TrendingUp, GraduationCap, Star, Activity as ActivityIcon } from "lucide-react";
import { useInstructorStore } from "@/stores/instructor-store";
import { StatCard } from "@/components/instructor/StatCard";

export const Route = createFileRoute("/instructor/")({
  component: InstructorOverview,
});

const naira = (n: number) => `₦${n.toLocaleString()}`;

function InstructorOverview() {
  const courses = useInstructorStore((s) => s.courses);
  const students = useInstructorStore((s) => s.students);
  const activity = useInstructorStore((s) => s.activity);
  const profile = useInstructorStore((s) => s.profile);

  const totalStudents = courses.reduce((sum, c) => sum + c.students, 0);
  const totalRevenue = courses.reduce((sum, c) => sum + c.revenue, 0);
  const published = courses.filter((c) => c.status === "published").length;
  const avgRating = (
    courses.filter((c) => c.rating > 0).reduce((sum, c) => sum + c.rating, 0) /
    Math.max(1, courses.filter((c) => c.rating > 0).length)
  ).toFixed(1);

  const iconMap = {
    enroll: Users,
    submission: BookOpen,
    review: Star,
    completion: GraduationCap,
  } as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Welcome back, {profile.name.split(" ")[1] ?? profile.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here's what's happening across your courses today.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Students" value={totalStudents.toLocaleString()} delta="+12% this month" icon={Users} tone="primary" />
        <StatCard label="Published Courses" value={`${published}`} delta={`${courses.length - published} draft`} icon={BookOpen} tone="mint" />
        <StatCard label="Revenue" value={naira(totalRevenue)} delta="+8.4% MoM" icon={Banknote} tone="success" />
        <StatCard label="Avg Rating" value={`${avgRating} ★`} delta="Across published courses" icon={Star} tone="primary" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Top performing courses</h2>
            <Link to="/instructor/courses" className="text-xs font-semibold text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {courses
              .filter((c) => c.status === "published")
              .sort((a, b) => b.students - a.students)
              .slice(0, 4)
              .map((c) => (
                <div key={c.id} className="flex items-center gap-4 rounded-xl border border-border p-3">
                  <div className="h-12 w-16 shrink-0 rounded-lg" style={{ background: c.thumbnail }} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{c.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.students} students · {c.completionRate}% completion · {c.rating} ★
                    </p>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-gradient-primary"
                        style={{ width: `${c.completionRate}%` }}
                      />
                    </div>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="font-display text-sm font-bold">{naira(c.revenue)}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Revenue</p>
                  </div>
                </div>
              ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="mb-4 flex items-center gap-2">
            <ActivityIcon className="h-4 w-4 text-primary" />
            <h2 className="font-display text-lg font-semibold">Recent activity</h2>
          </div>
          <ul className="space-y-3">
            {activity.map((a) => {
              const Icon = iconMap[a.type];
              return (
                <li key={a.id} className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug">{a.text}</p>
                    <p className="text-xs text-muted-foreground">{a.time}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Recent students</h2>
          <Link to="/instructor/students" className="text-xs font-semibold text-primary hover:underline">
            View all students
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border">
                <th className="py-2 text-left font-medium">Student</th>
                <th className="py-2 text-left font-medium">Course</th>
                <th className="py-2 text-left font-medium">Progress</th>
                <th className="py-2 text-left font-medium">Last active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {students.slice(0, 5).map((s) => {
                const course = courses.find((c) => c.id === s.courseId);
                return (
                  <tr key={s.id}>
                    <td className="py-3">
                      <p className="font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.email}</p>
                    </td>
                    <td className="py-3 text-muted-foreground">{course?.title ?? "—"}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                          <div className="h-full bg-gradient-primary" style={{ width: `${s.progress}%` }} />
                        </div>
                        <span className="text-xs font-semibold">{s.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-xs text-muted-foreground">{s.lastActive}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-5">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-primary" />
          <div>
            <p className="font-display text-sm font-semibold">Want deeper insights?</p>
            <p className="text-xs text-muted-foreground">See engagement, completion, and revenue trends in Analytics.</p>
          </div>
          <Link
            to="/instructor/analytics"
            className="ml-auto rounded-xl bg-gradient-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-soft transition hover:shadow-glow"
          >
            Open analytics
          </Link>
        </div>
      </div>
    </div>
  );
}
