'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container"; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// --- Zod Schema for Validation ---
export const bankingInfoSchema = z.object({
    accountHolderName: z.string().min(1, "Account holder name is required"),
    bankName: z.string().min(1, "Bank name is required"),
    accountNumber: z.string().min(1, "Account number is required"),
    ifscCode: z.string().min(1, "IFSC code is required"),
    accountType: z.string().min(1, "Account type is required"),
    branchName: z.string().optional(), 
    branchAddress: z.string().optional(),
});

// --- TypeScript Type from Schema ---
export type BankingInfoFormValues = z.infer<typeof bankingInfoSchema>;

// --- Account Type Options ---
const accountTypeOptions = [
    { value: "savings", label: "Savings Account" },
    { value: "checking", label: "Checking Account" },
    { value: "current", label: "Current Account" },
    { value: "other", label: "Other" },
];

// --- Component Props ---
interface BankingInfoFormProps {
    /**
     * Optional: Initial data to pre-fill the form (e.g., for editing)
     */
    initialData?: Partial<BankingInfoFormValues>;
    /**
     * Optional callback function to run on successful form submission
     */
    onSaveSuccess?: (data: BankingInfoFormValues) => void;
    /**
     * Optional callback function to run when the cancel button is clicked
     */
    onCancel?: () => void;
    /**
     * Optional: Function to handle the actual API call to save data
     * Receives validated form data and should return a Promise
     */
    saveBankingDetails?: (data: BankingInfoFormValues) => Promise<{ success: boolean; error?: string }>;
}

// --- Banking Information Form Component ---
export default function BankingInfoForm({
    initialData,
    onSaveSuccess,
    onCancel,
    saveBankingDetails, // Accept the save function as a prop
}: BankingInfoFormProps) {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast(); // Hook for showing toasts

    // Initialize react-hook-form
    const form = useForm<BankingInfoFormValues>({
        resolver: zodResolver(bankingInfoSchema),
        defaultValues: initialData || {
            accountHolderName: "",
            bankName: "",
            accountNumber: "",
            ifscCode: "",
            accountType: "",
            branchName: "",
            branchAddress: "",
        },
    });

    // Handle form submission
    const onSubmit = async (values: BankingInfoFormValues) => {
        setLoading(true);
        console.log("Submitting banking info:", values); // Log values for debugging

        if (saveBankingDetails) {
            try {
                const result = await saveBankingDetails(values);

                if (result.success) {
                    toast({
                        title: "Success",
                        description: "Banking details saved successfully.",
                    });
                    onSaveSuccess?.(values); // Call success callback with saved data
                } else {
                    toast({
                        title: "Error",
                        description: result.error || "Failed to save banking details.",
                        variant: "destructive",
                    });
                }
            } catch (error: any) {
                toast({
                    title: "Error",
                    description: error.message || "An unexpected error occurred.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        } else {
             // Placeholder logic if no save function is provided
             console.warn("No saveBankingDetails function provided. Simulating save...");
             await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
             setLoading(false);
             toast({
                title: "Info",
                description: "Banking details form submitted (no save function provided).",
            });
            onSaveSuccess?.(values); // Still call success callback
        }
    };

    return (
        <Container> {/* Using Container component */}
            <Card>
                <CardHeader>
                    <CardTitle>Banking Information</CardTitle>
                    <CardDescription>Enter the bank account details for the customer/company.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Grid layout for form fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Account Holder Name */}
                                <FormField
                                    control={form.control}
                                    name="accountHolderName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Account Holder Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Bank Name */}
                                <FormField
                                    control={form.control}
                                    name="bankName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bank Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., State Bank of India" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Account Number */}
                                <FormField
                                    control={form.control}
                                    name="accountNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Account Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., 1234567890" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* IFSC Code */}
                                <FormField
                                    control={form.control}
                                    name="ifscCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>IFSC Code</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., SBIN0001234" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Account Type */}
                                <FormField
                                    control={form.control}
                                    name="accountType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Account Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select an account type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {accountTypeOptions.map(option => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Branch Name (Optional) */}
                                <FormField
                                    control={form.control}
                                    name="branchName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Branch Name (Optional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Main Branch" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                 {/* Branch Address (Optional) */}
                                 <FormField
                                    control={form.control}
                                    name="branchAddress"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Branch Address (Optional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., 123 High Street" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-4">
                                {onCancel && ( // Only render cancel button if onCancel prop is provided
                                    <Button variant="outline" onClick={onCancel} type="button" disabled={loading}>
                                        Cancel
                                    </Button>
                                )}
                                <Button type="submit" disabled={loading}>
                                    {loading ? "Saving..." : "Save Banking Details"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </Container>
    );
}