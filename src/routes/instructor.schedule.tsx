import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, Clock, MapPin, Video, Plus, X, Check, Search } from "lucide-react";
import { useInstructorStore } from "@/stores/instructor-store";

export const Route = createFileRoute("/instructor/schedule")({
  component: SchedulePage,
});

function SchedulePage() {
  const schedules = useInstructorStore((s) => s.schedules);
  const addSchedule = useInstructorStore((s) => s.addSchedule);
  const courses = useInstructorStore((s) => s.courses);
  
  const [openCreate, setOpenCreate] = useState(false);
  const [newSession, setNewSession] = useState({
    title: "",
    courseId: courses[0]?.id || "",
    date: new Date().toISOString().split("T")[0],
    time: "10:00",
    type: "virtual" as "virtual" | "physical",
    location: "",
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addSchedule(newSession);
    setOpenCreate(false);
    setNewSession({
      title: "",
      courseId: courses[0]?.id || "",
      date: new Date().toISOString().split("T")[0],
      time: "10:00",
      type: "virtual",
      location: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Class Schedule</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your physical and virtual class sessions.</p>
        </div>
        <button
          onClick={() => setOpenCreate(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:shadow-glow transition"
        >
          <Plus className="h-4 w-4" /> Schedule Session
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-lg font-semibold mb-4">Upcoming Sessions</h2>
            <div className="space-y-3">
              {schedules.map((s) => {
                const course = courses.find(c => c.id === s.courseId);
                return (
                  <div key={s.id} className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-muted/20 hover:bg-muted/40 transition">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${s.type === 'virtual' ? 'bg-primary/10 text-primary' : 'bg-mint/10 text-mint'}`}>
                      {s.type === 'virtual' ? <Video className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm truncate">{s.title}</h3>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase">{course?.category}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">{course?.title}</p>
                      <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {s.date}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {s.time}</span>
                        <span className="flex items-center gap-1 truncate"><MapPin className="h-3 w-3" /> {s.location}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <button className="p-2 rounded-lg hover:bg-accent text-muted-foreground transition"><X className="h-4 w-4" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="font-display text-lg font-semibold mb-4">Calendar Preview</h2>
              <div className="aspect-square rounded-xl bg-muted/30 flex items-center justify-center border border-dashed border-border">
                 <p className="text-xs text-muted-foreground text-center p-6">Full calendar integration with drag-and-drop coming soon.</p>
              </div>
           </div>

           <div className="rounded-2xl bg-gradient-primary p-6 text-primary-foreground shadow-glow">
              <h3 className="font-display font-bold text-lg mb-2">Virtual Classes</h3>
              <p className="text-xs opacity-90 leading-relaxed">Ensure your meeting links are updated at least 30 minutes before the session starts.</p>
              <button className="mt-4 w-full rounded-xl bg-white/20 py-2 text-xs font-semibold backdrop-blur-md hover:bg-white/30 transition">
                 Sync with Google Calendar
              </button>
           </div>
        </div>
      </div>

      {openCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm" onClick={() => setOpenCreate(false)}>
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-card" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Schedule New Session</h3>
              <button onClick={() => setOpenCreate(false)} className="rounded-lg p-1.5 hover:bg-muted transition">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold">Session Title</label>
                <input
                  required
                  value={newSession.title}
                  onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                  placeholder="e.g. Workshop on Design Patterns"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold">Course</label>
                <select
                  value={newSession.courseId}
                  onChange={(e) => setNewSession({ ...newSession, courseId: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold">Date</label>
                  <input
                    type="date"
                    required
                    value={newSession.date}
                    onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold">Time</label>
                  <input
                    type="time"
                    required
                    value={newSession.time}
                    onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold">Session Type</label>
                <div className="grid grid-cols-2 gap-2">
                   <button
                     type="button"
                     onClick={() => setNewSession({...newSession, type: 'virtual'})}
                     className={`py-2 rounded-xl border text-xs font-bold transition ${newSession.type === 'virtual' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-background'}`}
                   >Virtual</button>
                   <button
                     type="button"
                     onClick={() => setNewSession({...newSession, type: 'physical'})}
                     className={`py-2 rounded-xl border text-xs font-bold transition ${newSession.type === 'physical' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-background'}`}
                   >Physical</button>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold">{newSession.type === 'virtual' ? 'Meeting Link' : 'Location / Room'}</label>
                <input
                  required
                  value={newSession.location}
                  onChange={(e) => setNewSession({ ...newSession, location: e.target.value })}
                  placeholder={newSession.type === 'virtual' ? 'https://zoom.us/...' : 'Hall B-12'}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button type="button" onClick={() => setOpenCreate(false)} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted transition">
                  Cancel
                </button>
                <button type="submit" className="rounded-xl bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-soft hover:shadow-glow transition">
                  Schedule Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
