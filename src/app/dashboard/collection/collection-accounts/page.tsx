"use client"

import { useEffect, useState } from "react";
import { getLeads } from "@/lib/actions/customer-boarding";
import { Column, DataTable } from "@/components/data-table/data-table";
import formatDate, { formatTime } from "@/lib/utils/date";
import { Button, ButtonTooltip } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Edit, Edit2 } from "lucide-react";
import CreateAccount from "./blocks/CreateAccount";
import { Heading } from "@/components/text/heading";
import { CollectionAccount } from "@/lib/repositories/collectionRepository";

export default function CollectionAccounts() {
  const [reload, setReload] = useState(true);
  const [loading, setLoading] = useState(true);
  const [vis, setVis] = useState(false);
  const [open, setOpen] = useState(false);
  const [collectionAccounts, setCollectionAccounts] = useState<CollectionAccount[]>([]);
  const [id, setId] = useState<string>();

  useEffect(() => {
    (async () => {
      setReload(false);
      setLoading(true);

      const branches = await getLeads();


      setLoading(false);
    })();
  }, [reload]);

  const columns: Column<CollectionAccount>[] = [
    {
      id: "customer_name",
      header: "Customer Name",
      accessorKey: "customer_name",
      sortable: true,
      visible: true,
    },
    {
      id: "customer_phone",
      header: "Phone",
      accessorKey: "customer_phone",
      sortable: false,
      visible: true,
    },
    {
      id: "loan_ref",
      header: "Loan Id",
      accessorKey: "loan_ref",
      sortable: true,
      visible: true,
    },
    {
      id: "lendor_name",
      header: "Lendor",
      accessorKey: "lendor_name",
      sortable: true,
      visible: true,
    },
    {
      id: "customer_address",
      header: "Address",
      accessorKey: "customer_address",
      sortable: false,
      visible: true,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      visible: true,
      sortable: true,
      cell: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${row.status == 1
            ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
            : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"
            }`}
        >
          {getStatus(row.status)}
        </span>
      ),
    },
    {
      id: "created_on",
      header: "Added On",
      accessorKey: "created_on",
      sortable: true,
      visible: true,
      cell: (row) => (
        <span>
          {row.created_on ? formatDate(row.created_on) : "N/A"}
        </span>
      )
    },
    {
      id: "id",
      header: "Actions",
      accessorKey: "id",
      visible: true,
      sortable: false,
      align: 'right',
      cell: (row) => (
        <div>
          <Button onClick={() => {
            setId(row.loan_ref)
            setOpen(!open)
          }} variant="ghost" size="icon"><Edit /></Button>
        </div>
      ),
    },
  ]

  return (
    <Container>
      <div className="flex justify-between items-center py-3">
        <Heading>Collection Accounts</Heading>
        {vis
          ? <Button variant='outline' onClick={() => setVis(false)}>Cancel</Button>
          : <Button onClick={() => setVis(true)}>Create New Account</Button>}
      </div>
      {vis
        ? <CreateAccount setVis={setVis} setReload={setReload} />
        : <DataTable data={collectionAccounts} columns={columns} loading={loading} setReload={setReload} />}


    </Container>
  )
}

function getStatus(status: number) {
  var s = '';
  switch (status) {
    case 1:
      s = 'Active'
      break;

    case 0:
      s = 'Inactive'
      break;

    default:
      break;
  }

  return s;
}
