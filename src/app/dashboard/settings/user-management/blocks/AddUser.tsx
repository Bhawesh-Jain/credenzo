'use client'

import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/app/loading";
import { useEffect, useState } from "react";
import { DefaultFormSelect, DefaultFormTextField } from "@/components/ui/default-form-field";
import { useUser } from "@/contexts/user-context";
import { createUser, getBranches, getRoles } from "@/lib/actions/settings";
import { Role } from "@/lib/repositories/accessRepository";
import { Branch } from "../../branch-management/blocks/AddBranch";
import { MultiSelect } from "@/components/multi-select";
import { Card, CardContent, CardDescription, CardTitle, CardHeader } from "@/components/ui/card";


const formScheme = z.object({
  employee_code: z.string().min(2, "Add an employee code").max(255, "Employee code must be less than 255 characters"),
  name: z.string().min(2, "Add a name").max(255, "Name must be less than 255 characters"),
  email: z.string().email().max(255, "Email must be less than 255 characters").optional(),
  phone: z.string().max(14, "Phone number must be less than 14 characters").optional(),
  password: z.string().min(4, "Password must be at least 4 characters long"),
  role: z.string().min(1, "Please select a role"),
  branch: z.string().min(1, "Branch must be selected"),
});

export type UserFormValues = z.infer<typeof formScheme>;

export default function AddUser({
  setReload,
  setAddUser,
  currentRole
}: {
  setReload: (reload: boolean) => void,
  setAddUser: (addUser: boolean) => void,
  currentRole: Role
}) {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [branches, setBranches] = useState<{ label: string; value: string }[]>([]);

  const { toast } = useToast();
  const { user } = useUser();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const rolesData = await getRoles();
        const branchesData = await getBranches();

        const formattedRoles = rolesData.result.map((role: Role) => ({
          label: role.role_name,
          value: role.id.toString(),
        }));
        setRoles(formattedRoles);

        const formattedBranches = branchesData.result.map((branch: Branch) => ({
          label: branch.name,
          value: branch.id,
        }));

        setBranches(formattedBranches);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load roles and branches",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);
  const defaultValues: Partial<UserFormValues> = {
    employee_code: `${user.company_abbr}-`,
    name: "",
    email: "",
    phone: "",
    password: "",
    role: currentRole.id.toString(),
    branch: ""
  };

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formScheme),
    defaultValues,
  });

  async function onSubmit(data: UserFormValues) {

    setLoading(true);
    try {
      const result = await createUser(data);
      if (result.success) {
        toast({
          title: "Success",
          description: result.result,
        });
        setAddUser(false);
        setReload(true);
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add User</CardTitle>
        <CardDescription>
          Add a new user to the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading
          ? <Loading />
          : <div className="my-3">
            <Form {...form}>
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
                  <DefaultFormTextField
                    form={form}
                    name="password"
                    label="Password"
                    placeholder="Enter password"
                  />
                </div>
                <DefaultFormSelect
                  form={form}
                  name="role"
                  label="Role"
                  options={roles}
                  placeholder="Select role"
                />
                <FormField
                  control={form.control}
                  name="branch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch</FormLabel>
                      <MultiSelect
                        name={field.name}
                        options={branches}
                        onValueChange={(value) => {
                          field.onChange(value.toString());
                        }}
                        modalPopover={true}
                        placeholder="Select branch"
                        animation={2}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />


                <div className="flex justify-end">
                  <Button type="submit">Add User</Button>
                </div>
              </form>
            </Form>
          </div>}
      </CardContent>
    </Card>
  );
}