import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  Search, 
  Plus, 
  Filter, 
  Download, 
  MoreHorizontal,
  CheckCircle2,
  Clock,
  AlertCircle,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminStore } from "@/stores/admin-store";

export const Route = createFileRoute("/admin/finance")({
  component: AdminFinance,
});

function AdminFinance() {
  const { fees, payments, scholarships } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingRevenue = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Management</h1>
          <p className="text-muted-foreground">Track revenue, manage fee structures, and handle scholarships.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Payment
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{pendingRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">12 transactions pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scholarships Granted</CardTitle>
            <GraduationCap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scholarships.length}</div>
            <p className="text-xs text-muted-foreground">₦1.2M in total waivers</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="payments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payments">Payment Tracking</TabsTrigger>
          <TabsTrigger value="fees">Fee Structure</TabsTrigger>
          <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search payments..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
          </div>

          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-xs">{payment.id}</TableCell>
                    <TableCell className="font-medium">{payment.studentName}</TableCell>
                    <TableCell>{payment.programName}</TableCell>
                    <TableCell>₦{payment.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {payment.method.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          payment.status === 'completed' ? 'default' : 
                          payment.status === 'pending' ? 'secondary' : 'destructive'
                        }
                        className="flex w-fit items-center gap-1"
                      >
                        {payment.status === 'completed' && <CheckCircle2 className="h-3 w-3" />}
                        {payment.status === 'pending' && <Clock className="h-3 w-3" />}
                        {payment.status === 'refunded' && <AlertCircle className="h-3 w-3" />}
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{payment.date}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Invoice</DropdownMenuItem>
                          <DropdownMenuItem>Download Receipt</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Refund Payment</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="fees" className="space-y-4">
           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {fees.map(f => (
                <Card key={f.id}>
                   <CardHeader>
                      <CardTitle className="text-base">{f.programName}</CardTitle>
                      <CardDescription>Fee breakdown per cohort</CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-4">
                      <div className="flex justify-between text-sm">
                         <span className="text-muted-foreground">Tuition Fee</span>
                         <span className="font-bold">₦{f.tuitionFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                         <span className="text-muted-foreground">Registration</span>
                         <span className="font-bold">₦{f.registrationFee.toLocaleString()}</span>
                      </div>
                      <div className="pt-2 border-t flex justify-between">
                         <span className="font-semibold">Total</span>
                         <span className="text-lg font-bold text-primary">₦{(f.tuitionFee + f.registrationFee).toLocaleString()}</span>
                      </div>
                   </CardContent>
                   <CardFooter>
                      <Button variant="outline" className="w-full">Edit Fee Structure</Button>
                   </CardFooter>
                </Card>
              ))}
              <Card className="border-dashed flex flex-col items-center justify-center p-6 text-center">
                 <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-2">
                    <Plus className="h-5 w-5 text-muted-foreground" />
                 </div>
                 <h3 className="font-bold text-sm">Add New Program Fee</h3>
                 <p className="text-xs text-muted-foreground mt-1">Define fees for a new educational offering.</p>
                 <Button variant="ghost" className="mt-4 text-xs">Configure now</Button>
              </Card>
           </div>
        </TabsContent>

        <TabsContent value="scholarships" className="space-y-4">
           <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-tight">Active Scholarships</h2>
              <Button size="sm">
                 <Plus className="mr-2 h-4 w-4" /> Grant Waiver
              </Button>
           </div>
           <div className="rounded-md border bg-card">
              <Table>
                 <TableHeader>
                    <TableRow>
                       <TableHead>Student</TableHead>
                       <TableHead>Program</TableHead>
                       <TableHead>Type</TableHead>
                       <TableHead>Discount %</TableHead>
                       <TableHead>Status</TableHead>
                       <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                 </TableHeader>
                 <TableBody>
                    {scholarships.map(s => (
                      <TableRow key={s.id}>
                         <TableCell className="font-medium">{s.studentName}</TableCell>
                         <TableCell>{s.programName}</TableCell>
                         <TableCell className="capitalize">{s.type}</TableCell>
                         <TableCell>
                            <span className="font-bold text-primary">{s.percentage}%</span>
                         </TableCell>
                         <TableCell>
                            <Badge variant={s.status === 'active' ? 'default' : 'secondary'}>
                               {s.status}
                            </Badge>
                         </TableCell>
                         <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Revoke</Button>
                         </TableCell>
                      </TableRow>
                    ))}
                 </TableBody>
              </Table>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
