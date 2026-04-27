import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageSquare, Users, Search, Filter, MessageCircle, MoreVertical, Shield, Reply } from "lucide-react";
import { useInstructorStore } from "@/stores/instructor-store";

export const Route = createFileRoute("/instructor/community")({
  component: CommunityPage,
});

function CommunityPage() {
  const courses = useInstructorStore((s) => s.courses);
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.id || "");
  const [query, setQuery] = useState("");

  const discussions = [
    { id: "d1", title: "Difficulty with Week 3 Exercise", author: "Adaeze Okonkwo", replies: 12, time: "2h ago", tags: ["question", "help"], urgent: true },
    { id: "d2", title: "Project Team Formation", author: "Tunde Bakare", replies: 45, time: "5h ago", tags: ["teamwork"], urgent: false },
    { id: "d3", title: "Feedback on Node.js Module", author: "Aisha Ibrahim", replies: 8, time: "Yesterday", tags: ["feedback"], urgent: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Community Boards</h1>
          <p className="mt-1 text-sm text-muted-foreground">Monitor and participate in course discussion forums.</p>
        </div>
        <div className="flex gap-2">
           <select 
             value={selectedCourse} 
             onChange={(e) => setSelectedCourse(e.target.value)}
             className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20 transition"
           >
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
           </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
         <div className="lg:col-span-1 space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
               <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Board Categories</h2>
               <nav className="space-y-1">
                  <button className="w-full flex items-center justify-between p-2 rounded-lg bg-primary/5 text-primary text-xs font-bold transition">
                     <span>General Q&A</span>
                     <span className="bg-primary/10 px-1.5 rounded-full">24</span>
                  </button>
                  <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted text-muted-foreground text-xs font-semibold transition">
                     <span>Announcements</span>
                     <span className="bg-muted px-1.5 rounded-full">2</span>
                  </button>
                  <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted text-muted-foreground text-xs font-semibold transition">
                     <span>Resource Sharing</span>
                     <span className="bg-muted px-1.5 rounded-full">18</span>
                  </button>
                  <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted text-muted-foreground text-xs font-semibold transition">
                     <span>Projects</span>
                     <span className="bg-muted px-1.5 rounded-full">56</span>
                  </button>
               </nav>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
               <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Moderation Stats</h2>
               <div className="space-y-4">
                  <div>
                     <p className="text-[10px] uppercase font-bold text-muted-foreground">Response Rate</p>
                     <p className="text-xl font-bold text-primary">94%</p>
                  </div>
                  <div>
                     <p className="text-[10px] uppercase font-bold text-muted-foreground">Pending Approval</p>
                     <p className="text-xl font-bold text-warning">0</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="lg:col-span-3 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
               <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search discussions..."
                    className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-4 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                  />
               </div>
               <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold shadow-soft hover:bg-accent transition">
                  <Filter className="h-3.5 w-3.5" /> Latest
               </button>
            </div>

            <div className="space-y-3">
               {discussions.map((d) => (
                 <div key={d.id} className={`rounded-2xl border bg-card p-5 shadow-card transition ${d.urgent ? 'border-destructive/30' : 'border-border'}`}>
                    <div className="flex items-start justify-between gap-4">
                       <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1.5">
                             {d.urgent && <span className="bg-destructive/10 text-destructive text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">Urgent</span>}
                             {d.tags.map(t => <span key={t} className="bg-muted text-muted-foreground text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">{t}</span>)}
                          </div>
                          <h3 className="font-display text-lg font-bold hover:text-primary cursor-pointer transition">{d.title}</h3>
                          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                             <span className="font-semibold text-foreground">{d.author}</span>
                             <span>·</span>
                             <span>{d.time}</span>
                             <span>·</span>
                             <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> {d.replies} replies</span>
                          </div>
                       </div>
                       <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition">
                          <MoreVertical className="h-4 w-4" />
                       </button>
                    </div>
                    <div className="mt-4 flex gap-2">
                       <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-accent py-2 text-xs font-semibold text-accent-foreground hover:bg-accent/80 transition">
                          <Reply className="h-3.5 w-3.5" /> Reply
                       </button>
                       <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-muted transition">
                          <Shield className="h-3.5 w-3.5" /> Moderate
                       </button>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
