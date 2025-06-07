'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form";
import { createProductsType } from "@/lib/actions/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/app/dashboard/loading";
import { useEffect, useState } from "react";
import { DefaultFormTextField, DefaultFormTextArea } from "@/components/ui/default-form-field";
import { useUser } from "@/contexts/user-context";
import { FormLabelWithIcon } from "@/components/ui/form-label-with-icon";
import { Icons } from "@/components/icons";

export interface Branch {
    id: number;
    product_type: string;
}
const formScheme = z.object({
    product_type: z.string().max(50, "Branch code must be less than 50 characters").optional(),
});

export type FormValues = z.infer<typeof formScheme>;


export default function AddProductType({
    setReload,
    branch
}: {
    setReload: (reload: boolean) => void,
    branch?: Branch | null
}) {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const { user } = useUser();

    const defaultValues: Partial<FormValues> = {
        product_type: branch?.product_type || ""
    };


    async function onSubmit(data: FormValues) {
        setLoading(true);
        console.log('Data:-----', data);
        const result = await createProductsType(data.product_type)

        setLoading(false);
        if (result.success) {
            toast({
                title: "Branch created successfully",
                description: "The branch has been created successfully",
            })
            form.reset();
            setOpen(false);
            setReload(true);
        } else {
            toast({
                title: "Error",
                description: result.error,
                variant: "destructive"
            })
        }
    }

    const form = useForm<FormValues>({
        resolver: zodResolver(formScheme),
        defaultValues,
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div>
                    <FormLabelWithIcon icon={Icons.plus}></FormLabelWithIcon>
                </div>

            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Product Type</DialogTitle>
                    <DialogDescription>
                        Add a new branch to the system
                    </DialogDescription>
                </DialogHeader>
                <div className="my-3">
                    {loading ? <Loading /> : <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 items-center">
                                <DefaultFormTextField
                                    label="Product Type"
                                    form={form}
                                    placeholder="Enter product type"
                                    name="product_type"
                                />

                            </div>

                            <div className="flex justify-end">
                                <Button type="submit">Add Product</Button>
                            </div>
                        </form>
                    </Form>}
                </div>
            </DialogContent>
        </Dialog>
    )
}