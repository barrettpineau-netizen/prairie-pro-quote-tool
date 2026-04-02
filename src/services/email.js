import emailjs from '@emailjs/browser'

const SERVICE_ID = 'service_u20d8hw'
const TEMPLATE_ID = 'template_lewjlh5'
const PUBLIC_KEY = 'VZ_w3RzeomFuCYm2T'

// ⚠️ TEST MODE — remove this line and use quoteData.clientEmail when going live
const TEST_EMAIL = 'barrettpineau@gmail.com'

emailjs.init(PUBLIC_KEY)

export async function sendQuoteEmail({ pdfBase64, quoteData }) {
  const templateParams = {
    to_name: quoteData.clientName,
    to_email: TEST_EMAIL, // swap to quoteData.clientEmail when live
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
