// ── Quote numbering ──────────────────────────────────────────────────────────
export const getNextQuoteNumber = () => {
  const stored = localStorage.getItem('pp_quote_counter')
  const next = stored ? parseInt(stored) + 1 : 134
  localStorage.setItem('pp_quote_counter', String(next))
  return `Quote-${String(next).padStart(4, '0')}`
}

// ── Line item definitions ─────────────────────────────────────────────────────
export const INTERIOR_ITEMS = [
  { id: 'int_1', label: 'Clear 5 ft from wall. Document w/ photos before start', defaultQty: 1 },
  { id: 'int_2', label: 'Remove drywall, vapour barrier, insulation, studs, etc. as applicable', defaultQty: 1 },
  { id: 'int_3', label: 'Assess crack, grind & prep surface, fill w/ epoxy, allow to set', defaultQty: 1 },
  { id: 'int_4', label: 'Fill with concrete patch, supply & install Blueskin waterproofing', defaultQty: 1 },
  { id: 'int_5', label: 'Seal test', defaultQty: 1 },
  { id: 'int_6', label: 'Return interior wall to pre-existing condition', defaultQty: 1 },
  { id: 'int_7', label: 'Return items to original locations', defaultQty: 1 },
  { id: 'int_8', label: 'Basic grading with 1/4 down gravel outside leaking wall', defaultQty: 1 },
]

export const EXTERIOR_ITEMS = [
  { id: 'ext_1', label: 'Excavate along exterior wall to footing of foundation', defaultQty: 1 },
  { id: 'ext_2', label: 'Clean wall, prepare surface and apply Henry BlueSkin membrane', defaultQty: 1 },
  { id: 'ext_3', label: 'Replace weeping tile if damaged', defaultQty: 1 },
  { id: 'ext_4', label: 'Backfill with two to four feet of 3/4 - 1" clean gravel', defaultQty: 1 },
  { id: 'ext_5', label: 'Top with filter fabric and clay, creating proper grading away from home', defaultQty: 1 },
  { id: 'ext_6', label: 'Includes basic grading with 1/4 down gravel or clay outside leaking wall', defaultQty: 1 },
  { id: 'ext_7', label: 'Cover area with grass seed if requested', defaultQty: 1 },
]

export const TELEPOST_ITEMS = [
  { id: 'tp_1', label: 'Jackhammer basement floor adjacent to tele posts', defaultQty: 1 },
  { id: 'tp_2', label: 'Excavate to required depth (approx. 12" deep x 30" wide per pad)', defaultQty: 1 },
  { id: 'tp_3', label: 'Supply & install 10M rebar cage with coated 20M dowels', defaultQty: 1 },
  { id: 'tp_4', label: 'Pour new reinforced concrete tele post pads', defaultQty: 1 },
  { id: 'tp_5', label: 'Allow to cure; reinstall tele posts on new pads', defaultQty: 1 },
  { id: 'tp_6', label: 'Patch and finish concrete floor surface', defaultQty: 1 },
]

export const REPAIR_TYPES = [
  { value: 'exterior', label: 'Exterior Repair' },
  { value: 'interior', label: 'Interior Repair' },
  { value: 'both', label: 'Both (Interior + Exterior Options)' },
  { value: 'telepost', label: 'Tele Post Pad Replacement' },
]

// ── API config ────────────────────────────────────────────────────────────────
export const CONFIG = {
  // Calendly
  CALENDLY_API_TOKEN: 'eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzc0ODA5NzI4LCJqdGkiOiI3MmE1YmZiZi0xMDI0LTQzNTgtYmRhYS1mYTY1YjJkZTY0YWIiLCJ1c2VyX3V1aWQiOiJmYjhiMmZlZC03NzIwLTQ0NjItOTY5Yi0wY2UxMzM1NjVkYTEiLCJzY29wZSI6ImF2YWlsYWJpbGl0eTpyZWFkIGF2YWlsYWJpbGl0eTp3cml0ZSBldmVudF90eXBlczpyZWFkIGV2ZW50X3R5cGVzOndyaXRlIGxvY2F0aW9uczpyZWFkIHJvdXRpbmdfZm9ybXM6cmVhZCBzaGFyZXM6d3JpdGUgc2NoZWR1bGVkX2V2ZW50czpyZWFkIHNjaGVkdWxlZF9ldmVudHM6d3JpdGUgc2NoZWR1bGluZ19saW5rczp3cml0ZSBncm91cHM6cmVhZCBvcmdhbml6YXRpb25zOnJlYWQgb3JnYW5pemF0aW9uczp3cml0ZSB1c2VyczpyZWFkIGFjdGl2aXR5X2xvZzpyZWFkIGRhdGFfY29tcGxpYW5jZTp3cml0ZSBvdXRnb2luZ19jb21tdW5pY2F0aW9uczpyZWFkIHdlYmhvb2tzOnJlYWQgd2ViaG9va3M6d3JpdGUifQ.2cvJd6u1YPUOjV4hsuo4L8lEvQ-gBpV7pcT3AV60ayjXKlgYNAYvqWBv1t_-nTMU3FASzBPPNBP76YchaZpclg',
  CALENDLY_USER_URI: 'https://api.calendly.com/users/fb8b2fed-7720-4462-969b-0ce133565da1',

  // EmailJS (add after setup)
  EMAILJS_SERVICE_ID: '',
  EMAILJS_TEMPLATE_ID: '',
  EMAILJS_PUBLIC_KEY: '',

  // Company
  COMPANY_NAME: 'Prairie Pro Foundation Repair Inc.',
  COMPANY_ADDRESS: '11 Ruttan Bay, Winnipeg, MB',
  COMPANY_PHONE: '(204) 298-3212',
  COMPANY_EMAIL: 'barrett@prairieprofoundations.ca',
  COMPANY_WEB: 'www.prairieprofoundations.ca',
  SENDER_EMAIL: 'barrett@prairieprofoundations.ca',
}
export const BUILD = 2
