import { Container } from "@/components/ui/container";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { getRoles } from "@/lib/actions/settings";
import RoleList from "./RoleList";

export default async function ModuleSettings() {

  const roles = await getRoles();

  return (
    <Container>
      <RoleList roles={roles.result} />
    </Container>
  )
}