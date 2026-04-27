import { createFileRoute } from "@tanstack/react-router";
import { 
  Building2, 
  FileText, 
  Users, 
  Plus, 
  Download, 
  ExternalLink, 
  ShieldCheck,
  Calendar,
  Settings,
  Mail,
  Phone,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { usePartnerStore } from "@/stores/partner-store";

export const Route = createFileRoute("/partner/management")({
  component: PartnerManagement,
});

function PartnerManagement() {
  const { profile, mous } = usePartnerStore();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Partnership Management</h1>
          <p className="text-muted-foreground">Manage organizational profile, legal documents, and staff enrollment.</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Org Profile</TabsTrigger>
          <TabsTrigger value="agreements">MOU / Agreements</TabsTrigger>
          <TabsTrigger value="enrollment">Staff Enrollment</TabsTrigger>
          <TabsTrigger value="custom">Custom Training</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
             <Card>
                <CardHeader>
                   <CardTitle className="text-lg">Organizational Details</CardTitle>
                   <CardDescription>Basic information about your organization.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="grid gap-2">
                      <Label>Organization Name</Label>
                      <Input defaultValue={profile.orgName} />
                   </div>
                   <div className="grid gap-2">
                      <Label>Organization Type</Label>
                      <Input defaultValue={profile.type} />
                   </div>
                   <div className="grid gap-2">
                      <Label>Headquarters / Location</Label>
                      <Input defaultValue={profile.location} />
                   </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                   <Button size="sm">Save Changes</Button>
                </CardFooter>
             </Card>

             <Card>
                <CardHeader>
                   <CardTitle className="text-lg">Contact Information</CardTitle>
                   <CardDescription>Primary contacts for partnership operations.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                         <Users className="h-5 w-5" />
                      </div>
                      <div>
                         <p className="text-sm font-bold">{profile.contactPerson}</p>
                         <p className="text-xs text-muted-foreground">Primary Liaison</p>
                      </div>
                   </div>
                   <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                         <Mail className="h-4 w-4" /> {profile.email}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                         <Phone className="h-4 w-4" /> {profile.phone}
                      </div>
                   </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                   <Button variant="outline" size="sm">Update Contacts</Button>
                </CardFooter>
             </Card>
          </div>
        </TabsContent>

        <TabsContent value="agreements" className="space-y-4">
           <div className="flex justify-end">
              <Button size="sm" variant="outline">
                 <Plus className="mr-2 h-4 w-4" /> Upload Document
              </Button>
           </div>
           <div className="grid gap-4">
              {mous.map(doc => (
                <Card key={doc.id} className="hover:border-primary/50 transition-colors">
                   <CardContent className="p-4 flex items-center gap-4">
                      <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                         <FileText className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                         <h4 className="font-bold text-sm truncate">{doc.title}</h4>
                         <p className="text-[10px] text-muted-foreground mt-0.5">Signed: {doc.signDate} • Expires: {doc.expiryDate}</p>
                      </div>
                      <div className="flex items-center gap-3">
                         <Badge variant={doc.status === 'active' ? 'default' : 'secondary'} className="text-[10px]">
                            {doc.status.replace('_', ' ')}
                         </Badge>
                         <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                         </Button>
                      </div>
                   </CardContent>
                </Card>
              ))}
              <div className="rounded-lg border border-dashed p-8 text-center bg-muted/20">
                 <ShieldCheck className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                 <p className="text-sm font-medium">All documents are stored securely.</p>
                 <p className="text-xs text-muted-foreground mt-1">Access is restricted to authorized organizational contacts.</p>
              </div>
           </div>
        </TabsContent>

        <TabsContent value="enrollment" className="space-y-4">
           <Card>
              <CardHeader>
                 <CardTitle className="text-lg">Staff Enrollment Portal</CardTitle>
                 <CardDescription>Directly enroll organization members into current UST programs.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                       <Label>1. Select Program</Label>
                       <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                          <option>Full-Stack Web Development</option>
                          <option>Data Analytics for Managers</option>
                          <option>UI/UX Design Fundamentals</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <Label>2. Upload Staff List (CSV/Excel)</Label>
                       <div className="h-10 border border-dashed rounded-md flex items-center justify-center px-3 cursor-pointer hover:bg-muted/50 transition-colors">
                          <Plus className="h-4 w-4 text-muted-foreground mr-2" />
                          <span className="text-xs text-muted-foreground">Drop file or click to browse</span>
                       </div>
                    </div>
                 </div>
                 <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                       <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                       <h5 className="text-sm font-bold">Partnership Benefit Applied</h5>
                       <p className="text-xs text-muted-foreground">Corporate partners receive prioritized admission and a 15% discount on all staff enrollments.</p>
                    </div>
                 </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                 <Button className="w-full sm:w-auto">Submit Enrollment Request</Button>
              </CardFooter>
           </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
           <Card>
              <CardHeader>
                 <CardTitle className="text-lg">Custom Corporate Training Request</CardTitle>
                 <CardDescription>Work with UST to build a bespoke training program tailored to your organization's specific needs.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                       <Label>Target Department</Label>
                       <Input placeholder="e.g. Engineering, Sales, Product" />
                    </div>
                    <div className="grid gap-2">
                       <Label>Proposed Start Date</Label>
                       <div className="flex items-center gap-2 border rounded-md px-3 h-10 text-muted-foreground text-sm cursor-pointer hover:bg-muted/30">
                          <Calendar className="h-4 w-4" /> Select Date
                       </div>
                    </div>
                 </div>
                 <div className="grid gap-2">
                    <Label>Training Objectives</Label>
                    <textarea 
                       className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                       placeholder="Briefly describe what your team needs to achieve through this training..."
                    />
                 </div>
              </CardContent>
              <CardFooter className="border-t pt-4 gap-3">
                 <Button className="w-full sm:w-auto">Submit Proposal</Button>
                 <Button variant="outline" className="w-full sm:w-auto">Schedule Consultation</Button>
              </CardFooter>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
