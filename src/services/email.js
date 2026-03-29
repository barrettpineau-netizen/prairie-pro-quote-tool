import emailjs from '@emailjs/browser'
import { CONFIG } from '../constants.js'

emailjs.init(CONFIG.EMAILJS_PUBLIC_KEY)

/**
 * Send the quote PDF to the client via EmailJS.
 * pdfBlob: Blob from html2pdf
 * quoteData: { clientName, clientEmail, quoteNumber, address }
 */
export async function sendQuoteEmail({ pdfBase64, quoteData }) {
  if (!CONFIG.EMAILJS_SERVICE_ID || !CONFIG.EMAILJS_PUBLIC_KEY) {
    throw new Error('EMAILJS_NOT_CONFIGURED')
  }

  const templateParams = {
    to_name: quoteData.clientName,
    to_email: quoteData.clientEmail,
    from_name: 'Prairie Pro Foundation Repair',
    quote_number: quoteData.quoteNumber,
    address: quoteData.address,
    reply_to: CONFIG.SENDER_EMAIL,
    // pdf_attachment is sent as base64 — configure your EmailJS template to attach it
    pdf_attachment: pdfBase64,
    message: `Please find attached your foundation repair quote (${quoteData.quoteNumber}) for ${quoteData.address}. 
    
If you have any questions, please don't hesitate to reach out.

Thank you for trusting Prairie Pro Foundation Repair!`,
  }

  const response = await emailjs.send(
    CONFIG.EMAILJS_SERVICE_ID,
    CONFIG.EMAILJS_TEMPLATE_ID,
    templateParams
  )

  return response
}
