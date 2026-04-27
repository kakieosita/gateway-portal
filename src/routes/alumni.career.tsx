import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { 
  Briefcase, 
  Users, 
  FileText, 
  Plus, 
  Search, 
  MapPin, 
  Building2, 
  ExternalLink,
  GraduationCap,
  MessageCircle,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAlumniStore } from "@/stores/alumni-store";

export const Route = createFileRoute("/alumni/career")({
  component: AlumniCareer,
});

function AlumniCareer() {
  const { jobs, alumni } = useAlumniStore();
  const mentors = alumni.filter(a => a.isMentor);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Career & Mentorship</h1>
          <p className="text-muted-foreground">Accelerate your professional journey with exclusive opportunities and guidance.</p>
        </div>
        <Button>
           <Plus className="mr-2 h-4 w-4" /> Post Opportunity
        </Button>
      </div>

      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="jobs" className="gap-2">
            <Briefcase className="h-4 w-4" /> Job Board
          </TabsTrigger>
          <TabsTrigger value="mentorship" className="gap-2">
            <Users className="h-4 w-4" /> Mentorship
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="gap-2">
            <FileText className="h-4 w-4" /> Portfolio Builder
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input placeholder="Search jobs by title or company..." className="pl-9" />
            </div>
            <div className="flex gap-2">
               <Button variant="outline" size="sm">Remote Only</Button>
               <Button variant="outline" size="sm">Full-time</Button>
            </div>
          </div>
          <div className="grid gap-4">
            {jobs.map(job => (
              <Card key={job.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                       <CardTitle className="text-lg">{job.title}</CardTitle>
                       <CardDescription className="flex items-center gap-2 mt-1">
                          <Building2 className="h-3.5 w-3.5" /> {job.company} • <MapPin className="h-3.5 w-3.5" /> {job.location}
                       </CardDescription>
                    </div>
                    <Badge variant="secondary" className="uppercase text-[10px] tracking-wider">{job.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                   <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                </CardContent>
                <CardFooter className="pt-2 border-t flex justify-between items-center text-xs text-muted-foreground">
                   <span>Posted {job.date} by {job.postedBy}</span>
                   <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-primary hover:text-primary hover:bg-primary/5">
                      View Details <ExternalLink className="h-3 w-3" />
                   </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mentorship" className="space-y-6">
           <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-primary/5 border-primary/20">
                 <CardHeader>
                    <CardTitle className="text-lg">Become a Mentor</CardTitle>
                    <CardDescription>Share your experience and guide the next generation of UST graduates.</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <ul className="space-y-2 text-sm">
                       <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>Help students navigate their early career paths.</span>
                       </li>
                       <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>Expand your own leadership and coaching skills.</span>
                       </li>
                    </ul>
                 </CardContent>
                 <CardFooter>
                    <Button className="w-full">Register as Mentor</Button>
                 </CardFooter>
              </Card>

              <Card>
                 <CardHeader>
                    <CardTitle className="text-lg">Find a Mentor</CardTitle>
                    <CardDescription>Connect with experienced alumni for career advice and networking.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="flex -space-x-2">
                       {mentors.slice(0, 5).map(m => (
                         <div key={m.id} className="h-10 w-10 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                            {m.name.charAt(0)}
                         </div>
                       ))}
                       <div className="h-10 w-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">
                          +{mentors.length > 5 ? mentors.length - 5 : 0}
                       </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{mentors.length} alumni are currently available for mentorship in various fields.</p>
                 </CardContent>
                 <CardFooter>
                    <Button variant="outline" className="w-full">Browse Mentors</Button>
                 </CardFooter>
              </Card>
           </div>

           <div className="space-y-4">
              <h3 className="font-bold text-lg">Featured Mentors</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                 {mentors.map(mentor => (
                    <Card key={mentor.id} className="flex flex-col">
                       <CardHeader className="pb-2">
                          <div className="flex items-center gap-3">
                             <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {mentor.name.charAt(0)}
                             </div>
                             <div>
                                <CardTitle className="text-sm">{mentor.name}</CardTitle>
                                <CardDescription className="text-xs">{mentor.role} at {mentor.company}</CardDescription>
                             </div>
                          </div>
                       </CardHeader>
                       <CardContent className="flex-1 py-2">
                          <div className="flex flex-wrap gap-1">
                             {mentor.skills.slice(0, 3).map(s => (
                               <Badge key={s} variant="secondary" className="text-[9px] py-0">{s}</Badge>
                             ))}
                          </div>
                       </CardContent>
                       <CardFooter className="pt-2 border-t">
                          <Button variant="ghost" size="sm" className="w-full text-xs gap-2">
                             <MessageCircle className="h-3.5 w-3.5" /> Request Mentorship
                          </Button>
                       </CardFooter>
                    </Card>
                 ))}
              </div>
           </div>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
           <Card className="text-center py-10">
              <CardHeader>
                 <div className="h-16 w-16 rounded-full bg-primary/5 text-primary flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8" />
                 </div>
                 <CardTitle>Professional Portfolio Builder</CardTitle>
                 <CardDescription className="max-w-md mx-auto">
                    Create a stunning professional profile that showcases your projects, certifications, and experience to UST's network of 200+ global partners.
                 </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="grid gap-4 sm:grid-cols-3 max-w-2xl mx-auto">
                    <div className="p-4 rounded-lg border bg-muted/30">
                       <Award className="h-6 w-6 text-primary mx-auto mb-2" />
                       <h4 className="text-sm font-bold">Auto-Sync</h4>
                       <p className="text-[10px] text-muted-foreground mt-1">Import your UST certificates automatically.</p>
                    </div>
                    <div className="p-4 rounded-lg border bg-muted/30">
                       <GraduationCap className="h-6 w-6 text-primary mx-auto mb-2" />
                       <h4 className="text-sm font-bold">Industry Ready</h4>
                       <p className="text-[10px] text-muted-foreground mt-1">Templates designed with hiring partners.</p>
                    </div>
                    <div className="p-4 rounded-lg border bg-muted/30">
                       <Users className="h-6 w-6 text-primary mx-auto mb-2" />
                       <h4 className="text-sm font-bold">Partner Access</h4>
                       <p className="text-[10px] text-muted-foreground mt-1">Direct visibility to top-tier employers.</p>
                    </div>
                 </div>
                 <Button size="lg" className="px-10">Build My Portfolio</Button>
              </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CheckCircle(props: any) {
   return (
      <svg
         {...props}
         xmlns="http://www.w3.org/2000/svg"
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
      >
         <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
         <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
   )
}
