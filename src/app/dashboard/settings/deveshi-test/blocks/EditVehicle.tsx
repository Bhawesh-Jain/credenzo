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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/app/dashboard/loading";
import { useEffect, useState } from "react";
import { Edit } from "lucide-react";
import { editVehicle ,getVehicleById } from "@/lib/actions/settings";
import { Icons } from "@/components/icons";
import { FormLabelWithIcon } from "@/components/ui/form-label-with-icon";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getLoanProductTypes } from "@/lib/actions/loan-product";
import { DefaultFormSelect, DefaultFormTimeField } from "@/components/ui/default-form-field";
import DatePicker from "@/components/date-picker";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getVehicleCompany } from "@/lib/actions/settings";


const vehicleFormScheme = z.object(
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

export type EditVehicleFormValues = z.infer<typeof vehicleFormScheme>;

type EditVehicleProps = {
    setOpen: (open: boolean) => void;
    setReload: (reload: boolean) => void;
    vehicleId: number
};

export default function EditVehicle({ setOpen, setReload,vehicleId }: EditVehicleProps) {
    const [companies, setCompanies] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const form = useForm<EditVehicleFormValues>({
        resolver: zodResolver(vehicleFormScheme),
    })
     

     useEffect(() => {
        (async () => {
          setLoading(true);
    
          const vehicle_data = await getVehicleById(vehicleId);
    
          if (vehicle_data.success) {
            var formItem = {
              ...vehicle_data.result,
              status: String(vehicle_data.result.status)
            }
            form.reset(formItem);
          }
          setLoading(false);
        })();

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

      }, [vehicleId, form]);


    async function onSubmit(data: EditVehicleFormValues) {
        setLoading(true);

        const result = await editVehicle(vehicleId ,data)

        setLoading(false);
        if (result.success) {
            toast({
                title: "Request successful",
                description: "The lead has been modified successfully",
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
    return (
        <div>
            <div className="w-full">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-lg font-semibold text-gray-800">
                        Edit Vehicle
                    </CardTitle>
                    <CardDescription>
                        Edit the Vehicle Detail
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ?
                        <Loading />
                        :
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

                                        {/* <FormField
                                            control={form.control}
                                            name="company"
                                            render={({ field }) =>
                                            (
                                                <FormItem>
                                                    <FormLabelWithIcon icon={Icons.user}>Company</FormLabelWithIcon>
                                                    <FormControl>
                                                        <Input placeholder="Enter name of the company" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        /> */}
<FormField
                                        control={form.control}
                                        name="company"
                                        render={({ field }) => (
                                            <FormItem>
                                                {/* <div className="flex justify-between items-center"> */}
                                                    <FormLabelWithIcon icon={Icons.user}>Company</FormLabelWithIcon>
                                                    {/* <Button variant="outline" size="sm" onClick={() => setOpenDialog(true)}>
                                                        + Add Company
                                                    </Button> */}
                                                {/* </div> */}
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
                        </Form>}
                </CardContent>
            </div>
        </div>
    )
}