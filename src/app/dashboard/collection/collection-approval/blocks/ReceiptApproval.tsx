'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import formatDate, { formatDateTime } from '@/lib/utils/date';
import { Separator } from '@/components/ui/separator';
import { CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getReceiptById, handleReceiptApproval } from '@/lib/actions/collection';
import { Receipt } from '@/lib/repositories/collectionRepository';

interface ReceiptApprovalDialogProps {
  receiptId: number;
  onClose: () => void;
  onDecision: () => void;
}

export default function ReceiptApprovalDialog({ receiptId, onClose, onDecision }: ReceiptApprovalDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [receipt, setReceipt] = useState<Receipt>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      if (!receiptId) return;
      setLoading(true);

      const res = await getReceiptById(receiptId.toString());

      if (res.success) {
        setReceipt(res.result);
      } else {
        toast({ variant: 'destructive', title: 'Error loading receipt', description: res.error });
        onClose();
      }
      setLoading(false);
    })();
  }, [receiptId]);

  const handleDecision = async (decision: 'approve' | 'rejecte') => {
    setSubmitting(true);

    const res = await handleReceiptApproval(decision, receiptId);
    
    setSubmitting(false);
    
    if (res.success) {
      toast({ title: `Receipt ${decision}d`, description: `Receipt has been ${decision}d successfully.` });
      onDecision();
      onClose();
    } else {
      toast({ variant: 'destructive', title: `Approval failed`, description: res.error });
    }
  };
  
  if (!receipt) return null;

  return (
    <Dialog open={!!receiptId} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Receipt Approval</span>
            <Badge variant="outline" className="border-primary">
              #{receipt.id}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center">Loading receipt...</div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <DetailItem label="Customer" value={receipt.customer_name} />
              <DetailItem label="Loan Ref" value={receipt.ref} />
              <DetailItem label="Amount" value={`₹ ${receipt.amount.toLocaleString()}`} />
              <DetailItem label="Payment Date" value={formatDate(receipt.payment_date)} />
              {receipt.utr_number && <DetailItem label="UTR #" value={receipt.utr_number} />}
              <DetailItem label="Method" value={receipt.payment_method} />
              <DetailItem label="Branch" value={receipt.branch_name} />
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-semibold">Timeline</h4>
              <div className="relative">
                <div className="relative flex justify-between py-4">
                  {[
                    { label: 'Created', date: receipt.created_on, status: 'completed' },
                    { label: 'Collected', date: receipt.receipt_on, status: receipt.status > 0 ? 'completed' : 'current' },
                    { label: receipt.approval_status != 0 ? receipt.status_name : 'Approval', date: receipt.approved_on, status: receipt.approval_status != 0 ? 'completed' : 'current' },
                  ].map((step, i) => (
                    <>
                      <div key={i} className="flex flex-col items-center text-center min-w-[100px] gap-2">
                        <div className={cn(
                          'relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2',
                          step.status === 'completed' ? 'bg-success border-success' : step.status === 'current' ? 'bg-primary border-primary animate-pulse' : 'bg-background border-border'
                        )}
                        >
                          {step.status === 'completed' && <CheckIcon className="w-4 h-4 text-white" />}
                        </div>
                        <div className="space-y-1 mt-2">
                          <p className="text-xs text-muted-foreground">{step.date ? formatDateTime(step.date) : 'N/A'}</p>
                          <p className="text-sm font-medium">{step.label}</p>
                        </div>
                      </div>
                    </>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button variant="destructive" onClick={() => handleDecision('rejecte')} disabled={submitting}>
                Reject
              </Button>
              <Button onClick={() => handleDecision('approve')} disabled={submitting}>
                Approve
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function DetailItem({ label, value }: { label: string; value: string | React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <dd className="font-medium text-sm">{value}</dd>
    </div>
  );
}
