"use client"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus } from "lucide-react"
import { useState } from "react"

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
      status: "active",
      created_at: "2024-03-21"
    }
  ])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Branches</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Branch
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Branch Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {branches.map((branch) => (
              <TableRow key={branch.id}>
                <TableCell className="font-medium">{branch.name}</TableCell>
                <TableCell>{branch.code}</TableCell>
                <TableCell>{branch.address}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    branch.status === 'active' 
                      ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' 
                      : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
                  }`}>
                    {branch.status}
                  </span>
                </TableCell>
                <TableCell>{new Date(branch.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 