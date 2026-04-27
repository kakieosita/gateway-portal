import { createFileRoute } from "@tanstack/react-router";
import { 
  MessagesSquare, 
  Calendar, 
  Heart, 
  Plus, 
  Users, 
  Search, 
  MapPin, 
  ExternalLink,
  MessageCircle,
  Share2,
  HandHelping
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
import { useAlumniStore } from "@/stores/alumni-store";

export const Route = createFileRoute("/alumni/community")({
  component: AlumniCommunity,
});

function AlumniCommunity() {
  const { events } = useAlumniStore();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community & Engagement</h1>
          <p className="text-muted-foreground">Network with peers, attend exclusive events, and give back to UST.</p>
        </div>
      </div>

      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events" className="gap-2">
            <Calendar className="h-4 w-4" /> Alumni Events
          </TabsTrigger>
          <TabsTrigger value="forum" className="gap-2">
            <MessagesSquare className="h-4 w-4" /> Discussion Forum
          </TabsTrigger>
          <TabsTrigger value="giving" className="gap-2">
            <Heart className="h-4 w-4" /> Giving Back
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             {events.map(event => (
               <Card key={event.id} className="overflow-hidden group flex flex-col">
                  <div className="aspect-video relative overflow-hidden">
                     <img 
                        src={event.image} 
                        alt={event.title} 
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                     />
                     <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-background/80 backdrop-blur shadow-sm">
                           {event.type}
                        </Badge>
                     </div>
                  </div>
                  <CardHeader className="p-4 pb-2">
                     <CardTitle className="text-base line-clamp-1 group-hover:text-primary transition-colors">
                        {event.title}
                     </CardTitle>
                     <CardDescription className="flex items-center gap-2 mt-1 text-xs">
                        <Calendar className="h-3 w-3" /> {event.date} at {event.time}
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 flex-1">
                     <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {event.location}
                     </div>
                     <div className="flex items-center gap-2 mt-4">
                        <div className="flex -space-x-1.5">
                           {[1,2,3].map(i => (
                             <div key={i} className="h-6 w-6 rounded-full border-2 border-background bg-muted" />
                           ))}
                        </div>
                        <span className="text-[10px] text-muted-foreground font-medium">{event.attendees} alumni attending</span>
                     </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 border-t bg-muted/5 gap-2">
                     <Button className="flex-1 text-xs">RSVP Now</Button>
                     <Button variant="outline" size="icon" className="h-9 w-9">
                        <Share2 className="h-4 w-4" />
                     </Button>
                  </CardFooter>
               </Card>
             ))}
             <Card className="border-dashed flex flex-col items-center justify-center p-6 text-center h-full min-h-[300px]">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-2">
                   <Plus className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="font-bold text-sm">Suggest an Event</h3>
                <p className="text-xs text-muted-foreground mt-1">Want to host a meetup in your city?</p>
                <Button variant="ghost" className="mt-4 text-xs">Submit Proposal</Button>
             </Card>
          </div>
        </TabsContent>

        <TabsContent value="forum" className="space-y-4">
           <div className="grid gap-4 md:grid-cols-4">
              <div className="md:col-span-1 space-y-4">
                 <Card>
                    <CardHeader className="p-4">
                       <CardTitle className="text-sm">Categories</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                       <div className="flex flex-col">
                          {['General Networking', 'Tech Trends', 'Industry News', 'Career Advice', 'UST Updates'].map(cat => (
                            <Button key={cat} variant="ghost" className="justify-start rounded-none px-4 h-10 text-xs font-medium">
                               {cat}
                            </Button>
                          ))}
                       </div>
                    </CardContent>
                 </Card>
                 <Button className="w-full gap-2">
                    <Plus className="h-4 w-4" /> New Discussion
                 </Button>
              </div>
              <div className="md:col-span-3 space-y-4">
                 {[
                   { title: "Best strategies for landing remote roles in 2024?", author: "Tobi Adebayo", replies: 12, category: "Career Advice" },
                   { title: "Anyone attending the Lagos Gala next month?", author: "Chioma Nwosu", replies: 8, category: "General Networking" },
                   { title: "My experience transitioning from Dev to Product Management", author: "Emeka Okafor", replies: 24, category: "Industry News" },
                 ].map((post, i) => (
                    <Card key={i} className="hover:border-primary/50 transition-colors cursor-pointer">
                       <CardContent className="p-4 flex items-start gap-4">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold shrink-0">
                             {post.author.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                             <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-[9px] py-0">{post.category}</Badge>
                                <span className="text-[10px] text-muted-foreground">Posted by {post.author}</span>
                             </div>
                             <h4 className="font-bold text-sm leading-tight mb-2">{post.title}</h4>
                             <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                                <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> {post.replies} replies</span>
                                <span>2 hours ago</span>
                             </div>
                          </div>
                       </CardContent>
                    </Card>
                 ))}
              </div>
           </div>
        </TabsContent>

        <TabsContent value="giving" className="space-y-6">
           <div className="grid gap-6 md:grid-cols-2">
              <Card className="flex flex-col border-emerald-500/20 bg-emerald-500/5">
                 <CardHeader>
                    <CardTitle className="text-emerald-700 flex items-center gap-2">
                       <Heart className="h-5 w-5 fill-emerald-500 stroke-emerald-500" /> UST Scholarship Fund
                    </CardTitle>
                    <CardDescription>Directly support talented students who lack the financial means to attend UST.</CardDescription>
                 </CardHeader>
                 <CardContent className="flex-1">
                    <div className="space-y-4">
                       <div className="space-y-2">
                          <div className="flex justify-between text-xs font-bold">
                             <span>Progress to Goal</span>
                             <span>₦12.5M / ₦20M</span>
                          </div>
                          <div className="h-2 rounded-full bg-emerald-100 overflow-hidden">
                             <div className="h-full bg-emerald-500 w-[62.5%]" />
                          </div>
                       </div>
                       <p className="text-sm text-muted-foreground italic">"Without the alumni scholarship, I wouldn't have been able to complete my Full-Stack program. Today, I'm a developer at Google." — Recent Graduate</p>
                    </div>
                 </CardContent>
                 <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Donate Now</Button>
                 </CardFooter>
              </Card>

              <Card className="flex flex-col border-primary/20 bg-primary/5">
                 <CardHeader>
                    <CardTitle className="text-primary flex items-center gap-2">
                       <HandHelping className="h-5 w-5" /> Volunteer Programs
                    </CardTitle>
                    <CardDescription>Share your skills as a guest speaker, curriculum advisor, or community leader.</CardDescription>
                 </CardHeader>
                 <CardContent className="flex-1">
                    <ul className="space-y-3">
                       {['Guest Speaking', 'Curriculum Review', 'Local Meetup Organizer', 'Portfolio Reviewer'].map(v => (
                         <li key={v} className="flex items-center justify-between p-2 rounded bg-background/50 border text-xs">
                            <span className="font-medium">{v}</span>
                            <Button variant="ghost" size="sm" className="h-7 text-[10px]">Learn More</Button>
                         </li>
                       ))}
                    </ul>
                 </CardContent>
                 <CardFooter>
                    <Button variant="outline" className="w-full">Browse Opportunities</Button>
                 </CardFooter>
              </Card>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
