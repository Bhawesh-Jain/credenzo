import React, { useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Settings2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Column<T> {
  id: string
  header: string
  accessorKey: keyof T
  cell?: (row: T) => React.ReactNode
  sortable?: boolean
  filterable?: boolean
  visible?: boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  pageSize?: number
  searchable?: boolean
  className?: string
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns: defaultColumns,
  pageSize = 10,
  searchable = true,
  className,
}: DataTableProps<T>) {
  // State management
  const [columns, setColumns] = useState(defaultColumns)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null
    direction: "asc" | "desc" | null
  }>({ key: null, direction: null })
  const [currentPage, setCurrentPage] = useState(1)

  // Column visibility toggle
  const toggleColumnVisibility = (columnId: string) => {
    setColumns(prev =>
      prev.map(col =>
        col.id === columnId ? { ...col, visible: !col.visible } : col
      )
    )
  }

  // Sorting logic
  const handleSort = (key: keyof T) => {
    setSortConfig(current => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }))
  }

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = [...data]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Sort
    if (sortConfig.key && sortConfig.direction) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key!]
        const bValue = b[sortConfig.key!]

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }

        return sortConfig.direction === "asc"
          ? aValue > bValue
            ? 1
            : -1
          : bValue > aValue
          ? 1
          : -1
      })
    }

    return filtered
  }, [data, searchTerm, sortConfig])

  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize)
  const paginatedData = processedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {searchable && (
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings2 className="mr-2 h-4 w-4" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {columns.map(column => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.visible !== false}
                onCheckedChange={() => toggleColumnVisibility(column.id)}
              >
                {column.header}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className={cn("rounded-md border", className)}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns
                .filter(col => col.visible !== false)
                .map(column => (
                  <TableHead
                    key={column.id}
                    className={cn(column.sortable && "cursor-pointer")}
                    onClick={() =>
                      column.sortable && handleSort(column.accessorKey)
                    }
                  >
                    <div className="flex items-center gap-2">
                      {column.header}
                      {column.sortable && sortConfig.key === column.accessorKey && (
                        {
                          asc: <ChevronUp className="h-4 w-4" />,
                          desc: <ChevronDown className="h-4 w-4" />,
                        }[sortConfig.direction!]
                      )}
                    </div>
                  </TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns
                  .filter(col => col.visible !== false)
                  .map(column => (
                    <TableCell key={column.id}>
                      {column.cell
                        ? column.cell(row)
                        : String(row[column.accessorKey] ?? "")}
                    </TableCell>
                  ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 