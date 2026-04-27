import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, Users, MessageCircle, PlusCircle, UserCircle2 } from "lucide-react";
import { useDashboardStore } from "@/stores/dashboard-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/dashboard/community")({
  component: DashboardCommunity,
});

function DashboardCommunity() {
  const forumPosts = useDashboardStore((s) => s.forumPosts);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Student Community</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Connect, discuss, and collaborate with your peers.
          </p>
        </div>
      </div>

      <Tabs defaultValue="forums" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
          <TabsTrigger value="forums">
            <MessageSquare className="mr-2 h-4 w-4" /> Forums
          </TabsTrigger>
          <TabsTrigger value="groups">
            <Users className="mr-2 h-4 w-4" /> Study Groups
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageCircle className="mr-2 h-4 w-4" /> Messages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forums" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Recent Discussions</h2>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> New Topic
            </Button>
          </div>
          
          <div className="grid gap-4">
            {forumPosts.map((post) => (
              <Card key={post.id} className="transition-all hover:bg-accent/40 cursor-pointer">
                <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{post.category}</Badge>
                      <span className="text-xs text-muted-foreground">{post.lastActive}</span>
                    </div>
                    <h3 className="font-semibold text-lg">{post.title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <UserCircle2 className="mr-1 h-4 w-4" />
                      Posted by {post.author}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-sm font-medium">{post.replies} replies</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">My Study Groups</h2>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Create Group
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             <Card>
               <CardHeader>
                 <CardTitle>React Study Circle</CardTitle>
                 <CardDescription>Created by Adaeze Okonkwo</CardDescription>
               </CardHeader>
               <CardContent>
                 <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-background bg-primary text-primary-foreground flex items-center justify-center text-xs">AO</div>
                    <div className="w-8 h-8 rounded-full border-2 border-background bg-secondary text-secondary-foreground flex items-center justify-center text-xs">CE</div>
                    <div className="w-8 h-8 rounded-full border-2 border-background bg-accent text-accent-foreground flex items-center justify-center text-xs">+3</div>
                 </div>
               </CardContent>
               <CardFooter>
                 <Button variant="outline" className="w-full">Open Group Chat</Button>
               </CardFooter>
             </Card>
          </div>
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <Card className="flex h-[500px] flex-col items-center justify-center text-center">
             <div className="rounded-full bg-accent p-4 mb-4">
               <MessageCircle className="h-8 w-8 text-primary" />
             </div>
             <h3 className="text-lg font-semibold">Your Messages</h3>
             <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
               Select a conversation from the sidebar or start a new message to a peer or instructor.
             </p>
             <Button>Start New Conversation</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
