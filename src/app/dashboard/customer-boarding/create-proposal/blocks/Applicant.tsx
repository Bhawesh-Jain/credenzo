
import DatePicker from '@/components/date-picker';
import { DefaultFormTextField } from '@/components/ui/default-form-field';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select } from '@/components/ui/select';

export default function PersonalDetails({
  form
}: { 
  form: any
}) {

  return (
    <div className='grid grid-cols-2 gap-5'>
      <DefaultFormTextField
        form={form}
        label='First Name'
        name='firstName'
        placeholder=''
      />

      <DefaultFormTextField
        form={form}
        label='Last Name'
        name='lastName'
        placeholder=''
      />

      <DefaultFormTextField
        form={form}
        label='Email Address'
        name='email'
        placeholder=''
      />

      <DefaultFormTextField
        form={form}
        label='Phone Number'
        name='phone'
        placeholder=''
      />

      <DefaultFormTextField
        form={form}
        label='PAN'
        uppercase
        name='panCard'
        placeholder=''
      />

      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gender</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="dob"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Date of Birth</FormLabel>
            <FormControl>
              <DatePicker
                date={field.value}
                subYear={18}
                onChange={(date) => field.onChange(date)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

