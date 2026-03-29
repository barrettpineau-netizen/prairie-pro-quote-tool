import React, { useEffect } from 'react'
import { INTERIOR_ITEMS, EXTERIOR_ITEMS, TELEPOST_ITEMS } from '../constants.js'
import s from './Steps.module.css'

const fmt = (n) =>
  n != null && n !== ''
    ? Number(n).toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })
    : ''

export default function StepLineItems({ data, onChange, onNext, onBack }) {
  // Initialize line items from template if not already set
  useEffect(() => {
    const rt = data.repairType
    const updates = {}

    if ((rt === 'interior' || rt === 'both') && !data.interiorItems) {
      updates.interiorItems = INTERIOR_ITEMS.map((it) => ({ ...it, qty: it.defaultQty, unitPrice: '', included: true }))
    }
    if ((rt === 'exterior' || rt === 'both') && !data.exteriorItems) {
      updates.exteriorItems = EXTERIOR_ITEMS.map((it) => ({ ...it, qty: it.defaultQty, unitPrice: '', included: true }))
    }
    if (rt === 'telepost' && !data.telepostItems) {
      updates.telepostItems = TELEPOST_ITEMS.map((it) => ({ ...it, qty: it.defaultQty, unitPrice: '', included: true }))
    }

    if (Object.keys(updates).length > 0) onChange({ ...data, ...updates })
  }, [])

  const updateItem = (listKey, index, field, value) => {
    const list = [...(data[listKey] || [])]
    list[index] = { ...list[index], [field]: value }
    onChange({ ...data, [listKey]: list })
  }

  const calcTotal = (items) =>
    (items || []).reduce((s, it) => s + (it.included ? (Number(it.qty || 0) * Number(it.unitPrice || 0)) : 0), 0)

  const intTotal = calcTotal(data.interiorItems)
  const extTotal = calcTotal(data.exteriorItems)
  const tpTotal = calcTotal(data.telepostItems)
  const subtotal = intTotal + extTotal + tpTotal
  const gst = subtotal * 0.05
  const pst = subtotal * 0.07
  const total = subtotal + gst + pst

  const ItemSection = ({ title, listKey, items }) => {
    if (!items || items.length === 0) return null
    return (
      <div className={s.lineSection}>
        <div className={s.lineSectionTitle}>{title}</div>
        <div className={s.lineHeader}>
          <span className={s.lineColDesc}>Description</span>
          <span className={s.lineColNum}>Qty</span>
          <span className={s.lineColNum}>Unit Price</span>
          <span className={s.lineColNum}>Amount</span>
          <span className={s.lineColCheck}></span>
        </div>
        {items.map((item, idx) => (
          <div key={item.id} className={`${s.lineRow} ${idx % 2 === 1 ? s.lineRowAlt : ''} ${!item.included ? s.lineRowDisabled : ''}`}>
            <span className={s.lineColDesc}>{item.label}</span>
            <input
              className={s.lineInput}
              type="number"
              min="0"
              value={item.qty ?? ''}
              onChange={(e) => updateItem(listKey, idx, 'qty', e.target.value)}
              disabled={!item.included}
            />
            <div className={s.priceInputWrap}>
              <span className={s.dollarSign}>$</span>
              <input
                className={`${s.lineInput} ${s.priceInput}`}
                type="number"
                min="0"
                step="0.01"
                value={item.unitPrice ?? ''}
                onChange={(e) => updateItem(listKey, idx, 'unitPrice', e.target.value)}
                placeholder="0.00"
                disabled={!item.included}
              />
            </div>
            <span className={`${s.lineColNum} ${s.lineAmount}`}>
              {item.included && item.qty && item.unitPrice
                ? fmt(item.qty * item.unitPrice)
                : '—'}
            </span>
            <input
              type="checkbox"
              className={s.lineCheck}
              checked={item.included !== false}
              onChange={(e) => updateItem(listKey, idx, 'included', e.target.checked)}
              title="Include this line item"
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={s.step}>
      <div className={s.stepHeader}>
        <span className={s.stepNum}>03</span>
        <h2 className={s.stepTitle}>Line Items & Pricing</h2>
      </div>
      <p className={s.hint}>Enter unit prices for each item. Uncheck to exclude a line item.</p>

      {(data.repairType === 'interior' || data.repairType === 'both') && (
        <ItemSection
          title={data.repairType === 'both' ? 'OPTION A — INTERIOR REPAIR' : 'INTERIOR REPAIR'}
          listKey="interiorItems"
          items={data.interiorItems}
        />
      )}
      {(data.repairType === 'exterior' || data.repairType === 'both') && (
        <ItemSection
          title={data.repairType === 'both' ? 'OPTION B — EXTERIOR REPAIR' : 'EXTERIOR REPAIR'}
          listKey="exteriorItems"
          items={data.exteriorItems}
        />
      )}
      {data.repairType === 'telepost' && (
        <ItemSection
          title="TELE POST PAD REPLACEMENT"
          listKey="telepostItems"
          items={data.telepostItems}
        />
      )}

      {/* Running total */}
      <div className={s.runningTotal}>
        <div className={s.runRow}><span>Subtotal</span><span>{fmt(subtotal) || '—'}</span></div>
        <div className={s.runRow}><span>GST (5%)</span><span>{fmt(gst) || '—'}</span></div>
        <div className={s.runRow}><span>PST (7%)</span><span>{fmt(pst) || '—'}</span></div>
        <div className={`${s.runRow} ${s.runTotal}`}><span>TOTAL DUE</span><span>{fmt(total) || '—'}</span></div>
      </div>

      {/* Notes */}
      <div className={s.fieldGroup} style={{ marginTop: '16px' }}>
        <label className={s.label}>Additional Notes (printed on quote)</label>
        <textarea
          rows={3}
          value={data.notes || ''}
          onChange={(e) => onChange({ ...data, notes: e.target.value })}
          placeholder="e.g. Access notes, scope clarifications, conditions, exclusions..."
        />
      </div>

      <div className={s.actions}>
        <button className="btn-ghost" onClick={onBack}>← Back</button>
        <button className="btn-primary" onClick={onNext}>
          Preview & Send →
        </button>
      </div>
    </div>
  )
}
