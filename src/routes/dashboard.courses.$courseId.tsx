import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Play, CheckCircle2, Circle, ChevronLeft, BookOpen } from "lucide-react";
import { useDashboardStore } from "@/stores/dashboard-store";
import { EmptyState } from "@/components/dashboard/EmptyState";

export const Route = createFileRoute("/dashboard/courses/$courseId")({
  component: CoursePlayer,
});

function CoursePlayer() {
  const { courseId } = useParams({ from: "/dashboard/courses/$courseId" });
  const course = useDashboardStore((s) => s.courses.find((c) => c.id === courseId));
  const toggleLesson = useDashboardStore((s) => s.toggleLesson);
  const [activeLessonId, setActiveLessonId] = useState<string | undefined>(
    course?.lessons.find((l) => !l.completed)?.id ?? course?.lessons[0]?.id,
  );

  if (!course) {
    return (
      <EmptyState
        icon={BookOpen}
        title="Course not found"
        description="The course you're looking for doesn't exist or has been removed."
      />
    );
  }

  const activeLesson = course.lessons.find((l) => l.id === activeLessonId) ?? course.lessons[0];
  const activeIndex = course.lessons.findIndex((l) => l.id === activeLesson.id);

  return (
    <div className="mx-auto max-w-7xl">
      <Link
        to="/dashboard/courses"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Back to courses
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Player */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground shadow-card">
            <div
              className="aspect-video w-full"
              style={{ backgroundImage: course.thumbnail }}
            >
              <div className="flex h-full items-center justify-center bg-foreground/40">
                <button className="flex h-20 w-20 items-center justify-center rounded-full bg-card/95 text-foreground shadow-glow transition hover:scale-110">
                  <Play className="h-8 w-8 fill-current" />
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Lesson {activeIndex + 1} of {course.lessons.length}
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold">{activeLesson.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {course.title} · {activeLesson.duration}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => toggleLesson(course.id, activeLesson.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  activeLesson.completed
                    ? "border border-border bg-card text-muted-foreground hover:text-foreground"
                    : "bg-gradient-primary text-primary-foreground shadow-soft hover:shadow-glow"
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                {activeLesson.completed ? "Mark as incomplete" : "Mark as complete"}
              </button>
              {activeIndex < course.lessons.length - 1 && (
                <button
                  onClick={() => setActiveLessonId(course.lessons[activeIndex + 1].id)}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-accent"
                >
                  Next lesson →
                </button>
              )}
            </div>

            <div className="mt-6 border-t border-border pt-6">
              <h2 className="font-display text-base font-semibold">About this lesson</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                In this lesson you'll explore key concepts and complete a hands-on activity.
                Take notes and pause whenever you need to reflect on the material.
              </p>
            </div>
          </div>
        </div>

        {/* Lesson list */}
        <aside className="rounded-2xl border border-border bg-card p-5 shadow-card lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-auto">
          <div className="mb-4">
            <h2 className="font-display text-base font-bold">Course content</h2>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {course.completedLessons} / {course.totalLessons} lessons
              </span>
              <span className="font-semibold text-foreground">{course.progress}%</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-primary"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>

          <ul className="space-y-1">
            {course.lessons.map((lesson, i) => {
              const isActive = lesson.id === activeLesson.id;
              return (
                <li key={lesson.id}>
                  <button
                    onClick={() => setActiveLessonId(lesson.id)}
                    className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
                      isActive ? "bg-accent" : "hover:bg-muted"
                    }`}
                  >
                    {lesson.completed ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-sm ${isActive ? "font-semibold text-foreground" : "text-foreground/80"}`}>
                        {i + 1}. {lesson.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{lesson.duration}</p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </div>
  );
}
