
import DatePicker from '@/components/date-picker';
import { DefaultFormTextField } from '@/components/ui/default-form-field';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Switch from '@/components/ui/switch';

export default function FinancialDetails({
  form
}: {
  form: any
}) {
  const isLoanTaken = form.watch('is_loan_taken');

  return (
    <div className='grid sm:grid-cols-2 gap-5'>
      <FormField
        control={form.control}
        name="appox_market_value"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Appox Market Value</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter appox market value"
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
        name="valuation_report"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Valuation Report (Optional)</FormLabel>
            <FormControl>
              <Input
                type="file"
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
        name="is_loan_taken"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Is Loan Taken on this Property?</FormLabel>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      /> {/* Conditional Loan Details */}
      {isLoanTaken && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
          <h4 className="font-medium text-sm text-gray-700 mb-3">Loan Details</h4>

          <div className='grid lg:grid-cols-2 gap-5'>
            <FormField
              control={form.control}
              name="outstanding_loan_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Outstanding Loan Amount *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter outstanding amount"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lender_bank_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lender Bank Name *</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter bank name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='grid sm:grid-cols-2 gap-5'>
            <FormField
              control={form.control}
              name="emi_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>EMI Amount *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter EMI amount"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}


    </div>
  );
}