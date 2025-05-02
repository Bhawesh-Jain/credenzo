"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCollectionDetailById, getPaymentMethod } from "@/lib/actions/collection";
import Loading from "@/app/loading";
import { Form } from "@/components/ui/form";
import { DefaultFormSelect, DefaultFormTextField } from "@/components/ui/default-form-field";
import { zodPatterns } from "@/lib/utils/zod-patterns";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaymentMethod } from "@/lib/repositories/paymentRepository";


interface ReceiptFormProps {
  collectionId: number;
  closeForm: () => void;
}

export interface ReceiptData {
  borrowerId: string;
  borrowerName: string;
  loanId: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: string;
  referenceNumber: string;
  collectorId: string;
  notes: string;
}

const formScheme = z.object({
  amount: zodPatterns.numberString.schema().min(1, "Amount is required"),
  payment_date: zodPatterns.date.schema(),
  payment_method: z.string().min(1, "Payment method is required"),
  utr_number: z.string().min(1, "Reference number is required"),
});

export type ReceiptFormValues = z.infer<typeof formScheme>;


export default function ReceiptForm({ collectionId, closeForm }: ReceiptFormProps) {
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [paymentMethodArray, setPaymentMethodArray] = useState<any[]>([]);

  const [data, setData] = useState<ReceiptData>();

  const defaultValues: Partial<ReceiptFormValues> = {
    amount: 0,
    payment_date: new Date(),
    payment_method: "",
    utr_number: "",
  };

  const form = useForm<ReceiptFormValues>({
    resolver: zodResolver(formScheme),
    defaultValues,
  });


  useEffect(() => {
    (async () => {
      setLoading(true);

      const result = await getCollectionDetailById(collectionId);

      const paymentMethodResult = await getPaymentMethod();
      const formattedMethods = paymentMethodResult.result.map((method: PaymentMethod) => ({
        label: method.name,
        value: method.id,
      }));

      setPaymentMethodArray(formattedMethods);
      setPaymentMethods(paymentMethodResult.result);

      
      setLoading(false);

    })();
  }, []);


  async function onSubmit(data: ReceiptFormValues) {

  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add User</CardTitle>
        <CardDescription>
          Add a new user to the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading
          ? <Loading />
          : <div className="my-3">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <DefaultFormSelect
                  form={form}
                  name="payment_method"
                  label="Payment Method"
                  placeholder="Select Payment Method"
                  options={paymentMethodArray}
                />


                <div className="flex justify-end">
                  <Button type="submit">Add User</Button>
                </div>
              </form>
            </Form>
          </div>}
      </CardContent>
    </Card>
  );
}