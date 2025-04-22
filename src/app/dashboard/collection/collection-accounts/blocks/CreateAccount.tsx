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
import { createDirectCollectionAccount, getCollectionUserList } from "@/lib/actions/collection";
import { useEffect, useState } from "react";
import { getBranchListById } from "@/lib/actions/branch";
import { DefaultFormSelect } from "@/components/ui/default-form-field";
import FormItemSkeleton from "@/components/skeletons/form-item-skeleton";

// Define the schema for direct collection account creation
const directCollectionSchema = z.object({
  customer_name: z.string().min(2, "Customer name must be at least 2 characters"),
  customer_phone: z.string().min(10, "Please enter a valid phone number"),
  handler_id: z.string().min(1, "Select Associated Handler"),
  branch_id: z.string().min(1, "Select Associated Branch"),
  customer_address: z.string().min(5, "Address is required"),
  loan_ref: z.string().min(1, "Loan reference is required"),
  loan_amount: z.number({
    required_error: "Loan amount is required",
    invalid_type_error: "Please enter a valid number"
  }).min(1, "Loan amount must be positive"),
  loan_emi_amount: z.number({
    required_error: "EMI amount is required",
    invalid_type_error: "Please enter a valid number"
  }).min(1, "EMI amount must be positive"),
  loan_type: z.string().min(1, "Loan type is required"),
  loan_tenure: z.number({
    required_error: "Loan tenure is required",
    invalid_type_error: "Please enter a valid number"
  }).min(1, "Loan tenure should be at least 1 month"),
  loan_start_date: z.date({
    required_error: "Loan start date is required"
  }),
  interest_rate: z.string().min(1, "Interest rate is required"),
  lendor_name: z.string().min(1, "Lendor name is required"),
  // lendor_id: z.number({
  //   required_error: "Lendor ID is required",
  //   invalid_type_error: "Please enter a valid number"
  // }),
});

export type DirectCollectionAccountValues = z.infer<typeof directCollectionSchema>;

const defaultValues: Partial<DirectCollectionAccountValues> = {
  // You can set default values if required, e.g., lendor_id: 0
};

export default function CreateDirectCollectionAccount({
  setVis,
  setReload,
}: {
  setVis: (vis: boolean) => void;
  setReload: (reload: boolean) => void;
}) {
  const { showSuccess, showError, showConfirmation, setLoading } = useGlobalDialog();
  const form = useForm<DirectCollectionAccountValues>({
    resolver: zodResolver(directCollectionSchema),
    defaultValues,
  });

  const [collectionUsers, setCollectionUsers] = useState<any[]>([]);
  const [branchList, setBranchList] = useState([]);

  const [formLoading, setFormLoading] = useState<boolean>(false);
  const { watch } = form;
  const branchItem = watch("branch_id");

  useEffect(() => {
    (async () => {
      if (!branchItem || branchItem.toString().length == 0) {
        return;
      }

      const accounts = await getCollectionUserList(branchItem);

      if (accounts.success) {
        const formattedUsers = accounts.result.map((branch: any) => ({
          label: branch.name,
          value: branch.id.toString(),
        }));

        setCollectionUsers(formattedUsers)
      } else {
        showError('Users Not Found!', accounts.error)
      }
    })();
  }, [branchItem, showError]);


  useEffect(() => {
    (async () => {
      setFormLoading(true);

      let branchListData = await getBranchListById()

      if (branchListData.success) {
        const formattedBranches = branchListData.result.map((branch: any) => ({
          label: branch.name,
          value: branch.id.toString(),
        }));

        setBranchList(formattedBranches)
      }

      setFormLoading(false);
    })();
  }, []);

  async function onSubmit(data: DirectCollectionAccountValues) {
    showConfirmation(
      'Create Direct Collection Account',
      'Are you sure you want to create this direct collection account?',
      async () => {
        try {
          setLoading(true);

          const result = await createDirectCollectionAccount(data);

          setLoading(false);
          if (result.success) {
            showSuccess('Account Created', 'The direct collection account has been created.');
            form.reset();
            setVis(false);
            setReload(true);
          } else {
            showError('Error', result.error);
          }
        } catch (error: any) {
          setLoading(false);
          if (error.message && error.message.includes("Duplicate entry")) {
            showError('Error', 'Loan Refernece Already Exists');
          } else {
            showError('Error', 'There was a problem creating the direct collection account.');
          }
        }
      }
    );
  }

  return (
    <div>
      <div className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Create Direct Collection Account
          </CardTitle>
          <CardDescription>
            Enter the minimal information required to create a direct collection account
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
                          <Input placeholder="Enter Customer name" {...field} />
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
                <div className='col-span-2'>
                  {formLoading
                    ? <FormItemSkeleton />
                    : <DefaultFormSelect
                      form={form}
                      label='Associated Branch'
                      name='branch_id'
                      options={branchList}
                      placeholder='Select Associated Branch'
                    />}
                </div>
                <div className='col-span-2'>
                  {formLoading
                    ? <FormItemSkeleton />
                    : <DefaultFormSelect
                      form={form}
                      label='Associated Handler'
                      name='handler_id'
                      options={collectionUsers}
                      placeholder='Select Associated Handler'
                    />}
                </div>
              </div>

              {/* Loan Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Loan Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="loan_ref"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithIcon icon={Icons.fileText}>Loan Reference</FormLabelWithIcon>
                        <FormControl>
                          <Input placeholder="Unique loan reference" {...field} />
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
                  {/* <FormField
                    control={form.control}
                    name="lendor_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithIcon icon={Icons.idCard}>Lendor ID</FormLabelWithIcon>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter lender ID"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                </div>
              </div>

              {/* Submission */}
              <div className="flex justify-end space-x-4">
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </div>
    </div>
  );
}
