import React from 'react'
import { CONFIG } from '../constants.js'

const fmt = (n) =>
  n
    ? Number(n).toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })
    : '—'

export default function QuotePDF({ data, quoteNumber, ref: _ref }) {
  const {
    client,
    repairType,
    interiorItems,
    exteriorItems,
    telepostItems,
    notes,
    date,
  } = data

  const today = date || new Date().toLocaleDateString('en-CA')

  // Collect all active line items
  const buildLines = (items) =>
    (items || []).filter((it) => it.included !== false)

  const interiorLines = repairType === 'interior' || repairType === 'both' ? buildLines(interiorItems) : []
  const exteriorLines = repairType === 'exterior' || repairType === 'both' ? buildLines(exteriorItems) : []
  const telepostLines = repairType === 'telepost' ? buildLines(telepostItems) : []

  const allLines = [...interiorLines, ...exteriorLines, ...telepostLines]
  const subtotal = allLines.reduce((s, it) => s + (Number(it.qty || 0) * Number(it.unitPrice || 0)), 0)
  const gst = subtotal * 0.05
  const pst = subtotal * 0.07
  const total = subtotal + gst + pst

  const LineRow = ({ item, idx, zebra }) => (
    <tr style={{ background: zebra ? '#fafafa' : '#fff' }}>
      <td style={styles.tdDesc}>{item.label}</td>
      <td style={styles.tdNum}>{item.qty || ''}</td>
      <td style={styles.tdNum}>{item.unitPrice ? fmt(item.unitPrice) : ''}</td>
      <td style={styles.tdNum}>
        {item.qty && item.unitPrice ? fmt(item.qty * item.unitPrice) : ''}
      </td>
    </tr>
  )

  const SectionHeader = ({ label }) => (
    <tr>
      <td colSpan={4} style={styles.sectionHeader}>{label}</td>
    </tr>
  )

  return (
    <div id="quote-pdf-root" style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logo}>PRAIRIE PRO</div>
          <div style={styles.logoSub}>Foundation Repair Inc.</div>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.headerContact}>{CONFIG.COMPANY_ADDRESS}</div>
          <div style={styles.headerContact}>{CONFIG.COMPANY_PHONE}</div>
          <div style={styles.headerContact}>{CONFIG.COMPANY_EMAIL}</div>
          <div style={styles.headerContact}>{CONFIG.COMPANY_WEB}</div>
        </div>
      </div>

      <div style={styles.goldBar} />

      {/* Quote meta + client info */}
      <div style={styles.metaRow}>
        <div style={styles.billTo}>
          <div style={styles.sectionLabel}>QUOTE TO</div>
          <div style={styles.clientName}>{client.name}</div>
          <div style={styles.clientDetail}>{client.address}</div>
          <div style={styles.clientDetail}>{client.city || 'Winnipeg, MB'}</div>
          <div style={styles.clientDetail}>{client.phone}</div>
          <div style={styles.clientDetail}>{client.email}</div>
        </div>
        <div style={styles.quoteInfo}>
          <div style={styles.quoteInfoRow}>
            <span style={styles.quoteLabel}>Invoice #</span>
            <span style={styles.quoteValue}>{quoteNumber}</span>
          </div>
          <div style={styles.quoteInfoRow}>
            <span style={styles.quoteLabel}>Date</span>
            <span style={styles.quoteValue}>{today}</span>
          </div>
          <div style={styles.quoteInfoRow}>
            <span style={styles.quoteLabel}>Due Date</span>
            <span style={styles.quoteValue}>Upon completion</span>
          </div>
        </div>
      </div>

      {/* Line items table */}
      <table style={styles.table}>
        <thead>
          <tr style={{ background: '#1A3A6B' }}>
            <th style={{ ...styles.th, textAlign: 'left' }}>DESCRIPTION</th>
            <th style={styles.th}>QTY</th>
            <th style={styles.th}>UNIT PRICE</th>
            <th style={styles.th}>AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {(repairType === 'interior' || repairType === 'both') && interiorLines.length > 0 && (
            <>
              <SectionHeader label={repairType === 'both' ? 'OPTION A — INTERIOR REPAIR' : 'INTERIOR REPAIR'} />
              {interiorLines.map((it, i) => <LineRow key={it.id} item={it} idx={i} zebra={i % 2 === 1} />)}
            </>
          )}
          {(repairType === 'exterior' || repairType === 'both') && exteriorLines.length > 0 && (
            <>
              <SectionHeader label={repairType === 'both' ? 'OPTION B — EXTERIOR REPAIR' : 'EXTERIOR REPAIR'} />
              {exteriorLines.map((it, i) => <LineRow key={it.id} item={it} idx={i} zebra={i % 2 === 1} />)}
            </>
          )}
          {repairType === 'telepost' && telepostLines.length > 0 && (
            <>
              <SectionHeader label="INTERIOR REPAIR — TELE POST PAD REPLACEMENT" />
              {telepostLines.map((it, i) => <LineRow key={it.id} item={it} idx={i} zebra={i % 2 === 1} />)}
            </>
          )}
        </tbody>
      </table>

      {/* Totals */}
      <div style={styles.totalsBlock}>
        <div style={styles.totalRow}>
          <span style={styles.totalLabel}>Subtotal</span>
          <span style={styles.totalValue}>{fmt(subtotal)}</span>
        </div>
        <div style={styles.totalRow}>
          <span style={styles.totalLabel}>GST (5%)</span>
          <span style={styles.totalValue}>{fmt(gst)}</span>
        </div>
        <div style={styles.totalRow}>
          <span style={styles.totalLabel}>PST (7%)</span>
          <span style={styles.totalValue}>{fmt(pst)}</span>
        </div>
        <div style={{ ...styles.totalRow, ...styles.totalRowFinal }}>
          <span style={styles.totalLabelFinal}>TOTAL DUE</span>
          <span style={styles.totalValueFinal}>{fmt(total)}</span>
        </div>
      </div>

      {/* Notes */}
      {notes && (
        <div style={styles.notesBlock}>
          <div style={styles.sectionLabel}>NOTES</div>
          <div style={styles.notesText}>{notes}</div>
        </div>
      )}

      {/* Payment terms */}
      <div style={styles.terms}>
        <div style={styles.termsTitle}>PAYMENT TERMS & NOTES</div>
        <div style={styles.termsText}>
          50% deposit due for booking. Remaining 50% due upon completion. Unpaid amounts are subject to interest at 5% monthly.
        </div>
        <div style={styles.termsText}>
          Please make cheques payable to Prairie Pro Foundation Repair Inc. or e-transfer to {CONFIG.SENDER_EMAIL}
        </div>
        <div style={styles.termsText}>Thank you for trusting Prairie Pro Foundation Repair!</div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        Prairie Pro Foundation Repair &nbsp;|&nbsp; Winnipeg, MB &nbsp;|&nbsp; {CONFIG.COMPANY_PHONE} &nbsp;|&nbsp; {CONFIG.COMPANY_EMAIL} &nbsp;|&nbsp; {CONFIG.COMPANY_WEB}
      </div>
    </div>
  )
}

