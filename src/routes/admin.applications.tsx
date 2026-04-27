import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, XCircle, Clock, Eye, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/applications")({
  component: AdminApplications,
});

const mockApplications = [
  {
    id: "APP-001",
    applicant: "Jane Doe",
    program: "Full-Stack Web Development",
    date: "2024-03-10",
    status: "Pending",
  },
  {
    id: "APP-002",
    applicant: "Mark Robinson",
    program: "UI/UX Design Fundamentals",
    date: "2024-03-09",
    status: "Approved",
  },
  {
    id: "APP-003",
    applicant: "Lucy Taylor",
    program: "Advanced Data Science",
    date: "2024-03-08",
    status: "Rejected",
  },
  {
    id: "APP-004",
    applicant: "Sam Wilson",
    program: "Cloud Computing with AWS",
    date: "2024-03-07",
    status: "Pending",
  },
];

function AdminApplications() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground">
            Review and manage student applications and enrollments.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search applications..." className="pl-8" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Status: All</Button>
          <Button variant="outline">Program: All</Button>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>App ID</TableHead>
              <TableHead>Applicant</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Date Applied</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockApplications.map((app) => (
              <TableRow key={app.id}>
                <TableCell className="font-medium">{app.id}</TableCell>
                <TableCell>{app.applicant}</TableCell>
                <TableCell>{app.program}</TableCell>
                <TableCell>{app.date}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      app.status === "Approved"
                        ? "default"
                        : app.status === "Rejected"
                        ? "destructive"
                        : "secondary"
                    }
                    className="flex w-fit items-center gap-1"
                  >
                    {app.status === "Approved" && <CheckCircle2 className="h-3 w-3" />}
                    {app.status === "Rejected" && <XCircle className="h-3 w-3" />}
                    {app.status === "Pending" && <Clock className="h-3 w-3" />}
                    {app.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" title="View Application">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    {app.status === "Pending" && (
                      <>
                        <Button variant="ghost" size="icon" className="text-emerald-500" title="Approve">
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" title="Reject">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" disabled>
          Previous
        </Button>
        <Button variant="outline" size="sm">
          Next
        </Button>
      </div>
    </div>
  );
}
