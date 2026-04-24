import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, ArrowUpDown, Mail } from "lucide-react";
import { useInstructorStore } from "@/stores/instructor-store";

export const Route = createFileRoute("/instructor/students")({
  component: StudentsPage,
});

type SortKey = "name" | "progress" | "lastActive";

function StudentsPage() {
  const students = useInstructorStore((s) => s.students);
  const courses = useInstructorStore((s) => s.courses);
  const [query, setQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = useMemo(() => {
    let result = students.filter((s) => {
      const matchesQuery =
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.email.toLowerCase().includes(query.toLowerCase());
      const matchesCourse = courseFilter === "all" || s.courseId === courseFilter;
      return matchesQuery && matchesCourse;
    });
    result = [...result].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "progress") cmp = a.progress - b.progress;
      else cmp = a.lastActive.localeCompare(b.lastActive);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return result;
  }, [students, query, courseFilter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Students</h1>
        <p className="mt-1 text-sm text-muted-foreground">{filtered.length} of {students.length} students shown.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">All courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3 text-left font-medium">
                  <button onClick={() => toggleSort("name")} className="inline-flex items-center gap-1 hover:text-foreground">
                    Student <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-5 py-3 text-left font-medium">Course</th>
                <th className="px-5 py-3 text-left font-medium">
                  <button onClick={() => toggleSort("progress")} className="inline-flex items-center gap-1 hover:text-foreground">
                    Progress <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-5 py-3 text-left font-medium">Grade</th>
                <th className="px-5 py-3 text-left font-medium">
                  <button onClick={() => toggleSort("lastActive")} className="inline-flex items-center gap-1 hover:text-foreground">
                    Last active <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((s) => {
                const course = courses.find((c) => c.id === s.courseId);
                const initials = s.name.split(" ").map((n) => n[0]).slice(0, 2).join("");
                return (
                  <tr key={s.id} className="hover:bg-muted/30">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-xs font-semibold text-primary-foreground">
                          {initials}
                        </div>
                        <div>
                          <p className="font-medium">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{course?.title ?? "—"}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                          <div className="h-full bg-gradient-primary" style={{ width: `${s.progress}%` }} />
                        </div>
                        <span className="text-xs font-semibold">{s.progress}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      {s.grade ? (
                        <span className="rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success">{s.grade}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">{s.lastActive}</td>
                    <td className="px-5 py-3">
                      <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Email student">
                        <Mail className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <p className="font-display text-base font-semibold">No students match your filters</p>
            <p className="mt-1 text-sm text-muted-foreground">Try clearing the search or course filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
