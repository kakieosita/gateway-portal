import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Plus, Search, MoreHorizontal, Download, Clock, Filter, Trash, UploadCloud, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Papa from "papaparse";
import { db, secondaryAuth, storage } from "@/lib/firebase";
import { usersCollection } from "@/lib/db/collections";
import { onSnapshot, doc, setDoc, deleteDoc, updateDoc, Timestamp, query, orderBy } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { User, UserRole } from "@/lib/db/schema";
import { demoUserStore } from "@/lib/demo-users";
import { toast } from "sonner";

const hasFirebaseCredentials =
  typeof import.meta.env.VITE_FIREBASE_API_KEY === "string" &&
  import.meta.env.VITE_FIREBASE_API_KEY.startsWith("AIza") &&
  !import.meta.env.VITE_FIREBASE_API_KEY.includes("Demo") &&
  Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID);

function isFirebaseConfigError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return (
    !hasFirebaseCredentials ||
    message.includes("api-key") ||
    message.includes("auth/invalid-api-key") ||
    message.includes("auth/configuration-not-found")
  );
}

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<UserRole>("student");
  const [searchQuery, setSearchQuery] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  // Add User Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student" as UserRole,
  });
  const [contractFile, setContractFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch users in real-time
    const q = query(usersCollection, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedUsers = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as User));
      setUsers(fetchedUsers);
    });
    return () => unsubscribe();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.role === activeTab &&
      (u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!hasFirebaseCredentials) {
        // Demo mode: simulate user creation locally
        const mockUser: User = {
          id: `demo-${Date.now()}`,
          email: formData.email,
          displayName: formData.name,
          photoURL: null,
          role: formData.role,
          status: "Active",
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };
        setUsers((prev) => [mockUser, ...prev]);
        toast.success(`${formData.name} added (demo mode — backend not configured)`);
        setIsAddModalOpen(false);
        setFormData({ name: "", email: "", password: "", role: activeTab });
        setContractFile(null);
        setIsSubmitting(false);
        return;
      }

      // 1. Create in Firebase Auth (Secondary app to avoid logout)
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, formData.email, formData.password);
      const uid = userCredential.user.uid;

      // 2. Update Profile
      await updateProfile(userCredential.user, { displayName: formData.name });

      // 3. Save to Firestore first to ensure user exists even if upload fails
      const newUser: User = {
        id: uid,
        email: formData.email,
        displayName: formData.name,
        photoURL: null,
        role: formData.role,
        status: "Active",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      
      await setDoc(doc(usersCollection, uid), newUser);

      // 4. Handle Instructor Contract Upload (if applicable)
      if (formData.role === "instructor" && contractFile) {
        try {
          const storageRef = ref(storage, `contracts/${uid}/${contractFile.name}`);
          await uploadBytes(storageRef, contractFile);
          const contractUrl = await getDownloadURL(storageRef);
          
          // Update the document with the contract URL
          await updateDoc(doc(usersCollection, uid), { contractUrl });
        } catch (uploadError: any) {
          console.error("Contract upload failed:", uploadError);
          toast.warning(`User ${formData.name} created, but contract upload failed.`);
          
          // Cleanup modal state anyway
          setIsAddModalOpen(false);
          setFormData({ name: "", email: "", password: "", role: activeTab });
          setContractFile(null);
          setIsSubmitting(false);
          return;
        }
      }
      

      toast.success(`${formData.name} added successfully!`);
      setIsAddModalOpen(false);
      setFormData({ name: "", email: "", password: "", role: activeTab });
      setContractFile(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to add user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleUserStatus = async (user: User) => {
    const newStatus = user.status === "Suspended" ? "Active" : "Suspended";
    try {
      await updateDoc(doc(usersCollection, user.id), { status: newStatus, updatedAt: Timestamp.now() });
      toast.success(`User marked as ${newStatus}`);
    } catch (error: any) {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? (They will be removed from Firestore but remain in Auth due to platform restrictions)")) return;
    try {
      await deleteDoc(doc(usersCollection, userId));
      toast.success("User deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete user");
    }
  };

  const handleBulkImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportProgress(0);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as any[];
        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const name = row.Name || row.name;
          const email = row.Email || row.email;
          const role = (row.Role || row.role || activeTab).toLowerCase() as UserRole;
          
          if (!name || !email) {
            errorCount++;
            continue;
          }

          try {
            // Password defaults to Welcome123!
            const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, "Welcome123!");
            const uid = userCredential.user.uid;
            await updateProfile(userCredential.user, { displayName: name });

            const newUser: User = {
              id: uid,
              email,
              displayName: name,
              photoURL: null,
              role,
              status: "Active",
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now(),
            };

            await setDoc(doc(usersCollection, uid), newUser);
            successCount++;
          } catch (error) {
            console.error(`Error importing ${email}:`, error);
            errorCount++;
          }

          setImportProgress(Math.round(((i + 1) / rows.length) * 100));
        }

        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
        toast.success(`Import complete! ${successCount} added, ${errorCount} failed.`);
      },
      error: (error) => {
        toast.error("Failed to parse CSV file: " + error.message);
        setIsImporting(false);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
          <p className="text-muted-foreground">
            Manage your platform's users, roles, and permissions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isImporting}>
            <Download className="mr-2 h-4 w-4 rotate-180" /> {isImporting ? `Importing ${importProgress}%` : 'Bulk Import'}
          </Button>
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept=".csv" 
            onChange={handleBulkImport}
          />
          
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddUser} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Temporary Password</Label>
                  <Input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Minimum 6 characters" minLength={6} />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={formData.role} onValueChange={(val: UserRole) => setFormData({...formData, role: val})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="instructor">Instructor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="partner">Partner</SelectItem>
                      <SelectItem value="alumni">Alumni</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {formData.role === "instructor" && (
                  <div className="space-y-2 p-4 border border-border rounded-lg bg-muted/30">
                    <Label>Instructor Contract (Optional)</Label>
                    <Input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setContractFile(e.target.files?.[0] || null)} />
                    <p className="text-xs text-muted-foreground mt-1">Upload the signed contract for this instructor.</p>
                  </div>
                )}
                
                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Clock className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isSubmitting ? "Creating..." : "Create User"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isImporting && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 flex items-center justify-between animate-pulse">
           <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-primary animate-spin" />
              <p className="text-sm font-medium">Processing bulk import... {importProgress}%</p>
           </div>
           <p className="text-xs text-muted-foreground">Uploading users sequentially to Firebase</p>
        </div>
      )}

      <Tabs defaultValue="student" onValueChange={(val) => setActiveTab(val as UserRole)}>
        <div className="flex items-center justify-between gap-4 mb-4">
          <TabsList>
            <TabsTrigger value="student">Students</TabsTrigger>
            <TabsTrigger value="instructor">Instructors</TabsTrigger>
            <TabsTrigger value="admin">Admins</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2 flex-1 max-w-sm ml-auto">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search users by name or email..." className="pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
        </div>

        <TabsContent value={activeTab} className="m-0">
          <div className="rounded-md border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  {activeTab === "instructor" && <TableHead>Contract</TableHead>}
                  <TableHead>Date Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.map((user) => (
                  <TableRow key={user.id} className="group">
                    <TableCell className="font-medium">{user.displayName || "Unknown"}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "default" : "secondary"} className="capitalize">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "Active" || !user.status
                            ? "default"
                            : "destructive"
                        }
                      >
                        {user.status || "Active"}
                      </Badge>
                    </TableCell>
                    {activeTab === "instructor" && (
                      <TableCell>
                        {user.contractUrl ? (
                          <a href={user.contractUrl} target="_blank" rel="noreferrer" className="text-primary text-sm flex items-center hover:underline">
                            <UploadCloud className="h-3 w-3 mr-1" /> View
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-xs">No contract</span>
                        )}
                      </TableCell>
                    )}
                    <TableCell className="text-muted-foreground">
                      {user.createdAt && (user.createdAt as any).toDate 
                        ? (user.createdAt as any).toDate().toLocaleDateString()
                        : "N/A"
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" /> Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-warning cursor-pointer" onClick={() => toggleUserStatus(user)}>
                             {user.status === 'Suspended' ? 'Unsuspend User' : 'Suspend User'}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive cursor-pointer" onClick={() => handleDeleteUser(user.id)}>
                            <Trash className="mr-2 h-4 w-4" /> Delete Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" disabled>
          Previous
        </Button>
        <Button variant="outline" size="sm">
          Next
        </Button>
      </div>
    </div>
  );
}
