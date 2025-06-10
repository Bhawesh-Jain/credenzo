'use client';

import { Button } from '@/components/ui/button';
import { DefaultFormTextArea, DefaultFormTextField } from '@/components/ui/default-form-field';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select } from '@/components/ui/select';
import { X } from 'lucide-react';
import { useState } from 'react';

export default function PersonalDetails({
    form
}: {
    form: any
}) {
    const [ownerNames, setOwnerNames] = useState(['']);
    const ownershipType = form.watch('ownership_type');
    const isCoOwned = ownershipType === 'Co-owned';
    const addOwnerName = () => {
        setOwnerNames([...ownerNames, '']);
    }
    const removeOwnerName=(index)=>{
    if (ownerNames.length > 1) {
         const newOwnerNames=ownerNames.filter((i,n)=>n!==index);
         setOwnerNames(newOwnerNames);
    }
    }
    return (
        <div className='grid sm:grid-cols-2 grid-cols-1 gap-5'>
            <FormField
                control={form.control}
                name="property_type"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Property Type <span className="text-red-500">*</span></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} required>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Property Type" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Residential">Residential</SelectItem>
                                <SelectItem value="Commercial">Commercial</SelectItem>
                                <SelectItem value="Agricultural">Agricultural</SelectItem>
                                <SelectItem value="Industrial">Industrial</SelectItem>
                                <SelectItem value="Land">Land</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="ownership_type"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Ownership Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select ownership type" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Owned">Owned</SelectItem>
                                <SelectItem value="Co-owned">Co-owned</SelectItem>
                                <SelectItem value="Inherited">Inherited</SelectItem>
                                <SelectItem value="Leased">Leased</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className='flex flex-col gap-4'>
                {ownerNames.map((name, index) => (
                    <div className='flex flex-row items-center gap-2'>
                        <div className='flex-1'>
                            <FormField
                                control={form.control}
                                name={`owner_names.${index}`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>owner name</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder={`Owner ${index + 1} Name`}
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {(isCoOwned || ownerNames.length > 1) && ownerNames.length > 1 && (
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeOwnerName(index)}
                                className="mt-8"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ))}
                {isCoOwned && (
                    <Button type="button" onClick={addOwnerName} >Add Another Owner</Button>
                )}
            </div>

            <DefaultFormTextArea
                form={form}
                label='Property Address'
                name='property_address'
                placeholder=''
            />
            <DefaultFormTextField
                form={form}
                label='City'
                name='city'
                placeholder=''
            />

            <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>State </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Gender" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Owned">Owned</SelectItem>
                                <SelectItem value="Co-owned">Co-owned</SelectItem>
                                <SelectItem value="Inherited">Inherited</SelectItem>
                                <SelectItem value="Leased">Leased</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}

