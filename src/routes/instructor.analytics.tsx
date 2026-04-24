import { createFileRoute } from "@tanstack/react-router";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useInstructorStore } from "@/stores/instructor-store";
import { enrollmentTrend, revenueTrend } from "@/lib/instructor-data";
import { TrendingUp, Users, Activity, Target } from "lucide-react";
import { StatCard } from "@/components/instructor/StatCard";

export const Route = createFileRoute("/instructor/analytics")({
  component: AnalyticsPage,
});

const CHART_COLORS = ["oklch(0.32 0.12 258)", "oklch(0.5 0.16 255)", "oklch(0.65 0.17 175)", "oklch(0.7 0.18 50)", "oklch(0.6 0.2 290)"];

function AnalyticsPage() {
  const courses = useInstructorStore((s) => s.courses);
  const students = useInstructorStore((s) => s.students);

  const totalStudents = courses.reduce((s, c) => s + c.students, 0);
  const avgCompletion = Math.round(
    courses.filter((c) => c.students > 0).reduce((s, c) => s + c.completionRate, 0) /
      Math.max(1, courses.filter((c) => c.students > 0).length),
  );
  const activeStudents = students.filter((s) => s.lastActive === "Today" || s.lastActive === "Yesterday").length;
  const engagement = Math.round((activeStudents / Math.max(1, students.length)) * 100);

  const coursePerformance = courses
    .filter((c) => c.students > 0)
    .map((c) => ({ name: c.title.split(" ").slice(0, 2).join(" "), students: c.students, completion: c.completionRate }));

  const categoryData = Object.values(
    courses.reduce<Record<string, { name: string; value: number }>>((acc, c) => {
      if (!acc[c.category]) acc[c.category] = { name: c.category, value: 0 };
      acc[c.category].value += c.students;
      return acc;
    }, {}),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Engagement, completion, and revenue across all your courses.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total enrollments" value={totalStudents.toLocaleString()} delta="+18% this quarter" icon={Users} tone="primary" />
        <StatCard label="Avg completion" value={`${avgCompletion}%`} delta="+4 pts MoM" icon={Target} tone="success" />
        <StatCard label="Active students" value={`${activeStudents}`} delta={`${engagement}% engaged`} icon={Activity} tone="mint" />
        <StatCard label="Revenue (Apr)" value="₦940k" delta="+14.6% MoM" icon={TrendingUp} tone="primary" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-display text-lg font-semibold">Enrollments vs completions</h2>
          <p className="mb-4 text-xs text-muted-foreground">Monthly trend across all courses.</p>
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <AreaChart data={enrollmentTrend}>
                <defs>
                  <linearGradient id="enroll" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.32 0.12 258)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="oklch(0.32 0.12 258)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="complete" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.65 0.15 155)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.65 0.15 155)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.015 250)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="oklch(0.5 0.03 255)" />
                <YAxis tick={{ fontSize: 11 }} stroke="oklch(0.5 0.03 255)" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.015 250)" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="enrollments" stroke="oklch(0.32 0.12 258)" fill="url(#enroll)" strokeWidth={2} />
                <Area type="monotone" dataKey="completions" stroke="oklch(0.65 0.15 155)" fill="url(#complete)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-display text-lg font-semibold">Revenue trend</h2>
          <p className="mb-4 text-xs text-muted-foreground">Net revenue per month (₦).</p>
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <BarChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.015 250)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="oklch(0.5 0.03 255)" />
                <YAxis tick={{ fontSize: 11 }} stroke="oklch(0.5 0.03 255)" tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.015 250)" }}
                  formatter={(v: any) => `₦${Number(v).toLocaleString()}`}
                />
                <Bar dataKey="revenue" fill="oklch(0.5 0.16 255)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-display text-lg font-semibold">Course performance</h2>
          <p className="mb-4 text-xs text-muted-foreground">Students enrolled vs completion rate.</p>
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <BarChart data={coursePerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.015 250)" />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="oklch(0.5 0.03 255)" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="oklch(0.5 0.03 255)" width={100} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.015 250)" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="students" fill="oklch(0.32 0.12 258)" radius={[0, 8, 8, 0]} />
                <Bar dataKey="completion" fill="oklch(0.65 0.17 175)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-display text-lg font-semibold">Enrollments by category</h2>
          <p className="mb-4 text-xs text-muted-foreground">Where your students come from.</p>
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3}>
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.015 250)" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
