"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useState } from "react";

interface Role {
  id: string;
  role_name: string;
  user_count: number;
}

export default function RoleList({ roles }: { roles: Role[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRoles = roles.filter((role: Role) =>
    role.role_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <li key={role.id} className="flex justify-between items-center gap-5 py-2 border p-3 shadow-sm cursor-pointer hover:shadow-md hover:bg-gray-50 rounded-lg">
                  <span className="font-medium">{role.role_name}</span>
                  <span className="text-gray-500">{role.user_count} User{role.user_count > 1 ? 's' : ''}</span>
                </li>
              ))}
            </ul>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75} minSize={40}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold text-base">Select Role</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}