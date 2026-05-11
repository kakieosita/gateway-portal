import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { programsCollection, usersCollection, enrollmentsCollection } from "@/lib/db/collections";
import { onSnapshot, query, where } from "firebase/firestore";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/analytics")({
  component: AdminAnalytics,
});

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--destructive))", "#10b981", "#f59e0b"];

function AdminAnalytics() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalInstructors: 0,
    totalPrograms: 0,
    enrollmentData: [] as any[],
    programDistribution: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubs: (() => void)[] = [];

    // Sync Users
    unsubs.push(onSnapshot(usersCollection, (snap) => {
      const users = snap.docs.map(d => d.data());
      setStats(prev => ({
        ...prev,
        totalUsers: snap.size,
        totalStudents: users.filter((u: any) => u.role === "student").length,
        totalInstructors: users.filter((u: any) => u.role === "instructor").length,
      }));
    }));

    // Sync Programs
    unsubs.push(onSnapshot(programsCollection, (snap) => {
      const programs = snap.docs.map(d => d.data() as any);
      const categories = ["Degree", "Certificate", "Short Course"];
      const dist = categories.map(cat => ({
        name: cat,
        value: programs.filter(p => p.category === cat).length
      }));
      
      setStats(prev => ({
        ...prev,
        totalPrograms: snap.size,
        programDistribution: dist
      }));
    }));

    // Mock engagement/revenue for now as we don't have a transactions collection yet
    // but we can show enrollment growth if we had a date field in enrollments
    setLoading(false);
    return () => unsubs.forEach(u => u());
  }, []);

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
          <p className="text-muted-foreground">
            Real-time analysis of platform usage, users, and programs.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={stats.totalUsers} description="All roles" />
        <StatCard title="Students" value={stats.totalStudents} description="Active enrollments" />
        <StatCard title="Instructors" value={stats.totalInstructors} description="Course authors" />
        <StatCard title="Programs" value={stats.totalPrograms} description="Published courses" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Program Distribution</CardTitle>
            <CardDescription>Courses categorized by type.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.programDistribution}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>User Role Mix</CardTitle>
            <CardDescription>Percentage breakdown of platform users.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Students", value: stats.totalStudents },
                      { name: "Instructors", value: stats.totalInstructors },
                      { name: "Admins", value: stats.totalUsers - stats.totalStudents - stats.totalInstructors }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {[0, 1, 2].map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, description }: { title: string, value: number, description: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
