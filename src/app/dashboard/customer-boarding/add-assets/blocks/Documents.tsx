

import DatePicker from '@/components/date-picker';
import { DefaultFormTextField } from '@/components/ui/default-form-field';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Documents({
  form
}: {
  form: any
}) {

  return (
    <div className='grid grid-cols-2 gap-5'>
      <FormField
                         control={form.control}
                         name="loan_amount"
                         render={({ field }) => (
                           <FormItem>
                             <FormLabel>Appox Market Value</FormLabel>
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
                         name="loan_amount"
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
                         name="loan_amount"
                         render={({ field }) => (
                           <FormItem>
                             <FormLabel>EMI Amount</FormLabel>
                             <FormControl>
                               <Input
                                 type="number"
                                 placeholder="Enter emi amount"
                                 {...field}
                                 onChange={(e) => field.onChange(Number(e.target.value))}
                               />
                             </FormControl>
                             <FormMessage />
                           </FormItem>
                         )}
                       />
    

    </div>
  );
}