import { createFileRoute } from "@tanstack/react-router";
import { 
  Search, 
  Users, 
  Briefcase, 
  Calendar, 
  ChevronRight, 
  Award,
  CheckCircle2,
  Circle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAlumniStore } from "@/stores/alumni-store";

export const Route = createFileRoute("/alumni/")({
  component: AlumniDashboard,
});

function AlumniDashboard() {
  const { jobs, events } = useAlumniStore();

  return (
    <div className="flex flex-col gap-8">
      {/* Header & Search */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, Alumni!</h1>
          <p className="text-muted-foreground">Stay connected with the UST community and explore new opportunities.</p>
        </div>
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search alumni directory by name, program, or industry..." 
            className="pl-10 h-12 text-lg shadow-sm"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Completion */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Profile Strength</CardTitle>
            <CardDescription>Complete your profile to increase visibility.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-primary">75% Complete</span>
              <span className="text-muted-foreground">Good</span>
            </div>
            <Progress value={75} className="h-2" />
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                <CheckCircle2 className="h-4 w-4" /> Professional Photo
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                <CheckCircle2 className="h-4 w-4" /> Current Role & Company
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Circle className="h-4 w-4" /> Industry Skills (Missing)
              </div>
            </div>
            <Button className="w-full mt-2" variant="outline">Update Profile</Button>
          </CardContent>
        </Card>

        {/* Quick Feed / Actions */}
        <div className="md:col-span-2 grid gap-6">
           <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                 <div>
                    <CardTitle className="text-lg">Upcoming Alumni Events</CardTitle>
                    <CardDescription>Don't miss out on the next networking session.</CardDescription>
                 </div>
                 <Button variant="ghost" size="sm">View All <ChevronRight className="ml-1 h-4 w-4" /></Button>
              </CardHeader>
              <CardContent className="space-y-4">
                 {events.slice(0, 2).map(event => (
                   <div key={event.id} className="flex items-center gap-4 p-3 rounded-lg border group hover:border-primary transition-colors cursor-pointer">
                      <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                         <Calendar className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                         <h4 className="font-bold text-sm truncate">{event.title}</h4>
                         <p className="text-xs text-muted-foreground">{event.date} • {event.location}</p>
                      </div>
                      <Badge variant="outline" className="shrink-0">{event.type}</Badge>
                   </div>
                 ))}
              </CardContent>
           </Card>

           <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                 <div>
                    <CardTitle className="text-lg">Recent Job Opportunities</CardTitle>
                    <CardDescription>Curated listings from UST partners.</CardDescription>
                 </div>
                 <Button variant="ghost" size="sm">Explore Jobs <ChevronRight className="ml-1 h-4 w-4" /></Button>
              </CardHeader>
              <CardContent className="space-y-4">
                 {jobs.slice(0, 2).map(job => (
                   <div key={job.id} className="flex items-center gap-4 p-3 rounded-lg border group hover:border-primary transition-colors cursor-pointer">
                      <div className="h-12 w-12 rounded bg-muted flex items-center justify-center text-muted-foreground shrink-0 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                         <Briefcase className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                         <h4 className="font-bold text-sm truncate">{job.title}</h4>
                         <p className="text-xs text-muted-foreground">{job.company} • {job.location}</p>
                      </div>
                      <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-1 rounded uppercase tracking-wider">{job.type}</span>
                   </div>
                 ))}
              </CardContent>
           </Card>
        </div>
      </div>

      {/* Featured News / Impact */}
      <div className="grid gap-6 md:grid-cols-2">
         <Card className="bg-primary/5 border-primary/10 overflow-hidden relative">
            <div className="absolute right-0 top-0 p-8 opacity-10">
               <Award className="h-32 w-32 rotate-12" />
            </div>
            <CardHeader>
               <CardTitle className="text-xl">Alumni Giving Back</CardTitle>
               <CardDescription>Contribute to the UST Scholarship Fund and empower future tech leaders.</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
               <div className="flex items-center gap-4 mb-4">
                  <div className="flex -space-x-2">
                     {[1,2,3,4].map(i => (
                       <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-muted" />
                     ))}
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">Join 450+ alumni who have donated this year.</p>
               </div>
               <Button className="w-full sm:w-auto">Make a Donation</Button>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
