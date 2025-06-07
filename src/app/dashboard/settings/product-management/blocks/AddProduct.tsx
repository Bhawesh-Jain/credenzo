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
import { createProducts, getProductsType } from "@/lib/actions/settings";
import AddProductType from "./AddProductType";

// Define the schema for direct collection account creation
const directCollectionSchema = z.object({
  name: z.string().min(2, "Customer name must be at least 2 characters"),
  minimum_cibil_score: z.number({
    required_error: "Minimum Civil Score is required",
    invalid_type_error: "Please enter a valid number"
  }).min(1, "Loan amount must be positive"),
  type: z.string().min(1, "Loan type is required"),
  minimum_tenure: z.number({
    required_error: "Loan tenure is required",
    invalid_type_error: "Please enter a valid number"
  }).min(1, "minimum tenure should be at least 1 month"),
   maximum_tenure: z.number({
    required_error: "Loan tenure is required",
    invalid_type_error: "Please enter a valid number"
  }).min(1, "maximum tenure should be at least 1 month"),
  age: z.date({
    required_error: "Age is required"
  }),
  interest_rate: z.number().min(1, "Interest rate is required"),

});

export type DirectCollectionAccountValues = z.infer<typeof directCollectionSchema>;

const defaultValues: Partial<DirectCollectionAccountValues> = {
  // You can set default values if required, e.g., lendor_id: 0
};

export default function AddProduct({
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

  const [productsData, setProductsData] = useState<any[]>([]);
  const [formLoading, setFormLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {

      const accounts = await getProductsType();
       console.log("Products Type: ", accounts);
      if (accounts.success) {
        const formattedUsers = accounts.result.map((branch: any) => ({
          label: branch.type,
          value: branch.type,
        }));

        setProductsData(formattedUsers)
      } else {
        showError('Users Not Found!', accounts.error)
      }
    })();
  }, []);


  async function onSubmit(data: DirectCollectionAccountValues) {
    showConfirmation(
      'Create Direct Collection Account',
      'Are you sure you want to create this direct collection account?',
      async () => {
        try {
          setLoading(true);
         console.log("Form Data: ", data);
          const result = await createProducts(data);
          console.log("Result: ", result);
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
            Create a Products
          </CardTitle>
          {/* <CardDescription>
            Enter the minimal information required to create a direct collection account
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Product Information Section */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithIcon icon={Icons.user}> Name</FormLabelWithIcon>
                        <FormControl>
                          <Input placeholder="Enter product name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                 
    
                </div>

                <div className='col-span-2'>
                  {formLoading
                    ? <FormItemSkeleton />
                    : <div className=" flex items-center">
                      <div className="mb-10 mr-2 ">
                        <AddProductType/>
                      </div>
                      <div className="flex-1">
                      <DefaultFormSelect
                      form={form}
                      label='Type'
                      name='type'
                      options={productsData}
                      placeholder='Select Associated Branch'
                    />
                                        </div>

                    </div>
                    }
                </div>

                
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                  <FormField
                    control={form.control}
                    name="minimum_cibil_score"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithIcon icon={Icons.receiptIndianRupee}>Minimum Cibil Score</FormLabelWithIcon>
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
                    name="interest_rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithIcon icon={Icons.percent}>Interest Rate</FormLabelWithIcon>
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
                    name="minimum_tenure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithIcon icon={Icons.tag}>Minimum Tenure (month)</FormLabelWithIcon>
                        <FormControl>
                           <Input
                            type="number"
                            placeholder="Enter minimum tenure"
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
                    name="maximum_tenure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithIcon icon={Icons.calendar}>Maximum Tenure (months)</FormLabelWithIcon>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter maximum tenure"
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
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithIcon icon={Icons.calendar}> Minimum Age</FormLabelWithIcon>
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
