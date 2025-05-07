"use server"

import { PdfOptions } from '@/lib/helpers/pdf-helper';

export async function pdfGenerate(
  templateName: string,
  data: any,
  options?: PdfOptions
): Promise<Uint8Array<ArrayBufferLike>> {
  const { default: PdfHelper } = await import('@/lib/helpers/pdf-helper');
  return PdfHelper.generate(templateName, data, options);
}