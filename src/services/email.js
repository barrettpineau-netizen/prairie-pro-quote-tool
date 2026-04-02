import emailjs from '@emailjs/browser'

const SERVICE_ID = 'service_u20d8hw'
const TEMPLATE_ID = 'template_lewjlh5'
const PUBLIC_KEY = 'VZ_w3RzeomFuCYm2T'

emailjs.init(PUBLIC_KEY)

/**
 * Send the quote PDF to the client via EmailJS.
 */
export async function sendQuoteEmail({ pdfBase64, quoteData }) {
  const templateParams = {
    to_name: quoteData.clientName,
    to_email: quoteData.clientEmail,
    from_name: 'Prairie Pro Foundation Repair',
    quote_number: quoteData.quoteNumber,
    address: quoteData.address,
    reply_to: 'barrett@prairieprofoundations.ca',
    pdf_attachment: pdfBase64,
    message: `Please find attached your foundation repair quote (${quoteData.quoteNumber}) for ${quoteData.address}.

If you have any questions, please don't hesitate to reach out.

Thank you for trusting Prairie Pro Foundation Repair!`,
  }

  const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
  return response
}
