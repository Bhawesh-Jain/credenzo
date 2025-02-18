"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PermissionItem } from "@/lib/helpers/permission-helper";
import { Container } from "@/components/ui/container";
import { Role } from "./RoleList";


export default function PermissionTree({ permissions, selectedRole }: { permissions: PermissionItem[], selectedRole: Role }) {
  const rolePermissions = selectedRole.permissions.split(',');

  const [updatedPermissions, setUpdatedPermissions] = useState<PermissionItem[]>(permissions);

  const handleCheckboxChange = (id: number, checked: boolean) => {
    const updatePermission = (perms: PermissionItem[]): PermissionItem[] => {
      return perms.map((perm) => {
        if (perm.id === id) {
          return { ...perm, checked };
        }
        if (perm.items) {
          return { ...perm, children: updatePermission(perm.items) };
        }
        return perm;
      });
    };

    setUpdatedPermissions(updatePermission(updatedPermissions));
  };
  const renderPermissions = (perms: PermissionItem[]) => {
    return perms.map((perm) => (
      <div key={perm.id} className="ml-4 w-full">
        <div className="flex items-center space-x-2 p-1 text-sm">
          <Checkbox id={perm.id.toString()}
            checked={perm.checked}
            onCheckedChange={(checked) => handleCheckboxChange(perm.id, checked === true)} />
          <label
            htmlFor={perm.id.toString()}
            className="text-sm leading-none cursor-pointer peer-disabled:opacity-70">
            {perm.title}
          </label>
        </div>
        {perm.items && <div>{renderPermissions(perm.items)}</div>}
      </div>
    ));
  };

  return (
    <Container>
      <h2 className="text-lg font-semibold">Permission Tree</h2>
      <div>{renderPermissions(updatedPermissions)}</div>
      <Button className="mt-4">Save Changes</Button>
    </Container>
  );

}
