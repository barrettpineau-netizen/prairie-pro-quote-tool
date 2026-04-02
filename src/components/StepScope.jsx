import React from 'react'
import { REPAIR_TYPES } from '../constants.js'
import s from './Steps.module.css'

export default function StepScope({ data, onChange, onNext, onBack }) {
  const set = (field) => (val) => onChange({ ...data, [field]: val })

  const handleTypeSelect = (val) => {
    onChange({ ...data, repairType: val })
  }

  const valid = !!data.repairType

  return (
    <div className={s.step}>
      <div className={s.stepHeader}>
        <span className={s.stepNum}>02</span>
        <h2 className={s.stepTitle}>Repair Scope</h2>
      </div>

      {/* Repair type tiles */}
      <div className={s.fieldGroup}>
        <label className={s.label}>Repair Type *</label>
        <div className={s.typeTiles}>
          {REPAIR_TYPES.map((rt) => (
            <button
              key={rt.value}
              className={`${s.typeTile} ${data.repairType === rt.value ? s.typeTileActive : ''}`}
              onClick={() => handleTypeSelect(rt.value)}
            >
              <span className={s.typeTileIcon}>
                {rt.value === 'exterior' && 'â'}
                {rt.value === 'interior' && 'ð§'}
                {rt.value === 'both' && 'â¡'}
                {rt.value === 'telepost' && 'ð'}
              </span>
              {rt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Exterior fields */}
      {(data.repairType === 'exterior' || data.repairType === 'both') && (
        <div className={s.scopeSection}>
          <div className={s.scopeSectionTitle}>
            {data.repairType === 'both' ? 'Option B â Exterior Details' : 'Exterior Details'}
          </div>
          <div className={s.row2}>
            <div className={s.fieldGroup}>
              <label className={s.label}>Exterior Dig â Feet</label>
              <input
                type="number"
                value={data.extDigFt || ''}
                onChange={(e) => set('extDigFt')(e.target.value)}
                placeholder="e.g. 30"
              />
            </div>
            <div className={s.fieldGroup}>
              <label className={s.label}>Depth</label>
              <input
                value={data.extDepth || ''}
                onChange={(e) => set('extDepth')(e.target.value)}
                placeholder="e.g. 8 ft"
              />
            </div>
          </div>
          <div className={s.fieldGroup}>
            <label className={s.label}>Obstructions / Access Notes</label>
            <input
              value={data.extObstructions || ''}
              onChange={(e) => set('extObstructions')(e.target.value)}
              placeholder="Fences, A/C units, tight spaces, neighbour access needed, etc."
            />
          </div>
        </div>
      )}

      {/* Interior fields */}
      {(data.repairType === 'interior' || data.repairType === 'both') && (
        <div className={s.scopeSection}>
          <div className={s.scopeSectionTitle}>
            {data.repairType === 'both' ? 'Option A â Interior Details' : 'Interior Details'}
          </div>
          <div className={s.row2}>
            <div className={s.fieldGroup}>
              <label className={s.label}>Wall Length â Feet</label>
              <input
                type="number"
                value={data.intWallFt || ''}
                onChange={(e) => set('intWallFt')(e.target.value)}
                placeholder="e.g. 25"
              />
            </div>
            <div className={s.fieldGroup}>
              <label className={s.label}>Crack Size</label>
              <select
                value={data.crackSize || ''}
                onChange={(e) => set('crackSize')(e.target.value)}
              >
                <option value="">Select...</option>
                <option value='Sub 1"'>Sub 1"</option>
                <option value='1"'>1"</option>
                <option value='2"'>2"</option>
                <option value='2"+ (large)'>2"+ (large)</option>
              </select>
            </div>
          </div>
          <div className={s.row2}>
            <div className={s.fieldGroup}>
              <label className={s.label}>Weeping Tile â Feet</label>
              <input
                type="number"
                value={data.weepingTileFt || ''}
                onChange={(e) => set('weepingTileFt')(e.target.value)}
                placeholder="e.g. 30"
              />
            </div>
            <div className={s.fieldGroup}>
              <label className={s.label}>New Sump Pump Required?</label>
              <select
                value={data.sumpPump || ''}
                onChange={(e) => set('sumpPump')(e.target.value)}
              >
                <option value="">Select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
          <div className={s.fieldGroup}>
            <label className={s.label}>Drywall Covered?</label>
            <select
              value={data.drywallCovered || ''}
              onChange={(e) => set('drywallCovered')(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="yes">Yes â drywall / insulation present</option>
              <option value="no">No â wall is exposed</option>
            </select>
          </div>
          <div className={s.fieldGroup}>
            <label className={s.label}>Demo / Rebuild Notes</label>
            <textarea
              rows={2}
              value={data.demoNotes || ''}
              onChange={(e) => set('demoNotes')(e.target.value)}
              placeholder="Length, height, carpet, baseboards, tiles, etc."
            />
          </div>
        </div>
      )}

      {/* Grading */}
      {(data.repairType === 'exterior' || data.repairType === 'both') && (
        <div className={s.scopeSection}>
          <div className={s.scopeSectionTitle}>Grading</div>
          <div className={s.row3}>
            <div className={s.fieldGroup}>
              <label className={s.label}>Basic Grading â ft</label>
              <input
                type="number"
                value={data.gradingFt || ''}
                onChange={(e) => set('gradingFt')(e.target.value)}
                placeholder="ft"
              />
            </div>
            <div className={s.fieldGroup}>
              <label className={s.label}>Paved Concrete â ft</label>
              <input
                type="number"
                value={data.concreteFt || ''}
                onChange={(e) => set('concreteFt')(e.target.value)}
                placeholder="ft"
              />
            </div>
            <div className={s.fieldGroup}>
              <label className={s.label}>Grass Seeding â ft</label>
              <input
                type="number"
                value={data.grassFt || ''}
                onChange={(e) => set('grassFt')(e.target.value)}
                placeholder="ft"
              />
            </div>
          </div>
        </div>
      )}

      <div className={s.actions}>
        <button className="btn-ghost" onClick={onBack}>â Back</button>
        <button className="btn-primary" onClick={onNext} disabled={!valid}>
          Next: Line Items & Pricing â
        </button>
      </div>
    </div>
  )
}
