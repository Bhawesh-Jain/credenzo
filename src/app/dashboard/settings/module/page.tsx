import { Container } from "@/components/ui/container";
import { getAllPermissions, getRoles } from "@/lib/actions/settings";
import RoleList from "./RoleList";

export default async function ModuleSettings() {

  const roles = await getRoles();
  const permissions = await getAllPermissions();

  return (
    <Container>
      <RoleList roles={roles.result} permissions={permissions.result} />
    </Container>
  )
}