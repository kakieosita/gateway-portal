import { createFileRoute } from "@tanstack/react-router";
import { Users, GraduationCap, BookOpen, DollarSign } from "lucide-react";
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
} from "recharts";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const userGrowthData = [
  { name: "Jan", total: 1200 },
  { name: "Feb", total: 1900 },
  { name: "Mar", total: 2400 },
  { name: "Apr", total: 3100 },
  { name: "May", total: 3800 },
  { name: "Jun", total: 4200 },
];

const enrollmentData = [
  { name: "Mon", enrollments: 45 },
  { name: "Tue", enrollments: 52 },
  { name: "Wed", enrollments: 38 },
  { name: "Thu", enrollments: 65 },
  { name: "Fri", enrollments: 48 },
  { name: "Sat", enrollments: 25 },
  { name: "Sun", enrollments: 30 },
];

const recentActivities = [
  {
    id: 1,
    user: "John Doe",
    action: "enrolled in",
    target: "Advanced React Patterns",
    time: "2 hours ago",
  },
  {
    id: 2,
    user: "Sarah Smith",
    action: "completed",
    target: "UI/UX Fundamentals",
    time: "4 hours ago",
  },
  {
    id: 3,
    user: "Mike Johnson",
    action: "submitted application for",
    target: "Instructor Role",
    time: "5 hours ago",
  },
  {
    id: 4,
    user: "Emily Chen",
    action: "registered as",
    target: "Student",
    time: "1 day ago",
  },
];

function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your platform's performance and metrics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value="12,345"
          icon={<Users className="h-4 w-4" />}
          trend={{ value: 12, label: "from last month", isPositive: true }}
        />
        <StatCard
          title="Active Students"
          value="8,234"
          icon={<GraduationCap className="h-4 w-4" />}
          trend={{ value: 5.2, label: "from last month", isPositive: true }}
        />
        <StatCard
          title="Programs/Courses"
          value="142"
          icon={<BookOpen className="h-4 w-4" />}
          trend={{ value: 2, label: "from last month", isPositive: true }}
        />
        <StatCard
          title="Total Revenue"
          value="$45,231.89"
          icon={<DollarSign className="h-4 w-4" />}
          trend={{ value: 8, label: "from last month", isPositive: true }}
        />
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Monthly new user registrations</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Enrollment Trends</CardTitle>
            <CardDescription>Daily course enrollments this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enrollmentData}>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                  />
                  <Bar
                    dataKey="enrollments"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest actions performed by users.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <span className="relative flex h-2 w-2 shrink-0 rounded-full bg-primary mr-4" />
                  <div className="ml-2 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      <span className="font-semibold text-foreground">{activity.user}</span>{" "}
                      <span className="text-muted-foreground">{activity.action}</span>{" "}
                      <span className="font-semibold text-foreground">{activity.target}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
