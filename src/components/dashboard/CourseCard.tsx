import { Link } from "@tanstack/react-router";
import { Play, BookOpen, Clock } from "lucide-react";
import type { Course } from "@/lib/dashboard-data";

export function CourseCard({ course }: { course: Course }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition hover:-translate-y-1 hover:shadow-soft">
      <div
        className="relative h-36 w-full"
        style={{ backgroundImage: course.thumbnail }}
      >
        <div className="absolute inset-0 bg-foreground/10" />
        <span className="absolute left-3 top-3 rounded-full bg-card/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground backdrop-blur">
          {course.category}
        </span>
        {course.progress === 100 && (
          <span className="absolute right-3 top-3 rounded-full bg-success px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-success-foreground">
            Completed
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 font-display text-base font-semibold text-foreground">
          {course.title}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">By {course.instructor}</p>

        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            {course.totalLessons} lessons
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {course.duration}
          </span>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-foreground">{course.progress}%</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-primary transition-all"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>

        <Link
          to="/dashboard/courses/$courseId"
          params={{ courseId: course.id }}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition group-hover:shadow-glow"
        >
          <Play className="h-4 w-4 fill-current" />
          {course.progress === 0 ? "Start course" : course.progress === 100 ? "Review" : "Continue"}
        </Link>
      </div>
    </div>
  );
}
