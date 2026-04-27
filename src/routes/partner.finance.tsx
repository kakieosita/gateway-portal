import { createFileRoute } from "@tanstack/react-router";
import { 
  CreditCard, 
  Download, 
  Search, 
  Plus, 
  Filter, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  Receipt
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { usePartnerStore } from "@/stores/partner-store";

export const Route = createFileRoute("/partner/finance")({
  component: PartnerFinance,
});

function PartnerFinance() {
  const { invoices } = usePartnerStore();

  const totalOutstanding = invoices
    .filter(i => i.status !== 'paid')
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoicing & Payments</h1>
          <p className="text-muted-foreground">Manage your organizational billing, invoices, and payment history.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline">
              <Receipt className="mr-2 h-4 w-4" /> Billing Support
           </Button>
           <Button>
              <CreditCard className="mr-2 h-4 w-4" /> Make Payment
           </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
         <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">₦{totalOutstanding.toLocaleString()}</div>
               <p className="text-xs text-muted-foreground">Due by next week</p>
            </CardContent>
         </Card>
         <Card>
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium">Last Payment</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">₦1,250,000</div>
               <p className="text-xs text-muted-foreground">Processed Mar 12, 2024</p>
            </CardContent>
         </Card>
         <Card>
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium">Annual Spending</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">₦4.8M</div>
               <div className="flex items-center gap-1.5 mt-1 text-emerald-500 font-bold text-xs">
                  <TrendingUp className="h-3 w-3" /> +12% from previous FY
               </div>
            </CardContent>
         </Card>
      </div>

      <Card>
         <CardHeader>
            <CardTitle className="text-lg">Billing Ledger</CardTitle>
            <CardDescription>All financial transactions between your organization and UST.</CardDescription>
            <div className="flex flex-col gap-4 mt-4 md:flex-row md:items-center">
               <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search by Invoice ID or description..." className="pl-9" />
               </div>
               <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" /> Filter
               </Button>
            </div>
         </CardHeader>
         <CardContent>
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead>Invoice ID</TableHead>
                     <TableHead>Description</TableHead>
                     <TableHead>Amount</TableHead>
                     <TableHead>Issue Date</TableHead>
                     <TableHead>Due Date</TableHead>
                     <TableHead>Status</TableHead>
                     <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {invoices.map(inv => (
                    <TableRow key={inv.id}>
                       <TableCell className="font-mono text-xs">{inv.id}</TableCell>
                       <TableCell className="font-medium">{inv.description}</TableCell>
                       <TableCell className="font-bold">₦{inv.amount.toLocaleString()}</TableCell>
                       <TableCell className="text-xs text-muted-foreground">{inv.date}</TableCell>
                       <TableCell className="text-xs text-muted-foreground">{inv.dueDate}</TableCell>
                       <TableCell>
                          <Badge 
                            variant={
                               inv.status === 'paid' ? 'default' : 
                               inv.status === 'pending' ? 'secondary' : 'destructive'
                            }
                            className="flex w-fit items-center gap-1"
                          >
                             {inv.status === 'paid' && <CheckCircle2 className="h-3 w-3" />}
                             {inv.status === 'pending' && <Clock className="h-3 w-3" />}
                             {inv.status === 'overdue' && <AlertCircle className="h-3 w-3" />}
                             {inv.status}
                          </Badge>
                       </TableCell>
                       <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                             <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Download className="h-4 w-4" />
                             </Button>
                             {inv.status !== 'paid' && (
                               <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                                  Pay <ArrowUpRight className="h-3 w-3" />
                               </Button>
                             )}
                          </div>
                       </TableCell>
                    </TableRow>
                  ))}
               </TableBody>
            </Table>
         </CardContent>
      </Card>
    </div>
  );
}
