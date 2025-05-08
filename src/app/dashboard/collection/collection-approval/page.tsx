'use client';

import { useEffect, useState } from "react";
import { Column, DataTable } from "@/components/data-table/data-table";
import formatDate, { formatDateTime } from "@/lib/utils/date";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getApprovalPendingCollectionList } from "@/lib/actions/collection";
import { Collection } from "@/lib/repositories/collectionRepository";
import { encryptId } from "@/lib/utils/crypto";
import { cn, getStatusColor } from "@/lib/utils";

export default function Receipting() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [reload, setReload] = useState(true);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(false);
  const [selectedId, setSelectedId] = useState<number>();

  useEffect(() => {
    (async () => {
      setReload(false);
      setLoading(true);

      const result = await getApprovalPendingCollectionList();

      setLoading(false);

      if (result.success) {
        setCollections(result.result);
      }
    })();
  }, [reload]);

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    
  };

  const columns: Column<Collection>[] = [
    {
      id: "id",
      header: "Receipt #",
      accessorKey: "id",
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
      id: "handler_name",
      header: "Receiptor Name",
      accessorKey: "receiptor_name",
      sortable: true,
      visible: true,
    },
    {
      id: "amount",
      header: "Amount",
      accessorKey: "amount",
      sortable: true,
      visible: true,
      cell: (row) => (
        <span>{row.amount}</span>
      )
    },
    {
      id: "loan_ref",
      header: "Loan Ref",
      accessorKey: "loan_ref",
      sortable: true,
      visible: true,
    },
    {
      id: "submission_date",
      header: "Submission Date",
      accessorKey: "receipt_on",
      sortable: true,
      visible: true,
      cell: (row) => formatDateTime(row.receipt_on)
    },
    {
      id: "actions",
      header: "Actions",
      accessorKey: "id",
      align: 'right',
      visible: true,
      cell: (row) => (
        <div className="flex gap-2 justify-end">
        <Button size="sm" variant="outline" onClick={() => handleAction(row.id, 'approve')}>
          Approve
        </Button>
        <Button size="sm" variant="destructive" onClick={() => handleAction(row.id, 'reject')}>
          Reject
        </Button>
      </div>
      ),
    },
  ]

  return (
    <>
      <Container>
        <CardHeader>
          <CardTitle>Receipt Approvals</CardTitle>
          <CardDescription>Review and approve or reject incoming receipts</CardDescription>
        </CardHeader>

        <CardContent>
          <DataTable
            data={collections}
            columns={columns}
            loading={loading}
            setReload={setReload}
          />
        </CardContent>
      </Container>
    </>
  )
}