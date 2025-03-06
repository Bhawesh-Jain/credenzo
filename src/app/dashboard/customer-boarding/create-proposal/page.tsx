'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import PersonalDetails from "./blocks/Applicant"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useGlobalDialog } from "@/providers/DialogProvider";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import AddressDetails from "./blocks/Address";
import { SubHeading } from "@/components/text/heading";
import { twMerge } from "tailwind-merge";

const proposalFormSchema = z.object({
  // Personal Details
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
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Please select gender",
  }),
  dob: z.string().date("Please enter Date of Birth"),

  // Address Details
  // Address fields
  add_line_1: z.string().min(5, "Address line 1 is required"),
  add_line_2: z.string().optional(),
  add_line_3: z.string().optional(),
  landmark: z.string().min(2, "Landmark is required"),
  pincode: z.string().length(6, "Must be 6 digits"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
});

export type ProposalFormValues = z.infer<typeof proposalFormSchema>;

const defaultValues: Partial<ProposalFormValues> = {

};

export default function createProposal() {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast()
  const { showSuccess, showError, showConfirmation, setLoading } = useGlobalDialog()

  const steps = [
    { title: "Personal Details", fields: ['firstName', 'lastName', 'email', 'phone', 'panCard', 'gender', 'dob'] },
    { title: "Address Details", fields: ['add_line_1', 'add_line_2', 'add_line_3', 'landmark', 'pincode', 'city', 'state'] },
    { title: "Income Details", fields: [] },
    { title: "Loan Details", fields: [] }
  ];

  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalFormSchema),
    defaultValues,
  })

  const handleNext = async () => {
    const fields = steps[currentStep].fields;
    const isValid = await form.trigger(fields as any);

    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };



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
    <Container>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-gray-800">
          Create New Loan Proposal
        </CardTitle>
        <CardDescription>
          Enter the applicant&apos;s details to submit a new loan proposal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={currentStep.toString()}>
          <TabsList className="gap-4 flex w-fit mb-4">
            {steps.map((_, index) => (
              <TabsTrigger 
                key={index} 
                value={index.toString()}
                className={twMerge(
                  "cursor-default", // Disable pointer events
                  currentStep !== index && "opacity-50"
                )}
                onClick={(e) => {
                  // Prevent manual tab changes
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                {steps[index].title}
              </TabsTrigger>
            ))}
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Details */}
              <TabsContent value="0">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <SubHeading>Applicant Personal Details</SubHeading>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PersonalDetails form={form} />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Address Details */}
              <TabsContent value="1">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <SubHeading>Permanent Address Details</SubHeading>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AddressDetails form={form} />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Add other TabsContent for remaining steps */}

              <div className="flex justify-end space-x-4">
                {currentStep > 0 && (
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handlePrev}
                  >
                    Previous
                  </Button>
                )}
                
                {currentStep < steps.length - 1 ? (
                  <Button 
                    type="button"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                ) : (
                  <Button type="submit">Submit Proposal</Button>
                )}
              </div>
            </form>
          </Form>
        </Tabs>
      </CardContent>
    </Container>
  )
}
