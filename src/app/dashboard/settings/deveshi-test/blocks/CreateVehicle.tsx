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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button, ButtonTooltip } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Icons } from "@/components/icons";
import { FormLabelWithIcon } from "@/components/ui/form-label-with-icon";
import { getVehicleCompany } from "@/lib/actions/settings";
import { createVehicle } from '@/lib/actions/settings';
import { useGlobalDialog } from '@/providers/DialogProvider'
import AddCompany from "./AddCompany";
import { Children, useEffect, useState } from "react";
import { getLoanProductTypes } from "@/lib/actions/loan-product";
import { DefaultFormSelect, DefaultFormTimeField } from "@/components/ui/default-form-field";
import FormItemSkeleton from "@/components/skeletons/form-item-skeleton";
import DatePicker from "@/components/date-picker";
import { PlusCircle } from "lucide-react";
const vehicleFormSchema = z.object(
    {
        chassis_number: z.string().min(17, "must be atleast 17 characters"),
        make: z.string().min(2, "must be atleast 2 characters"),
        model: z.string().min(2, "must be atleast 2 characters"),
        company: z.string().min(2, "must be atleast 2 characters"),
        status: z.enum(["1", "-1"], {
            required_error: "Status must be active or inactive",
        }),
    }
)

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

type CreateVehicleProps = {
    //   setshowform: React.Dispatch<React.SetStateAction<boolean>>;
    setVis: (vis: boolean) => void;
    setReload: (reload: boolean) => void;
};


export default function CreateVehicle({ setVis, setReload }: CreateVehicleProps) {
    const { showSuccess, showError, showConfirmation, setLoading } = useGlobalDialog()
    const [companies, setCompanies] = useState<string[]>([]);
    const [openDialog, setOpenDialog] = useState(false);

    const form = useForm<VehicleFormValues>({
        resolver: zodResolver(vehicleFormSchema),

    })

    useEffect(() => {
        (async () => {
            const response = await getVehicleCompany();
            console.log(response)

            if (response.success) {
                const names = response.result.map((item: { company: string }) => item.company);

                console.log(names)

                setCompanies(names);

            } else {
                console.error("Failed to fetch companies:", response.error);
            }
        })();
    }, []);




    async function onSubmit(data: VehicleFormValues) {

        showConfirmation(
            'Create Vehicle',
            'Are you sure you want to create this Vehicle?',
            async () => {
                try {
                    setLoading(true)
                    const result = await createVehicle(data)
                    setLoading(false)

                    if (result.success) {
                        showSuccess('Vehicle Created', 'The Vehicle has been created.')
                        form.reset()
                        setVis(false)
                        setReload(true)
                    } else {
                        showError('Error', result.error)
                    }
                } catch (error) {
                    setLoading(false)
                    showError('Error', 'There was a problem creating the vehicle.')
                    console.log(error)

                }
            }
        )
    }

    return (
        <div>
            <div className="w-full">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-lg font-semibold text-gray-800">
                        Create New Vehicle
                    </CardTitle>
                    <CardDescription>
                        Enter the Vehicle&apos;s information to create a new Vehicle Detail
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form  {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <h3 className="text-lg font-semibold text-gray-700">Vehicle Information</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="chassis_number"
                                        render={({ field }) =>
                                        (
                                            <FormItem>
                                                <FormLabelWithIcon icon={Icons.user}>Chassis Number</FormLabelWithIcon>
                                                <FormControl>
                                                    <Input placeholder="Enter chassis number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="make"
                                        render={({ field }) =>
                                        (
                                            <FormItem>
                                                <FormLabelWithIcon icon={Icons.user}>Manufacturing</FormLabelWithIcon>
                                                <FormControl>
                                                    <Input placeholder="Enter manufacturing(make..)" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="model"
                                        render={({ field }) =>
                                        (
                                            <FormItem>
                                                <FormLabelWithIcon icon={Icons.user}>Model</FormLabelWithIcon>
                                                <FormControl>
                                                    <Input placeholder="Enter model of the vehical" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="company"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex justify-between items-center">
                                                    <FormLabelWithIcon icon={Icons.user}>Company</FormLabelWithIcon>
                                                    <Button variant="outline" size="sm" onClick={() => setOpenDialog(true)}>
                                                        + Add Company
                                                    </Button>
                                                </div>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Company" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {companies.map((company) => (
                                                            <SelectItem key={company} value={company}>
                                                                {company}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabelWithIcon icon={Icons.user}>Status</FormLabelWithIcon>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="1">Active</SelectItem>
                                                        <SelectItem value="-1">Inactive</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <Button type="submit">
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
                <AddCompany
                    open={openDialog}
                    setOpen={setOpenDialog}
                    onAdd={(newCompany) => {
                        setCompanies((prev) => [...prev, newCompany])
                    }}
                />

            </div>
        </div>
    )
}