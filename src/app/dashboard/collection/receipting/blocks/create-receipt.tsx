"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createReceipt, getCollectionDetailById, getPaymentMethod } from "@/lib/actions/collection";
import Loading from "@/app/loading";
import { Form } from "@/components/ui/form";
import { DefaultFormDatePicker, DefaultFormSelect, DefaultFormTextField } from "@/components/ui/default-form-field";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaymentMethod } from "@/lib/repositories/paymentRepository";
import { Collection } from "@/lib/repositories/collectionRepository";
import formatDate from "@/lib/utils/date";
import { cn } from "@/lib/utils";
import { zodPatterns } from "@/lib/utils/zod-patterns";
import { useGlobalDialog } from "@/providers/DialogProvider";
import { getCompanyDetails } from "@/lib/actions/company";
// import PdfHelper from "@/lib/helpers/pdf-helper";

// Schema and type moved outside component for reuse
export const receiptFormSchema = z.object({
  amount: zodPatterns.numberString.schema().min(1, "Amount is required"),
  payment_date: z.date(),
  payment_method: z.string().min(1, "Payment method is required"),
  utr_number: z.string().optional(),
});

export type ReceiptFormValues = z.infer<typeof receiptFormSchema>;

interface ReceiptFormProps {
  collectionId: number;
  closeForm: () => void;
}

export default function ReceiptForm({ collectionId, closeForm }: ReceiptFormProps) {
  const [pageLoading, setPageLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [data, setData] = useState<Collection | null>(null);
  const { showSuccess, showError, showConfirmation, setLoading } = useGlobalDialog();

  const form = useForm<ReceiptFormValues>({
    resolver: zodResolver(receiptFormSchema),
    defaultValues: {
      amount: 0,
      payment_date: new Date(),
      payment_method: "",
      utr_number: "",
    },
  });

  const { watch, reset, setError } = form;
  const selectedPaymentId = watch("payment_method");
  const selectedMethod = paymentMethods.find(m => m.id.toString() === selectedPaymentId);

  useEffect(() => {
    const initializeForm = async () => {
      try {
        const [collectionRes, paymentRes] = await Promise.all([
          getCollectionDetailById(collectionId),
          getPaymentMethod(),
        ]);

        setData(collectionRes.result);
        setPaymentMethods(paymentRes.result);

        reset({
          payment_date: new Date(),
          payment_method: "",
          utr_number: "",
          amount: collectionRes.result.amount,
        });
      } finally {
        setPageLoading(false);
      }
    };

    initializeForm();
  }, [collectionId, reset]);

  const onSubmit = async (values: ReceiptFormValues) => {
    try {
      if (selectedMethod?.utr_required === 1 && !values.utr_number) {
        setError("utr_number", { type: "manual", message: "UTR/Reference number is required for this payment method" });
        return;
      }

      if (values.amount <= 0) {
        setError("amount", { type: "manual", message: "Amount must be greater than 0" });
        return;
      }
      setLoading(true);
      
      const result = await createReceipt(collectionId, values);

      setLoading(false);
      if (result.success) {
        handlePdfGeneratetion(result.result);
        closeForm();
      } else {
        showError("Request Failed!", result.error);
      }
    } catch (error: Error | any) {
      showError("Failed to create receipt", error.message);
    }
  };

  const handlePdfGeneratetion = async (receiptData: any) => {
    const companyResult = await getCompanyDetails();

    if (!companyResult.success) {
      showError("Request Failed", companyResult.error);
      return;
    }

    var companyDetails = companyResult.result;

    var pdfData = {
      companyLogoUrl: companyDetails.logo_url,
      companyName: companyDetails.company_name,
      companyAddress: companyDetails.address,
      companyContact: companyDetails.phone,
      receiptNumber: receiptData.id,
      paymentDate: formatDate(receiptData.payment_date),
      paymentMethod: receiptData.collection_type,
      utrNumber: receiptData.utr_number,
      customerName: receiptData.customer_name,
      loanRef: receiptData.ref,
      loanAmount:  receiptData.loan_amount,
      loanEmiAmount: receiptData.loan_emi_amount,
      loanType: receiptData.loan_type,
      loanTenure: receiptData.loan_tenure,
      interestRate: receiptData.interest_rate,
      loanStartDate: formatDate(receiptData.loan_start_date),
      dueDate: formatDate(receiptData.due_date),
      currencySymbol: companyDetails.currency_symbol,
      amount: receiptData.amount,
      lendorName: receiptData.lendor_name,
    }

    try {
      // const pdfBuffer = await PdfHelper.generate('receipt', pdfData);
      
      // const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
      // const pdfUrl = URL.createObjectURL(blob);
  
      // window.open(pdfUrl, '_blank');
    } catch (error: any) {
      showError("PDF Generation Failed", error.message);
    }
    
  }

  if (pageLoading) return <Loading />;
  if (!data) return <div>No data found</div>;

  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="text-2xl">Payment Receipt</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Account Details Section */}
        <div className="space-y-4 p-4 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold">Account Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <DetailItem label="Customer Name" value={data.customer_name} />
            <DetailItem label="Loan Reference" value={data.loan_ref} />
            <DetailItem label="Loan Amount" value={`${data.currency_symbol} ${data.loan_amount}`} />
            <DetailItem label="EMI Amount" value={`${data.currency_symbol} ${data.loan_emi_amount}`} />
            <DetailItem label="Loan Type" value={data.loan_type} />
            <DetailItem label="Tenure" value={`${data.loan_tenure} Months`} />
            <DetailItem label="Interest Rate" value={`${data.interest_rate}%`} />
            <DetailItem label="Start Date" value={formatDate(data.loan_start_date)} />
          </div>
        </div>

        <div className="grid gap-4 text-sm">
          <DetailItem label="Collection Amount" value={`${data.currency_symbol} ${data.amount}`} />

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Due Date</span>
            <span
              className={cn(
                "font-medium",
                new Date(data.due_date) < new Date() ? "text-red-500" : "text-green-500"
              )}
            >
              {formatDate(data.due_date)}
            </span>
          </div>

          {new Date(data.due_date) < new Date() && (
            <p className="text-sm text-red-500">This payment is overdue.</p>
          )}
        </div>

        {/* Payment Form Section */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <DefaultFormSelect
                form={form}
                placeholder="Select Payment Method"
                name="payment_method"
                label="Payment Method"
                options={paymentMethods.map(m => ({ value: m.id, label: m.name }))}
              />

              <DefaultFormTextField
                form={form}
                name="amount"
                label="Amount"
              />

              <DefaultFormDatePicker
                form={form}
                name="payment_date"
                label="Payment Date"
              />

              {selectedMethod?.utr_required === 1 && (
                <DefaultFormTextField
                  form={form}
                  name="utr_number"
                  label="UTR/Reference Number"
                />
              )}
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={closeForm}>
                Cancel
              </Button>
              <Button type="submit">Submit Payment</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

const DetailItem = ({ label, value }: { label: string; value?: string | number }) => (
  <div className="flex justify-between items-center">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium">{value || "-"}</span>
  </div>
);
