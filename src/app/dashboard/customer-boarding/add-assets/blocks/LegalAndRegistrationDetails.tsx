
import DatePicker from '@/components/date-picker';
import { DefaultFormTextField } from '@/components/ui/default-form-field';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export default function LegalAndRegistrationDetails({
    form
}: {
    form: any
}) {

    return (
        <div className='grid sm:grid-cols-2 grid-cols-1 gap-5'>
            <div className='col-span-2'>
                <DefaultFormTextField
                    form={form}
                    label='Property Registration NO.'
                    name='property_registration_no'
                    placeholder=''
                />

            </div>
            <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                    <FormItem className="">
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
            <FormField
                control={form.control}
                name="legal_owner_document"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Legal Owner Document</FormLabel>
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


        </div>
    );
}