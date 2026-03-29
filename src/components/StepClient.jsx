import React, { useState } from 'react'
import { lookupCalendlyClient } from '../services/calendly.js'
import { CONFIG } from '../constants.js'
import s from './Steps.module.css'

export default function StepClient({ data, onChange, onNext }) {
  const [searching, setSearching] = useState(false)
  const [searchStatus, setSearchStatus] = useState(null) // 'found' | 'not_found' | 'error' | 'no_key'

  const set = (field) => (e) => onChange({ ...data, [field]: e.target.value })

  const handleCalendlyLookup = async () => {
    if (!data.address?.trim()) return
    setSearching(true)
    setSearchStatus(null)

    if (!CONFIG.CALENDLY_API_TOKEN) {
      setSearchStatus('no_key')
      setSearching(false)
      return
    }

    try {
      const result = await lookupCalendlyClient(data.address)
      if (result) {
        onChange({ ...data, ...result })
        setSearchStatus('found')
      } else {
        setSearchStatus('not_found')
      }
    } catch (err) {
      console.error(err)
      setSearchStatus('error')
    } finally {
      setSearching(false)
    }
  }

  const valid = data.name?.trim() && data.email?.trim() && data.address?.trim()

  return (
    <div className={s.step}>
      <div className={s.stepHeader}>
        <span className={s.stepNum}>01</span>
        <h2 className={s.stepTitle}>Client Information</h2>
      </div>

      {/* Address + Calendly lookup */}
      <div className={s.fieldGroup}>
        <label className={s.label}>Job Site Address</label>
        <div className={s.lookupRow}>
          <input
            value={data.address || ''}
            onChange={set('address')}
            placeholder="e.g. 62 Buckle Drive"
          />
          <button
            className={`btn-ghost btn-sm ${s.lookupBtn}`}
            onClick={handleCalendlyLookup}
            disabled={searching || !data.address?.trim()}
          >
            {searching ? '...' : '⟳ Calendly'}
          </button>
        </div>

        {searchStatus === 'found' && (
          <div className={`${s.statusMsg} ${s.statusGood}`}>
            ✓ Client info pulled from Calendly
          </div>
        )}
        {searchStatus === 'not_found' && (
          <div className={`${s.statusMsg} ${s.statusWarn}`}>
            No Calendly match found — fill in manually
          </div>
        )}
        {searchStatus === 'no_key' && (
          <div className={`${s.statusMsg} ${s.statusWarn}`}>
            Calendly API key not configured — fill in manually
          </div>
        )}
        {searchStatus === 'error' && (
          <div className={`${s.statusMsg} ${s.statusError}`}>
            Calendly lookup failed — fill in manually
          </div>
        )}
      </div>

      <div className={s.fieldGroup}>
        <label className={s.label}>City / Province</label>
        <input
          value={data.city || ''}
          onChange={set('city')}
          placeholder="Winnipeg, MB"
        />
      </div>

      <div className={s.row2}>
        <div className={s.fieldGroup}>
          <label className={s.label}>Client Name *</label>
          <input
            value={data.name || ''}
            onChange={set('name')}
            placeholder="Full name"
          />
        </div>
        <div className={s.fieldGroup}>
          <label className={s.label}>Phone</label>
          <input
            value={data.phone || ''}
            onChange={set('phone')}
            placeholder="+1 204-xxx-xxxx"
          />
        </div>
      </div>

      <div className={s.fieldGroup}>
        <label className={s.label}>Email Address *</label>
        <input
          type="email"
          value={data.email || ''}
          onChange={set('email')}
          placeholder="client@email.com"
        />
      </div>

      <div className={s.actions}>
        <button className="btn-primary" onClick={onNext} disabled={!valid}>
          Next: Repair Scope →
        </button>
      </div>
    </div>
  )
}
