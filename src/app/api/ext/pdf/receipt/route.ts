import { NextRequest, NextResponse } from 'next/server'
import { getReceiptById } from '@/lib/actions/collection'
import { pdfGenerate } from '@/lib/actions/pdf'
import { getCompanyDetails } from '@/lib/actions/company'
import { decryptId } from '@/lib/utils/crypto'
import formatDate, { formatDateTime } from '@/lib/utils/date'
import { customLog } from '@/lib/utils'

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const encryptedId = searchParams.get('id')

    if (!encryptedId) {
        return new Response('Missing receipt ID', { status: 400 })
    }

    try {
        const receiptId = decryptId(encryptedId);       

        const receiptRes = await getReceiptById(receiptId);

        if (!receiptRes.success) {
            return new Response('Failed to fetch data', { status: 500 })
        }

        var receiptData = receiptRes.result;
        
        var pdfData = {
            companyLogoUrl: process.env.NEXT_PUBLIC_BASE_URL + receiptData.logo_url,
            companyName: receiptData.company_name,
            companyAddress: receiptData.address,
            companyContact: receiptData.phone,
            receiptNumber: receiptData.id,
            paymentDate: formatDate(receiptData.payment_date),
            paymentMethod: receiptData.payment_method,
            utrNumber: receiptData.utr_number,
            customerName: receiptData.customer_name,
            loanRef: receiptData.ref,
            loanAmount: receiptData.loan_amount,
            loanEmiAmount: receiptData.loan_emi_amount,
            loanType: receiptData.loan_type,
            loanTenure: receiptData.loan_tenure,
            interestRate: receiptData.interest_rate,
            loanStartDate: formatDate(receiptData.loan_start_date),
            dueDate: formatDate(receiptData.due_date),
            currencySymbol: receiptData.currency_symbol,
            amount: receiptData.amount,
            lendorName: receiptData.lendor_name,
            paymentStatus: receiptData.status_name,
            receiptGenerationDate: formatDateTime(new Date().toString()),
        }

        const pdfBuffer = await pdfGenerate('receipt', pdfData)
        return new Response(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="receipt-${receiptId}.pdf"`
            }
        })
    } catch (error) {
        customLog('Error generating PDF:', error)
        return new Response('PDF generation failed', { status: 500 })
    }
}