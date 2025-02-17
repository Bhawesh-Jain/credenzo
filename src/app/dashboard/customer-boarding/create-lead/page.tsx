'use client';

import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useToast } from "@/hooks/use-toast"
import { FormLabelWithIcon } from "@/components/ui/form-label-with-icon";

const leadFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"), 
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  loanType: z.enum(["personal", "business", "mortgage", "auto"], {
    required_error: "Please select a loan type",
  }),
  amount: z.number({
    required_error: "Please enter a loan amount",
    invalid_type_error: "Please enter a valid number",
  })
    .min(1000, "Minimum loan amount is 1,000")
    .max(1000000, "Maximum loan amount is 1,000,000"),
  purpose: z.string().min(10, "Please provide a detailed purpose"),
  term: z.number({
    required_error: "Please enter a loan term",
    invalid_type_error: "Please enter a valid number",
  })
    .min(6, "Minimum term is 6 months")
    .max(360, "Maximum term is 360 months"),
  notes: z.string().optional(),
});

type LeadFormValues = z.infer<typeof leadFormSchema>;

const defaultValues: Partial<LeadFormValues> = {
  notes: "",
};

export default function CreateLead() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false);

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues,
  });

  async function onSubmit(data: LeadFormValues) {
    try {
      setLoading(true);
      // TODO: Implement API call to save lead
      console.log(data);
      toast({
        title: "Lead Created Successfully",
        description: "The lead has been created and saved.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem creating the lead.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card className="w-full shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Create New Lead
          </CardTitle>
          <CardDescription>
            Enter the customer's information to create a new loan lead
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-700">Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithIcon icon={Icons.user}>First Name</FormLabelWithIcon>
                        <FormControl>
                          <Input placeholder="Enter first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithIcon icon={Icons.user}>Last Name</FormLabelWithIcon>
                        <FormControl>
                          <Input placeholder="Enter last name" {...field} />
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
                </div>
              </div>

              {/* Loan Information Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-700">Loan Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="loanType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithIcon icon={Icons.creditCard}>Loan Type</FormLabelWithIcon>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select loan type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="personal">Personal Loan</SelectItem>
                            <SelectItem value="business">Business Loan</SelectItem>
                            <SelectItem value="mortgage">Mortgage Loan</SelectItem>
                            <SelectItem value="auto">Auto Loan</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithIcon icon={Icons.dollarSign}>Loan Amount</FormLabelWithIcon>
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
                    name="purpose"
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
                  <Icons.fileText className="h-5 w-5 text-gray-500" />
                  <h3 className="text-lg font-semibold text-gray-700">Additional Information</h3>
                </div>
                <FormField
                  control={form.control}
                  name="notes"
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Lead"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
