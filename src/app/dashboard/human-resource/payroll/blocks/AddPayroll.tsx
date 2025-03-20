'use client'

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/app/dashboard/loading";
import { useEffect, useState } from "react";
import { DefaultFormSelect, DefaultFormTextField } from "@/components/ui/default-form-field";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { getUsersByRoleId } from "@/lib/actions/settings";
import DatePicker from "@/components/date-picker";
// import { createPayroll } from "@/lib/actions/payroll"; 

const payrollFormSchema = z.object({
  employeeId: z.string().min(1, "Please select an employee"),
  payMonth: z.string().min(1, "Please specify the pay month"),
  baseSalary: z
    .number({ invalid_type_error: "Base salary must be a number" })
    .positive("Salary must be positive"),
  bonus: z
    .number({ invalid_type_error: "Bonus must be a number" })
    .optional()
    .or(z.literal("").transform(() => 0)),
  deductions: z
    .number({ invalid_type_error: "Deductions must be a number" })
    .optional()
    .or(z.literal("").transform(() => 0)),
  paymentDate: z.date(),
  comments: z.string().optional(),
});

export type PayrollFormValues = z.infer<typeof payrollFormSchema>;

export default function AddPayroll({
  setReload,
  setAddPayroll,
}: {
  setReload: (reload: boolean) => void;
  setAddPayroll: (visible: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<{ label: string; value: string }[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const usersData = await getUsersByRoleId('1');
        const formattedEmployees = usersData.result.map((user: any) => ({
          label: user.name,
          value: user.id.toString(),
        }));
        setEmployees(formattedEmployees);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load employees",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  const defaultValues: Partial<PayrollFormValues> = {
    employeeId: "",
    payMonth: "",
    baseSalary: 0,
    bonus: 0,
    deductions: 0,
    paymentDate: new Date(),
    comments: "",
  };

  const form = useForm<PayrollFormValues>({
    resolver: zodResolver(payrollFormSchema),
    defaultValues,
  });

  async function onSubmit(data: PayrollFormValues) {
    setLoading(true);
    // try {

    // const result = await createPayroll(data);

    //   if (result.success) {
    //     toast({
    //       title: "Success",
    //       description: "Payroll added successfully",
    //     });
    //     setAddPayroll(false);
    //     setReload(true);
    //   } else {
    //     toast({
    //       title: "Error",
    //       description: result.error,
    //       variant: "destructive",
    //     });
    //   }
    // } catch (error) {
    //   toast({
    //     title: "Error",
    //     description: "Failed to add payroll",
    //     variant: "destructive",
    //   });
    // } finally {
    setLoading(false);
    // }
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Payroll</CardTitle>
        <CardDescription>Add a new salary payroll record for an employee</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DefaultFormSelect
              form={form}
              name="employeeId"
              label="Employee"
              options={employees}
              placeholder="Select employee"
            />
            <DefaultFormTextField
              form={form}
              name="payMonth"
              label="Pay Month"
              placeholder="e.g. August 2025"
            />
            <DefaultFormTextField
              form={form}
              name="baseSalary"
              label="Base Salary"
              placeholder="Enter base salary"
            />
            <DefaultFormTextField
              form={form}
              name="bonus"
              label="Bonus"
              placeholder="Enter bonus (optional)"
            />
            <DefaultFormTextField
              form={form}
              name="deductions"
              label="Deductions"
              placeholder="Enter deductions (optional)"
            />
            <FormField
              control={form.control}
              name="paymentDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Select Payment Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value}
                      subYear={18}
                      onChange={(date) => field.onChange(date)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DefaultFormTextField
              form={form}
              name="comments"
              label="Comments"
              placeholder="Any additional comments"
            />
            <div className="flex justify-end">
              <Button type="submit">Add Payroll</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
