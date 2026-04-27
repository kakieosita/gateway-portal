import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, BookOpen, Clock, Users, Star } from "lucide-react";
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

export const Route = createFileRoute("/dashboard/catalog")({
  component: CourseCatalog,
});

const availableCourses = [
  {
    id: "cat1",
    title: "Advanced Go Programming",
    instructor: "David Nwachukwu",
    category: "Backend",
    duration: "10 weeks",
    students: 120,
    rating: 4.8,
    price: "₦45,000",
    image: "linear-gradient(135deg, oklch(0.6 0.2 145), oklch(0.7 0.16 175))",
  },
  {
    id: "cat2",
    title: "Product Management 101",
    instructor: "Grace Okafor",
    category: "Management",
    duration: "6 weeks",
    students: 340,
    rating: 4.9,
    price: "₦30,000",
    image: "linear-gradient(135deg, oklch(0.7 0.18 50), oklch(0.65 0.2 25))",
  },
  {
    id: "cat3",
    title: "Blockchain Foundations",
    instructor: "Tolu Ojo",
    category: "Web3",
    duration: "8 weeks",
    students: 85,
    rating: 4.7,
    price: "₦55,000",
    image: "linear-gradient(135deg, oklch(0.55 0.18 258), oklch(0.7 0.15 220))",
  },
];

function CourseCatalog() {
  const [query, setQuery] = useState("");

  const handleEnroll = (title: string) => {
    toast.success(`Successfully enrolled in ${title}`);
  };

  const filtered = availableCourses.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase()) || 
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Course Catalog</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse and enroll in new programs to advance your career.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or category..."
          className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((course) => (
          <Card key={course.id} className="flex flex-col overflow-hidden">
            <div className="h-32 w-full" style={{ background: course.image }} />
            <CardHeader>
              <div className="flex items-start justify-between">
                <Badge variant="secondary" className="mb-2">{course.category}</Badge>
                <div className="flex items-center text-sm font-medium text-amber-500">
                  <Star className="mr-1 h-3.5 w-3.5 fill-current" />
                  {course.rating}
                </div>
              </div>
              <CardTitle className="line-clamp-1">{course.title}</CardTitle>
              <CardDescription>Instructor: {course.instructor}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="mr-1.5 h-4 w-4" />
                  {course.duration}
                </div>
                <div className="flex items-center">
                  <Users className="mr-1.5 h-4 w-4" />
                  {course.students} students
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t bg-muted/20 px-6 py-4">
              <span className="font-bold text-foreground">{course.price}</span>
              <Button onClick={() => handleEnroll(course.title)}>Enroll Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 font-semibold">No courses found</h3>
          <p className="mt-2 text-sm text-muted-foreground">Try adjusting your search query.</p>
        </div>
      )}
    </div>
  );
}
