import { createFileRoute } from "@tanstack/react-router";
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Bookmark, 
  BookmarkCheck,
  Video, 
  FileText, 
  Book, 
  Globe, 
  User, 
  Calendar, 
  Shield,
  Star,
  MessageCircle,
  ExternalLink
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
import { useLibraryStore } from "@/stores/library-store";

export const Route = createFileRoute("/library/$resourceId")({
  component: ResourceDetail,
});

function ResourceDetail() {
  const { resourceId } = Route.useParams();
  const { resources, bookmarks, toggleBookmark } = useLibraryStore();
  
  const resource = resources.find(r => r.id === resourceId) || resources[0];
  const related = resources.filter(r => r.category === resource.category && r.id !== resource.id);

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'pdf': return <FileText className="h-4 w-4" />;
      case 'ebook': return <Book className="h-4 w-4" />;
      case 'link': return <Globe className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
         <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
            <ArrowLeft className="h-5 w-5" />
         </Button>
         <div className="flex-1">
            <div className="flex items-center gap-2">
               <Badge variant="outline" className="capitalize text-[10px]">{resource.format}</Badge>
               <span className="text-xs text-muted-foreground">{resource.category}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight mt-1">{resource.title}</h1>
         </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
         {/* Main Content / Preview */}
         <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden bg-muted/20 border-dashed border-2">
               <CardContent className="flex flex-col items-center justify-center py-24 text-center">
                  {getFormatIcon(resource.format)}
                  <div className="mt-4 space-y-2">
                     <h3 className="font-bold">Resource Preview</h3>
                     <p className="text-sm text-muted-foreground max-w-sm">
                        {resource.format === 'video' ? 'Click to play this video lesson.' : 
                         resource.format === 'link' ? 'This resource is hosted on an external platform.' : 
                         'Use the buttons below to download or view the full document.'}
                     </p>
                     <Button className="mt-4 gap-2">
                        {resource.format === 'link' ? <ExternalLink className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                        {resource.format === 'link' ? 'Visit External Site' : 'Open Resource'}
                     </Button>
                  </div>
               </CardContent>
            </Card>

            <div className="space-y-4">
               <h3 className="text-lg font-bold">About this resource</h3>
               <p className="text-sm text-muted-foreground leading-relaxed">{resource.description}</p>
            </div>

            <div className="flex flex-wrap gap-2 pt-4">
               {['#react', '#webdev', '#tutorial', '#frontend'].map(tag => (
                  <Badge key={tag} variant="secondary" className="text-[10px] bg-muted/50">{tag}</Badge>
               ))}
            </div>
         </div>

         {/* Sidebar Info */}
         <div className="space-y-6">
            <Card>
               <CardHeader className="pb-4">
                  <CardTitle className="text-base font-bold">Details</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4 pt-0">
                  <div className="flex items-center justify-between text-sm">
                     <span className="text-muted-foreground flex items-center gap-2"><User className="h-3.5 w-3.5" /> Author</span>
                     <span className="font-medium">{resource.author}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                     <span className="text-muted-foreground flex items-center gap-2"><Calendar className="h-3.5 w-3.5" /> Added</span>
                     <span className="font-medium">{resource.dateAdded}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                     <span className="text-muted-foreground flex items-center gap-2"><Shield className="h-3.5 w-3.5" /> Access</span>
                     <Badge variant="secondary" className="capitalize text-[10px]">{resource.accessLevel}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                     <span className="text-muted-foreground flex items-center gap-2"><Star className="h-3.5 w-3.5 text-primary fill-primary" /> Rating</span>
                     <span className="font-bold">4.8 / 5.0</span>
                  </div>
               </CardContent>
               <CardFooter className="flex gap-2 border-t pt-4">
                  <Button variant="outline" className="flex-1 gap-2 text-xs" onClick={() => toggleBookmark(resource.id)}>
                     {bookmarks.includes(resource.id) ? (
                        <><BookmarkCheck className="h-3.5 w-3.5 text-primary" /> Saved</>
                     ) : (
                        <><Bookmark className="h-3.5 w-3.5" /> Bookmark</>
                     )}
                  </Button>
                  <Button variant="outline" size="icon" className="shrink-0 h-9 w-9">
                     <Share2 className="h-4 w-4" />
                  </Button>
               </CardFooter>
            </Card>

            <div className="space-y-4">
               <h4 className="font-bold text-sm">Related Resources</h4>
               <div className="grid gap-3">
                  {related.slice(0, 3).map(r => (
                     <Card key={r.id} className="cursor-pointer hover:border-primary transition-colors">
                        <CardContent className="p-3 flex items-center gap-3">
                           <div className="h-8 w-8 rounded bg-muted flex items-center justify-center shrink-0">
                              {getFormatIcon(r.format)}
                           </div>
                           <div className="min-w-0">
                              <p className="text-xs font-bold truncate">{r.title}</p>
                              <p className="text-[10px] text-muted-foreground">{r.author}</p>
                           </div>
                        </CardContent>
                     </Card>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
