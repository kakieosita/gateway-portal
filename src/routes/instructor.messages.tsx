import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Search, Plus, MoreVertical, Paperclip, Smile } from "lucide-react";
import { useInstructorStore } from "@/stores/instructor-store";

export const Route = createFileRoute("/instructor/messages")({
  component: MessagesPage,
});

function MessagesPage() {
  const students = useInstructorStore((s) => s.students);
  const [activeChat, setActiveChat] = useState(students[0]?.id || "");
  const [msg, setMsg] = useState("");

  const currentStudent = students.find(s => s.id === activeChat);

  const mockMessages = [
    { id: "m1", sender: "student", text: "Hello Dr. Okafor, I have a question about the last assignment.", time: "10:30 AM" },
    { id: "m2", sender: "instructor", text: "Hi! I'm happy to help. What specifically is the issue?", time: "10:35 AM" },
    { id: "m3", sender: "student", text: "I'm struggling with the deployment part. The S3 bucket permissions are tricky.", time: "10:40 AM" },
  ];

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h1 className="font-display text-3xl font-bold">Messages</h1>
          <p className="mt-1 text-sm text-muted-foreground">Directly message your students and staff.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:shadow-glow transition">
           <Plus className="h-4 w-4" /> New Chat
        </button>
      </div>

      <div className="flex-1 min-h-0 rounded-2xl border border-border bg-card shadow-card flex overflow-hidden">
         {/* Sidebar */}
         <div className="w-full sm:w-80 border-r border-border flex flex-col">
            <div className="p-4 border-b border-border shrink-0">
               <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search students..."
                    className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-4 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                  />
               </div>
            </div>
            <div className="flex-1 overflow-y-auto">
               {students.slice(0, 10).map((s) => (
                 <button
                   key={s.id}
                   onClick={() => setActiveChat(s.id)}
                   className={`w-full flex items-center gap-3 p-4 text-left transition hover:bg-muted/50 ${activeChat === s.id ? 'bg-primary/5 border-r-4 border-primary' : ''}`}
                 >
                    <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                       {(s?.name || "User").split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0 flex-1">
                       <div className="flex items-center justify-between mb-0.5">
                          <p className="font-semibold text-sm truncate">{s.name}</p>
                          <span className="text-[10px] text-muted-foreground">10:40 AM</span>
                       </div>
                       <p className="text-xs text-muted-foreground truncate italic">I'm struggling with the deployment...</p>
                    </div>
                 </button>
               ))}
            </div>
         </div>

         {/* Chat Area */}
         <div className="hidden sm:flex flex-1 flex-col bg-muted/5">
            {currentStudent ? (
              <>
                 <div className="p-4 border-b border-border bg-card flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                          {(currentStudent?.name || "User").split(' ').map(n => n[0]).join('')}
                       </div>
                       <div>
                          <p className="font-bold text-sm">{currentStudent.name}</p>
                          <p className="text-[10px] text-success font-bold flex items-center gap-1">
                             <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Online
                          </p>
                       </div>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition">
                       <MoreVertical className="h-4 w-4" />
                    </button>
                 </div>

                 <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {mockMessages.map((m) => (
                      <div key={m.id} className={`flex ${m.sender === 'instructor' ? 'justify-end' : 'justify-start'}`}>
                         <div className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-soft ${m.sender === 'instructor' ? 'bg-gradient-primary text-primary-foreground rounded-tr-none' : 'bg-card border border-border rounded-tl-none'}`}>
                            <p className="text-sm leading-relaxed">{m.text}</p>
                            <p className={`text-[10px] mt-1.5 font-medium ${m.sender === 'instructor' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground'}`}>
                               {m.time}
                            </p>
                         </div>
                      </div>
                    ))}
                 </div>

                 <div className="p-4 bg-card border-t border-border shrink-0">
                    <div className="relative flex items-center gap-2">
                       <div className="flex-1 relative">
                          <input
                             value={msg}
                             onChange={(e) => setMsg(e.target.value)}
                             placeholder="Type a message..."
                             className="w-full rounded-2xl border border-border bg-muted/30 py-3 pl-4 pr-20 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                          />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                             <button className="p-1.5 text-muted-foreground hover:text-primary transition"><Paperclip className="h-4 w-4" /></button>
                             <button className="p-1.5 text-muted-foreground hover:text-primary transition"><Smile className="h-4 w-4" /></button>
                          </div>
                       </div>
                       <button className="h-11 w-11 rounded-2xl bg-gradient-primary flex items-center justify-center text-primary-foreground shadow-soft hover:shadow-glow transition">
                          <Send className="h-5 w-5" />
                       </button>
                    </div>
                 </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                 <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Send className="h-8 w-8 opacity-20" />
                 </div>
                 <p className="text-sm font-medium">Select a student to start messaging</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
