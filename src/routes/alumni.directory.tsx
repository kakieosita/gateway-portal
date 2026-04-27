import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { 
  Search, 
  Filter, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  UserPlus, 
  MessageSquare,
  MoreVertical,
  Check
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAlumniStore } from "@/stores/alumni-store";

export const Route = createFileRoute("/alumni/directory")({
  component: AlumniDirectory,
});

function AlumniDirectory() {
  const { alumni, connections, connectWithAlumni } = useAlumniStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAlumni = alumni.filter(person => 
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.program.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alumni Directory</h1>
          <p className="text-muted-foreground">Find and connect with fellow UST graduates across the globe.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, program, or industry..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            <Filter className="mr-2 h-4 w-4" /> All Filters
          </Button>
          <Button variant="ghost" size="sm" className="whitespace-nowrap">Class of 2023</Button>
          <Button variant="ghost" size="sm" className="whitespace-nowrap">Tech Stream</Button>
          <Button variant="ghost" size="sm" className="whitespace-nowrap">Lagos, Nigeria</Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAlumni.map((person) => (
          <Card key={person.id} className="group overflow-hidden flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="h-14 w-14 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-primary text-xl font-bold">
                   {person.name.charAt(0)}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Report User</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="pt-2">
                <CardTitle className="text-lg leading-tight">{person.name}</CardTitle>
                <CardDescription className="flex items-center gap-1.5 mt-1">
                  <Briefcase className="h-3 w-3" /> {person.role} at {person.company}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4 pt-0">
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  <span>{person.program} • Class of {person.gradYear}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>{person.location}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {person.skills.map(skill => (
                  <Badge key={skill} variant="secondary" className="text-[10px] py-0">{skill}</Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t bg-muted/5 group-hover:bg-muted/10 transition-colors gap-2">
              <Button 
                variant={connections.includes(person.id) ? "outline" : "default"} 
                className="flex-1 gap-2 text-xs"
                onClick={() => connectWithAlumni(person.id)}
              >
                {connections.includes(person.id) ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Connected
                  </>
                ) : (
                  <>
                    <UserPlus className="h-3.5 w-3.5" /> Connect
                  </>
                )}
              </Button>
              <Button variant="ghost" size="icon" className="shrink-0 h-9 w-9">
                <MessageSquare className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredAlumni.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
           <Search className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
           <h3 className="text-lg font-bold">No results found</h3>
           <p className="text-sm text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
           <Button variant="link" onClick={() => setSearchTerm("")}>Clear search</Button>
        </div>
      )}
    </div>
  );
}
