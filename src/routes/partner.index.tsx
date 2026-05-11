import { createFileRoute } from "@tanstack/react-router";
import { 
  Building2, 
  Users, 
  Target, 
  ArrowUpRight, 
  Calendar, 
  FileText, 
  Plus, 
  TrendingUp,
  Briefcase,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { usePartnerStore } from "@/stores/partner-store";
import { useAuthStore } from "@/stores/auth-store";

export const Route = createFileRoute("/partner/")({
  component: PartnerDashboard,
});

function PartnerDashboard() {
  const { engagements, profile: partnerProfile } = usePartnerStore();
  const user = useAuthStore((s) => s.user);
  const firstName = user?.displayName ? user.displayName.split(" ")[0] : "Partner";
  
  const totalStaff = engagements.reduce((sum, e) => sum + e.enrolledStaff, 0);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {firstName}!</h1>
        <div className="flex items-center gap-3">
           <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary">
              <Building2 className="h-6 w-6" />
           </div>
           <div>
              <p className="text-sm font-bold leading-none">{partnerProfile.orgName}</p>
              <p className="text-xs text-muted-foreground mt-1">{partnerProfile.type} Partner • {partnerProfile.location}</p>
           </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
            <Briefcase className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engagements.filter(e => e.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">Across 2 streams</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff Enrolled</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStaff}</div>
            <p className="text-xs text-muted-foreground">+3 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Completion</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82%</div>
            <p className="text-xs text-muted-foreground">High impact rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MOU Status</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">Expires Jan 2025</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Active Engagements</CardTitle>
            <CardDescription>Real-time progress of your staff in UST programs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {engagements.filter(e => e.status === 'active').map(eng => (
               <div key={eng.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                     <span className="font-bold">{eng.programName}</span>
                     <span className="text-muted-foreground">{eng.enrolledStaff} Staff</span>
                  </div>
                  <div className="flex items-center gap-4">
                     <Progress value={eng.completionRate} className="flex-1" />
                     <span className="text-xs font-bold text-primary w-8 text-right">{eng.completionRate}%</span>
                  </div>
               </div>
            ))}
          </CardContent>
          <CardFooter className="border-t pt-4">
             <Button variant="ghost" className="w-full text-primary hover:text-primary hover:bg-primary/5 gap-2">
                View Full Progress Report <ArrowUpRight className="h-4 w-4" />
             </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Action Center</CardTitle>
            <CardDescription>Quick links to common partner tasks.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
             <Button className="w-full justify-start gap-3 h-12" variant="outline">
                <Plus className="h-4 w-4" /> Request Custom Training
             </Button>
             <Button className="w-full justify-start gap-3 h-12" variant="outline">
                <Users className="h-4 w-4" /> Enroll New Staff
             </Button>
             <Button className="w-full justify-start gap-3 h-12" variant="outline">
                <FileText className="h-4 w-4" /> Download Impact Report
             </Button>
             <Button className="w-full justify-start gap-3 h-12" variant="outline">
                <Calendar className="h-4 w-4" /> Schedule Quarterly Review
             </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-primary/5 border-primary/10 overflow-hidden relative">
         <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="flex-1 space-y-2">
               <h3 className="text-xl font-bold tracking-tight">Assigned Relationship Manager</h3>
               <p className="text-sm text-muted-foreground">Direct access to your dedicated UST account support team.</p>
               <div className="flex items-center gap-3 mt-4 pt-2">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">SM</div>
                  <div>
                     <p className="text-sm font-bold">Sarah Miller</p>
                     <p className="text-xs text-muted-foreground">Senior Partnership Executive</p>
                  </div>
               </div>
            </div>
            <div className="flex gap-2 shrink-0">
               <Button className="gap-2">
                  <Plus className="h-4 w-4" /> Message Sarah
               </Button>
               <Button variant="outline" size="icon">
                  <ExternalLink className="h-4 w-4" />
               </Button>
            </div>
         </CardContent>
      </Card>
    </div>
  );
}
