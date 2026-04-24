import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Check, Upload, X, Plus, FileText, Video, GripVertical, ArrowLeft, ArrowRight } from "lucide-react";
import { useInstructorStore } from "@/stores/instructor-store";

export const Route = createFileRoute("/instructor/courses/new")({
  component: CreateCourse,
});

type Lesson = { id: string; title: string; duration: string };
type UploadedFile = { id: string; name: string; size: number; type: string };

const steps = [
  { id: 1, label: "Course details" },
  { id: 2, label: "Upload content" },
  { id: 3, label: "Lessons & modules" },
  { id: 4, label: "Review & publish" },
];

const thumbs = [
  "linear-gradient(135deg, oklch(0.55 0.18 258), oklch(0.7 0.15 220))",
  "linear-gradient(135deg, oklch(0.6 0.18 320), oklch(0.7 0.15 280))",
  "linear-gradient(135deg, oklch(0.65 0.17 175), oklch(0.6 0.15 220))",
  "linear-gradient(135deg, oklch(0.7 0.18 50), oklch(0.65 0.2 25))",
];

function CreateCourse() {
  const navigate = useNavigate();
  const addCourse = useInstructorStore((s) => s.addCourse);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    level: "Beginner",
    price: "",
    thumbnail: thumbs[0],
  });
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([
    { id: "l1", title: "Welcome & introduction", duration: "8 min" },
  ]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required";
    else if (form.title.length < 5) e.title = "Title must be at least 5 characters";
    if (!form.description.trim()) e.description = "Description is required";
    else if (form.description.length < 20) e.description = "At least 20 characters";
    if (!form.category.trim()) e.category = "Category is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 1 && !validateStep1()) return;
    setStep((s) => Math.min(4, s + 1));
  };
  const back = () => setStep((s) => Math.max(1, s - 1));

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles: UploadedFile[] = Array.from(fileList).map((f, i) => ({
      id: `f${Date.now()}-${i}`,
      name: f.name,
      size: f.size,
      type: f.type,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const addLesson = () => {
    setLessons((prev) => [...prev, { id: `l${Date.now()}`, title: "New lesson", duration: "10 min" }]);
  };
  const removeLesson = (id: string) => setLessons((prev) => prev.filter((l) => l.id !== id));
  const updateLesson = (id: string, patch: Partial<Lesson>) =>
    setLessons((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const publish = (status: "published" | "draft") => {
    addCourse({
      title: form.title,
      category: form.category,
      status,
      thumbnail: form.thumbnail,
      lessons: lessons.length,
    });
    navigate({ to: "/instructor/courses" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Create a new course</h1>
        <p className="mt-1 text-sm text-muted-foreground">Follow the steps to publish your course.</p>
      </div>

      {/* Stepper */}
      <ol className="flex items-center gap-2 overflow-x-auto rounded-2xl border border-border bg-card p-3 shadow-soft">
        {steps.map((s, i) => {
          const active = step === s.id;
          const done = step > s.id;
          return (
            <li key={s.id} className="flex flex-1 items-center gap-2 min-w-fit">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  done
                    ? "bg-success text-success-foreground"
                    : active
                    ? "bg-gradient-primary text-primary-foreground shadow-soft"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : s.id}
              </div>
              <p className={`hidden text-xs font-semibold sm:block ${active ? "text-foreground" : "text-muted-foreground"}`}>
                {s.label}
              </p>
              {i < steps.length - 1 && <div className={`h-px flex-1 ${done ? "bg-success" : "bg-border"}`} />}
            </li>
          );
        })}
      </ol>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-semibold">Course title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Modern React with TypeScript"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold">Description</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="What will students learn?"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              {errors.description && <p className="mt-1 text-xs text-destructive">{errors.description}</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-semibold">Category</label>
                <input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="Web Development"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                {errors.category && <p className="mt-1 text-xs text-destructive">{errors.category}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold">Level</label>
                <select
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold">Price (₦)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="0 for free"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold">Thumbnail style</label>
              <div className="grid grid-cols-4 gap-2">
                {thumbs.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm({ ...form, thumbnail: t })}
                    className={`h-16 rounded-xl border-2 transition ${form.thumbnail === t ? "border-primary shadow-soft" : "border-transparent"}`}
                    style={{ background: t }}
                    aria-label="Select thumbnail"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleFiles(e.dataTransfer.files);
              }}
              onClick={() => inputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition ${
                dragOver ? "border-primary bg-primary/5" : "border-border bg-muted/30 hover:bg-muted/50"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-soft">
                <Upload className="h-5 w-5" />
              </div>
              <p className="mt-3 font-display text-base font-semibold">Drag & drop your files</p>
              <p className="mt-1 text-xs text-muted-foreground">Videos (MP4, MOV) and PDFs · up to 500 MB each</p>
              <input
                ref={inputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>
            {files.length > 0 && (
              <ul className="space-y-2">
                {files.map((f) => {
                  const Icon = f.type.startsWith("video") ? Video : FileText;
                  return (
                    <li key={f.id} className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{f.name}</p>
                        <p className="text-xs text-muted-foreground">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button
                        onClick={() => setFiles((prev) => prev.filter((x) => x.id !== f.id))}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Remove"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-display text-base font-semibold">Lessons ({lessons.length})</p>
              <button
                onClick={addLesson}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-soft hover:shadow-glow"
              >
                <Plus className="h-3.5 w-3.5" /> Add lesson
              </button>
            </div>
            <ul className="space-y-2">
              {lessons.map((l, i) => (
                <li key={l.id} className="flex items-center gap-2 rounded-xl border border-border bg-background p-3">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <span className="w-6 text-xs font-bold text-muted-foreground">{i + 1}</span>
                  <input
                    value={l.title}
                    onChange={(e) => updateLesson(l.id, { title: e.target.value })}
                    className="flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm font-medium outline-none focus:border-border focus:bg-card"
                  />
                  <input
                    value={l.duration}
                    onChange={(e) => updateLesson(l.id, { duration: e.target.value })}
                    className="w-20 rounded-lg border border-transparent bg-transparent px-2 py-1 text-xs text-muted-foreground outline-none focus:border-border focus:bg-card"
                  />
                  <button
                    onClick={() => removeLesson(l.id)}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Remove lesson"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <p className="font-display text-base font-semibold">Review your course</p>
            <div className="overflow-hidden rounded-2xl border border-border">
              <div className="h-32" style={{ background: form.thumbnail }} />
              <div className="space-y-3 p-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">{form.category || "Uncategorized"}</p>
                  <p className="font-display text-lg font-bold">{form.title || "Untitled course"}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{form.description || "No description provided."}</p>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span><b className="text-foreground">{lessons.length}</b> lessons</span>
                  <span><b className="text-foreground">{files.length}</b> files uploaded</span>
                  <span><b className="text-foreground">{form.level}</b></span>
                  <span><b className="text-foreground">{form.price ? `₦${Number(form.price).toLocaleString()}` : "Free"}</b></span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
          <button
            onClick={back}
            disabled={step === 1}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40 hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          {step < 4 ? (
            <button
              onClick={next}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-soft hover:shadow-glow"
            >
              Next <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => publish("draft")}
                className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
              >
                Save as draft
              </button>
              <button
                onClick={() => publish("published")}
                className="rounded-xl bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-soft hover:shadow-glow"
              >
                Publish course
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
