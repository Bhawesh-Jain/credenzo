'use client'

import { Column, DataTable } from "@/components/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { getApplicationsList } from "@/lib/actions/applications";
import { getProcessName } from "@/lib/helpers/string-helper";
import { Application } from "@/lib/repositories/applicationsRepository";
import formatDate from "@/lib/utils/date";
import { useEffect, useState } from "react";

export default function QueuePage() {
  const [approvals, setApprovals] = useState<Application[]>([])
  const [reload, setReload] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setReload(false);
      setLoading(true);

      const result = await getApplicationsList();

      setApprovals(result.result);

      console.log(result.result);

      setLoading(false);
    })();
  }, [reload]);

  const columns: Column<Application>[] = [
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
          {getProcessName(row.current_process)} Pending
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
      <CardHeader>
        <CardTitle>Queue</CardTitle>
        <CardDescription>Current Application Queue</CardDescription>
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
  );
}