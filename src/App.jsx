import React, { useState } from 'react'
import StepClient from './components/StepClient.jsx'
import StepScope from './components/StepScope.jsx'
import StepLineItems from './components/StepLineItems.jsx'
import StepSend from './components/StepSend.jsx'
import { getNextQuoteNumber } from './constants.js'
import './App.css'

const STEPS = ['Client', 'Scope', 'Pricing', 'Send']

export default function App() {
  const [step, setStep] = useState(0)
  const [quoteNumber, setQuoteNumber] = useState(null)
  const [formData, setFormData] = useState({
    client: {},
    repairType: null,
    extDigFt: '',
    extDepth: '',
    extObstructions: '',
    intWallFt: '',
    crackSize: '',
    weepingTileFt: '',
    sumpPump: '',
    drywallCovered: '',
    demoNotes: '',
    gradingFt: '',
    concreteFt: '',
    grassFt: '',
    interiorItems: null,
    exteriorItems: null,
    telepostItems: null,
    notes: '',
  })

  const updateClient = (clientData) =>
    setFormData((f) => ({ ...f, client: clientData }))

  const updateScope = (scopeData) => setFormData((f) => ({ ...f, ...scopeData }))

  const updateLineItems = (d) => setFormData((f) => ({ ...f, ...d }))

  const goNext = () => {
    if (step === 2) {
      // Generate quote number when moving to preview
      setQuoteNumber(getNextQuoteNumber())
    }
    setStep((s) => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goBack = () => {
    setStep((s) => s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const reset = () => {
    setStep(0)
    setQuoteNumber(null)
    setFormData({
      client: {},
      repairType: null,
      extDigFt: '', extDepth: '', extObstructions: '',
      intWallFt: '', crackSize: '', weepingTileFt: '',
      sumpPump: '', drywallCovered: '', demoNotes: '',
      gradingFt: '', concreteFt: '', grassFt: '',
      interiorItems: null, exteriorItems: null, telepostItems: null,
      notes: '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Flatten client into formData for scope/lineitems steps
  const scopeData = {
    repairType: formData.repairType,
    extDigFt: formData.extDigFt,
    extDepth: formData.extDepth,
    extObstructions: formData.extObstructions,
    intWallFt: formData.intWallFt,
    crackSize: formData.crackSize,
    weepingTileFt: formData.weepingTileFt,
    sumpPump: formData.sumpPump,
    drywallCovered: formData.drywallCovered,
    demoNotes: formData.demoNotes,
    gradingFt: formData.gradingFt,
    concreteFt: formData.concreteFt,
    grassFt: formData.grassFt,
  }

  return (
    <div className="app">
      {/* Top bar */}
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <span className="brand-name">PRAIRIE PRO</span>
            <span className="brand-sub">Quote Tool</span>
          </div>
          <nav className="stepper">
            {STEPS.map((label, i) => (
              <div key={label} className={`step-dot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
                <div className="dot-num">{i < step ? '✓' : i + 1}</div>
                <div className="dot-label">{label}</div>
                {i < STEPS.length - 1 && <div className="dot-line" />}
              </div>
            ))}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="main">
        <div className="card">
          {step === 0 && (
            <StepClient
              data={formData.client}
              onChange={updateClient}
              onNext={goNext}
            />
          )}
          {step === 1 && (
            <StepScope
              data={{ ...formData.client, ...scopeData }}
              onChange={(d) => {
                const { name, email, phone, address, city, source, ...scope } = d
                updateScope(scope)
              }}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 2 && (
            <StepLineItems
              data={{ ...scopeData, ...formData }}
              onChange={(d) => updateLineItems(d)}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 3 && (
            <StepSend
              data={{
                client: formData.client,
                repairType: formData.repairType,
                interiorItems: formData.interiorItems,
                exteriorItems: formData.exteriorItems,
                telepostItems: formData.telepostItems,
                notes: formData.notes,
              }}
              quoteNumber={quoteNumber}
              onBack={goBack}
              onReset={reset}
            />
          )}
        </div>
      </main>
    </div>
  )
}
