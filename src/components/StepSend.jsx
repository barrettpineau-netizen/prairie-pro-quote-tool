import React, { useState, useRef, useEffect } from 'react'
import QuotePDF from './QuotePDF.jsx'
import { sendQuoteEmail } from '../services/email.js'
import { CONFIG } from '../constants.js'
import s from './Steps.module.css'

export default function StepSend({ data, quoteNumber, onBack, onReset }) {
  const [status, setStatus] = useState('idle') // idle | generating | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('')
  const [downloadUrl, setDownloadUrl] = useState(null)
  const pdfRef = useRef()

  const generatePDF = async () => {
    setStatus('generating')
    try {
      const element = document.getElementById('quote-pdf-root')
      const opt = {
        margin: 0,
        filename: `${quoteNumber} - ${data.client?.address || 'Quote'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      }
      const blob = await window.html2pdf().set(opt).from(element).outputPdf('blob')
      return blob
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  const blobToBase64 = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result.split(',')[1])
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })

  const handleDownload = async () => {
    setStatus('generating')
    try {
      const element = document.getElementById('quote-pdf-root')
      const opt = {
        margin: 0,
        filename: `${quoteNumber} - ${data.client?.address || 'Quote'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      }
      await window.html2pdf().set(opt).from(element).save()
      setStatus('idle')
    } catch (err) {
      setStatus('error')
      setErrorMsg('PDF generation failed. Please try again.')
    }
  }

  const handleSend = async () => {
    if (!CONFIG.EMAILJS_SERVICE_ID || !CONFIG.EMAILJS_PUBLIC_KEY) {
      setStatus('error')
      setErrorMsg('EmailJS is not configured. Download the PDF and send manually.')
      return
    }
    setStatus('generating')
    try {
      const blob = await generatePDF()
      const base64 = await blobToBase64(blob)
      setStatus('sending')
      await sendQuoteEmail({
        pdfBase64: base64,
        quoteData: {
          clientName: data.client?.name,
          clientEmail: data.client?.email,
          quoteNumber,
          address: data.client?.address,
        },
      })
      setStatus('sent')
    } catch (err) {
      console.error(err)
      setStatus('error')
      setErrorMsg(
        err.message === 'EMAILJS_NOT_CONFIGURED'
          ? 'EmailJS is not configured yet. Download the PDF and email manually.'
          : 'Failed to send email. Download the PDF and email manually.'
      )
    }
  }

  const isBusy = status === 'generating' || status === 'sending'

  return (
    <div className={s.step}>
      <div className={s.stepHeader}>
        <span className={s.stepNum}>04</span>
        <h2 className={s.stepTitle}>Preview & Send</h2>
      </div>

      {/* Action buttons */}
      <div className={s.sendActions}>
        <button className="btn-ghost" onClick={onBack} disabled={isBusy}>← Edit</button>
        <button className="btn-primary" onClick={handleDownload} disabled={isBusy}>
          {status === 'generating' ? '⏳ Generating...' : '⬇ Download PDF'}
        </button>
        <button className="btn-gold" onClick={handleSend} disabled={isBusy || status === 'sent'}>
          {status === 'sending' ? '📤 Sending...' : status === 'sent' ? '✓ Sent!' : '✉ Email to Client'}
        </button>
      </div>

      {status === 'sent' && (
        <div className={`${s.statusMsg} ${s.statusGood}`} style={{ marginBottom: 12 }}>
          ✓ Quote emailed to {data.client?.email}
          <button className="btn-ghost btn-sm" style={{ marginLeft: 16 }} onClick={onReset}>
            New Quote
          </button>
        </div>
      )}
      {status === 'error' && (
        <div className={`${s.statusMsg} ${s.statusError}`} style={{ marginBottom: 12 }}>
          ⚠ {errorMsg}
        </div>
      )}

      {/* Quote number display */}
      <div className={s.quoteNumBadge}>
        <span>Quote Number</span>
        <strong>{quoteNumber}</strong>
      </div>

      {/* PDF Preview */}
      <div className={s.pdfPreviewWrap}>
        <div className={s.pdfPreviewInner} ref={pdfRef}>
          <QuotePDF
            data={{
              client: data.client || {},
              repairType: data.repairType,
              interiorItems: data.interiorItems,
              exteriorItems: data.exteriorItems,
              telepostItems: data.telepostItems,
              notes: data.notes,
            }}
            quoteNumber={quoteNumber}
          />
        </div>
      </div>

      <div className={s.actions} style={{ marginTop: 16 }}>
        <button className="btn-ghost" onClick={onReset}>+ Start New Quote</button>
      </div>
    </div>
  )
}
