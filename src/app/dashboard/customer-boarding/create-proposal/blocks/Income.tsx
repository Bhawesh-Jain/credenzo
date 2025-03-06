import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { DefaultFormSelect, DefaultFormTextField } from '@/components/ui/default-form-field';


export default function IncomeDetails({ form }: { form: any }) {
  const { watch } = useFormContext();
  const empType = watch("empType");
  const [type, setType] = useState("");

  useEffect(() => {
    switch (empType) {
      case 'salaried':
        setType("of Employer");
        break;
      case 'business':
        setType("of Business");
        break;
    }
  }, [empType]);

  return (
    <div className='grid grid-cols-2 gap-5'>
      <div className='col-span-2'>
        <DefaultFormSelect
          form={form}
          label='Employment Type'
          name='empType'
          options={[
            { label: "Salaried", value: "salaried" },
            { label: "Business", value: "business" },
          ]}
          placeholder='Select employment type'
        />
      </div>

      <DefaultFormTextField
        form={form}
        label={`Name ${type}`}
        name='incomeName'
        placeholder={`Enter Address ${type}`}
      />

      <DefaultFormTextField
        form={form}
        label={`Income ${type}`}
        name='incomeAmount'
        placeholder=''
      />

      <DefaultFormTextField
        form={form}
        label={`Address ${type}`}
        name='incomeAddress'
        placeholder={`Enter Address ${type}`}
      />

      <DefaultFormTextField
        form={form}
        label={`Contact Number ${type}`}
        name='incomeContact'
        placeholder={`Enter Contact Number ${type}`}
      />
    </div>
  );
}