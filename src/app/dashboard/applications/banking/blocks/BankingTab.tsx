'use client';

import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { DefaultFormTextField } from "@/components/ui/default-form-field";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// --- Types & Dummy Data ---

export type BankAccount = {
  id: number;
  bankName: string;
  branchName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  monthlyBalances: {
    month: string;
    year: string;
    balance: number;
  }[];
};

const initialAccounts: BankAccount[] = [
  {
    id: 1,
    bankName: "Bank of Example",
    branchName: "Downtown",
    accountNumber: "1234567890",
    ifscCode: "EXAM0ABC123",
    accountHolderName: "John Doe",
    monthlyBalances: [
      { month: "January", year: "2025", balance: 50000 },
      { month: "February", year: "2025", balance: 52000 },
      { month: "March", year: "2025", balance: 51000 },
    ],
  },
  {
    id: 2,
    bankName: "Sample Bank",
    branchName: "Uptown",
    accountNumber: "9876543210",
    ifscCode: "SAMP0XYZ789",
    accountHolderName: "Jane Smith",
    monthlyBalances: [
      { month: "January", year: "2025", balance: 75000 },
      { month: "February", year: "2025", balance: 73000 },
    ],
  },
];

// --- Add Bank Form Schema & Component ---

const addBankSchema = z.object({
  bankName: z.string().min(2, "Bank name is required"),
  branchName: z.string().min(2, "Branch name is required"),
  accountNumber: z.string().min(8, "Enter a valid account number"),
  ifscCode: z
    .string()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Enter a valid IFSC code"),
  accountHolderName: z.string().min(2, "Account holder name is required"),
  monthlyBalances: z.array(
    z.object({
      month: z.string().min(1, "Month is required"),
      year: z.string().min(4, "Year is required"),
      balance: z
        .number({ invalid_type_error: "Balance must be a number" })
        .min(0, "Balance must be positive"),
    })
  ).min(1, "At least one balance record is required"),
});

type AddBankFormValues = z.infer<typeof addBankSchema>;

function AddBankForm({
  onAdd,
  onCancel,
}: {
  onAdd: (data: AddBankFormValues) => void;
  onCancel: () => void;
}) {
  const form = useForm<AddBankFormValues>({
    resolver: zodResolver(addBankSchema),
    defaultValues: {
      bankName: "",
      branchName: "",
      accountNumber: "",
      ifscCode: "",
      accountHolderName: "",
      monthlyBalances: [{ month: "January", year: "2025", balance: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "monthlyBalances",
  });

  const onSubmit = (data: AddBankFormValues) => {
    onAdd(data);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Add New Bank Account</CardTitle>
        <CardDescription>Fill out the bank details below</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Bank Details */}
            <div className="grid grid-cols-2 gap-5">
              <DefaultFormTextField
                form={form}
                label="Bank Name"
                name="bankName"
                placeholder="Enter bank name"
              />
              <DefaultFormTextField
                form={form}
                label="Branch Name"
                name="branchName"
                placeholder="Enter branch name"
              />
              <DefaultFormTextField
                form={form}
                label="Account Number"
                name="accountNumber"
                placeholder="Enter account number"
              />
              <DefaultFormTextField
                form={form}
                label="IFSC Code"
                name="ifscCode"
                placeholder="Enter IFSC code"
              />
              <DefaultFormTextField
                form={form}
                label="Account Holder Name"
                name="accountHolderName"
                placeholder="Enter account holder name"
              />
            </div>

            {/* Monthly Balances Grid */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Monthly Balances</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-md">
                    <FormField
                      control={form.control}
                      name={`monthlyBalances.${index}.month`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Month</FormLabel>
                          <FormControl>
                            <input
                              {...field}
                              type="text"
                              placeholder="Month"
                              className="p-2 border border-gray-300 rounded-md w-full"
                            />
                          </FormControl>
                          <FormMessage>
                            {form.formState.errors.monthlyBalances?.[index]?.month?.message}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`monthlyBalances.${index}.year`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year</FormLabel>
                          <FormControl>
                            <input
                              {...field}
                              type="text"
                              placeholder="Year"
                              className="p-2 border border-gray-300 rounded-md w-full"
                            />
                          </FormControl>
                          <FormMessage>
                            {form.formState.errors.monthlyBalances?.[index]?.year?.message}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`monthlyBalances.${index}.balance`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Balance (₹)</FormLabel>
                          <FormControl>
                            <input
                              {...field}
                              type="number"
                              placeholder="Balance"
                              className="p-2 border border-gray-300 rounded-md w-full"
                            />
                          </FormControl>
                          <FormMessage>
                            {form.formState.errors.monthlyBalances?.[index]?.balance?.message}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                    <div className="mt-2 flex justify-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => append({ month: "", year: "", balance: 0 })}
                >
                  Add Balance
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <SubmitButton>Submit</SubmitButton>
              <Button variant="outline" type="button" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// --- Bank Accounts Manager Component ---

export default function BankAccountsManager({
  loanDetails,
  setForm
}: {
  loanDetails: any,
  setForm: (vis: boolean) => void,
}) {
  const [accounts, setAccounts] = useState<BankAccount[]>(initialAccounts);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddBank = (data: AddBankFormValues) => {
    const newAccount: BankAccount = {
      id: accounts.length ? accounts[accounts.length - 1].id + 1 : 1,
      bankName: data.bankName,
      branchName: data.branchName,
      accountNumber: data.accountNumber,
      ifscCode: data.ifscCode,
      accountHolderName: data.accountHolderName,
      monthlyBalances: data.monthlyBalances,
    };

    setAccounts([...accounts, newAccount]);
    setShowAddForm(false);
  };

  const handleRemoveAccount = (id: number) => {
    setAccounts(accounts.filter(account => account.id !== id));
  };

  return (
    <Container>
      {showAddForm ? (
        // When add form is open, replace the list with the form
        <AddBankForm onAdd={handleAddBank} onCancel={() => setShowAddForm(false)} />
      ) : (
        <>
          <CardHeader>
            <CardTitle>Bank Accounts</CardTitle>
            <CardDescription>
              {accounts.length > 0 ? "Your bank accounts" : "No bank accounts found."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {accounts.length > 0 ? (
              <div className="space-y-6">
                {accounts.map(account => (
                  <Card key={account.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{account.bankName}</h3>
                        <p>{account.branchName}</p>
                        <p>Account #: {account.accountNumber}</p>
                        <p>IFSC: {account.ifscCode}</p>
                        <p>Holder: {account.accountHolderName}</p>
                      </div>
                      <div>
                        <Button variant="destructive" size="sm" onClick={() => handleRemoveAccount(account.id)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                    {/* Monthly Balances Grid as a responsive grid of cards */}
                    <div className="mt-4">
                      <h4 className="font-semibold">Monthly Balances:</h4>
                      {account.monthlyBalances.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                          {account.monthlyBalances.map((bal, i) => (
                            <div key={i} className="p-3 border rounded-md bg-gray-50">
                              <p className="font-semibold">{bal.month} {bal.year}</p>
                              <p>₹{bal.balance.toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>No balance records.</p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                No bank accounts found. Please add one.
              </div>
            )}
          </CardContent>
          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={() => setForm(false)}>
              Cancel
            </Button>
            <Button variant="outline" onClick={() => setShowAddForm(true)}>
              Add Bank
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}
