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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/app/dashboard/loading";
import { useEffect, useState } from "react";
import { Edit } from "lucide-react";
import { editLead, getLeadById } from "@/lib/actions/customer-boarding";
import { Icons } from "@/components/icons";
import { FormLabelWithIcon } from "@/components/ui/form-label-with-icon";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getLoanProductTypes } from "@/lib/actions/loan-product";
import { DefaultFormSelect, DefaultFormTimeField } from "@/components/ui/default-form-field";
import DatePicker from "@/components/date-picker";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formScheme = z.object({
  customer_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  product_type: z.string().min(1, "You have to Select Product Type!"),

  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Please select gender",
  }),
  loan_amount: z.coerce.number({
    required_error: "Please enter a loan amount",
    invalid_type_error: "Please enter a valid number",
  })
    .min(1000, "Minimum loan amount is 1,000")
    .max(1000000000, "Maximum loan amount is 1,000,000,000"),
  loan_purpose: z.string().min(3, "Please provide a detailed purpose"),
  meeting_date: z.date().optional(),
  meeting_time: z.string().optional(),
  term: z.coerce.number({
    required_error: "Please enter a loan term",
    invalid_type_error: "Please enter a valid number",
  })
    .min(6, "Minimum term is 6 months")
    .max(360, "Maximum term is 360 months"),
  remark: z.string().optional(),
  status: z.coerce.string().min(1, "Select Status")
});

export type EditLeadFormValues = z.infer<typeof formScheme>;

export default function EditLead({
  setOpen,
  setReload,
  leadId
}: {
  setReload: (reload: boolean) => void,
  setOpen: (open: boolean) => void,
  leadId: number
}) {
  const [loading, setLoading] = useState(false);
  const [productTypeList, setProductTypeList] = useState([]);
  const { toast } = useToast();
  const statusList = [
    {
      label: 'Hot',
      value: '1'
    },
    {
      label: 'Reschedule',
      value: '5'
    },
    {
      label: 'Proceed to Proposal',
      value: '10'
    },
    {
      label: 'Not Interested',
      value: '0'
    },
  ]
  const defaultValues: Partial<EditLeadFormValues> = {  };

  const form = useForm<EditLeadFormValues>({
    resolver: zodResolver(formScheme),
    defaultValues,
  })

  useEffect(() => {
    (async () => {
      setLoading(true);

      let list = await getLoanProductTypes()


      if (list.success) {
        const formattedData = list.result.map((item: any) => ({
          label: item.name,
          value: item.id.toString(),
        }))
        setProductTypeList(formattedData);
      }

      const branch = await getLeadById(leadId);

      if (branch.success) {
        var formItem = {
          ...branch.result,
          status: String(branch.result['status'])
        }
        form.reset(formItem);
      }
      setLoading(false);
    })();
  }, [leadId, form]);


  async function onSubmit(data: EditLeadFormValues) {
    setLoading(true);

    const result = await editLead(leadId, data)

    setLoading(false);
    if (result.success) {
      toast({
        title: "Request successful",
        description: "The lead has been modified successfully",
      })
      form.reset();
      setOpen(false);
      setReload(true);
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive"
      })
    }
  }

  return (
    <div className="py-2">
      <CardHeader>
        <CardTitle>Edit Lead</CardTitle>
        <CardDescription>
          Edit the Lead details
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading
          ? <Loading />
          : <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-700">Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="customer_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithIcon icon={Icons.user}>First Name</FormLabelWithIcon>
                        <FormControl>
                          <Input placeholder="Enter name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithIcon icon={Icons.mail}>Email Address</FormLabelWithIcon>
                        <FormControl>
                          <Input type="email" placeholder="Enter email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithIcon icon={Icons.phone}>Phone Number</FormLabelWithIcon>
                        <FormControl>
                          <Input type="tel" placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithIcon icon={Icons.gender}>Gender</FormLabelWithIcon>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Loan Information Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-700">Loan Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div className='col-span-2'>
                    <DefaultFormSelect
                      form={form}
                      label='Loan Product Type'
                      name='product_type'
                      options={productTypeList}
                      placeholder='Select Product Type'
                    />
                  </div>

                  <div className='col-span-2'>
                    <DefaultFormSelect
                      form={form}
                      label='Lead Status'
                      name='status'
                      options={statusList}
                      placeholder=''
                    />
                  </div>

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
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="loan_purpose"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithIcon icon={Icons.target}>Loan Purpose</FormLabelWithIcon>
                        <FormControl>
                          <Input placeholder="Enter loan purpose" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="term"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithIcon icon={Icons.calendar}>Loan Term (months)</FormLabelWithIcon>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter loan term"
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </div>
              </div>

              {/* Additional Information Section */}
              <div className="space-y-4">

                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-700">Additional Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DefaultFormTimeField
                    form={form}
                    label="Next Meeting Time"
                    name="meeting_time"
                    placeholder=""
                  />
                  <FormField
                    control={form.control}
                    name="meeting_date"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel>Next Meeting Date</FormLabel>
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

                <FormField
                  control={form.control}
                  name="remark"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabelWithIcon icon={Icons.fileText}>Notes</FormLabelWithIcon>
                      <FormControl>
                        <textarea
                          className="min-h-[100px] w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter any additional notes"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button onClick={() => setOpen(false)} variant='outline' type="button">
                  Cancel
                </Button>
                <Button type="submit">
                  Submit
                </Button>
              </div>
            </form>
          </Form>}
      </CardContent>
    </div>
  )
}