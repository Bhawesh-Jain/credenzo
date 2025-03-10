import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form";
import { Input } from "./input";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "./select";
import { Textarea } from "./textarea";

export function DefaultFormTextField({
  label,
  name,
  placeholder,
  uppercase = false,  
  capitalize = true,  
  form
}: {
  label: string,
  name: string,
  placeholder: string,
  uppercase?: boolean,
  capitalize?: boolean,
  form: any
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input 
              placeholder={placeholder}
              {...field}
              value={field.value || ''}
              onChange={(e) => {
                const value = uppercase 
                  ? e.target.value.toUpperCase()
                  : e.target.value;
                field.onChange(value);
              }}
              autoCapitalize={capitalize ? "sentences" : "off"}
              onInput={uppercase ? (e) => {
                e.currentTarget.value = e.currentTarget.value.toUpperCase()
              } : undefined}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}


export function DefaultFormTimeField({
  label,
  name,
  placeholder,
  form
}: {
  label: string,
  name: string,
  placeholder: string,
  form: any
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type="time"  placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
};

export function DefaultFormTextArea({
  label,
  name,
  placeholder,
  form
}: {
  label: string,
  name: string,
  placeholder: string,
  form: any
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea  placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
};


export function DefaultFormSelect({
  label,
  name,
  placeholder,
  options,
  form,
}: {
  label: string,
  name: string,
  options: any[],
  placeholder: string,
  form: any,
}) {
  return (  
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              defaultValue={String(field.value)}
              form={form}
            > 
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
};

