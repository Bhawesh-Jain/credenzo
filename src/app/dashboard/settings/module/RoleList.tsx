"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { PermissionItem } from "@/lib/helpers/permission-helper";
import { useState } from "react";
import PermissionTree from "./PermissionTree";

export interface Role {
  id: string;
  role_name: string;
  user_count: number;
  permissions: string;
}

export default function RoleList({ roles, permissions }: { roles: Role[], permissions: PermissionItem[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const filteredRoles = roles.filter((role: Role) =>
    role.role_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClickRole = (role: Role) => {
    setSelectedRole(role);
  }

  return (
    <div className="border rounded-lg">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={30} minSize={20}>
          <div className="flex flex-col gap-2 p-4">
            <div className="flex justify-between items-center gap-5">
              <Input 
                placeholder="Search" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="flex-grow max-w-md"
              />
              <Button>Add Role</Button>
            </div>
            <ul className="mt-2 text-sm">
              {filteredRoles.map((role: Role) => (
                <li onClick={() => handleClickRole(role)} key={role.id} className="flex justify-between items-center gap-5 py-2 border p-3 shadow-sm cursor-pointer hover:shadow-md hover:bg-gray-50 rounded-lg">
                  <span className="font-medium">{role.role_name}</span>
                  <span className="text-gray-500">{role.user_count} User{role.user_count > 1 ? 's' : ''}</span>
                </li>
              ))}
            </ul>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70} minSize={40}>
          {selectedRole && <PermissionTree permissions={permissions} selectedRole={selectedRole} />}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}