"use client";

import { useEffect, useState } from "react";
import { Column, DataTable } from "@/components/data-table/data-table";
import formatDate from "@/lib/utils/date";
import { Button, ButtonTooltip } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Edit, PlusCircle } from "lucide-react";
import { Heading } from "@/components/text/heading";
import { CollectionAccount } from "@/lib/repositories/collectionRepository";
import AddProduct from "./AddProduct";
import { getProducts } from "@/lib/actions/settings";
import EditProduct from "./EditProduct";

type FormType = "create" | "edit" | "addCollection";

interface OpenFormProps {
  type: FormType;
  data?: any;
}

export default function ProductList() {
  const [reload, setReload] = useState(true);
  const [loading, setLoading] = useState(true);
  const [productList, setProductList] = useState<CollectionAccount[]>([]);
  const [openForm, setOpenForm] = useState<OpenFormProps | null>(null);

  useEffect(() => {
    (async () => {
      setReload(false);
      setLoading(true);
      const accounts = await getProducts();
      console.log("Collection products", accounts);
      if (accounts.success) {
        setProductList(accounts.result);
      }
      setLoading(false);
    })();
  }, [reload]);

  const columns: Column<CollectionAccount>[] = [
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
      sortable: true,
      visible: true,
    },
    {
      id: "maximum_tenure",
      header: "Maximum Tenure",
      accessorKey: "maximum_tenure",
      sortable: false,
      visible: true,
    },
    {
      id: "minimum_tenure",
      header: "Minimum Tenure",
      accessorKey: "minimum_tenure",
      sortable: true,
      visible: true,
    },
    {
      id: "type",
      header: "Type",
      accessorKey: "type",
      sortable: true,
      visible: true,
      // cell: (row) => (
      //   <span>{row.handler_name ?? 'N/A'}</span>
      // )
    },
    {
      id: "minimum_cibil_score",
      header: "Minimum Cibil Score",
      accessorKey: "minimum_cibil_score",
      sortable: true,
      visible: true,
    },
    {
      id: "age",
      header: "Age",
      accessorKey: "age",
      sortable: true,
      visible: true,
    },
    {
      id: "interest_rate",
      header: "Interest Range",
      accessorKey: "interest_rate",
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
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${row.status === 1
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
      cell: (row) => <span>{row.created_on ? formatDate(row.created_on) : "N/A"}</span>,
    },
    {
      id: "id",
      header: "Actions",
      accessorKey: "id",
      visible: true,
      sortable: false,
      align: "right",
      cell: (row) => (
        <div className="flex justify-end items-end space-x-2">
          <ButtonTooltip
            title={"Edit Collection Account"}
            onClick={() =>
              setOpenForm({ type: "edit", data: row })
            }
            variant="ghost"
            size="icon"
          >
            <Edit />
          </ButtonTooltip>
        
        </div>
      ),
    },
  ];

  return (
    <Container>
      <div className="flex justify-between items-center py-3">
        <Heading>Product List</Heading>
        <div className="space-x-2">
          {openForm
            ? <Button onClick={() => setOpenForm(null)} variant='outline'>Cancel</Button>
            : <Button onClick={() => setOpenForm({ type: "create" })}>Create New Product</Button>}
        </div>
      </div>


      {openForm ? (
        <>
          {openForm.type === "create" && (
            <AddProduct
              setVis={() => setOpenForm(null)}
              setReload={setReload}
            />
          )}
          {openForm.type === "edit" && openForm.data && (
            <EditProduct
              initialData={openForm.data}
              onClose={() => setOpenForm(null)}
              onReload={() => {
                setOpenForm(null);
                setReload(true);
              }}
            />
          )}

        </>
      ) : (
        <DataTable data={productList} columns={columns} loading={loading} setReload={setReload} />
      )}
    </Container>
  );
}

function getStatus(status: number) {
  switch (status) {
    case 1:
      return "Active";
    case 0:
      return "Inactive";
    default:
      return "";
  }
}
