'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Icons } from "@/components/icons";
import { FormLabelWithIcon } from "@/components/ui/form-label-with-icon";
import { useGlobalDialog } from '@/providers/DialogProvider';
import DatePicker from "@/components/date-picker";
import { useEffect, useState } from "react";
import { DefaultFormSelect } from "@/components/ui/default-form-field";
import FormItemSkeleton from "@/components/skeletons/form-item-skeleton";
import { getProductsType, updateProducts } from "@/lib/actions/settings";
import AddProductType from "./AddProductType";

// Extend your existing schema with an id field for editing
const editDirectCollectionSchema = z.object({
    id: z.number(),
    name: z.string().min(2, "Customer name must be at least 2 characters"),
    minimum_cibil_score: z.number({
        required_error: "Minimum Civil Score is required",
        invalid_type_error: "Please enter a valid number"
    }).min(1, "Loan amount must be positive"),
    type: z.string().min(1, "Loan type is required"),
    minimum_tenure: z.number({
        required_error: "Loan tenure is required",
        invalid_type_error: "Please enter a valid number"
    }).min(1, "minimum tenure should be at least 1 month"),
    maximum_tenure: z.number({
        required_error: "Loan tenure is required",
        invalid_type_error: "Please enter a valid number"
    }).min(1, "maximum tenure should be at least 1 month"),
    age: z.date({
        required_error: "Age is required"
    }),
    interest_rate: z.number().min(1, "Interest rate is required"),
});

export type EditProductsValues = z.infer<typeof editDirectCollectionSchema>;

interface EditProductsProps {
    initialData: EditProductsValues;
    onClose: () => void;
    onReload: () => void;
}

export default function EditProduct({
    initialData,
    onClose,
    onReload,
}: EditProductsProps) {
    const { showSuccess, showError, showConfirmation, setLoading } = useGlobalDialog();
    const form = useForm<EditProductsValues>({
        resolver: zodResolver(editDirectCollectionSchema),
        defaultValues: initialData,
    });

    const [productsData, setProductsData] = useState<{ label: string; value: string }[]>([]);
    const [formLoading, setFormLoading] = useState<boolean>(false);
    const statuses = [
        {
            label: 'Active',
            value: '1'
        },
        {
            label: 'Inactive',
            value: '0'
        },
    ]

    useEffect(() => {
        (async () => {

            const accounts = await getProductsType();
            console.log("Products Type: ", accounts);
            if (accounts.success) {
                const formattedUsers = accounts.result.map((branch: any) => ({
                    label: branch.type,
                    value: branch.type,
                }));

                setProductsData(formattedUsers)
            } else {
                showError('Users Not Found!', accounts.error)
            }
        })();
    }, []);

    async function onSubmit(data: EditProductsValues) {
        showConfirmation(
            'Update Account',
            'Are you sure you want to update this account?',
            async () => {
                try {
                    setLoading(true);
                    console.log(data.id, 'Data:-----', data);
                    const result = await updateProducts(data);
                    setLoading(false);
                    if (result.success) {
                        showSuccess('Account Updated', 'The direct collection account has been updated.');
                        form.reset();
                        onClose();
                        onReload();
                    } else {
                        showError('Error', result.error);
                    }
                } catch (error) {
                    setLoading(false);
                    showError('Error', 'There was a problem updating the direct collection account.');
                }
            }
        );
    }

    return (
        <div>
            <div className="w-full">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-gray-800">
                        Edit Products
                    </CardTitle>
                    {/* <CardDescription>
                        Update the information for this direct collection account.
                    </CardDescription> */}
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {/* Customer Information Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-700">Product Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <DefaultFormSelect
                                        form={form}
                                        label='Account Status'
                                        name='status'
                                        options={statuses}
                                        placeholder='Select Account Status'
                                    />

                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabelWithIcon icon={Icons.user}> Name</FormLabelWithIcon>
                                                <FormControl>
                                                    <Input placeholder="Enter customer name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className='md:col-span-2'>
                                        {formLoading
                                            ? <FormItemSkeleton />
                                            :
                                            <div className=" flex items-center">
                                                <div className="mb-10 mr-2 ">
                                                    <AddProductType />
                                                </div>
                                                <div className="flex-1"> <DefaultFormSelect
                                                    form={form}
                                                    label='Type'
                                                    name='type'
                                                    options={productsData}
                                                    placeholder='Select Associated Branch'
                                                />
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>

                            {/* Loan Information Section */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="minimum_cibil_score"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabelWithIcon icon={Icons.receiptIndianRupee}>Minimum Cibil Score</FormLabelWithIcon>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="Enter loan amount"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="interest_rate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabelWithIcon icon={Icons.percent}>Interest Rate</FormLabelWithIcon>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="Enter EMI amount"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="minimum_tenure"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabelWithIcon icon={Icons.tag}>Minimum Tenure (month)</FormLabelWithIcon>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="Enter minimum tenure"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="maximum_tenure"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabelWithIcon icon={Icons.calendar}>Maximum Tenure (months)</FormLabelWithIcon>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="Enter maximum tenure"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="age"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabelWithIcon icon={Icons.calendar}> Minimum Age</FormLabelWithIcon>
                                                <FormControl>
                                                    <DatePicker
                                                        date={field.value || null}
                                                        maxToday={false}
                                                        onChange={(date) => field.onChange(date)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                </div>
                            </div>

                            {/* Submission */}
                            <div className="flex justify-end space-x-4">
                                <Button type="submit">Update Account</Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </div>
        </div>
    );
}
