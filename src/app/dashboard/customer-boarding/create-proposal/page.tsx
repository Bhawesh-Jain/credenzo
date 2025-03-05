import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import PersonalDetails from "./blocks/Applicant"

export default function TabsDemo() {
  return (
    <Tabs defaultValue="personal">
      <TabsList className="gap-4 flex w-fit">
        <TabsTrigger value="personal">Personal Details</TabsTrigger>
        <TabsTrigger value="address">Adress Details</TabsTrigger>
        <TabsTrigger value="income">Income Details</TabsTrigger>
        <TabsTrigger value="loan">Loan Details</TabsTrigger>
      </TabsList>
      <TabsContent value="personal">
        <PersonalDetails />
      </TabsContent>
      <TabsContent value="password">
      </TabsContent>
    </Tabs>
  )
}
