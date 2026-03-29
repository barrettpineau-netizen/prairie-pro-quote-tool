# Prairie Pro Quote Tool

A mobile-friendly web app for generating and emailing foundation repair quotes on-site.

## What It Does

1. **Client lookup** — Enter the job site address and pull client info automatically from Calendly
2. **Repair scope** — Select repair type (Interior, Exterior, Both, or Tele Post) and fill in job details
3. **Line items & pricing** — Enter unit prices; totals, GST (5%), and PST (7%) calculate automatically
4. **Preview & send** — Review the branded PDF quote and email it directly to the client

---

## Setup (One-Time, ~30 Minutes)

### Step 1 — Get the Code onto GitHub

1. Go to [github.com](https://github.com) and sign in (or create a free account)
2. Click **New repository** → name it `prairie-pro-quote-tool` → **Create repository**
3. On your computer, open a terminal in the project folder and run:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/prairie-pro-quote-tool.git
git push -u origin main
```

---

### Step 2 — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → **Sign up with GitHub** (free)
2. Click **Add New Project** → import your `prairie-pro-quote-tool` repo
3. Vercel auto-detects Vite — just click **Deploy**
4. In about 60 seconds you'll have a live URL like `prairie-pro-quote-tool.vercel.app`

---

### Step 3 — Get Your Calendly API Token

1. Go to [calendly.com/integrations/api_webhooks](https://calendly.com/integrations/api_webhooks)
2. Click **Generate New Token** → copy it
3. To find your User URI, open this URL in your browser (replace YOUR_TOKEN):
   ```
   https://api.calendly.com/users/me
   ```
   with header `Authorization: Bearer YOUR_TOKEN` — or use the [Calendly API Explorer](https://developer.calendly.com/api-docs)
4. Copy the `uri` value from the response (looks like `https://api.calendly.com/users/XXXXXXXX`)

---

### Step 4 — Set Up EmailJS (Free — 200 emails/month)

1. Go to [emailjs.com](https://www.emailjs.com) → **Sign Up Free**
2. **Add an Email Service:**
   - Click **Email Services** → **Add New Service**
   - Choose **Gmail** → connect `barrett@prairieprofoundations.ca`
   - Copy the **Service ID** (e.g. `service_abc123`)
3. **Create an Email Template:**
   - Click **Email Templates** → **Create New Template**
   - Set **To Email:** `{{to_email}}`
   - Set **Subject:** `Your Foundation Repair Quote — {{quote_number}}`
   - Set **Body:**
     ```
     Hi {{to_name}},

     {{message}}

     Please find your quote attached.

     Prairie Pro Foundation Repair
     (204) 298-3212 | barrett@prairieprofoundations.ca
     ```
   - Copy the **Template ID** (e.g. `template_xyz789`)
4. Go to **Account** → copy your **Public Key**

---

### Step 5 — Add Environment Variables to Vercel

1. In your Vercel project → **Settings** → **Environment Variables**
2. Add each of the following:

| Name | Value |
|------|-------|
| `VITE_CALENDLY_API_TOKEN` | Your Calendly personal access token |
| `VITE_CALENDLY_USER_URI` | `https://api.calendly.com/users/YOUR_ID` |
| `VITE_EMAILJS_SERVICE_ID` | e.g. `service_abc123` |
| `VITE_EMAILJS_TEMPLATE_ID` | e.g. `template_xyz789` |
| `VITE_EMAILJS_PUBLIC_KEY` | Your EmailJS public key |

3. Go to **Deployments** → click the three dots on your latest deployment → **Redeploy**

---

## Running Locally (for development)

```bash
npm install
cp .env.example .env.local   # then fill in your keys
npm run dev
```

Opens at `http://localhost:5173`

---

## Quote Numbering

Quote numbers auto-increment starting at Quote-0134 and are stored in the browser's `localStorage`. Each device (Barrett's phone, Austin's phone) maintains its own counter — coordinate numbering between devices if needed, or set a starting number in `src/constants.js`:

```js
const next = stored ? parseInt(stored) + 1 : 134  // ← change starting number here
```

---

## Customizing Line Items or Pricing

Edit `src/constants.js` to add, remove, or rename line items in any of the three repair type lists.

---

## Tech Stack

- **React + Vite** — fast, mobile-friendly frontend
- **html2pdf.js** — client-side PDF generation (no server needed)
- **EmailJS** — send emails directly from the browser (no backend)
- **Calendly API** — client lookup by address
- **Vercel** — free hosting with automatic deploys on every git push

