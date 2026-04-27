import { createFileRoute } from "@tanstack/react-router";
import { 
  Plus, 
  BookOpen, 
  Users, 
  Clock, 
  Edit, 
  Trash2, 
  MoreVertical, 
  Calendar,
  Layers,
  MapPin,
  CheckCircle2,
  CalendarDays
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useAdminStore } from "@/stores/admin-store";

export const Route = createFileRoute("/admin/programs")({
  component: AdminPrograms,
});

const mockPrograms = [
  {
    id: "1",
    title: "Full-Stack Web Development",
    description: "Learn to build modern web applications from scratch.",
    instructor: "Sarah Smith",
    students: 124,
    duration: "12 Weeks",
    status: "Published",
  },
  {
    id: "2",
    title: "UI/UX Design Fundamentals",
    description: "Master the principles of user interface and experience design.",
    instructor: "Emily Chen",
    students: 85,
    duration: "8 Weeks",
    status: "Published",
  },
];

function AdminPrograms() {
  const { cohorts } = useAdminStore();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Program Management</h1>
          <p className="text-muted-foreground">
            Build curricula, manage cohorts, and generate timetables.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline">
              <Layers className="mr-2 h-4 w-4" /> Categories
           </Button>
           <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Course
           </Button>
        </div>
      </div>

      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">Course Builder</TabsTrigger>
          <TabsTrigger value="cohorts">Cohorts</TabsTrigger>
          <TabsTrigger value="timetable">Timetable Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {mockPrograms.map((program) => (
              <Card key={program.id} className="flex flex-col">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <Badge variant={program.status === "Published" ? "default" : "secondary"}>
                      {program.status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit Course</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardTitle className="line-clamp-1">{program.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pb-4">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center"><BookOpen className="mr-2 h-4 w-4" /><span>{program.instructor}</span></div>
                    <div className="flex items-center"><Users className="mr-2 h-4 w-4" /><span>{program.students} Enrolled</span></div>
                    <div className="flex items-center"><Clock className="mr-2 h-4 w-4" /><span>{program.duration}</span></div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" className="w-full">Edit Curriculum</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cohorts" className="space-y-4">
           <div className="flex justify-end">
              <Button size="sm">
                 <Plus className="mr-2 h-4 w-4" /> New Cohort
              </Button>
           </div>
           <div className="rounded-md border bg-card overflow-hidden">
              <Table>
                 <TableHeader>
                    <TableRow>
                       <TableHead>Cohort Name</TableHead>
                       <TableHead>Program</TableHead>
                       <TableHead>Duration</TableHead>
                       <TableHead>Students</TableHead>
                       <TableHead>Status</TableHead>
                       <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                 </TableHeader>
                 <TableBody>
                    {cohorts.map(c => (
                      <TableRow key={c.id}>
                         <TableCell className="font-bold">{c.name}</TableCell>
                         <TableCell>Full-Stack Web Dev</TableCell>
                         <TableCell className="text-xs text-muted-foreground">
                            {c.startDate} to {c.endDate}
                         </TableCell>
                         <TableCell>{c.studentCount} students</TableCell>
                         <TableCell>
                            <Badge variant={c.status === 'active' ? 'default' : 'secondary'}>
                               {c.status}
                            </Badge>
                         </TableCell>
                         <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Manage</Button>
                         </TableCell>
                      </TableRow>
                    ))}
                 </TableBody>
              </Table>
           </div>
        </TabsContent>

        <TabsContent value="timetable" className="space-y-4">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
                 <Button variant="secondary" size="sm">Weekly View</Button>
                 <Button variant="ghost" size="sm">Daily List</Button>
              </div>
              <Button size="sm">
                 <CalendarDays className="mr-2 h-4 w-4" /> Add Slot
              </Button>
           </div>
           <Card>
              <CardContent className="p-0">
                 <div className="grid grid-cols-6 border-b divide-x">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="p-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted/20">
                         {day}
                      </div>
                    ))}
                 </div>
                 <div className="grid grid-cols-6 divide-x min-h-[400px]">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="p-2 space-y-2">
                         {day === 'Mon' && (
                           <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-[10px]">
                              <p className="font-bold text-primary">React Basics</p>
                              <p className="text-muted-foreground">09:00 - 11:00</p>
                              <p className="flex items-center gap-1 mt-1 text-muted-foreground">
                                 <MapPin className="h-2 w-2" /> Hall A
                              </p>
                           </div>
                         )}
                         {day === 'Wed' && (
                           <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px]">
                              <p className="font-bold text-emerald-600">AWS Workshop</p>
                              <p className="text-muted-foreground">14:00 - 17:00</p>
                              <p className="flex items-center gap-1 mt-1 text-muted-foreground">
                                 <MapPin className="h-2 w-2" /> Virtual
                              </p>
                           </div>
                         )}
                      </div>
                    ))}
                 </div>
              </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

