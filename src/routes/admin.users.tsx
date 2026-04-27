import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, MoreHorizontal, Download, Clock, Filter } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Student",
    status: "Active",
    dateJoined: "2023-10-15",
  },
  {
    id: "2",
    name: "Sarah Smith",
    email: "sarah@example.com",
    role: "Instructor",
    status: "Active",
    dateJoined: "2023-09-20",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "Admin",
    status: "Active",
    dateJoined: "2023-01-10",
  },
  {
    id: "4",
    name: "Emily Chen",
    email: "emily@example.com",
    role: "Student",
    status: "Inactive",
    dateJoined: "2024-01-05",
  },
  {
    id: "5",
    name: "Alex Brown",
    email: "alex@example.com",
    role: "Student",
    status: "Pending",
    dateJoined: "2024-02-18",
  },
];

function AdminUsers() {
  const [isImporting, setIsImporting] = useState(false);

  const simulateImport = () => {
    setIsImporting(true);
    setTimeout(() => {
      setIsImporting(false);
      // In a real app, this would parse the file and update the state
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
          <p className="text-muted-foreground">
            Manage your platform's users, roles, and permissions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => document.getElementById('csv-import')?.click()}>
            <Download className="mr-2 h-4 w-4 rotate-180" /> Bulk Import
          </Button>
          <input 
            type="file" 
            id="csv-import" 
            className="hidden" 
            accept=".csv,.xlsx" 
            onChange={simulateImport}
          />
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </div>
      </div>

      {isImporting && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 flex items-center justify-between animate-pulse">
           <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-primary animate-spin" />
              <p className="text-sm font-medium">Processing bulk import... (Simulated)</p>
           </div>
           <p className="text-xs text-muted-foreground">Checking for duplicates and validating fields</p>
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search users by name or email..." className="pl-8" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockUsers.map((user) => (
              <TableRow key={user.id} className="group">
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "Admin" ? "default" : "secondary"}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.status === "Active"
                        ? "default"
                        : user.status === "Inactive" || user.status === "Suspended"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.dateJoined}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit Details</DropdownMenuItem>
                      <DropdownMenuItem>Change Role</DropdownMenuItem>
                      <DropdownMenuItem className="text-warning">
                         {user.status === 'Suspended' ? 'Unsuspend' : 'Suspend User'}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete Account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
