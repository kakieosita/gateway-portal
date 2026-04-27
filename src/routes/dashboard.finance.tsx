import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download, CreditCard, ReceiptText, Wallet, CheckCircle2 } from "lucide-react";
import { useDashboardStore } from "@/stores/dashboard-store";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/finance")({
  component: DashboardFinance,
});

function DashboardFinance() {
  const { invoices, payInvoice } = useDashboardStore();
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalOutstanding = invoices
    .filter((i) => i.status === "pending" || i.status === "overdue")
    .reduce((sum, i) => sum + i.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const handleSimulatePayment = () => {
    if (!selectedInvoice) return;
    
    setIsProcessing(true);
    
    // Simulate Paystack processing delay
    setTimeout(() => {
      payInvoice(selectedInvoice);
      setIsProcessing(false);
      setSelectedInvoice(null);
      toast.success("Payment successful! Receipt has been generated.");
    }, 2000);
  };

  const handleDownloadReceipt = (id: string) => {
    toast.success(`Downloading receipt for invoice ${id}...`);
  };

  const pendingInvoiceDetails = invoices.find(i => i.id === selectedInvoice);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Financial Statements</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your tuition, view fee statements, and make payments online.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card md:col-span-1 flex flex-col justify-center items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <Wallet className="h-8 w-8" />
          </div>
          <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Total Outstanding
          </h3>
          <p className="mt-2 font-display text-3xl font-bold text-foreground">
            {formatCurrency(totalOutstanding)}
          </p>
          <Button 
            className="mt-6 w-full bg-[#0ba4db] hover:bg-[#0ba4db]/90 text-white" 
            disabled={totalOutstanding === 0}
            onClick={() => {
              const firstPending = invoices.find(i => i.status !== "paid");
              if (firstPending) setSelectedInvoice(firstPending.id);
            }}
          >
            <CreditCard className="mr-2 h-4 w-4" /> Pay with Paystack
          </Button>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-card md:col-span-2 overflow-hidden flex flex-col">
          <div className="border-b px-6 py-4 flex justify-between items-center">
            <h3 className="font-semibold text-lg">Fee History & Invoices</h3>
          </div>
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{inv.description}</TableCell>
                    <TableCell>{new Date(inv.date).toLocaleDateString()}</TableCell>
                    <TableCell>{formatCurrency(inv.amount)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          inv.status === "paid"
                            ? "default"
                            : inv.status === "overdue"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {inv.status === "paid" ? (
                        <Button variant="ghost" size="sm" onClick={() => handleDownloadReceipt(inv.id)}>
                          <Download className="mr-2 h-4 w-4" /> Receipt
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedInvoice(inv.id)}
                        >
                          Pay Now
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>
              You are about to make a payment securely via Paystack.
            </DialogDescription>
          </DialogHeader>
          
          {pendingInvoiceDetails && (
            <div className="grid gap-4 py-4">
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Invoice For:</span>
                  <span className="font-medium">{pendingInvoiceDetails.description}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount Due:</span>
                  <span className="font-medium text-lg text-primary">{formatCurrency(pendingInvoiceDetails.amount)}</span>
                </div>
              </div>
              <div className="flex items-center justify-center py-4 text-[#0ba4db] font-bold text-xl">
                Paystack Integration <br /> (Simulation Mode)
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedInvoice(null)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button 
              className="bg-[#0ba4db] hover:bg-[#0ba4db]/90 text-white" 
              onClick={handleSimulatePayment}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Confirm Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
