import { NextRequest, NextResponse } from 'next/server'
import { pdfGenerate } from '@/lib/actions/pdf'
import { getCompanyDetails } from '@/lib/actions/company'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const id = searchParams.get('id')

  if (!id) {
    return new Response('Missing receipt ID', { status: 400 })
  }

  try {
   
    return new Response()
  } catch (error) {
    return new Response('PDF generation failed', { status: 500 })
  }
}