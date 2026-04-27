import { createFileRoute } from "@tanstack/react-router";
import { 
  MessageSquare, 
  Send, 
  Phone, 
  Mail, 
  Calendar, 
  Bell, 
  Megaphone,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/partner/support")({
  component: PartnerSupport,
});

function PartnerSupport() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Communication Hub</h1>
          <p className="text-muted-foreground">Direct access to your UST relationship manager and organizational updates.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
         {/* Direct Contact */}
         <div className="md:col-span-2 space-y-6">
            <Card className="overflow-hidden">
               <div className="h-32 bg-primary/10 relative">
                  <div className="absolute -bottom-10 left-6 h-20 w-20 rounded-full border-4 border-background bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-soft">
                     SM
                  </div>
               </div>
               <CardHeader className="pt-12">
                  <CardTitle>Sarah Miller</CardTitle>
                  <CardDescription>Senior Partnership Manager</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">"I am here to ensure your organization gets the maximum value from our partnership. Feel free to reach out for any program customization or strategic reviews."</p>
                  <div className="space-y-2">
                     <div className="flex items-center gap-3 text-sm">
                        <Mail className="h-4 w-4 text-primary" /> s.miller@upskill.edu.ng
                     </div>
                     <div className="flex items-center gap-3 text-sm">
                        <Phone className="h-4 w-4 text-primary" /> +234 812 000 1122
                     </div>
                  </div>
               </CardContent>
               <CardFooter className="bg-muted/5 border-t p-4 flex gap-2">
                  <Button className="flex-1 gap-2">
                     <MessageSquare className="h-4 w-4" /> Message Sarah
                  </Button>
                  <Button variant="outline" size="icon">
                     <Calendar className="h-4 w-4" />
                  </Button>
               </CardFooter>
            </Card>

            <Card>
               <CardHeader className="pb-2">
                  <CardTitle className="text-base">Support Status</CardTitle>
               </CardHeader>
               <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-medium">
                     <span className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Technical Support</span>
                     <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs font-medium">
                     <span className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-warning" /> Response Time</span>
                     <span className="text-muted-foreground">&lt; 2 Hours</span>
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Announcements & Feed */}
         <div className="md:col-span-3 space-y-6">
            <div className="flex items-center gap-2 mb-4">
               <Megaphone className="h-5 w-5 text-primary" />
               <h2 className="text-xl font-bold tracking-tight">Partner Announcements</h2>
            </div>

            {[
              { 
                title: "New Executive Leadership Stream launching in Q2", 
                date: "2 hours ago", 
                tag: "Program Update",
                content: "We're expanding our leadership curriculum to include strategic AI implementation for C-suite executives.",
                action: "View Prospectus"
              },
              { 
                title: "Upcoming Quarterly Partnership Review", 
                date: "Yesterday", 
                tag: "Administrative",
                content: "Please ensure your staff enrollment lists are finalized before our review meeting next Thursday.",
                action: "Check Deadlines"
              },
              { 
                title: "2024 Impact Report now available for download", 
                date: "3 days ago", 
                tag: "Reporting",
                content: "Access your organization's consolidated impact data and staff performance metrics for the past year.",
                action: "Download Report"
              }
            ].map((news, i) => (
               <Card key={i} className="hover:border-primary/40 transition-colors">
                  <CardHeader className="pb-2">
                     <div className="flex justify-between items-start">
                        <Badge className="text-[10px] uppercase tracking-wider">{news.tag}</Badge>
                        <span className="text-[10px] text-muted-foreground">{news.date}</span>
                     </div>
                     <CardTitle className="text-base mt-2">{news.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p className="text-sm text-muted-foreground">{news.content}</p>
                  </CardContent>
                  <CardFooter className="pt-2 border-t">
                     <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 p-0 hover:bg-transparent hover:text-primary">
                        {news.action} <ArrowRight className="h-3 w-3" />
                     </Button>
                  </CardFooter>
               </Card>
            ))}

            <Button variant="outline" className="w-full gap-2">
               View All Updates <ExternalLink className="h-4 w-4" />
            </Button>
         </div>
      </div>
    </div>
  );
}
