'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/app/loading";
import { useEffect, useState } from "react";
import { DefaultFormTextField } from "@/components/ui/default-form-field";
import { useUser } from "@/contexts/user-context";
import { getBranches, getRoles } from "@/lib/actions/settings";
import { Role } from "@/lib/repositories/accessRepository";
import { Branch } from "../../branch-management/blocks/AddBranch";
import { MultiSelect } from "@/components/multi-select";

const formScheme = z.object({
  employee_code: z.string().min(2, "Add a employee code").max(255, "Employee code must be less than 255 characters"),
  name: z.string().min(2, "Add a role name").max(255, "Role name must be less than 255 characters"),
  email: z.string().email("Please enter a valid email address").max(255, "Email must be less than 255 characters").optional(),
  phone: z.string().min(10, "Please enter a valid phone number").max(14, "Phone number must be less than 14 characters").optional(),
  password: z.string(),
  role: z.string().max(255, "Department name must be less than 255 characters"),
  branch: z.string().max(255, "Department name must be less than 255 characters"),
  additional_branch: z.string().max(255, "Department name must be less than 255 characters").optional(),
});

export type FormValues = z.infer<typeof formScheme>;

export default function AddUser({
  setReload
}: {
  setReload: (reload: boolean) => void
}) {
  const [loading, setLoading] = useState(false);

  const [roles, setRoles] = useState<Role[]>([]);

  const [branches, setBranches] = useState<{ label: string; value: string }[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string[]>([]);

  const { toast } = useToast();

  const { user } = useUser();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const rolesData = await getRoles();
      const branchesData = await getBranches();
      setRoles(rolesData.result);
      
      // Transform branches to the required format
      const formattedBranches = branchesData.result.map((branch: Branch) => ({
        label: branch.name,
        value: branch.id,
      }));

      setBranches(formattedBranches);
      setLoading(false);
    })();
  }, []);


  async function onSubmit(data: FormValues) {
    setLoading(true);

    setLoading(false);

  }

  const defaultValues: Partial<FormValues> = {
    employee_code: `${user.company_abbr}-`,
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    branch: "",
    additional_branch: "",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formScheme),
    defaultValues,
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add User</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>
            Add a new user to the system
          </DialogDescription>
        </DialogHeader>
        <div className="my-3">
          {loading ? <Loading /> : <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <DefaultFormTextField
                  form={form}
                  name="employee_code"
                  label="Employee Code"
                  placeholder="Enter employee code"
                />
                <DefaultFormTextField
                  form={form}
                  name="name"
                  label="Name"
                  placeholder="Enter name"
                />
                <DefaultFormTextField
                  form={form}
                  name="email"
                  label="Email"
                  placeholder="Enter email"
                />
                <DefaultFormTextField
                  form={form}
                  name="phone"
                  label="Phone"
                  placeholder="Enter phone"
                />
              </div>
              <MultiSelect
                options={branches}
                onValueChange={setSelectedBranch}
                defaultValue={selectedBranch}
                modalPopover={true}
                placeholder="Select branch"
                animation={2}
              />
              <div className="flex justify-end">
                <Button type="submit">Add User</Button>
              </div>
            </form>
          </Form>}
        </div>
      </DialogContent>
    </Dialog>
  )
}