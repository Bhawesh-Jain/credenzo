'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DatePicker from "@/components/date-picker";
import { DefaultFormDatePicker, DefaultFormTextField, DefaultFormTimeField } from "@/components/ui/default-form-field";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SubmitButton } from "@/components/ui/submit-button";
import { QueueItem } from "@/lib/repositories/applicationsRepository";
import { useGlobalDialog } from "@/providers/DialogProvider";
import { submitTeleverification } from "@/lib/actions/applications";

// Zod schema for validation
const televerificationSchema = z.object({
  verification_date: z.date({ required_error: "Verification date is required" }),
  verification_time: z.string().min(1, "Verification time is required"),
  call_status: z.enum(["Connected", "Voicemail", "No Answer"], {
    errorMap: () => ({ message: "Please select a call status" })
  }),
  verification_outcome: z.enum(["Verified", "Not Verified", "Pending"], {
    errorMap: () => ({ message: "Please select an outcome" })
  }),
  remarks: z.string().optional()
});

export type TeleverificationFormValues = z.infer<typeof televerificationSchema>;

export default function TeleverificationScreen({
  loanDetails,
  setForm,
  setReload,
}: {
  loanDetails: QueueItem,
  setForm: (vis: boolean) => void,
  setReload: (flag: boolean) => void,
}) {
  const { showSuccess, showError, showConfirmation, setLoading } = useGlobalDialog();


  const form = useForm<TeleverificationFormValues>({
    resolver: zodResolver(televerificationSchema),
    defaultValues: {
      verification_date: new Date(),
      verification_time: "",
      call_status: "Connected",
      verification_outcome: "Pending",
      remarks: ""
    }
  });

  async function onSubmit(data: TeleverificationFormValues) {
    showConfirmation(
      'Submit Televerificaiton',
      'Are you sure you want to submit this data?',
      async () => {
        try {
          setLoading(true);

          const result = await submitTeleverification(loanDetails.id.toString(), loanDetails.client_id.toString(), data);

          setLoading(false);
          if (result.success) {
            showSuccess('Request Successful', result.result);
            form.reset();
            closeForm();
            setReload(true);
          } else {
            showError('Error', result.error);
          }
        } catch (error: any) {
          setLoading(false);
          showError('Error', 'There was a problem submitting televerification.');
        }
      }
    );
  }

  const closeForm = () => {
    setForm(false)
  }

  return (
    <Container>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-5">

            {/* Verification Date */}
            <DefaultFormDatePicker
              form={form}
              label="Verification Date"
              name="verification_date"
              maxToday={true}
            />

            {/* Verification Time */}
            <DefaultFormTimeField
              form={form}
              label="Verification Time"
              name="verification_time"
              placeholder="e.g., 10:30 AM"
            />

            {/* Call Status */}
            <FormField
              control={form.control}
              name="call_status"
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
                  <FormMessage>{form.formState.errors.call_status?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Verification Outcome */}
            <FormField
              control={form.control}
              name="verification_outcome"
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
                  <FormMessage>{form.formState.errors.verification_outcome?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Verifier's Comments */}
            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Verifier Comment</FormLabel>
                  <textarea
                    {...field}
                    className="p-2 border border-gray-300 rounded-md w-full"
                    placeholder="Enter your comments"
                  />
                  <FormMessage>{form.formState.errors.remarks?.message}</FormMessage>
                </FormItem>
              )}
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
