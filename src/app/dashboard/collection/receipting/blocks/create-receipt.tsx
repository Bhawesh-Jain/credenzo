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
import { Collection } from "@/lib/repositories/collectionRepository";


interface ReceiptFormProps {
  collectionId: number;
  closeForm: () => void;
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

  const [data, setData] = useState<Collection>();

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

      const collection = await getCollectionDetailById(collectionId);

      setData(collection.result)

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
        <CardTitle>{data?.customer_name} | {data?.loan_ref}</CardTitle>
        <CardDescription>
          Loan Amount: {data?.currency_symbol} {data?.loan_amount} | EMI Amount: {data?.currency_symbol} {data?.loan_emi_amount} | {data?.loan_type}
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


                <div className="flex justify-between gap-4">
                  <Button variant='outline' onClick={closeForm}>Cancel</Button>
                  <Button type="submit">Add User</Button>
                </div>
              </form>
            </Form>
          </div>}
      </CardContent>
    </Card>
  );
}