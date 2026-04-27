import { createFileRoute } from "@tanstack/react-router";
import { Calendar, MapPin, Clock, Star, Users } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/events")({
  component: DashboardEvents,
});

function DashboardEvents() {
  const events = useDashboardStore((s) => s.events);

  const handleRSVP = (title: string) => {
    toast.success(`You have successfully RSVP'd for ${title}!`);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Student Events Board</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Discover and RSVP to upcoming workshops, webinars, and social gatherings.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event.id} className="flex flex-col overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <Badge
                  variant={
                    event.type === "Workshop"
                      ? "default"
                      : event.type === "Webinar"
                      ? "secondary"
                      : "outline"
                  }
                  className="mb-2"
                >
                  {event.type}
                </Badge>
              </div>
              <CardTitle className="text-xl">{event.title}</CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(event.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {event.time}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {event.type === "Webinar" ? "Online" : "UST Main Hall"}
                </div>
              </div>
              <div className="pt-2">
                <div className="flex items-center gap-2 text-sm">
                   <Users className="h-4 w-4 text-primary" />
                   <span className="font-medium">42 students attending</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0 pb-6 px-6">
              <Button className="w-full" onClick={() => handleRSVP(event.title)}>
                RSVP Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {events.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center border rounded-2xl bg-card">
          <Calendar className="h-12 w-12 text-muted-foreground opacity-20" />
          <h3 className="mt-4 font-semibold text-lg">No upcoming events</h3>
          <p className="mt-2 text-sm text-muted-foreground">Check back later for new activities.</p>
        </div>
      )}
    </div>
  );
}
