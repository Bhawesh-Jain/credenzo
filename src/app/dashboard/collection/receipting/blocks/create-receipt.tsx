"use client"

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import DatePicker from "@/components/date-picker";

// Types
interface LoanCollector {
  id: string;
  name: string;
}

interface ReceiptFormProps {
  collectors: LoanCollector[];
  onSubmit: (receiptData: ReceiptData) => void;
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

export default function ReceiptForm({ collectors, onSubmit }: ReceiptFormProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [formData, setFormData] = useState<ReceiptData>({
    borrowerId: "",
    borrowerName: "",
    loanId: "",
    amount: 0,
    paymentDate: new Date(),
    paymentMethod: "",
    referenceNumber: "",
    collectorId: "",
    notes: ""
  });

  const handleChange = (field: keyof ReceiptData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, paymentDate: date });
  };

  // Payment methods
  const paymentMethods = [
    "Cash",
    "Bank Transfer",
    "Credit Card",
    "Debit Card",
    "Mobile Money",
    "Check",
    "Online Payment"
  ];

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Create Payment Receipt</CardTitle>
        <CardDescription>Record a new loan payment from a borrower</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Borrower Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="borrowerName">Borrower Name</Label>
                <Input
                  id="borrowerName"
                  placeholder="Full name of borrower"
                  value={formData.borrowerName}
                  onChange={(e) => handleChange("borrowerName", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="borrowerId">Borrower ID</Label>
                <Input
                  id="borrowerId"
                  placeholder="Enter borrower ID"
                  value={formData.borrowerId}
                  onChange={(e) => handleChange("borrowerId", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="loanId">Loan ID</Label>
                <Input
                  id="loanId"
                  placeholder="Enter loan reference ID"
                  value={formData.loanId}
                  onChange={(e) => handleChange("loanId", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Payment Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="amount"
                    className="pl-8"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.amount || ""}
                    onChange={(e) => handleChange("amount", parseFloat(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="paymentDate">Payment Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <DatePicker
                      date={date}
                      onChange={(date) => {
                        setDate(date || new Date());
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select
                  onValueChange={(value) => handleChange("paymentMethod", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method} value={method}>{method}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Reference and Collector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="referenceNumber">Reference Number</Label>
              <Input
                id="referenceNumber"
                placeholder="Transaction reference number"
                value={formData.referenceNumber}
                onChange={(e) => handleChange("referenceNumber", e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                For bank transfers, checks, or digital payments
              </p>
            </div>

            <div>
              <Label htmlFor="collector">Collected By</Label>
              <Select
                onValueChange={(value) => handleChange("collectorId", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select collector" />
                </SelectTrigger>
                <SelectContent>
                  {collectors.map((collector) => (
                    <SelectItem key={collector.id} value={collector.id}>
                      {collector.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional information about this payment"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              className="min-h-24"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" type="button">Cancel</Button>
        <Button type="submit" onClick={handleSubmit}>Create Receipt</Button>
      </CardFooter>
    </Card>
  );
}