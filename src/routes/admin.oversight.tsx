import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { 
  Users, 
  FileText, 
  Bell, 
  Search, 
  Filter, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Eye,
  Download,
  MoreVertical,
  Edit3
} from "lucide-react";
import { 
  assignmentsCollection, 
  submissionsCollection, 
  announcementsCollection,
  usersCollection
} from "@/lib/db/collections";
import { onSnapshot, query, orderBy, where, Timestamp, updateDoc, doc, addDoc } from "firebase/firestore";
import { Assignment, Submission, Announcement, User } from "@/lib/db/schema";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/auth-api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export const Route = createFileRoute("/admin/oversight")({
  component: AdminOversight,
});

function AdminOversight() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [instructors, setInstructors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubs: (() => void)[] = [];

    // Sync assignments
    unsubs.push(onSnapshot(query(assignmentsCollection, orderBy("dueDate", "desc")), (snap) => {
      setAssignments(snap.docs.map(d => ({ ...d.data(), id: d.id } as Assignment)));
    }));

    // Sync submissions
    unsubs.push(onSnapshot(query(submissionsCollection, orderBy("submittedAt", "desc")), (snap) => {
      setSubmissions(snap.docs.map(d => ({ ...d.data(), id: d.id } as Submission)));
    }));

    // Sync announcements
    unsubs.push(onSnapshot(query(announcementsCollection, orderBy("date", "desc")), (snap) => {
      setAnnouncements(snap.docs.map(d => ({ ...d.data(), id: d.id } as Announcement)));
    }));

    // Sync instructors
    unsubs.push(onSnapshot(query(usersCollection, where("role", "==", "instructor")), (snap) => {
      setInstructors(snap.docs.map(d => ({ ...d.data(), id: d.id } as User)));
    }));

    setLoading(false);
    return () => unsubs.forEach(u => u());
  }, []);

  const handleOverrideGrade = async (submissionId: string, newGrade: string) => {
    try {
      await updateDoc(doc(submissionsCollection, submissionId), {
        grade: newGrade,
        status: "graded",
        updatedAt: Timestamp.now(),
        overriddenByAdmin: true
      } as any);
      toast.success("Grade overridden successfully!");
    } catch (error) {
      toast.error("Failed to override grade.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Oversight</h1>
          <p className="text-muted-foreground">
            Monitor instructor activity, assignment submissions, and platform communications.
          </p>
        </div>
      </div>

      <Tabs defaultValue="assignments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assignments" className="gap-2">
            <FileText className="h-4 w-4" /> Assignments
          </TabsTrigger>
          <TabsTrigger value="submissions" className="gap-2">
            <CheckCircle2 className="h-4 w-4" /> Submissions
          </TabsTrigger>
          <TabsTrigger value="instructors" className="gap-2">
            <Users className="h-4 w-4" /> Instructor Activity
          </TabsTrigger>
          <TabsTrigger value="announcements" className="gap-2">
            <Bell className="h-4 w-4" /> Announcements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle>All Assignments</CardTitle>
              <CardDescription>Track all coursework uploaded by instructors across the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Submissions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map(a => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{a.title}</TableCell>
                      <TableCell>{a.instructorId ? instructors.find(i => i.id === a.instructorId)?.displayName || "Unknown" : "N/A"}</TableCell>
                      <TableCell>{(a.dueDate as any)?.toDate?.().toLocaleDateString() || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {a.submissionsCount || 0} Submissions
                        </Badge>
                      </TableCell>
                      <TableCell>
                         <Badge variant={new Date((a.dueDate as any)?.toDate?.()) < new Date() ? "destructive" : "default"}>
                            {new Date((a.dueDate as any)?.toDate?.()) < new Date() ? "Closed" : "Active"}
                         </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>Global Submissions</CardTitle>
              <CardDescription>Monitor student work and instructor grading history.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Submitted At</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map(s => (
                    <TableRow key={s.id}>
                      <TableCell>{s.studentName}</TableCell>
                      <TableCell>{assignments.find(a => a.id === s.assignmentId)?.title || "N/A"}</TableCell>
                      <TableCell>{(s.submittedAt as any)?.toDate?.().toLocaleString() || "N/A"}</TableCell>
                      <TableCell>
                         {s.grade ? (
                           <Badge variant={s.status === 'graded' ? 'default' : 'secondary'}>
                              {s.grade}
                           </Badge>
                         ) : <span className="text-muted-foreground italic text-xs">Ungraded</span>}
                      </TableCell>
                      <TableCell>
                         <Badge variant={s.status === 'graded' ? 'success' : 'warning' as any}>
                            {s.status}
                         </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                               <Button variant="ghost" size="sm"><MoreVertical className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                               <DropdownMenuLabel>Admin Controls</DropdownMenuLabel>
                               <DropdownMenuItem onClick={() => window.open(s.fileUrl, '_blank')}>
                                  <Download className="mr-2 h-4 w-4" /> Download Work
                               </DropdownMenuItem>
                               <DropdownMenuItem onClick={() => {
                                  const grade = prompt("Enter override grade:", s.grade as string);
                                  if (grade) handleOverrideGrade(s.id, grade);
                               }}>
                                  <Edit3 className="mr-2 h-4 w-4" /> Override Grade
                               </DropdownMenuItem>
                            </DropdownMenuContent>
                         </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instructors">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             {instructors.map(inst => (
                <Card key={inst.id}>
                   <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                         <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {inst.displayName?.split(' ').map(n => n[0]).join('')}
                         </div>
                         <div>
                            <CardTitle className="text-base">{inst.displayName}</CardTitle>
                            <CardDescription className="text-xs">{inst.email}</CardDescription>
                         </div>
                      </div>
                   </CardHeader>
                   <CardContent>
                      <div className="space-y-4">
                         <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-muted p-2 rounded-lg">
                               <p className="text-muted-foreground">Assignments</p>
                               <p className="text-lg font-bold">{assignments.filter(a => a.instructorId === inst.id).length}</p>
                            </div>
                            <div className="bg-muted p-2 rounded-lg">
                               <p className="text-muted-foreground">Announcements</p>
                               <p className="text-lg font-bold">{announcements.filter(a => a.authorId === inst.id).length}</p>
                            </div>
                         </div>
                         <Button variant="outline" size="sm" className="w-full">View Activity Logs</Button>
                      </div>
                   </CardContent>
                </Card>
             ))}
          </div>
        </TabsContent>

        <TabsContent value="announcements">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Platform Announcements</CardTitle>
                <CardDescription>Monitor announcements sent by instructors and post platform-wide updates.</CardDescription>
              </div>
              <Button onClick={async () => {
                const title = prompt("Announcement Title:");
                const content = prompt("Announcement Content:");
                if (title && content) {
                  try {
                    await addDoc(announcementsCollection, {
                      title,
                      content,
                      authorId: "admin",
                      date: Timestamp.now(),
                      isGlobal: true
                    } as any);
                    toast.success("Global announcement posted!");
                  } catch (error) {
                    toast.error("Failed to post announcement.");
                  }
                }
              }}>Post Global Update</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {announcements.map(ann => (
                    <TableRow key={ann.id}>
                      <TableCell className="font-medium">{ann.title}</TableCell>
                      <TableCell>{ann.authorId ? instructors.find(i => i.id === ann.authorId)?.displayName || "Admin" : "Admin"}</TableCell>
                      <TableCell>{(ann.date as any)?.toDate?.().toLocaleDateString() || "N/A"}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View Content</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
