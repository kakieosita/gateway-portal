import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Mail, MapPin, Phone, Briefcase } from "lucide-react";
import { useInstructorStore } from "@/stores/instructor-store";

export const Route = createFileRoute("/instructor/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const profile = useInstructorStore((s) => s.profile);
  const updateProfile = useInstructorStore((s) => s.updateProfile);
  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [pwdMsg, setPwdMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const initials = profile.name.split(" ").map((n) => n[0]).slice(0, 2).join("");

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const changePwd = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd.next.length < 8) return setPwdMsg({ type: "error", text: "Password must be at least 8 characters." });
    if (pwd.next !== pwd.confirm) return setPwdMsg({ type: "error", text: "Passwords don't match." });
    setPwdMsg({ type: "success", text: "Password updated successfully." });
    setPwd({ current: "", next: "", confirm: "" });
    setTimeout(() => setPwdMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Instructor profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Update your public information and security settings.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-primary text-2xl font-bold text-primary-foreground shadow-soft">
            {initials}
          </div>
          <div className="flex-1">
            <h2 className="font-display text-xl font-bold">{profile.name}</h2>
            <p className="text-sm text-muted-foreground">{profile.title}</p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {profile.email}</span>
              <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {profile.phone}</span>
              <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {profile.location}</span>
              <span className="inline-flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> Joined {profile.joinedAt}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {profile.expertise.map((e) => (
                <span key={e} className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold text-accent-foreground">{e}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={save} className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h3 className="font-display text-lg font-semibold">Personal information</h3>
          <div className="mt-4 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold">Full name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold">Location</label>
                <input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">Bio</label>
              <textarea
                rows={4}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button type="submit" className="rounded-xl bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-soft hover:shadow-glow">
              Save changes
            </button>
            {saved && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
                <Check className="h-3.5 w-3.5" /> Saved
              </span>
            )}
          </div>
        </form>

        <form onSubmit={changePwd} className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h3 className="font-display text-lg font-semibold">Change password</h3>
          <p className="mt-1 text-xs text-muted-foreground">Use a strong password you don't reuse elsewhere.</p>
          <div className="mt-4 space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold">Current password</label>
              <input
                type="password"
                value={pwd.current}
                onChange={(e) => setPwd({ ...pwd, current: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">New password</label>
              <input
                type="password"
                value={pwd.next}
                onChange={(e) => setPwd({ ...pwd, next: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">Confirm new password</label>
              <input
                type="password"
                value={pwd.confirm}
                onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button type="submit" className="rounded-xl bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-soft hover:shadow-glow">
              Update password
            </button>
            {pwdMsg && (
              <span className={`text-xs font-semibold ${pwdMsg.type === "success" ? "text-success" : "text-destructive"}`}>
                {pwdMsg.text}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
