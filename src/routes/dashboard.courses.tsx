import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, BookOpen } from "lucide-react";
import { useDashboardStore } from "@/stores/dashboard-store";
import { CourseCard } from "@/components/dashboard/CourseCard";
import { EmptyState } from "@/components/dashboard/EmptyState";

export const Route = createFileRoute("/dashboard/courses")({
  component: MyCourses,
});

const filters = ["All", "In progress", "Completed", "Not started"] as const;
type Filter = (typeof filters)[number];

function MyCourses() {
  const courses = useDashboardStore((s) => s.courses);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      if (query && !c.title.toLowerCase().includes(query.toLowerCase()) && !c.instructor.toLowerCase().includes(query.toLowerCase())) {
        return false;
      }
      if (filter === "In progress") return c.progress > 0 && c.progress < 100;
      if (filter === "Completed") return c.progress === 100;
      if (filter === "Not started") return c.progress === 0;
      return true;
    });
  }, [courses, query, filter]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">My Courses</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {courses.length} enrolled · keep up the great work.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses or instructors…"
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                filter === f
                  ? "bg-gradient-primary text-primary-foreground shadow-soft"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses found"
          description="Try a different search term or filter to find what you're looking for."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      )}
    </div>
  );
}
