import { createFileRoute } from "@tanstack/react-router";
import { 
  Plus, 
  Upload, 
  FileText, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  ShieldCheck,
  Search,
  MoreHorizontal
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
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useLibraryStore } from "@/stores/library-store";

export const Route = createFileRoute("/library/manage")({
  component: LibraryManage,
});

function LibraryManage() {
  const { resources } = useLibraryStore();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resource Management</h1>
          <p className="text-muted-foreground">Upload new materials and moderate the library catalog.</p>
        </div>
      </div>

      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upload">Upload Resource</TabsTrigger>
          <TabsTrigger value="moderation">Moderation Queue</TabsTrigger>
          <TabsTrigger value="reading-lists">Reading Lists</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
               <CardTitle className="text-lg">Add New Resource</CardTitle>
               <CardDescription>Contribute a file or external link to the library.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                     <Label>Resource Title</Label>
                     <Input placeholder="e.g. Mastering React State" />
                  </div>
                  <div className="space-y-2">
                     <Label>Category</Label>
                     <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                        <option>Web Development</option>
                        <option>Design</option>
                        <option>Data Science</option>
                        <option>Business</option>
                     </select>
                  </div>
               </div>

               <div className="space-y-2">
                  <Label>Resource Format</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                     {['video', 'pdf', 'ebook', 'link'].map(f => (
                        <div key={f} className="flex items-center gap-2 p-3 rounded-lg border cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-colors">
                           <Badge variant="outline" className="capitalize">{f}</Badge>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="space-y-2">
                  <Label>Access Level</Label>
                  <div className="flex gap-4">
                     {['public', 'student', 'instructor'].map(level => (
                        <div key={level} className="flex items-center gap-2">
                           <input type="radio" name="access" id={level} value={level} />
                           <Label htmlFor={level} className="capitalize text-xs cursor-pointer">{level}</Label>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="space-y-2">
                  <Label>Source</Label>
                  <div className="h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer">
                     <Upload className="h-6 w-6 text-muted-foreground" />
                     <p className="text-xs text-muted-foreground font-medium">Drag and drop file, or enter URL</p>
                  </div>
               </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
               <Button className="w-full sm:w-auto">Submit Resource</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="moderation" className="space-y-4">
           <Card>
              <CardHeader>
                 <CardTitle className="text-lg">Pending Approval</CardTitle>
                 <CardDescription>Review community-contributed resources before they go live.</CardDescription>
              </CardHeader>
              <CardContent>
                 <Table>
                    <TableHeader>
                       <TableRow>
                          <TableHead>Resource</TableHead>
                          <TableHead>Contributor</TableHead>
                          <TableHead>Format</TableHead>
                          <TableHead>Access</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {resources.slice(0, 2).map(res => (
                          <TableRow key={res.id}>
                             <TableCell>
                                <div className="font-medium">{res.title}</div>
                                <div className="text-[10px] text-muted-foreground">{res.category}</div>
                             </TableCell>
                             <TableCell className="text-xs">{res.author}</TableCell>
                             <TableCell>
                                <Badge variant="outline" className="capitalize text-[10px]">{res.format}</Badge>
                             </TableCell>
                             <TableCell>
                                <Badge variant="secondary" className="capitalize text-[10px]">{res.accessLevel}</Badge>
                             </TableCell>
                             <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                   <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">Approve</Button>
                                   <Button variant="ghost" size="sm" className="text-destructive">Reject</Button>
                                </div>
                             </TableCell>
                          </TableRow>
                       ))}
                    </TableBody>
                 </Table>
              </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="reading-lists" className="space-y-4">
           <div className="flex justify-between items-center">
              <h3 className="font-bold">Course Reading Lists</h3>
              <Button size="sm">
                 <Plus className="mr-2 h-4 w-4" /> Create New List
              </Button>
           </div>
           <div className="grid gap-4 md:grid-cols-2">
              {[1, 2].map(i => (
                 <Card key={i}>
                    <CardHeader className="pb-2">
                       <div className="flex justify-between items-start">
                          <CardTitle className="text-base">Full-Stack Development Q3</CardTitle>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                             <MoreHorizontal className="h-4 w-4" />
                          </Button>
                       </div>
                       <CardDescription>Curated by Jane Smith • 12 Resources</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div className="flex -space-x-2">
                          {[1,2,3,4].map(j => (
                             <div key={j} className="h-8 w-8 rounded border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">
                                <FileText className="h-4 w-4" />
                             </div>
                          ))}
                       </div>
                    </CardContent>
                    <CardFooter className="pt-2 border-t text-[10px] text-muted-foreground">
                       Last updated 2 days ago
                    </CardFooter>
                 </Card>
              ))}
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
