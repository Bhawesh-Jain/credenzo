"use client"

import Loading from "@/app/loading";
import { Container } from "@/components/ui/container";
import { getRoles } from "@/lib/actions/settings";
import { Role } from "@/lib/repositories/accessRepository";
import { useState, useEffect } from "react";
import RoleList from "./blocks/RoleList";
import EmptyList from "@/components/ui/empty-list";
import UserList from "./blocks/UserList";

export default function UserManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(true);

  useEffect(() => {
    (async () => {
      setReload(false);
      setLoading(true);
      const rolesData = await getRoles();
      setRoles(rolesData.result);
      setSelectedRole(rolesData.result.find((role: Role) => role.id === selectedRole?.id) || null);
      setLoading(false);
    })();
  }, [reload]);


  return (
    <Container>
      {loading
        ? <Loading />
        : <div className="flex flex-col md:flex-row border rounded-lg ">
          <div className="md:w-1/3 border-b md:border-r md:border-b-0">
            <RoleList setReload={setReload} roles={roles} selectedRole={selectedRole} setSelectedRole={setSelectedRole} />
          </div>
          <div className="md:w-2/3">
            {selectedRole
              ? <UserList role={selectedRole} />
              : <EmptyList text="No role selected" />}
          </div>
        </div>}
    </Container>
  )
}
