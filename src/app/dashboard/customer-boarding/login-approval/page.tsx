'use client';

import { useEffect, useState } from "react";
import { getPendingApprovals } from "@/lib/actions/customer-boarding";
import { Column, DataTable } from "@/components/data-table/data-table";
import formatDate from "@/lib/utils/date";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import ApprovalDialog from "./blocks/ApprovalDialog";

type LoanApproval = {
  id: number;
  prop_no: string;
  customer_name: string;
  loan_amount: number;
  product_name: string;
  branch_name: string;
  login_date: string;
  status_label: string;
  handler_name: string;
}

export default function Approvals() {
  const [approvals, setApprovals] = useState<LoanApproval[]>([])
  const [selectedId, setSelectedId] = useState<number>();
  const [reload, setReload] = useState(true);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    (async () => {
      setReload(false);
      setLoading(true);

      const result = await getPendingApprovals();
      
      setApprovals(result.result);

      setLoading(false);
    })();
  }, [reload]);

  const columns: Column<LoanApproval>[] = [
    {
      id: "prop_no",
      header: "Proposal #",
      accessorKey: "prop_no",
      sortable: true,
      visible: true,
    },
    {
      id: "customer_name",
      header: "Applicant Name",
      accessorKey: "customer_name",
      sortable: true,
      visible: true,
    },
    {
      id: "loan_amount",
      header: "Loan Amount",
      accessorKey: "loan_amount",
      sortable: true,
      visible: true,
      cell: (row) => (
        <span>₹{row.loan_amount.toLocaleString()}</span>
      )
    },
    {
      id: "product_name",
      header: "Product",
      accessorKey: "product_name",
      sortable: true,
      visible: true,
    },
    {
      id: "branch_name",
      header: "Branch",
      accessorKey: "branch_name",
      sortable: true,
      visible: true,
    },
    {
      id: "handler_name",
      header: "Added By",
      accessorKey: "handler_name",
      sortable: true,
      visible: true,
    },
    {
      id: "login_date",
      header: "Submitted Date",
      accessorKey: "login_date",
      sortable: true,
      visible: true,
      cell: (row) => formatDate(row.login_date)
    },
    {
      id: "status_label",
      header: "Status",
      accessorKey: "status_label",
      sortable: true,
      visible: true,
      cell: (row) => (
        <Badge 
          variant={
            row.status_label.toLocaleLowerCase() === 'approved' ? 'success' :
            row.status_label.toLocaleLowerCase() === 'rejected' ? 'destructive' : 'secondary'
          }
        >
          {row.status_label.toUpperCase()}
        </Badge>
      )
    },
    {
      id: "actions",
      header: "Actions",
      accessorKey: "id",
      align: 'right',
      visible: true,
      cell: (row) => (
        <div className="flex gap-2 justify-end">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setSelectedId(row.id);
              setDialogOpen(true);
            }}
          >
            Review
          </Button>
        </div>
      ),
    },
  ]

  return (
    <Container>
      <div className="flex justify-between items-center py-3">
        <h2 className="text-2xl font-bold tracking-tight">Loan Approvals</h2>
        <div className="flex gap-2">
          <Button variant="outline">Export Report</Button>
        </div>
      </div>

      <DataTable 
        data={approvals} 
        columns={columns} 
        loading={loading} 
        setReload={setReload}
      />

      {dialogOpen && selectedId && (
        <ApprovalDialog 
          approvalId={selectedId}
          onClose={() => setDialogOpen(false)}
          onDecision={() => setReload(true)}
        />
      )}
    </Container>
  )
}