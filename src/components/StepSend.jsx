import React, { useState } from 'react'
import QuotePDF from './QuotePDF.jsx'
import s from './Steps.module.css'

export default function StepSend({ data, quoteNumber, onBack, onReset }) {
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const isBusy = status === 'generating'

  const handleDownload = async () => {
    setStatus('generating')
    setErrorMsg('')
    try {
      const element = document.getElementById('quote-pdf-root')
      const opt = {
        margin: 0,
        filename: \`\${quoteNumber} - \${data.client?.address || 'Quote'}.pdf\`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      }
      await window.html2pdf().set(opt).from(element).save()
      setStatus('idle')
    } catch (err) {
      console.error('PDF error:', err)
      setStatus('error')
      setErrorMsg('PDF generation failed. Please try again.')
    }
  }

  return (
    <div className={s.step}>
      <div className={s.stepHeader}>
        <span className={s.stepNum}>04</span>
        <h2 className={s.stepTitle}>Preview & Download</h2>
      </div>

      <div className={s.sendActions}>
        <button className="btn-ghost" onClick={onBack} disabled={isBusy}>← Edit</button>
        <button className="btn-primary" onClick={handleDownload} disabled={isBusy}>
          {status === 'generating' ? '⏳ Generating...' : '⬇ Download PDF'}
        </button>
      </div>

      {status === 'error' && (
        <div className={\`\${s.statusMsg} \${s.statusError}\`} style={{ marginBottom: 12 }}>
          ⚠ {errorMsg}
        </div>
      )}

      <div className={s.quoteNumBadge}>
        <span>Quote Number</span>
        <strong>{quoteNumber}</strong>
      </div>

      <div className={s.pdfPreviewWrap}>
        <div className={s.pdfPreviewInner}>
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
