'use client';

import { useState } from 'react';
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
  FormMessage,
} from "@/components/ui/form";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast"
import { FormLabelWithIcon } from "@/components/ui/form-label-with-icon";
import { useGlobalDialog } from '@/providers/DialogProvider'

const proposalFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .max(12, "Phone number cannot exceed 12 digits")
    .regex(/^[6-9]\d{9}$/, "Please enter a valid Indian mobile number"),
  panCard: z.string()
    .length(10, "PAN Card number must be 10 characters")
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN Card format"),
  proposalType: z.enum(["personal", "business", "home", "vehicle", "education"], {
    required_error: "Please select a proposal type",
  }),
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Please select gender",
  }),
  amount: z.number({
    required_error: "Please enter a proposal amount",
    invalid_type_error: "Please enter a valid number",
  })
    .min(10000, "Minimum proposal amount is ₹10,000")
    .max(100000000, "Maximum proposal amount is ₹10,00,00,000"),
  purpose: z.string().min(3, "Please provide a detailed purpose"),
  term: z.number({
    required_error: "Please enter proposal term",
    invalid_type_error: "Please enter a valid number",
  })
    .min(6, "Minimum term is 6 months")
    .max(360, "Maximum term is 360 months"),
  sourceOfIncome: z.enum(["Salary", "Business", "Rental", "Agriculture", "Other"], {
    required_error: "Please select source of income",
  }),
  employmentType: z.enum(["Salaried", "Self-Employed", "Professional", "Retired"], {
    required_error: "Please select employment type",
  }),
  notes: z.string().optional(),
});

export type ProposalFormValues = z.infer<typeof proposalFormSchema>;

const defaultValues: Partial<ProposalFormValues> = {
  notes: "",
};

export default function PersonalDetails() {
  const { toast } = useToast()
  const { showSuccess, showError, showConfirmation, setLoading } = useGlobalDialog()

  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalFormSchema),
    defaultValues,
  })

  async function onSubmit(data: ProposalFormValues) {
    showConfirmation(
      'Create Proposal',
      'Are you sure you want to submit this proposal?',
      async () => {
        try {
          setLoading(true)
          // const result = await createProposal('1', data)
          const result = { success: true, error: "" };
          setLoading(false)

          if (result.success) {
            showSuccess('Proposal Submitted', 'The proposal has been successfully created.')
            form.reset()
          } else {
            showError('Error', result.error)
          }
        } catch (error) {
          setLoading(false)
          showError('Error', 'There was a problem submitting the proposal.')
        }
      }
    )
  }

  return (
    <div className="w-full mx-auto py-4 md:px-4">
      <div className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Create New Loan Proposal
          </CardTitle>
          <CardDescription>
            Enter the applicant&apos;s details to submit a new loan proposal
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
                          <Input type="tel" placeholder="Enter 10-digit mobile number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="panCard"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithIcon icon={Icons.creditCard}>PAN Card Number</FormLabelWithIcon>
                        <FormControl>
                          <Input placeholder="Enter PAN Card Number" {...field} />
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

              {/* Proposal Information Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-700">Proposal Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="proposalType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithIcon icon={Icons.creditCard}>Proposal Type</FormLabelWithIcon>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select proposal type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="personal">Personal Loan</SelectItem>
                            <SelectItem value="business">Business Loan</SelectItem>
                            <SelectItem value="home">Home Loan</SelectItem>
                            <SelectItem value="vehicle">Vehicle Loan</SelectItem>
                            <SelectItem value="education">Education Loan</SelectItem>
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
                        <FormLabelWithIcon icon={Icons.receiptIndianRupee}>Loan Amount (₹)</FormLabelWithIcon>
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
                          <Input placeholder="Enter detailed loan purpose" {...field} />
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
                  <FormField
                    control={form.control}
                    name="sourceOfIncome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithIcon icon={Icons.briefcase}>Source of Income</FormLabelWithIcon>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select source of income" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Salary">Salary</SelectItem>
                            <SelectItem value="Business">Business</SelectItem>
                            <SelectItem value="Rental">Rental</SelectItem>
                            <SelectItem value="Agriculture">Agriculture</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="employmentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabelWithIcon icon={Icons.userCheck}>Employment Type</FormLabelWithIcon>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select employment type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Salaried">Salaried</SelectItem>
                            <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                            <SelectItem value="Professional">Professional</SelectItem>
                            <SelectItem value="Retired">Retired</SelectItem>
                          </SelectContent>
                        </Select>
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
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabelWithIcon icon={Icons.fileText}>Notes</FormLabelWithIcon>
                      <FormControl>
                        <textarea
                          className="min-h-[100px] w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter any additional notes or remarks"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="submit">
                  Submit Proposal
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </div>
    </div>
  );
}