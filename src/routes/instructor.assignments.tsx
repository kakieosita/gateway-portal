import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, FileText, ClipboardCheck, X, Download } from "lucide-react";
import { useInstructorStore } from "@/stores/instructor-store";

export const Route = createFileRoute("/instructor/assignments")({
  component: AssignmentsPage,
});

function AssignmentsPage() {
  const assignments = useInstructorStore((s) => s.assignments);
  const submissions = useInstructorStore((s) => s.submissions);
  const gradeSubmission = useInstructorStore((s) => s.gradeSubmission);
  const [openCreate, setOpenCreate] = useState(false);
  const [openSubmissions, setOpenSubmissions] = useState<string | null>(null);
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [gradeInput, setGradeInput] = useState("");
  const [newAssignment, setNewAssignment] = useState({ title: "", course: "", type: "assignment", dueDate: "" });

  const submit = () => {
    setOpenCreate(false);
    setNewAssignment({ title: "", course: "", type: "assignment", dueDate: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Assignments & Quizzes</h1>
          <p className="mt-1 text-sm text-muted-foreground">{assignments.length} assignments across your courses.</p>
        </div>
        <button
          onClick={() => setOpenCreate(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:shadow-glow"
        >
          <Plus className="h-4 w-4" /> New assignment
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {assignments.map((a) => {
          const submissionRate = Math.round((a.submissions / a.totalStudents) * 100);
          const gradedRate = a.submissions > 0 ? Math.round((a.graded / a.submissions) * 100) : 0;
          const Icon = a.type === "quiz" ? ClipboardCheck : FileText;
          return (
            <article key={a.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-soft">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">{a.type}</span>
                  <h3 className="line-clamp-2 font-display text-base font-bold leading-snug">{a.title}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{a.course}</p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Submissions</span>
                    <span className="font-semibold">{a.submissions}/{a.totalStudents}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-gradient-primary" style={{ width: `${submissionRate}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Graded</span>
                    <span className="font-semibold">{a.graded}/{a.submissions}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-success" style={{ width: `${gradedRate}%` }} />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <span className="text-xs text-muted-foreground">Due {new Date(a.dueDate).toLocaleDateString()}</span>
                <button
                  onClick={() => setOpenSubmissions(a.id)}
                  className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground hover:bg-accent/80"
                >
                  View submissions
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Create modal */}
      {openCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm" onClick={() => setOpenCreate(false)}>
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-card" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">New assignment</h3>
              <button onClick={() => setOpenCreate(false)} className="rounded-lg p-1.5 hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold">Title</label>
                <input
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  placeholder="e.g. Build a CRUD API"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold">Course</label>
                <input
                  value={newAssignment.course}
                  onChange={(e) => setNewAssignment({ ...newAssignment, course: e.target.value })}
                  placeholder="Course name"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold">Type</label>
                  <select
                    value={newAssignment.type}
                    onChange={(e) => setNewAssignment({ ...newAssignment, type: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="assignment">Assignment</option>
                    <option value="quiz">Quiz</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold">Due date</label>
                  <input
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setOpenCreate(false)} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted">
                Cancel
              </button>
              <button onClick={submit} className="rounded-xl bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-soft hover:shadow-glow">
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submissions modal */}
      {openSubmissions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm" onClick={() => setOpenSubmissions(null)}>
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-card shadow-card" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <h3 className="font-display text-lg font-bold">Submissions</h3>
                <p className="text-xs text-muted-foreground">{assignments.find((a) => a.id === openSubmissions)?.title}</p>
              </div>
              <button onClick={() => setOpenSubmissions(null)} className="rounded-lg p-1.5 hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="max-h-96 divide-y divide-border overflow-auto">
              {submissions.filter((s) => s.assignmentId === openSubmissions).map((sub) => (
                <li key={sub.id} className="flex items-center gap-3 p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{sub.studentName}</p>
                    <p className="truncate text-xs text-muted-foreground">{sub.fileName} · {sub.submittedAt}</p>
                  </div>
                  {sub.status === "graded" ? (
                    <span className="rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success">{sub.grade}</span>
                  ) : gradingId === sub.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        autoFocus
                        value={gradeInput}
                        onChange={(e) => setGradeInput(e.target.value)}
                        placeholder="A / 90"
                        className="w-20 rounded-lg border border-border bg-background px-2 py-1 text-xs outline-none focus:border-primary"
                      />
                      <button
                        onClick={() => {
                          if (gradeInput.trim()) {
                            gradeSubmission(sub.id, gradeInput.trim());
                            setGradingId(null);
                            setGradeInput("");
                          }
                        }}
                        className="rounded-lg bg-gradient-primary px-3 py-1 text-xs font-semibold text-primary-foreground"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setGradingId(sub.id);
                        setGradeInput("");
                      }}
                      className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground hover:bg-accent/80"
                    >
                      Grade
                    </button>
                  )}
                  <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted" aria-label="Download">
                    <Download className="h-4 w-4" />
                  </button>
                </li>
              ))}
              {submissions.filter((s) => s.assignmentId === openSubmissions).length === 0 && (
                <li className="p-12 text-center text-sm text-muted-foreground">No submissions yet.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