const styles = {
  page: {
    width: '210mm',
    minHeight: '297mm',
    background: '#fff',
    fontFamily: "'Barlow', sans-serif",
    fontSize: '10pt',
    color: '#111827',
    padding: '12mm 14mm',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '6px',
  },
  headerLeft: {},
  logo: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 800,
    fontSize: '22pt',
    color: '#1A3A6B',
    letterSpacing: '0.05em',
  },
  logoSub: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 600,
    fontSize: '10pt',
    color: '#C9A227',
    letterSpacing: '0.08em',
    marginTop: '-3px',
  },
  headerRight: { textAlign: 'right' },
  headerContact: { fontSize: '8.5pt', color: '#6B7280', lineHeight: 1.6 },
  goldBar: { height: '3px', background: '#C9A227', margin: '8px 0 14px' },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '18px',
  },
  billTo: {},
  sectionLabel: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 700,
    fontSize: '7.5pt',
    letterSpacing: '0.12em',
    color: '#C9A227',
    marginBottom: '4px',
  },
  clientName: { fontWeight: 600, fontSize: '12pt', color: '#1A3A6B', marginBottom: '2px' },
  clientDetail: { fontSize: '9pt', color: '#6B7280', lineHeight: 1.6 },
  quoteInfo: { textAlign: 'right', minWidth: '160px' },
  quoteInfoRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '16px',
    marginBottom: '3px',
  },
  quoteLabel: { fontSize: '9pt', color: '#6B7280' },
  quoteValue: { fontSize: '9pt', fontWeight: 600, color: '#1A3A6B' },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '12px',
    fontSize: '9pt',
  },
  th: {
    color: '#fff',
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 700,
    fontSize: '8.5pt',
    letterSpacing: '0.06em',
    padding: '7px 8px',
    textAlign: 'right',
  },
  sectionHeader: {
    background: '#1A3A6B',
    color: '#fff',
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 700,
    fontSize: '8.5pt',
    letterSpacing: '0.08em',
    padding: '5px 8px',
  },
  tdDesc: {
    padding: '5px 8px',
    color: '#374151',
    borderBottom: '1px solid #f3f4f6',
    lineHeight: 1.4,
  },
  tdNum: {
    padding: '5px 8px',
    color: '#374151',
    textAlign: 'right',
    borderBottom: '1px solid #f3f4f6',
    whiteSpace: 'nowrap',
  },
  totalsBlock: {
    marginLeft: 'auto',
    width: '240px',
    marginBottom: '16px',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '4px 8px',
    fontSize: '9pt',
  },
  totalRowFinal: {
    background: '#1A3A6B',
    borderRadius: '3px',
    marginTop: '4px',
    padding: '7px 8px',
  },
  totalLabel: { color: '#6B7280' },
  totalValue: { color: '#374151', fontWeight: 500 },
  totalLabelFinal: {
    color: '#fff',
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 700,
    fontSize: '10pt',
    letterSpacing: '0.06em',
  },
  totalValueFinal: { color: '#C9A227', fontWeight: 700, fontSize: '11pt' },
  notesBlock: {
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '4px',
    padding: '10px 12px',
    marginBottom: '14px',
  },
  notesText: { fontSize: '9pt', color: '#374151', lineHeight: 1.6, marginTop: '4px' },
  terms: { borderTop: '1px solid #e5e7eb', paddingTop: '12px', marginBottom: '20px' },
  termsTitle: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 700,
    fontSize: '7.5pt',
    letterSpacing: '0.12em',
    color: '#C9A227',
    marginBottom: '5px',
  },
  termsText: { fontSize: '8.5pt', color: '#6B7280', lineHeight: 1.6 },
  footer: {
    textAlign: 'center',
    fontSize: '7.5pt',
    color: '#9ca3af',
    borderTop: '1px solid #f3f4f6',
    paddingTop: '8px',
  },
}
