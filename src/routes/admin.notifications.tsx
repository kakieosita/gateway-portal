import { createFileRoute } from "@tanstack/react-router";
import { Send, BellRing, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/admin/notifications")({
  component: AdminNotifications,
});

const recentAnnouncements = [
  {
    id: 1,
    title: "Platform Maintenance",
    target: "All Users",
    date: "Mar 12, 2024",
    channels: ["In-App", "Email"],
    status: "Sent",
  },
  {
    id: 2,
    title: "New Course Available: React Advanced",
    target: "Students",
    date: "Mar 10, 2024",
    channels: ["In-App"],
    status: "Sent",
  },
  {
    id: 3,
    title: "Instructor Meeting Reminder",
    target: "Instructors",
    date: "Mar 08, 2024",
    channels: ["Email"],
    status: "Sent",
  },
];

function AdminNotifications() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications Center</h1>
          <p className="text-muted-foreground">
            Send announcements and manage communications with your users.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Send New Announcement</CardTitle>
            <CardDescription>
              Compose a message to send out via in-app notification or email.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="target">Target Audience</Label>
              <Select defaultValue="all">
                <SelectTrigger id="target">
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="students">Students Only</SelectItem>
                  <SelectItem value="instructors">Instructors Only</SelectItem>
                  <SelectItem value="specific">Specific Program...</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Notification Title</Label>
              <Input id="title" placeholder="e.g., System Maintenance Scheduled" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message Content</Label>
              <Textarea 
                id="message" 
                placeholder="Type your message here..." 
                className="min-h-[150px]"
              />
            </div>

            <div className="space-y-4 pt-2">
              <Label>Delivery Channels</Label>
              <div className="flex items-center space-x-2">
                <Switch id="in-app" defaultChecked />
                <Label htmlFor="in-app" className="flex items-center cursor-pointer">
                  <BellRing className="mr-2 h-4 w-4" /> In-App Notification
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="email" />
                <Label htmlFor="email" className="flex items-center cursor-pointer">
                  <Mail className="mr-2 h-4 w-4" /> Email Blast
                </Label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <Button variant="ghost">Save Draft</Button>
            <Button>
              <Send className="mr-2 h-4 w-4" /> Send Now
            </Button>
          </CardFooter>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Sent</CardTitle>
            <CardDescription>Your past communication history.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentAnnouncements.map((item) => (
                <div key={item.id} className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{item.title}</span>
                    <span className="text-xs text-muted-foreground flex items-center">
                      <CheckCircle2 className="mr-1 h-3 w-3 text-emerald-500" />
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Target: {item.target}</span>
                    <span>{item.date}</span>
                  </div>
                  <div className="flex gap-1 pt-1">
                    {item.channels.map(channel => (
                      <span key={channel} className="text-[10px] px-2 py-0.5 bg-secondary rounded-full">
                        {channel}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
