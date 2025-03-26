'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DatePicker from "@/components/date-picker";
import { DefaultFormTextField } from "@/components/ui/default-form-field";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SubmitButton } from "@/components/ui/submit-button";

// Zod schema for validation
const televerificationSchema = z.object({
  phoneDialed: z.string().min(10, "Enter a valid phone number"),
  verificationDate: z.date({ required_error: "Verification date is required" }),
  verificationTime: z.string().min(1, "Verification time is required"),
  callStatus: z.enum(["Connected", "Voicemail", "No Answer"], {
    errorMap: () => ({ message: "Please select a call status" })
  }),
  verificationOutcome: z.enum(["Verified", "Not Verified", "Pending"], {
    errorMap: () => ({ message: "Please select an outcome" })
  }),
  verifierComments: z.string().optional(),
  additionalDocs: z.string().optional()
});

type TeleverificationFormValues = z.infer<typeof televerificationSchema>;

export default function TeleverificationScreen({
  loanDetails,
  setForm
}: {
  loanDetails: any,
  setForm: (vis: boolean) => void,
}) {
  const form = useForm<TeleverificationFormValues>({
    resolver: zodResolver(televerificationSchema),
    defaultValues: {
      phoneDialed: "",
      verificationDate: new Date(),
      verificationTime: "",
      callStatus: "Connected",
      verificationOutcome: "Pending",
      verifierComments: "",
      additionalDocs: ""
    }
  });

  const onSubmit = (data: TeleverificationFormValues) => {
    console.log("Televerification Data:", data);

  };

  const closeForm = () => {
    setForm(false)
  }

  return (
    <Container>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-5">
            {/* Phone Dialed */}
            <DefaultFormTextField
              form={form}
              label="Phone Dialed"
              name="phoneDialed"
              placeholder="Enter phone number"
            />

            {/* Verification Date */}
            <FormField
              control={form.control}
              name="verificationDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value}
                      onChange={(date) => field.onChange(date)}
                    />
                  </FormControl>
                  <FormMessage>{form.formState.errors.verificationDate?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Verification Time */}
            <DefaultFormTextField
              form={form}
              label="Verification Time"
              name="verificationTime"
              placeholder="e.g., 14:30"
            />

            {/* Call Status */}
            <FormField
              control={form.control}
              name="callStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Call Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select call status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Connected">Connected</SelectItem>
                      <SelectItem value="Voicemail">Voicemail</SelectItem>
                      <SelectItem value="No Answer">No Answer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage>{form.formState.errors.callStatus?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Verification Outcome */}
            <FormField
              control={form.control}
              name="verificationOutcome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Outcome</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select outcome" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Verified">Verified</SelectItem>
                      <SelectItem value="Not Verified">Not Verified</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage>{form.formState.errors.verificationOutcome?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Verifier's Comments */}
            <FormField
              control={form.control}
              name="verifierComments"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Verifier Comment</FormLabel>
                  <textarea
                    {...field}
                    className="p-2 border border-gray-300 rounded-md w-full"
                    placeholder="Enter your comments"
                  />
                  <FormMessage>{form.formState.errors.verifierComments?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Additional Documents */}
            <DefaultFormTextField
              form={form}
              label="Additional Documents (optional)"
              name="additionalDocs"
              placeholder="Upload document URL or file reference"
            />
          </div>
          <div className="mt-6 flex gap-4 justify-end">
            <SubmitButton>Submit</SubmitButton>
            <Button variant='outline' type="button" onClick={closeForm}>Cancel</Button>
          </div>
        </form>
      </Form>
    </Container>
  );
}
