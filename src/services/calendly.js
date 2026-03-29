import { CONFIG } from '../constants.js'

/**
 * Fetch upcoming/recent Calendly events and try to match by address keyword.
 * Returns { name, email, phone, address } or null.
 */
export async function lookupCalendlyClient(addressQuery) {
  if (!CONFIG.CALENDLY_API_TOKEN) {
    throw new Error('CALENDLY_API_KEY_MISSING')
  }

  const query = addressQuery.toLowerCase().trim()

  // Pull the last 100 scheduled events for the user
  const eventsRes = await fetch(
    `https://api.calendly.com/scheduled_events?user=${encodeURIComponent(CONFIG.CALENDLY_USER_URI)}&count=100&status=active`,
    {
      headers: {
        Authorization: `Bearer ${CONFIG.CALENDLY_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  )

  if (!eventsRes.ok) {
    throw new Error(`Calendly API error: ${eventsRes.status}`)
  }

  const eventsData = await eventsRes.json()
  const events = eventsData.collection || []

  // For each event, fetch invitees and check if their address response matches
  for (const event of events) {
    const eventUuid = event.uri.split('/').pop()
    const inviteesRes = await fetch(
      `https://api.calendly.com/scheduled_events/${eventUuid}/invitees?count=10`,
      {
        headers: {
          Authorization: `Bearer ${CONFIG.CALENDLY_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!inviteesRes.ok) continue
    const inviteesData = await inviteesRes.json()
    const invitees = inviteesData.collection || []

    for (const invitee of invitees) {
      // Check questions_and_answers for address match
      const qa = invitee.questions_and_answers || []

      // Address is Q2 in your Calendly form
      const addressAnswer = qa.find(
        (q) =>
          q.question?.toLowerCase().includes('address') ||
          q.question?.toLowerCase().includes('where')
      )
      const phoneAnswer = qa.find(
        (q) =>
          q.question?.toLowerCase().includes('phone') ||
          q.question?.toLowerCase().includes('number')
      )

      if (addressAnswer?.answer) {
        const answerLower = addressAnswer.answer.toLowerCase()
        // Fuzzy match: check if key words from query appear in the answer
        const queryWords = query.split(/\s+/).filter((w) => w.length > 2)
        const matchScore = queryWords.filter((w) => answerLower.includes(w)).length
        const matchThreshold = Math.max(1, Math.floor(queryWords.length * 0.6))

        if (matchScore >= matchThreshold) {
          return {
            name: invitee.name || '',
            email: invitee.email || '',
            phone: phoneAnswer?.answer?.replace(/^'+/, '') || '',
            address: addressAnswer.answer || '',
            source: 'calendly',
          }
        }
      }
    }
  }

  return null // no match found
}
