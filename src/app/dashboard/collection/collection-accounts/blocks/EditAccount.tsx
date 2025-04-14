'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Icons } from "@/components/icons";
import { FormLabelWithIcon } from "@/components/ui/form-label-with-icon";
import { useGlobalDialog } from '@/providers/DialogProvider';
import DatePicker from "@/components/date-picker";
import { updateDirectCollectionAccount } from "@/lib/actions/collection";

// Extend your existing schema with an id field for editing
const editDirectCollectionSchema = z.object({
  id: z.number(),
  customer_name: z.string().min(2, "Customer name must be at least 2 characters"),
  customer_phone: z.string().min(10, "Please enter a valid phone number"),
  customer_address: z.string().min(5, "Address is required"),
  loan_ref: z.string().min(1, "Loan reference is required"),
  loan_amount: z.number({
    required_error: "Loan amount is required",
    invalid_type_error: "Please enter a valid number",
  }).min(1, "Loan amount must be positive"),
  loan_emi_amount: z.number({
    required_error: "EMI amount is required",
    invalid_type_error: "Please enter a valid number",
  }).min(1, "EMI amount must be positive"),
  loan_type: z.string().min(1, "Loan type is required"),
  loan_tenure: z.number({
    required_error: "Loan tenure is required",
    invalid_type_error: "Please enter a valid number",
  }).min(1, "Loan tenure should be at least 1 month"),
  loan_start_date: z.date({
    required_error: "Loan start date is required",
  }),
  interest_rate: z.string().min(1, "Interest rate is required"),
  lendor_name: z.string().min(1, "Lendor name is required"),
});

export type EditDirectCollectionAccountValues = z.infer<typeof editDirectCollectionSchema>;

interface EditDirectCollectionAccountProps {
  initialData: EditDirectCollectionAccountValues;
  onClose: () => void;
  onReload: () => void;
}

export default function EditDirectCollectionAccount({
  initialData,
  onClose,
  onReload,
}: EditDirectCollectionAccountProps) {
  const { showSuccess, showError, showConfirmation, setLoading } = useGlobalDialog();
  const form = useForm<EditDirectCollectionAccountValues>({
    resolver: zodResolver(editDirectCollectionSchema),
    defaultValues: initialData,
  });

  async function onSubmit(data: EditDirectCollectionAccountValues) {
    showConfirmation(
      'Update Account',
      'Are you sure you want to update this account?',
      async () => {
        try {
          setLoading(true);
          const result = await updateDirectCollectionAccount(data);
          setLoading(false);
          if (result.success) {
            showSuccess('Account Updated', 'The direct collection account has been updated.');
            form.reset();
            onClose();
            onReload();
          } else {
            showError('Error', result.error);
          }
        } catch (error) {
          setLoading(false);
          showError('Error', 'There was a problem updating the direct collection account.');
        }
      }
    );
  }

  return (
    <div>
      <div className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Edit Direct Collection Account
          </CardTitle>
          <CardDescription>
            Update the information for this direct collection account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Customer Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="customer_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithIcon icon={Icons.user}>Customer Name</FormLabelWithIcon>
                        <FormControl>
                          <Input placeholder="Enter customer name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customer_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithIcon icon={Icons.phone}>Customer Phone</FormLabelWithIcon>
                        <FormControl>
                          <Input placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customer_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithIcon icon={Icons.mapPin}>Address</FormLabelWithIcon>
                        <FormControl>
                          <Input placeholder="Enter address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Loan Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Loan Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Loan reference is often not editable */}
                  <FormField
                    control={form.control}
                    name="loan_ref"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithIcon icon={Icons.fileText}>Loan Reference</FormLabelWithIcon>
                        <FormControl>
                          <Input placeholder="Unique loan reference" {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="loan_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithIcon icon={Icons.receiptIndianRupee}>Loan Amount</FormLabelWithIcon>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter loan amount"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="loan_emi_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithIcon icon={Icons.currency}>EMI Amount</FormLabelWithIcon>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter EMI amount"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="loan_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithIcon icon={Icons.tag}>Loan Type</FormLabelWithIcon>
                        <FormControl>
                          <Input placeholder="Enter loan type" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="loan_tenure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithIcon icon={Icons.calendar}>Loan Tenure (months)</FormLabelWithIcon>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter loan tenure"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="loan_start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithIcon icon={Icons.calendar}>Loan Start Date</FormLabelWithIcon>
                        <FormControl>
                          <DatePicker
                            date={field.value || null}
                            maxToday={false}
                            onChange={(date) => field.onChange(date)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="interest_rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithIcon icon={Icons.percent}>Interest Rate</FormLabelWithIcon>
                        <FormControl>
                          <Input placeholder="Enter interest rate" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lendor_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithIcon icon={Icons.building}>Lendor Name</FormLabelWithIcon>
                        <FormControl>
                          <Input placeholder="Enter lender name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Submission */}
              <div className="flex justify-end space-x-4">
                <Button type="submit">Update Account</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </div>
    </div>
  );
}
