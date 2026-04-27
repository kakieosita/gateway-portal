import { createFileRoute } from "@tanstack/react-router";
import { Download, GraduationCap } from "lucide-react";
import { useDashboardStore } from "@/stores/dashboard-store";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/grades")({
  component: DashboardGrades,
});

function DashboardGrades() {
  const grades = useDashboardStore((s) => s.grades);

  // Calculate mock GPA
  const calculateGPA = () => {
    if (grades.length === 0) return 0;
    const points: Record<string, number> = { A: 4.0, B: 3.0, C: 2.0, D: 1.0, F: 0.0 };
    let totalPoints = 0;
    let totalCredits = 0;
    
    grades.forEach(g => {
      totalPoints += (points[g.grade] || 0) * g.credits;
      totalCredits += g.credits;
    });
    
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  };

  const gpa = calculateGPA();

  const handleDownload = () => {
    toast.success("Downloading official transcript as PDF...");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Grades & Transcripts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View your academic performance and download official records.
          </p>
        </div>
        <Button onClick={handleDownload} className="w-full sm:w-auto">
          <Download className="mr-2 h-4 w-4" /> Download Transcript
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card md:col-span-1 flex flex-col justify-center items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Cumulative GPA
          </h3>
          <p className="mt-2 font-display text-4xl font-bold text-foreground">
            {gpa}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Out of 4.0</p>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-card md:col-span-2 overflow-hidden flex flex-col">
          <div className="border-b px-6 py-4">
            <h3 className="font-semibold text-lg">Course Grades</h3>
          </div>
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead className="text-center">Credits</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead className="text-right">Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell className="font-medium">{g.course}</TableCell>
                    <TableCell className="text-center">{g.credits}</TableCell>
                    <TableCell className="text-center">{g.score}%</TableCell>
                    <TableCell className="text-right font-bold text-primary">{g.grade}</TableCell>
                  </TableRow>
                ))}
                {grades.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No grades recorded yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
