import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { DefaultFormSelect, DefaultFormTextField } from '@/components/ui/default-form-field';


export default function LoanProductDetails({ form, productTypeList, branchList }: { form: any, productTypeList: any[], branchList: any[] }) {


  return (
    <div className='grid grid-cols-2 gap-5'>
      <div className='col-span-2'>
        <DefaultFormSelect
          form={form}
          label='Loan Product Type'
          name='produtType'
          options={productTypeList}
          placeholder='Select Product Type'
        />
      </div>

      <DefaultFormTextField
        form={form}
        label='Loan Purpose'
        name='purpose'
        placeholder=''
      />

      <DefaultFormTextField
        form={form}
        label='Loan Amount'
        name='loanAmount'
        placeholder=''
      />

      <div className='col-span-2'>
        <DefaultFormSelect
          form={form}
          label='Associated Branch'
          name='branch'
          options={branchList}
          placeholder='Select Associated Branch'
        />
      </div>


    </div>
  );
}