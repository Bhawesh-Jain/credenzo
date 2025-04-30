'use client'

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/app/dashboard/loading";
import { useState } from "react";
import { DefaultFormTextField } from "@/components/ui/default-form-field";
import { Card, CardContent, CardDescription, CardTitle, CardHeader } from "@/components/ui/card";
import { CollectionAccount } from "@/lib/repositories/collectionRepository";
import DatePicker from "@/components/date-picker";
import { createCollection } from "@/lib/actions/collection";
import { zodPatterns } from "@/lib/utils/zod-patterns";


const formScheme = z.object({
  ref: z.string().readonly(),
  amount: zodPatterns.numberString.schema(),
	due_date: z.date({
    required_error: "Due date is required",
  }),
});

export type CollectionFormValues = z.infer<typeof formScheme>;

export default function AddCollection({
  initialData,
  onClose,
  onReload,
}: {
  initialData: CollectionAccount,
  onClose: () => void,
  onReload: () => void,
}) {
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  
  const defaultValues: Partial<CollectionFormValues> = {
    ref: initialData.loan_ref
  };

  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(formScheme),
    defaultValues,
  });

  async function onSubmit(data: CollectionFormValues) {

    setLoading(true);
    try {
      const result = await createCollection(data);
      if (result.success) {
        toast({
          title: "Success",
          description: result.result,
        });
        onClose()
        onReload()
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add collection",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Collection</CardTitle>
        <CardDescription>
          Add a new collection for recovery.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading
          ? <Loading />
          : <div className="my-3">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <DefaultFormTextField
                    form={form}
                    name="ref"
                    disabled={true}
                    label="Loan Reference"
                    placeholder=""
                  />
                  <DefaultFormTextField
                    form={form}
                    name="amount"
                    label="Collection Amount"
                    placeholder="Enter Collection Amount"
                  />
                </div>
                <FormField
                    control={form.control}
                    name="due_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <DatePicker
                            date={field.value || null}
                            maxToday={false}
                            minToday={true}
                            onChange={(date) => field.onChange(date)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />


                <div className="flex justify-end">
                  <Button type="submit">Add Collection</Button>
                </div>
              </form>
            </Form>
          </div>}
      </CardContent>
    </Card>
  );
}