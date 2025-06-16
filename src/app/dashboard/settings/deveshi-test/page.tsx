"use client"

import { useEffect, useState } from "react";
import { getVehicles } from "@/lib/actions/settings";
import { Column, DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import CreateVehicle from "./blocks/CreateVehicle";
import EditVehicle from "./blocks/EditVehicle";
import { Container } from "@/components/ui/container";
import { Edit } from "lucide-react";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Vehicle = {
  id: number;
  chassis_number: string;
  make: string;
  model: string;
  company: string;
  status: string | string
}


export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [vehicleId, setVehicleId] = useState<number | null>();
  const [reload, setReload] = useState(true);
  const [loading, setLoading] = useState(true);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    (async () => {
      setReload(false);
      setLoading(true);

      const vehicles_data = await getVehicles();
      setVehicles(vehicles_data.result);

      setLoading(false);
    })();
  }, [reload]);

  const columns: Column<Vehicle>[] = [
    {
      id: "chassis_number",
      header: "Chassis Number",
      accessorKey: "chassis_number",
      sortable: true,
      visible: true,
    },
    {
      id: "make",
      header: "Make",
      accessorKey: "make",
      sortable: false,
      visible: true,
    },
    {
      id: "model",
      header: "Model",
      accessorKey: "model",
      sortable: false,
      visible: true,
    },
    {
      id: "company",
      header: "Company",
      accessorKey: "company",
      sortable: true,
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
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${row.status == "1"
            ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
            : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"
            }`}
        >
          {row.status == "1" ? "Active" : "Inactive"}
        </span>
      ),
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
            setVehicleId(row.id)
            setVis(true)
          }} variant="ghost" size="icon"><Edit /></Button>
        </div>
      ),
    },
  ]

  return (
    <Container>
      <div className="flex justify-between items-center">
        <CardHeader>
          <CardTitle className="text-xl">Vehicles</CardTitle>
        </CardHeader>
          {vis
            ? <Button variant='outline' onClick={() => {
              setVis(false);
              setVehicleId(null);
            }}>Cancel</Button>
            : <Button onClick={() => setVis(true)}>Create Vehicle</Button>}
       
      </div>
      <CardContent>

        {!vis && <DataTable data={vehicles} columns={columns} loading={loading} setReload={setReload} />}
        {vis && !vehicleId && <CreateVehicle setVis={setVis} setReload={setReload} />}
        {vis && vehicleId && <EditVehicle vehicleId={vehicleId} setReload={setReload} setOpen={setVis} />}

      </CardContent>
    </Container>
  )
}

