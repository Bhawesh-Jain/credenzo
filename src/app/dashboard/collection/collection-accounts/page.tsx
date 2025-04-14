"use client";

import { useEffect, useState } from "react";
import { Column, DataTable } from "@/components/data-table/data-table";
import formatDate from "@/lib/utils/date";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Edit, PlusCircle } from "lucide-react";
import CreateAccount from "./blocks/CreateAccount";
import EditAccount from "./blocks/EditAccount";
import AddCollection from "./blocks/AddCollection"; 
import { Heading } from "@/components/text/heading";
import { CollectionAccount } from "@/lib/repositories/collectionRepository";
import { getAccountList } from "@/lib/actions/collection";

// Define the possible form types
type FormType = "create" | "edit" | "addCollection";

interface OpenFormProps {
  type: FormType;
  data?: any;
}

export default function CollectionAccounts() {
  const [reload, setReload] = useState(true);
  const [loading, setLoading] = useState(true);
  const [vis, setVis] = useState(false); // Use this if you still want to show/hide the create form as default
  const [collectionAccounts, setCollectionAccounts] = useState<CollectionAccount[]>([]);
  
  // New state to keep track of which form is open (create, edit, or addCollection)
  const [openForm, setOpenForm] = useState<OpenFormProps | null>(null);

  useEffect(() => {
    (async () => {
      setReload(false);
      setLoading(true);
      const accounts = await getAccountList();
      if (accounts.success) {
        setCollectionAccounts(accounts.result);
      }
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
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            row.status === 1
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
        <div className="flex space-x-2">
          <Button
            onClick={() =>
              setOpenForm({ type: "edit", data: row })
            }
            variant="ghost"
            size="icon"
          >
            <Edit />
          </Button>
          <Button
            onClick={() =>
              // Open the addCollection form, for example passing the row if needed
              setOpenForm({ type: "addCollection", data: row })
            }
            variant="ghost"
            size="icon"
          >
            <PlusCircle />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Container>
      <div className="flex justify-between items-center py-3">
        <Heading>Collection Accounts</Heading>
        <div className="space-x-2">
          <Button onClick={() => setOpenForm({ type: "create" })}>Create New Account</Button>
        </div>
      </div>


      {openForm ? (
        <>
          {openForm.type === "create" && (
            <CreateAccount
              setVis={() => setOpenForm(null)}
              setReload={setReload}
            />
          )}
          {openForm.type === "edit" && openForm.data && (
            <EditAccount
              initialData={openForm.data}
              onClose={() => setOpenForm(null)}
              onReload={() => {
                setOpenForm(null);
                setReload(true);
              }}
            />
          )}
          {openForm.type === "addCollection" && openForm.data && (
            <AddCollection
              accountData={openForm.data}
              onClose={() => setOpenForm(null)}
              onReload={() => {
                setOpenForm(null);
                setReload(true);
              }}
            />
          )}
        </>
      ) : (
        <DataTable data={collectionAccounts} columns={columns} loading={loading} setReload={setReload} />
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
