import { format } from 'date-fns';
import { enIN } from 'date-fns/locale';

export default function formatDate(date: string, dateFormat: string = 'dd-MM-yyyy') {
  return format(new Date(date), dateFormat, { locale: enIN });
}