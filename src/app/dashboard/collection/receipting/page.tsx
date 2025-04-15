'use client';

import { useEffect, useState } from "react";
import { Column, DataTable } from "@/components/data-table/data-table";
import formatDate from "@/lib/utils/date";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ReceiptForm from "./blocks/create-receipt";
import { getCollectionList } from "@/lib/actions/collection";
import { Collection } from "@/lib/repositories/collectionRepository";
import { MoneyHelper } from "@/lib/helpers/money-helper";

export default function Receipting ()  {
  const [collections, setCollections] = useState<Collection[]>([])
  const [reload, setReload] = useState(true);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>();

  useEffect(() => {
    (async () => {
      setReload(false);
      setLoading(true);

      const result = await getCollectionList();

      setCollections(result.result);

      setLoading(false);
    })();
  }, [reload]);

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
      id: "customer_phone",
      header: "Phone",
      accessorKey: "customer_phone",
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
        <span>{MoneyHelper.formatPaise(Number(row.amount))}</span>
      )
    },
    {
      id: "customer_address",
      header: "Address",
      accessorKey: "customer_address",
      sortable: true,
      visible: true,
    },
    {
      id: "loan_ref",
      header: "Loan Ref",
      accessorKey: "loan_ref",
      sortable: true,
      visible: true,
    },
    {
      id: "due_date",
      header: "Due Date",
      accessorKey: "due_date",
      sortable: true,
      visible: true,
      cell: (row) => formatDate(row.due_date)
    },
    {
      id: "loan_type",
      header: "Loan Type",
      accessorKey: "loan_type",
      sortable: true,
      visible: true,
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
            Create Receipt
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
            <CardDescription>Create a receipt for Pending Collection</CardDescription>
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
              data={collections}
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