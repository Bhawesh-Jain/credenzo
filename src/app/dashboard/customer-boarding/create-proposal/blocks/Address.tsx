
import { DefaultFormTextField } from '@/components/ui/default-form-field';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AddressDetails({
  form
}: {
  form: any
}) {

  return (
    <div className='grid grid-cols-2 gap-5'>
      <div className='col-span-2'>
        <DefaultFormTextField
          form={form}
          label='Address line 1'
          name='add_line_1'
          placeholder=''
        />
      </div>

      <div className='col-span-2'>
        <DefaultFormTextField
          form={form}
          label='Address line 2'
          name='add_line_2'
          placeholder=''
        />
      </div>

      <div className='col-span-2'>
        <DefaultFormTextField
          form={form}
          label='Address line 3'
          name='add_line_3'
          placeholder=''
        />
      </div>

      <div className=''>
        <DefaultFormTextField
          form={form}
          label='Landmark'
          name='landmark'
          placeholder=''
        />
      </div>

      <FormField
        control={form.control}
        name="ownership"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Residence Ownership</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Ownership" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Owned">Owned</SelectItem>
                <SelectItem value="Rented">Rented</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className=''>
        <DefaultFormTextField
          form={form}
          label='Residing Since'
          name='since'
          placeholder=''
        />
      </div>

      <div className=''>
        <DefaultFormTextField
          form={form}
          label='Pincode'
          name='pincode'
          placeholder=''
        />
      </div>

      <div className=''>
        <DefaultFormTextField
          form={form}
          label='City'
          name='city'
          placeholder=''
        />
      </div>

      <div className=''>
        <DefaultFormTextField
          form={form}
          label='State'
          name='state'
          placeholder=''
        />
      </div>
    </div>
  );
}