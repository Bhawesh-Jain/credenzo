'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import PersonalDetails from "./blocks/Applicant"
import AddressDetails from "./blocks/Address";
import IncomeDetails from "./blocks/Income";
import LoanProductDetails from "./blocks/LoanProduct";

import Loading from "../../loading";

import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useGlobalDialog } from "@/providers/DialogProvider";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { SubHeading } from "@/components/text/heading";
import { twMerge } from "tailwind-merge";
import { zodPatterns } from "@/lib/utils/zod-patterns";
import { getLoanProductTypes } from "@/lib/actions/loan-product";
import { createProposal } from "@/lib/actions/customer-boarding";
import { getBranchListById } from "@/lib/actions/branch";

const proposalFormSchema = z.object({
  // Personal Details
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: zodPatterns.email.schema().optional().or(z.literal('')),
  phone: zodPatterns.phone.schema(),
  panCard: zodPatterns.pan.schema(),
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Please select gender",
  }),
  dob: z.date(),

  // Address Details
  add_line_1: zodPatterns.addressDef.schema(),
  add_line_2: z.string().optional(),
  add_line_3: z.string().optional(),
  landmark: z.string().min(2, "Landmark is required"),
  pincode: zodPatterns.pincode.schema(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  since: z.string().max(10, "Max 10 characters allowed").optional(),
  ownership: z.enum(["Owned", "Rented"], {
    required_error: "Please select ownership",
  }),

  // Income Details
  empType: z.enum(["salaried", "business"], {
    required_error: "Please select employment type",
  }),
  entityName: z.string(),
  incomeAmount: zodPatterns.numberString.schema(),
  incomeAddress: zodPatterns.addressDef.schema(),
  incomeContact: zodPatterns.phone.schema(),

  // Loan Details
  productType: z.string().min(1, "You have to Select Product Type!"),
  purpose: z.string().min(2, "Enter at least 5 characters"),
  loanAmount: z.coerce.number().min(1000, "Enter a valid loan amount!"),
  branch: z.string().min(1, "You have to add the Branch!")
});

export type ProposalFormValues = z.infer<typeof proposalFormSchema>;

const defaultValues: Partial<ProposalFormValues> = {
  firstName: 'T-FirstName',
  lastName: 'T-LastName',
  email: '',
  phone: '9988776655',
  panCard: 'CDXSJ1746D',
  gender: 'Female',
  dob: new Date(),
  add_line_1: 'Somewhere in city',
  add_line_2: 'Vijay Nagar',
  add_line_3: 'Indore, Main',
  landmark: 'Intellect Heights',
  pincode: '452001',
  city: 'Indore',
  state: 'Madhya Pradesh',
  since: '5 Years',
  ownership: 'Owned',
  empType: 'salaried',
  entityName: 'Bls',
  incomeAmount: 20000,
  incomeAddress: 'Vijay Nagar',
  incomeContact: '7999882598',
  productType: '2',
  purpose: 'Test',
  loanAmount: 50000,
  branch: '1'
};

export default function CreateProposal() {
  const [currentStep, setCurrentStep] = useState(0);
  const [productTypeList, setProductTypeList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const { toast } = useToast()
  const { showSuccess, showError, showConfirmation, setLoading } = useGlobalDialog()

  const steps = [
    { title: "Personal Details", fields: ['firstName', 'lastName', 'email', 'phone', 'panCard', 'gender', 'dob'] },
    { title: "Address Details", fields: ['add_line_1', 'add_line_2', 'add_line_3', 'landmark', 'pincode', 'city', 'state', 'ownership'] },
    { title: "Income Details", fields: ['empType', 'entityName', 'incomeAmount', 'incomeAddress', 'incomeContact',] },
    { title: "Loan Details", fields: ['productType', 'purpose', 'loanAmount'] }
  ];

  useEffect(() => {
    (async () => {
      setListLoading(true);

      let list = await getLoanProductTypes()
      let branchListData = await getBranchListById()

      setListLoading(false);

      if (branchListData.success) {
        const formattedBranches = branchListData.result.map((branch: any) => ({
          label: branch.name,
          value: branch.id.toString(),
        }));

        setBranchList(formattedBranches)
      }


      if (list.success) {
        const formattedData = list.result.map((item: any) => ({
          label: item.name,
          value: item.id.toString(),
        }));
        setProductTypeList(formattedData);
      }
    })();
  }, []);

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

          const result = await createProposal(data)

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

              {/* Income Details */}
              <TabsContent value="2">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <SubHeading>Income Details</SubHeading>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <IncomeDetails form={form} />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Loan Details */}
              <TabsContent value="3">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <SubHeading>Loan Details</SubHeading>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {listLoading
                      ? <Loading />
                      : <LoanProductDetails branchList={branchList} productTypeList={productTypeList} form={form} />}
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

                {currentStep < steps.length - 1 && (
                  <Button
                    type="button"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                )}

                {currentStep == steps.length - 1 && <Button type="submit">Submit Proposal</Button>}
              </div>
            </form>
          </Form>
        </Tabs>
      </CardContent>
    </Container>
  )
}
