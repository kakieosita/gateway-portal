import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { 
  Search, 
  Filter, 
  Video, 
  FileText, 
  Book, 
  Globe, 
  Bookmark, 
  BookmarkCheck,
  Plus,
  Star,
  ChevronRight,
  MoreVertical,
  ExternalLink
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
import { Badge } from "@/components/ui/badge";
import { useLibraryStore } from "@/stores/library-store";

export const Route = createFileRoute("/library/")({
  component: LibraryDiscovery,
});

function LibraryDiscovery() {
  const { resources, bookmarks, toggleBookmark } = useLibraryStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFormat, setActiveFormat] = useState<string | null>(null);

  const featured = resources.filter(r => r.isFeatured);
  const filteredResources = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         r.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFormat = activeFormat ? r.format === activeFormat : true;
    return matchesSearch && matchesFormat;
  });

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
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">E-Library Discovery</h1>
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search by title, author, or category..." 
            className="pl-10 h-12 text-lg shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Featured Resources */}
      {!searchTerm && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <Star className="h-5 w-5 text-primary fill-primary" /> Featured Resources
            </h2>
            <Button variant="ghost" size="sm">See All <ChevronRight className="ml-1 h-4 w-4" /></Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {featured.map(resource => (
              <Card key={resource.id} className="overflow-hidden bg-primary/5 border-primary/10 group cursor-pointer hover:border-primary/30 transition-all">
                <div className="flex flex-col md:flex-row h-full">
                  <div className="md:w-1/3 bg-muted flex items-center justify-center p-8">
                    {getFormatIcon(resource.format)}
                  </div>
                  <div className="flex-1 flex flex-col p-6">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="capitalize text-[10px]">{resource.format}</Badge>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 -mt-2 -mr-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(resource.id);
                        }}
                      >
                        {bookmarks.includes(resource.id) ? (
                          <BookmarkCheck className="h-4 w-4 text-primary" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">{resource.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{resource.description}</p>
                    <div className="mt-auto pt-4 flex items-center justify-between text-xs font-medium">
                       <span>{resource.author}</span>
                       <span className="text-muted-foreground">{resource.category}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Resource Catalog */}
      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
           <h2 className="text-xl font-bold tracking-tight">Resource Catalog</h2>
           <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {['video', 'pdf', 'ebook', 'link'].map(format => (
                 <Button 
                    key={format}
                    variant={activeFormat === format ? "default" : "outline"}
                    size="sm"
                    className="capitalize text-xs whitespace-nowrap"
                    onClick={() => setActiveFormat(activeFormat === format ? null : format)}
                 >
                    {getFormatIcon(format)}
                    <span className="ml-2">{format}</span>
                 </Button>
              ))}
           </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredResources.map(resource => (
            <Card key={resource.id} className="flex flex-col h-full hover:border-primary/50 transition-colors">
              <CardHeader className="p-4 pb-2">
                 <div className="flex justify-between items-start">
                    <Badge variant="secondary" className="capitalize text-[9px] py-0">{resource.format}</Badge>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => toggleBookmark(resource.id)}
                      >
                        {bookmarks.includes(resource.id) ? (
                          <BookmarkCheck className="h-4 w-4 text-primary" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </Button>
                 </div>
                 <CardTitle className="text-base leading-tight mt-2">{resource.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 flex-1">
                 <p className="text-xs text-muted-foreground line-clamp-3">{resource.description}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 border-t bg-muted/5 flex items-center justify-between text-[10px] text-muted-foreground">
                 <div className="flex items-center gap-1">
                    <Star className="h-3 w-3" /> 4.8
                 </div>
                 <span>Added {resource.dateAdded}</span>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
             <Search className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
             <h3 className="text-lg font-bold">No resources found</h3>
             <p className="text-sm text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
             <Button variant="link" onClick={() => { setSearchTerm(""); setActiveFormat(null); }}>Clear all</Button>
          </div>
        )}
      </section>
    </div>
  );
}
