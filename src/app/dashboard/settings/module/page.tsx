import { Container } from "@/components/ui/container";
import { getRoles } from "@/lib/actions/settings";

export default async function ModuleSettings() {

  const roles = await getRoles();

  return (
    <Container>
      {roles && roles.result && roles.result.map((role: any) => (
        <div key={role.id}>
          {role.role_name}
        </div>
      ))}
    </Container>
  )
}