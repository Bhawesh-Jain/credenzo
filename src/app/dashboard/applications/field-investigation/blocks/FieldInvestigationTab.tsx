'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DatePicker from "@/components/date-picker";
import { DefaultFormDatePicker, DefaultFormSelect, DefaultFormTextArea, DefaultFormTextField, DefaultFormTimeField } from "@/components/ui/default-form-field";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SubmitButton } from "@/components/ui/submit-button";
import { QueueItem } from "@/lib/repositories/applicationsRepository";
import { useGlobalDialog } from "@/providers/DialogProvider";
import { submitFieldInvestigation } from "@/lib/actions/applications";

const fieldInvestigationSchema = z.object({
  investigation_date: z.date({ required_error: "Investigation date is required" }),
  visit_time: z.string().min(1, "Visit time is required"),
  visit_status: z.enum(["Completed", "Partial", "Unable to Complete"], {
    errorMap: () => ({ message: "Please select a visit status" })
  }),
  residence_verification: z.enum(["Verified", "Not Verified", "Not Applicable"], {
    errorMap: () => ({ message: "Please select a verification status" })
  }),
  employment_verification: z.enum(["Verified", "Not Verified", "Not Applicable"], {
    errorMap: () => ({ message: "Please select a verification status" })
  }),
  business_verification: z.enum(["Verified", "Not Verified", "Not Applicable"], {
    errorMap: () => ({ message: "Please select a verification status" })
  }),
  investigation_outcome: z.enum(["Approved", "Rejected", "Pending Additional Info"], {
    errorMap: () => ({ message: "Please select an outcome" })
  }),
  field_notes: z.string().optional(),
});

export type FieldInvestigationFormValues = z.infer<typeof fieldInvestigationSchema>;

export default function FieldInvestigationScreen({
  loanDetails,
  setForm,
  setReload,
}: {
  loanDetails: QueueItem,
  setForm: (vis: boolean) => void,
  setReload: (flag: boolean) => void,
}) {
  const { showSuccess, showError, showConfirmation, setLoading } = useGlobalDialog();

  const form = useForm<FieldInvestigationFormValues>({
    resolver: zodResolver(fieldInvestigationSchema),
    defaultValues: {
      investigation_date: new Date(),
      visit_time: "",
      visit_status: "Completed",
      residence_verification: "Not Applicable",
      employment_verification: "Not Applicable",
      business_verification: "Not Applicable",
      investigation_outcome: "Pending Additional Info",
      field_notes: "",
    }
  });

  async function onSubmit(data: FieldInvestigationFormValues) {
    showConfirmation(
      'Submit Field Investigation',
      'Are you sure you want to submit this investigation report?',
      async () => {
        try {
          setLoading(true);

          const result = await submitFieldInvestigation(loanDetails.id.toString(), data);

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
          showError('Error', 'There was a problem submitting the field investigation report.');
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

            {/* Investigation Date */}
            <DefaultFormDatePicker
              form={form}
              label="Investigation Date"
              name="investigation_date"
              maxToday={true}
            />

            {/* Visit Time */}
            <DefaultFormTimeField
              form={form}
              label="Visit Time"
              name="visit_time"
              placeholder="e.g., 10:30 AM"
            />

            {/* Visit Status */}
            <DefaultFormSelect
              form={form}
              label="Visit Status"
              name="visit_status"
              options={[
                { label: 'Completed', value: 'Completed' },
                { label: 'Partial', value: 'Partial' },
                { label: 'Unable to Complete', value: 'Unable to Complete' },
              ]}
            />

            {/* Residence Verification */}
            <DefaultFormSelect
              form={form}
              label="Residence Verification"
              name="residence_verification"
              options={[
                { label: 'Verified', value: 'Verified' },
                { label: 'Not Verified', value: 'Not Verified' },
                { label: 'Not Applicable', value: 'Not Applicable' },
              ]}
            />

            {/* Employment Verification */}
            <DefaultFormSelect
              form={form}
              label="Employment Verification"
              name="employment_verification"
              options={[
                { label: 'Verified', value: 'Verified' },
                { label: 'Not Verified', value: 'Not Verified' },
                { label: 'Not Applicable', value: 'Not Applicable' },
              ]}
            />

            {/* Business Verification */}
            <DefaultFormSelect
              form={form}
              label="Business Verification"
              name="business_verification"
              options={[
                { label: 'Verified', value: 'Verified' },
                { label: 'Not Verified', value: 'Not Verified' },
                { label: 'Not Applicable', value: 'Not Applicable' },
              ]}
            />

            {/* Investigation Outcome */}
            <DefaultFormSelect
              form={form}
              label="Investigation Outcome"
              name="investigation_outcome"
              options={[
                { label: 'Approved', value: 'Approved' },
                { label: 'Rejected', value: 'Rejected' },
                { label: 'Pending Additional Info', value: 'Pending Additional Info' },
              ]}
            />

            {/* Field Notes */}
            <div className="col-span-2">
              <DefaultFormTextArea
                form={form}
                label="Field Notes"
                rows={5}
                name="field_notes"
                placeholder="Enter detailed observations and findings"
              />
            </div>

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