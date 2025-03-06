
import { DefaultFormTextField } from '@/components/ui/default-form-field';

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