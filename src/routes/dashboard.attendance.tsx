import { createFileRoute } from "@tanstack/react-router";
import { UserCheck, UserX, CalendarDays } from "lucide-react";
import { useDashboardStore } from "@/stores/dashboard-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/dashboard/attendance")({
  component: DashboardAttendance,
});

function DashboardAttendance() {
  const attendance = useDashboardStore((s) => s.attendance);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Attendance Tracker</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Monitor your class participation and meet attendance requirements.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {attendance.map((record) => {
          const percentage = Math.round((record.attendedClasses / record.totalClasses) * 100);
          const isAtRisk = percentage < 75; // Assuming 75% is the requirement
          
          return (
            <Card key={record.id} className="flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">{record.course}</CardTitle>
                <CardDescription>
                  Attendance Requirement: 75%
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-6">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-4xl font-display font-bold">
                      {percentage}%
                    </p>
                    <p className={`text-sm font-medium ${isAtRisk ? 'text-destructive' : 'text-success'}`}>
                      {isAtRisk ? 'At Risk' : 'On Track'}
                    </p>
                  </div>
                  <div className="text-right space-y-1 text-sm text-muted-foreground">
                    <p className="flex items-center justify-end gap-1">
                      <UserCheck className="h-4 w-4 text-emerald-500" />
                      {record.attendedClasses} Attended
                    </p>
                    <p className="flex items-center justify-end gap-1">
                      <UserX className="h-4 w-4 text-rose-500" />
                      {record.totalClasses - record.attendedClasses} Missed
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium text-muted-foreground">
                    <span>Progress</span>
                    <span>{record.attendedClasses} / {record.totalClasses} Classes</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
