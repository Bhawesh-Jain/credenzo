'use client';

import { useEffect, useState } from "react";
import { Column, DataTable } from "@/components/data-table/data-table";
import { formatDateTime } from "@/lib/utils/date";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getBankingCases } from "@/lib/actions/applications";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QueueItem } from "@/lib/repositories/applicationsRepository";
import BankAccountsManager from "./blocks/BankingTab";

export default function BankingPage() {
  const [items, setItems] = useState<QueueItem[]>([])
  const [reload, setReload] = useState(true);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState<QueueItem | null>();

  useEffect(() => {
    (async () => {
      setReload(false);
      setLoading(true);

      const result = await getBankingCases();

      setItems(result.result);

      setLoading(false);
    })();
  }, [reload]);

  const columns: Column<QueueItem>[] = [
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
      header: "Handler",
      accessorKey: "handler_name",
      sortable: true,
      visible: true,
    },
    {
      id: "date",
      header: "Date",
      accessorKey: "date",
      sortable: true,
      noWrap: true,
      visible: true,
      cell: (row) => formatDateTime(row.date)
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
              setSelectedRow(row)
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
      {form && selectedRow
        ? <Container>
          <CardHeader>
            <CardTitle>Banking</CardTitle>
            <CardDescription>Enter Customer Bank Information</CardDescription>
          </CardHeader>

          <CardContent>
            <BankAccountsManager loanDetails={selectedRow} setForm={setForm} />
          </CardContent>
        </Container>

        : <Container>
          <CardHeader>
            <CardTitle>Banking</CardTitle>
            <CardDescription>Cases Awaiting Banking Details</CardDescription>
          </CardHeader>

          <CardContent>
            <DataTable
              data={items}
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