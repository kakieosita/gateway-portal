import { createFileRoute } from "@tanstack/react-router";
import { 
  Award, 
  Download, 
  FileText, 
  ExternalLink, 
  BookOpen, 
  Percent, 
  TrendingUp,
  Clock,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/alumni/education")({
  component: AlumniEducation,
});

const pastCertificates = [
  { id: "CERT-001", title: "Full-Stack Web Development", date: "June 15, 2022", verId: "UST-WEB-8821", type: "Professional Certificate" },
  { id: "CERT-002", title: "Advanced React Patterns", date: "August 10, 2022", verId: "UST-ADV-1102", type: "Short Course" },
];

const continuingEd = [
  { 
    id: "prog1", 
    title: "Cloud Architecture Masterclass", 
    duration: "6 Months", 
    price: "₦450,000", 
    discounted: "₦360,000", 
    off: "20%",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60"
  },
  { 
    id: "prog2", 
    title: "AI & Machine Learning for Business", 
    duration: "4 Months", 
    price: "₦350,000", 
    discounted: "₦297,500", 
    off: "15%",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60"
  },
];

function AlumniEducation() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Education & Records</h1>
        <p className="text-muted-foreground">Access your academic history and explore advanced training with alumni benefits.</p>
      </div>

      {/* Continuing Education / Discounts */}
      <div className="space-y-4">
         <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
               <TrendingUp className="h-5 w-5 text-primary" /> Exclusive Alumni Discounts
            </h2>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
               <Percent className="mr-1 h-3 w-3" /> Partner Rates Apply
            </Badge>
         </div>
         <div className="grid gap-6 md:grid-cols-2">
            {continuingEd.map(prog => (
              <Card key={prog.id} className="overflow-hidden flex flex-col md:flex-row">
                 <div className="md:w-1/3 aspect-square md:aspect-auto relative">
                    <img src={prog.image} alt={prog.title} className="object-cover w-full h-full" />
                    <div className="absolute top-2 left-2">
                       <Badge className="bg-emerald-600 border-none">{prog.off} OFF</Badge>
                    </div>
                 </div>
                 <div className="flex-1 flex flex-col">
                    <CardHeader className="p-4 pb-2">
                       <CardTitle className="text-base">{prog.title}</CardTitle>
                       <CardDescription className="text-xs flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3" /> {prog.duration}
                       </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 py-2 flex-1">
                       <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-primary">{prog.discounted}</span>
                          <span className="text-xs text-muted-foreground line-through">{prog.price}</span>
                       </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                       <Button className="w-full text-xs" variant="outline">Learn More</Button>
                    </CardFooter>
                 </div>
              </Card>
            ))}
         </div>
      </div>

      {/* Certificates & Transcripts */}
      <div className="space-y-4">
         <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" /> My Academic Records
         </h2>
         <div className="grid gap-4">
            {pastCertificates.map(cert => (
              <Card key={cert.id} className="hover:border-primary/50 transition-colors">
                 <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                       <FileText className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <h4 className="font-bold text-sm truncate">{cert.title}</h4>
                       <p className="text-xs text-muted-foreground">{cert.type} • Issued {cert.date}</p>
                       <div className="mt-1">
                          <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-bold">{cert.verId}</code>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary">
                          <Download className="h-4 w-4" />
                       </Button>
                       <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary">
                          <ExternalLink className="h-4 w-4" />
                       </Button>
                    </div>
                 </CardContent>
              </Card>
            ))}
            <Card className="bg-muted/30 border-dashed">
               <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <BookOpen className="h-8 w-8 text-muted-foreground/40 mb-2" />
                  <h4 className="text-sm font-bold">Request Official Transcript</h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs">Need a formal document for further studies or job applications? Request a verified digital transcript.</p>
                  <Button variant="outline" className="mt-4 text-xs">Submit Request</Button>
               </CardContent>
            </Card>
         </div>
      </div>

      {/* Benefits Reminder */}
      <Card className="bg-slate-900 text-white overflow-hidden">
         <CardContent className="p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 space-y-2">
               <h3 className="text-xl font-bold tracking-tight">Lifetime Learning Access</h3>
               <p className="text-slate-400 text-sm">As a UST alumnus, you have perpetual access to our community labs, discounted workshops, and annual refresher courses. Keep your skills sharp in a rapidly evolving tech landscape.</p>
               <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs font-medium">
                     <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Free Lab Access
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium">
                     <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Annual Refresher
                  </div>
               </div>
            </div>
            <Button className="bg-white text-slate-900 hover:bg-slate-200 px-8">Join the Lab</Button>
         </CardContent>
      </Card>
    </div>
  );
}
