
import { DefaultFormTextField } from '@/components/ui/default-form-field';

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
    </div>
  );
}