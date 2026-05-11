import { createFileRoute } from "@tanstack/react-router";
import { Users, GraduationCap, BookOpen, DollarSign, Loader2, PieChart as PieChartIcon } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { useAdminStats } from "@/hooks/useAdminStats";
import { useAuthStore } from "@/stores/auth-store";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', '#10b981', '#f59e0b', '#3b82f6', '#ef4444'];

function AdminDashboard() {
  const { kpis, charts, activities, loading } = useAdminStats();
  const user = useAuthStore((s) => s.user);
  const firstName = user?.displayName ? user.displayName.split(" ")[0] : "Admin";

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading dashboard data...</span>
      </div>
    );
  }

  // format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {firstName}!</h1>
        <p className="text-muted-foreground">
          Real-time overview of your platform's performance and metrics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={kpis.totalStudents.toString()}
          icon={<Users className="h-4 w-4" />}
          trend={{ value: kpis.newEnrollments, label: "new enrollments (30d)", isPositive: true }}
        />
        <StatCard
          title="Active Programs"
          value={kpis.activePrograms.toString()}
          icon={<BookOpen className="h-4 w-4" />}
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(kpis.revenueMonthly)}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatCard
          title="Annual Revenue"
          value={formatCurrency(kpis.revenueAnnual)}
          icon={<DollarSign className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        {/* Enrollment Trends */}
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Enrollment Trends</CardTitle>
            <CardDescription>Daily course enrollments</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              {charts.enrollmentTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={charts.enrollmentTrends}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }} />
                    <Area type="monotone" dataKey="enrollments" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorTotal)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm">Waiting for realtime data...</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Program Performance */}
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Program Performance</CardTitle>
            <CardDescription>Top programs by enrollment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {charts.programPerformance.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.programPerformance} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
                    <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={100} />
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                    <Tooltip cursor={{ fill: "transparent" }} contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }} />
                    <Bar dataKey="enrollments" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm">Waiting for realtime data...</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Revenue by Program */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Program</CardTitle>
            <CardDescription>Distribution of revenue</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="h-[250px]">
               {charts.revenueByProgram.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={charts.revenueByProgram}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {charts.revenueByProgram.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => formatCurrency(Number(value || 0))} contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                 </ResponsiveContainer>
               ) : (
                 <div className="flex h-full items-center justify-center text-muted-foreground text-sm">Waiting for realtime data...</div>
               )}
             </div>
          </CardContent>
        </Card>

        {/* Demographics: Age */}
        <Card>
          <CardHeader>
            <CardTitle>Demographics: Age</CardTitle>
            <CardDescription>Student age distribution</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="h-[250px]">
               {charts.demographicsAge.length > 0 && charts.demographicsAge.some(d => d.value > 0) ? (
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={charts.demographicsAge}>
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip cursor={{ fill: "transparent" }} contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }} />
                      <Bar dataKey="value" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
               ) : (
                 <div className="flex h-full items-center justify-center text-muted-foreground text-sm">Waiting for realtime data...</div>
               )}
             </div>
          </CardContent>
        </Card>

        {/* Demographics: Gender */}
        <Card>
          <CardHeader>
            <CardTitle>Demographics: Gender</CardTitle>
            <CardDescription>Student gender distribution</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="h-[250px]">
               {charts.demographicsGender.length > 0 && charts.demographicsGender.some(d => d.value > 0) ? (
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={charts.demographicsGender}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent ? percent * 100 : 0).toFixed(0)}%`}
                      >
                        {charts.demographicsGender.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }} />
                    </PieChart>
                 </ResponsiveContainer>
               ) : (
                 <div className="flex h-full items-center justify-center text-muted-foreground text-sm">Waiting for realtime data...</div>
               )}
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-7">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest platform-wide actions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activities.length > 0 ? activities.map((activity) => {
                const actDate = activity.createdAt && (activity.createdAt as any).toDate 
                  ? (activity.createdAt as any).toDate() 
                  : new Date(activity.createdAt as any);
                return (
                  <div key={activity.id} className="flex items-center">
                    <span className="relative flex h-2 w-2 shrink-0 rounded-full bg-primary mr-4" />
                    <div className="ml-2 flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        <span className="text-muted-foreground capitalize">[{activity.type}] </span>
                        <span className="text-foreground">{activity.description}</span>
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(actDate, { addSuffix: true })}
                    </div>
                  </div>
                );
              }) : (
                <div className="text-sm text-muted-foreground">No recent activities found. Waiting for realtime data...</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
