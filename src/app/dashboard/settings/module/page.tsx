import { Container } from "@/components/ui/container";
import { getRoles } from "@/lib/actions/settings";

export default async function ModuleSettings() {

  const roles = await getRoles();

  return (
    <Container>
      
    </Container>
  )
}