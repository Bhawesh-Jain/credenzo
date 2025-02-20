"use client"

import { DataTable, Column } from "@/components/ui/data-table/data-table"
import formatDate from "@/lib/utils/date"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import AddBranch from "./AddBranch"

interface Branch {
  id: number
  name: string
  code: string
  address: string
  status: "active" | "inactive"
  created_at: string
}

export function BranchList() {
  const [branches, setBranches] = useState<Branch[]>([
    // Temporary dummy data
    {
      id: 1,
      name: "Main Branch",
      code: "MB001",
      address: "123 Main Street",
      status: "active",
      created_at: "2024-03-20"
    },
    {
      id: 2,
      name: "Downtown Branch",
      code: "DB002",
      address: "456 Downtown Ave",
      status: "inactive",
      created_at: "2024-03-21"
    }
  ])

  const columns: Column<Branch>[] = [
    {
      id: "name",
      header: "Branch Name",
      accessorKey: "name",
      sortable: true,
    },
    {
      id: "code",
      header: "Code",
      accessorKey: "code",
      sortable: true,
    },
    {
      id: "address",
      header: "Address",
      accessorKey: "address",
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      sortable: true,
      cell: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            row.status === "active"
              ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
              : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      id: "created_at",
      header: "Created At",
      accessorKey: "created_at",
      cell: (row) => formatDate(row.created_at),
      sortable: true,
    },
    {
      id: "actions",
      header: "Actions",
      accessorKey: "id",
      cell: (row) => (
        <Button variant="ghost" size="sm">
          Edit
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Branches</h2>
        <AddBranch setReload={() => {}} />
      </div>
      <DataTable data={branches} columns={columns} />
    </div>
  )
} 