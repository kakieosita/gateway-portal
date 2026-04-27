import { createFileRoute } from "@tanstack/react-router";
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  Users, 
  Target, 
  FileText,
  PieChart,
  Calendar,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell,
  PieChart as RePieChart,
  Pie
} from "recharts";

export const Route = createFileRoute("/partner/reports")({
  component: PartnerReports,
});

const progressData = [
  { name: "Week 1", score: 65 },
  { name: "Week 2", score: 72 },
  { name: "Week 3", score: 85 },
  { name: "Week 4", score: 80 },
  { name: "Week 5", score: 92 },
  { name: "Week 6", score: 88 },
];

const completionStatus = [
  { name: "Completed", value: 65 },
  { name: "On Track", value: 25 },
  { name: "Delayed", value: 10 },
];

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--destructive))"];

function PartnerReports() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reporting & Impact</h1>
          <p className="text-muted-foreground">Analyze training outcomes and download organizational impact data.</p>
        </div>
        <Button>
           <Download className="mr-2 h-4 w-4" /> Export Annual Impact Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
         <Card>
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium">Net Promoter Score (NPS)</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">8.4 / 10</div>
               <p className="text-xs text-emerald-500 font-medium">+0.6 from Q3</p>
            </CardContent>
         </Card>
         <Card>
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium">Skills Improvement</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">+42%</div>
               <p className="text-xs text-muted-foreground">Post-training assessment avg.</p>
            </CardContent>
         </Card>
         <Card>
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium">Certificates Issued</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">24</div>
               <p className="text-xs text-muted-foreground">92% eligibility rate</p>
            </CardContent>
         </Card>
      </div>

      <Tabs defaultValue="progress" className="space-y-4">
        <TabsList>
          <TabsTrigger value="progress">Beneficiary Progress</TabsTrigger>
          <TabsTrigger value="impact">Impact Metrics</TabsTrigger>
          <TabsTrigger value="attendance">Attendance & Completion</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-6">
           <div className="grid gap-6 md:grid-cols-2">
              <Card>
                 <CardHeader>
                    <CardTitle className="text-lg">Average Assessment Score</CardTitle>
                    <CardDescription>Aggregate weekly performance across all enrolled staff.</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <div className="h-[300px] w-full">
                       <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={progressData}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                             <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                             <YAxis fontSize={10} axisLine={false} tickLine={false} />
                             <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                                cursor={{ fill: 'transparent' }}
                             />
                             <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                          </BarChart>
                       </ResponsiveContainer>
                    </div>
                 </CardContent>
              </Card>

              <Card>
                 <CardHeader>
                    <CardTitle className="text-lg">Staff Completion Status</CardTitle>
                    <CardDescription>Breakdown of current cohort standing.</CardDescription>
                 </CardHeader>
                 <CardContent className="flex items-center justify-center">
                    <div className="h-[300px] w-full">
                       <ResponsiveContainer width="100%" height="100%">
                          <RePieChart>
                             <Pie
                                data={completionStatus}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                             >
                                {completionStatus.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                             </Pie>
                             <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                          </RePieChart>
                       </ResponsiveContainer>
                    </div>
                 </CardContent>
                 <div className="p-4 pt-0 flex justify-center gap-4 text-xs">
                    {completionStatus.map((s, i) => (
                       <div key={s.name} className="flex items-center gap-1.5">
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                          <span>{s.name} ({s.value}%)</span>
                       </div>
                    ))}
                 </div>
              </Card>
           </div>
        </TabsContent>

        <TabsContent value="impact" className="space-y-4">
           <Card>
              <CardHeader>
                 <CardTitle className="text-lg">Impact Case Studies</CardTitle>
                 <CardDescription>Qualitative feedback and organizational transformation results.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="grid gap-6 md:grid-cols-2">
                    <div className="p-6 rounded-xl border bg-primary/5">
                       <h4 className="font-bold mb-2">Technical Proficiency</h4>
                       <p className="text-sm text-muted-foreground mb-4">Post-training surveys show a significant increase in independent problem-solving capabilities within the engineering team.</p>
                       <div className="flex items-center gap-2 text-xs font-bold text-primary">
                          <Target className="h-4 w-4" /> 94% Increase in Delivery Speed
                       </div>
                    </div>
                    <div className="p-6 rounded-xl border bg-secondary/10">
                       <h4 className="font-bold mb-2">Collaborative Culture</h4>
                       <p className="text-sm text-muted-foreground mb-4">Cross-functional training has improved communication between design and development departments.</p>
                       <div className="flex items-center gap-2 text-xs font-bold text-secondary">
                          <CheckCircle2 className="h-4 w-4" /> 100% Shared Documentation Adoption
                       </div>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
           <Card>
              <CardHeader>
                 <CardTitle className="text-lg">Attendance Log</CardTitle>
                 <CardDescription>Weekly attendance tracking across all corporate cohorts.</CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="space-y-4">
                    {[
                      { date: "Oct 12 - Oct 19", attendance: 98, status: "Perfect" },
                      { date: "Oct 05 - Oct 12", attendance: 94, status: "High" },
                      { date: "Sep 28 - Oct 05", attendance: 88, status: "Target" },
                    ].map(log => (
                       <div key={log.date} className="flex items-center justify-between p-4 rounded-lg border">
                          <div className="flex items-center gap-3">
                             <Calendar className="h-4 w-4 text-muted-foreground" />
                             <span className="text-sm font-medium">{log.date}</span>
                          </div>
                          <div className="flex items-center gap-6">
                             <div className="text-right">
                                <p className="text-sm font-bold">{log.attendance}%</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold">{log.status}</p>
                             </div>
                             <Button variant="ghost" size="sm">Details</Button>
                          </div>
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
