import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { 
  Award, 
  Plus, 
  Layout, 
  Users, 
  Search, 
  CheckCircle2, 
  ExternalLink,
  Download,
  FileText,
  Printer,
  ChevronRight
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
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/certificates")({
  component: AdminCertificates,
});

const mockTemplates = [
  { id: "tmpl1", name: "Professional Graduate Certificate", lastUsed: "2 days ago", type: "Standard" },
  { id: "tmpl2", name: "Short Course Achievement", lastUsed: "1 week ago", type: "Minimalist" },
  { id: "tmpl3", name: "Honorary Fellowship", lastUsed: "Never", type: "Premium" },
];

const mockIssued = [
  { id: "CERT-9901", student: "John Doe", program: "Full-Stack Web Development", date: "2024-03-20", verId: "UST-WEB-8821" },
  { id: "CERT-9902", student: "Sarah Smith", program: "UI/UX Fundamentals", date: "2024-03-18", verId: "UST-DSN-1102" },
  { id: "CERT-9903", student: "Mike Johnson", program: "Cloud AWS", date: "2024-03-15", verId: "UST-CLD-5542" },
];

function AdminCertificates() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Certificate Management</h1>
          <p className="text-muted-foreground">Design templates and issue professional credentials to graduates.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Template
        </Button>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="issuance">Bulk Issuance</TabsTrigger>
          <TabsTrigger value="verification">Verification Log</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
             {mockTemplates.map(t => (
               <Card key={t.id} className="overflow-hidden group">
                  <div className="aspect-[1.4/1] bg-muted relative flex items-center justify-center p-8">
                     <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                     <div className="border-4 border-double border-primary/20 w-full h-full flex flex-col items-center justify-center p-4">
                        <Award className="h-12 w-12 text-primary/40 mb-2" />
                        <div className="h-2 w-24 bg-muted-foreground/20 rounded-full mb-1" />
                        <div className="h-1.5 w-16 bg-muted-foreground/10 rounded-full" />
                     </div>
                  </div>
                  <CardHeader className="p-4 pb-2">
                     <div className="flex justify-between items-start">
                        <CardTitle className="text-sm font-bold">{t.name}</CardTitle>
                        <Badge variant="secondary" className="text-[10px]">{t.type}</Badge>
                     </div>
                     <CardDescription className="text-xs">Last used {t.lastUsed}</CardDescription>
                  </CardHeader>
                  <CardFooter className="p-4 pt-0 gap-2">
                     <Button variant="ghost" size="sm" className="flex-1 text-xs">Edit</Button>
                     <Button variant="outline" size="sm" className="flex-1 text-xs">Preview</Button>
                  </CardFooter>
               </Card>
             ))}
             <Card className="border-dashed flex flex-col items-center justify-center p-6 text-center h-[240px]">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-2">
                   <Plus className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="font-bold text-sm">New Template</h3>
                <p className="text-xs text-muted-foreground mt-1">Start from a blank canvas or clone existing.</p>
                <Button variant="ghost" className="mt-4 text-xs">Open Designer</Button>
             </Card>
          </div>
        </TabsContent>

        <TabsContent value="issuance" className="space-y-4">
           <Card>
              <CardHeader>
                 <CardTitle className="text-lg">Bulk Issuance Wizard</CardTitle>
                 <CardDescription>Select a completed cohort to generate and email certificates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase text-muted-foreground">1. Select Cohort</label>
                       <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                          <option>Full-Stack Batch A 2024 (24 Graduates)</option>
                          <option>UI/UX Cohort 1 (18 Graduates)</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase text-muted-foreground">2. Choose Template</label>
                       <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                          <option>Professional Graduate Certificate</option>
                          <option>Minimalist Achievement</option>
                       </select>
                    </div>
                 </div>
                 <div className="rounded-lg border bg-muted/30 p-4 flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                       <Users className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                       <h4 className="text-sm font-bold">Ready for Generation</h4>
                       <p className="text-xs text-muted-foreground">24 certificates will be generated and unique verification IDs assigned. An automated email with the digital copy will be sent to all students.</p>
                    </div>
                 </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                 <Button className="w-full sm:w-auto">
                    <Printer className="mr-2 h-4 w-4" /> Generate & Issue Certificates
                 </Button>
              </CardFooter>
           </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-4">
           <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                 <Input placeholder="Search Verification ID or Student Name..." className="pl-8" />
              </div>
           </div>
           <div className="rounded-md border bg-card">
              <Table>
                 <TableHeader>
                    <TableRow>
                       <TableHead>Student</TableHead>
                       <TableHead>Program</TableHead>
                       <TableHead>Issue Date</TableHead>
                       <TableHead>Verification ID</TableHead>
                       <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                 </TableHeader>
                 <TableBody>
                    {mockIssued.map(cert => (
                      <TableRow key={cert.id}>
                         <TableCell className="font-medium">{cert.student}</TableCell>
                         <TableCell>{cert.program}</TableCell>
                         <TableCell className="text-muted-foreground">{cert.date}</TableCell>
                         <TableCell>
                            <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-bold">{cert.verId}</code>
                         </TableCell>
                         <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="gap-1.5">
                               <ExternalLink className="h-3 w-3" /> Verify
                            </Button>
                         </TableCell>
                      </TableRow>
                    ))}
                 </TableBody>
              </Table>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
