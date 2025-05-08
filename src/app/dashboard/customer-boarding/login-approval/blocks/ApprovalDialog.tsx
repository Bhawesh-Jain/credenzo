'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getApprovalDetails, processApproval } from "@/lib/actions/customer-boarding";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import {
  UserIcon,
  LandmarkIcon,
  FileTextIcon,
  PcCase,
  CheckIcon
} from "lucide-react";
import formatDate, { formatDateTime } from "@/lib/utils/date";
import { cn } from "@/lib/utils";
import capitalizeWord from "@/lib/helpers/string-helper";

export default function ApprovalDialog({
  approvalId,
  onClose,
  onDecision
}: {
  approvalId: number,
  onClose: () => void,
  onDecision: () => void
}) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [approval, setApproval] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      if (approvalId) {
        setLoading(true);
        const result = await getApprovalDetails(approvalId);

        if (result.success) {
          setApproval(result.result);
        } else {
          toast({
            variant: "destructive",
            title: "Error loading details",
            description: result.error
          });
          onClose();
        }
        setLoading(false);
      }
    })();
  }, [approvalId]);

  const handleDecision = async (decision: 'approve' | 'reject') => {
    setSubmitting(true);
    const result = await processApproval(approvalId, decision);
    setSubmitting(false);

    if (result.success) {
      toast({
        title: `Proposal ${decision}ed`,
        description: `The loan proposal has been ${decision}ed successfully`
      });
      onDecision();
      onClose();
    } else {
      toast({
        variant: "destructive",
        title: `Approval failed`,
        description: result.error
      });
    }
  };

  if (!approval) return null;

  return (
    <Dialog open={!!approvalId} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Review Proposal</span>
            <Badge variant="outline" className="border-primary">
              {approval.prop_no}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center">Loading details...</div>
        ) : (
          <div className="grid gap-6">
            {/* Applicant Section */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <UserIcon className="w-5 h-5 mt-1 text-muted-foreground" />
                <div>
                  <h4 className="font-semibold mb-2">Applicant Details</h4>
                  <dl className="grid grid-cols-2 gap-y-3 gap-x-4">
                    <DetailItem label=" Name" value={approval.customer_name} />
                    <DetailItem label="Contact" value={approval.phone} />
                    <DetailItem label="PAN Number" value={approval.pan} />
                    <DetailItem label="Email" value={approval.email} />
                    <DetailItem label="Date of Birth" value={approval.dob} />
                  </dl>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <PcCase className="w-5 h-5 mt-1 text-muted-foreground" />
                <div>
                  <h4 className="font-semibold mb-2">Income Details</h4>
                  <dl className="grid grid-cols-2 gap-y-3 gap-x-4">
                    <DetailItem label="Employment Type" value={capitalizeWord(approval.income_emp_type)} />
                    <DetailItem label="Entity Name" value={approval.income_entity_name} />
                    <DetailItem label="Income Amount" value={`₹${approval.income_amount?.toLocaleString()}`} />
                    <DetailItem label="Income Frequence" value={approval.income_freq} />
                    <DetailItem label="Address" value={approval.income_address} />
                    <DetailItem label="Contact" value={approval.income_contact} />
                  </dl>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid md:grid-cols-2 gap-4">
              {approval.userAddress && <div className="flex items-start gap-3">
                <UserIcon className="w-5 h-5 mt-1 text-muted-foreground" />
                <div>
                  <h4 className="font-semibold mb-2">Applicant Address</h4>
                  <dl className="grid grid-cols-2 gap-y-3 gap-x-4">
                    <DetailItem label=" Address Line 1" value={approval.userAddress.line_1} />
                    {approval.userAddress.line_2 && <DetailItem label=" Address Line 2" value={approval.userAddress.line_2} />}
                    {approval.userAddress.line_3 && <DetailItem label=" Address Line 3" value={approval.userAddress.line_3} />}
                    <DetailItem label="Landmark" value={approval.userAddress.landmark} />
                    <DetailItem label="Pincode" value={approval.userAddress.pincode} />
                    <DetailItem label="City" value={approval.userAddress.city} />
                    <DetailItem label="State" value={approval.userAddress.state} />
                  </dl>
                </div>
              </div>}

              <div className="flex items-start gap-3">
                <LandmarkIcon className="w-5 h-5 mt-1 text-muted-foreground" />
                <div>
                  <h4 className="font-semibold mb-2">Loan Details</h4>
                  <dl className="grid grid-cols-2 gap-y-3 gap-x-4">
                    <DetailItem label="Customer Type" value={approval.customer_type} />
                    <DetailItem label="Amount" value={`₹${approval.loan_amount?.toLocaleString()}`} />
                    <DetailItem label="Product" value={approval.product_name} />
                    <DetailItem label="Purpose" value={approval.loan_purpose} />
                  </dl>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-semibold">Application Timeline</h4>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2" />

                <div className="relative flex justify-between gap-4 overflow-x-auto py-4">
                  {[
                    {
                      label: "Applied",
                      date: approval.login_date,
                      status: "completed",
                    },
                    {
                      label: "Lead Process",
                      date: approval.process.log_lead,
                      status: approval.process.log_lead ? "completed" : "current",
                    },
                    {
                      label: "KYC Process",
                      date: approval.process.log_kyc,
                      status: approval.process.log_kyc ? "completed" : "pending",
                    },
                    {
                      label: "Proposal",
                      date: approval.process.log_proposal,
                      status: approval.process.log_proposal ? "completed" : "pending",
                    },
                    {
                      label: "Current Stage",
                      status: approval.status,
                      date: approval.updated_on,
                      current: true,
                    },
                  ].map((step, index, arr) => (
                    <div
                      key={index}
                      className="flex flex-col items-center gap-2 min-w-[120px] text-center"
                    >

                      <div className="relative flex items-center justify-center w-full">
                        {index > 0 && (
                          <div className="absolute right-full w-[calc(100%+8px)] h-px bg-border" />
                        )}
                        <div className={cn(
                          "w-8 h-8 rounded-full border-2 relative z-10 flex justify-center items-center",
                          step.status === "completed"
                            ? "bg-success border-success"
                            : step.status === "current"
                              ? "bg-primary border-primary animate-pulse"
                              : "bg-background border-border"
                        )}>
                          {step.status === "completed" && (
                            <CheckIcon className="w-5 h-5 text-white z-10" />
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-2 mt-3">
                        <p className="text-xs text-muted-foreground">
                          {step.date ? formatDateTime(step.date) : "N/A"}
                        </p>
                        <h4 className="text-sm font-medium">
                          {step.label}
                        </h4>
                        {step.label === "Current Stage" && (
                          <Badge
                            variant={
                              approval.status === "approved" ? "success" :
                                approval.status === "rejected" ? "destructive" : "secondary"
                            }
                            className="mt-1 text-xs"
                          >
                            {approval.status_label}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <Separator />

            {/* Documents & Status Section */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <FileTextIcon className="w-5 h-5 mt-1 text-muted-foreground" />
                <div className="space-y-2">
                  <h4 className="font-semibold">Documents</h4>
                  <div className="space-y-1">
                    {approval.documents && approval.documents.length > 0
                      ? approval.documents?.map((doc: any) => (
                        <div key={doc.id} className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">{doc.type}:</span>
                          <Button variant="link" size="sm" className="h-auto p-0">
                            {doc.name}
                          </Button>
                        </div>
                      ))
                      : <p className="text-sm text-muted-foreground">No Documents Uploaded</p>
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                variant="destructive"
                onClick={() => handleDecision('reject')}
                disabled={submitting}
              >
                Reject Proposal
              </Button>
              <Button
                onClick={() => handleDecision('approve')}
                disabled={submitting}
              >
                Approve Loan
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function DetailItem({ label, value, variant = 'vertical' }: { variant?: 'vertical' | 'horizontal'; label: string; value: string | React.ReactNode }) {
  return (
    <div className={cn(
      "text-sm ",
      variant === 'vertical'
        ? 'flex flex-col'
        : 'flex gap-2'
    )}>
      <dt className="text-muted-foreground">{label}{variant === 'horizontal' && ':'}</dt>
      <dd className="font-medium">{value ? value : 'N/A'}</dd>
    </div>
  );
}