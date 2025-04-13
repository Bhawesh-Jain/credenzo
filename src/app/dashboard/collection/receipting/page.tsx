'use client';

import { useEffect, useState } from "react";
import { Column, DataTable } from "@/components/data-table/data-table";
import formatDate from "@/lib/utils/date";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { usePathname, useRouter } from "next/navigation";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ReceiptForm from "./blocks/create-receipt";

export default function Receipting ()  {
  const [approvals, setApprovals] = useState<any[]>([])
  const [reload, setReload] = useState(true);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>();

  useEffect(() => {
    (async () => {
      setReload(false);
      setLoading(true);

      // const result = await getApprovedCases();

      // setApprovals(result.result);

      setLoading(false);
    })();
  }, [reload]);

  const columns: Column<any>[] = [
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
      header: "Date",
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
      align: 'center',
      cell: (row) => (
        <Badge variant={'secondary'}  >
          Televerification
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
              setSelectedId(row.id)
              setForm(true)
            }}
          >
            Review
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      {form
        ? <Container>
          <CardHeader>
            <CardTitle>Receipting</CardTitle>
            <CardDescription>Create a receipt for EMI</CardDescription>
          </CardHeader>

          <CardContent>
            <ReceiptForm collectors={[]} onSubmit={() => {}}/>
          </CardContent>
        </Container>

        : <Container>
          <CardHeader>
            <CardTitle>Receipting</CardTitle>
            <CardDescription>Create a receipt for EMI</CardDescription>
          </CardHeader>

          <CardContent>
            <DataTable
              data={approvals}
              columns={columns}
              loading={loading}
              setReload={setReload}
            />
          </CardContent>
        </Container>
      }
    </>
  )
}