"use client"

import { useEffect, useState } from "react";
import { getLeads } from "@/lib/actions/customer-boarding";
import { Column, DataTable } from "@/components/data-table/data-table";
import formatDate, { formatTime } from "@/lib/utils/date";
import { Button } from "@/components/ui/button";
import CreateLead from "../create-lead/page";
import { Container } from "@/components/ui/container";

type Lead = {
  customer_name: string;
  email: string;
  phone: string;
  loanType: string;
  gender: "Male" | "Female" | "Other";
  amount: number;
  purpose: string;
  term: number;
  meetting_date?: string | undefined;
  meetting_time?: string | undefined;
  notes?: string | undefined;
  status: number;
}

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [reload, setReload] = useState(true);
  const [loading, setLoading] = useState(true);
  const [vis, setVis] = useState(false);


  useEffect(() => {
    (async () => {
      setReload(false);
      setLoading(true);

      const branches = await getLeads();
      setLeads(branches.result);

      setLoading(false);
    })();
  }, [reload]);

  const columns: Column<Lead>[] = [
    {
      id: "customer_name",
      header: "Customer Name",
      accessorKey: "customer_name",
      sortable: true,
      visible: true,
    },
    {
      id: "phone",
      header: "Phone",
      accessorKey: "phone",
      sortable: false,
      visible: true,
    },
    {
      id: "email",
      header: "Email",
      accessorKey: "email",
      sortable: false,
      visible: true,
    },
    {
      id: "loanType",
      header: "Product",
      accessorKey: "loanType",
      sortable: true,
      visible: true,
    },
    {
      id: "date",
      header: "Promised Date",
      accessorKey: "meetting_date",
      sortable: true,
      visible: true,
      cell: (row) => (
        <span>
          {row.meetting_date ? formatDate(row.meetting_date) : "N/A"}
        </span>
      )
    },
    {
      id: "time",
      header: "Promised Time",
      accessorKey: "meetting_time",
      sortable: true,
      visible: true,
      cell: (row) => (
        <span>
          {row.meetting_time ? formatTime(row.meetting_time) : "N/A"}
        </span>
      )
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
          {row.status == 1 ? "Active" : "Inactive"}
        </span>
      ),
    },
  ]

  return (
    <Container>
      <div className="flex justify-between items-center py-3">
        <h2 className="text-2xl font-bold tracking-tight">Leads</h2>
        {vis 
        ? <Button variant='outline' onClick={() => setVis(false)}>Cancel</Button>
        : <Button onClick={() => setVis(true)}>Create Lead</Button>}
      </div>
      {vis
        ? <CreateLead setVis={setVis} setReload={setReload}/>
        : <DataTable data={leads} columns={columns} loading={loading} setReload={setReload} />}
    </Container>
  )
}