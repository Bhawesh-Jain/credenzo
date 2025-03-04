import { DefaultTabTrigger, DefaultTabsList } from "@/components/tab/DefaultTabTrigger";
import { Tabs } from "@radix-ui/react-tabs";

export default function CreateProposal() {
  return (
    <div>
      <Tabs>
        <DefaultTabsList>
          <DefaultTabTrigger value="test">Test</DefaultTabTrigger>
          <DefaultTabTrigger value="test2">Test2</DefaultTabTrigger>
        </DefaultTabsList>
      </Tabs>
    </div>
  )
}