import { createFileRoute } from "@tanstack/react-router";
import { 
  Bookmark, 
  BookMarked, 
  Video, 
  FileText, 
  Book, 
  Globe, 
  Trash2, 
  ArrowRight,
  Search,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useLibraryStore } from "@/stores/library-store";

export const Route = createFileRoute("/library/my-list")({
  component: MyLibraryList,
});

function MyLibraryList() {
  const { resources, bookmarks, toggleBookmark, readingLists } = useLibraryStore();
  
  const myBookmarks = resources.filter(r => bookmarks.includes(r.id));

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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Library</h1>
          <p className="text-muted-foreground">Access your saved resources and course reading lists.</p>
        </div>
      </div>

      <Tabs defaultValue="bookmarks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bookmarks" className="gap-2">
            <Bookmark className="h-4 w-4" /> Bookmarks
          </TabsTrigger>
          <TabsTrigger value="reading-lists" className="gap-2">
            <BookMarked className="h-4 w-4" /> Assigned Lists
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookmarks" className="space-y-4">
           {myBookmarks.length > 0 ? (
             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {myBookmarks.map(res => (
                   <Card key={res.id} className="group overflow-hidden flex flex-col">
                      <CardHeader className="p-4 pb-2">
                         <div className="flex justify-between items-start">
                            <Badge variant="secondary" className="capitalize text-[9px] py-0">{res.format}</Badge>
                            <Button 
                               variant="ghost" 
                               size="icon" 
                               className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                               onClick={() => toggleBookmark(res.id)}
                            >
                               <Trash2 className="h-4 w-4" />
                            </Button>
                         </div>
                         <CardTitle className="text-base mt-2">{res.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 flex-1">
                         <p className="text-xs text-muted-foreground line-clamp-2">{res.description}</p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 border-t bg-muted/5">
                         <Button variant="ghost" className="w-full text-xs gap-2 group-hover:text-primary transition-colors">
                            Access Resource <ExternalLink className="h-3 w-3" />
                         </Button>
                      </CardFooter>
                   </Card>
                ))}
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center py-20 text-center rounded-lg border-2 border-dashed">
                <Bookmark className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                <h3 className="text-lg font-bold">No bookmarks yet</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">Save resources from the Discovery page to access them quickly later.</p>
                <Button variant="outline" className="mt-6" asChild>
                   <a href="/library">Go to Discovery</a>
                </Button>
             </div>
           )}
        </TabsContent>

        <TabsContent value="reading-lists" className="space-y-6">
           {readingLists.map(list => (
             <div key={list.id} className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                   <div>
                      <h2 className="text-xl font-bold tracking-tight">{list.title}</h2>
                      <p className="text-sm text-muted-foreground">Instructor: {list.instructor} • {list.resourceIds.length} items</p>
                   </div>
                   <Button size="sm">Download All</Button>
                </div>
                <div className="grid gap-4">
                   {resources.filter(r => list.resourceIds.includes(r.id)).map(res => (
                      <Card key={res.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                         <CardContent className="p-4 flex items-center gap-4">
                            <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                               {getFormatIcon(res.format)}
                            </div>
                            <div className="flex-1 min-w-0">
                               <h4 className="font-bold text-sm truncate">{res.title}</h4>
                               <p className="text-[10px] text-muted-foreground">{res.category} • Added {res.dateAdded}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                               <ArrowRight className="h-4 w-4" />
                            </Button>
                         </CardContent>
                      </Card>
                   ))}
                </div>
             </div>
           ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
