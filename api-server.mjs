/**
 * api-server.mjs — Contact form → Airtable + Email + SMS
 * Run with: node api-server.mjs
 * Vite proxies /api/* to this server (port 5001)
 */

import http from 'http'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import nodemailer from 'nodemailer'

// ── Load .env ─────────────────────────────────────────────────────────────────
const envPath = resolve(process.cwd(), '.env')
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const [key, ...rest] = line.split('=')
    if (key && !key.startsWith('#')) process.env[key.trim()] = rest.join('=').trim()
  }
}

const PORT           = 5001
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN || ''
const AIRTABLE_BASE  = process.env.AIRTABLE_BASE  || 'appWApjlYYxfe3Vj2'
const AIRTABLE_TABLE = process.env.AIRTABLE_TABLE || 'tbl46E8jx9l8fQWay'
const GMAIL_USER     = process.env.GMAIL_USER     || ''
const GMAIL_PASS     = process.env.GMAIL_APP_PASSWORD || ''
const TWILIO_SID     = process.env.TWILIO_ACCOUNT_SID  || ''
const TWILIO_TOKEN   = process.env.TWILIO_AUTH_TOKEN   || ''
const TWILIO_FROM    = process.env.TWILIO_FROM_NUMBER  || ''
const NICK_EMAIL     = 'nickjungmarker@lnf.com'
const NICK_PHONE     = '+13018757182'

if (!AIRTABLE_TOKEN) console.warn('⚠️  AIRTABLE_TOKEN not set in .env')
if (!GMAIL_USER)     console.warn('⚠️  GMAIL_USER not set in .env')
if (!GMAIL_PASS)     console.warn('⚠️  GMAIL_APP_PASSWORD not set in .env')
if (!TWILIO_SID)     console.warn('⚠️  TWILIO_ACCOUNT_SID not set in .env (SMS disabled)')

// ── Gmail transporter ─────────────────────────────────────────────────────────
const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: GMAIL_USER, pass: GMAIL_PASS },
})

// ── Helpers ───────────────────────────────────────────────────────────────────
function normalizePhone(raw) {
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  return null
}

async function sendEmail(fields) {
  const { firstName, lastName, email, phone, type, message } = fields
  const subject = `New Contact Form Lead — ${firstName} ${lastName} (${type})`
  const text = [
    `Name:    ${firstName} ${lastName}`,
    `Email:   ${email}`,
    `Phone:   ${phone || '—'}`,
    `Type:    ${type}`,
    `Message: ${message || '—'}`,
    '',
    'Submitted via nickjungmarker.com',
  ].join('\n')

  await mailer.sendMail({
    from: `"Nick Jungmarker Site" <${GMAIL_USER}>`,
    to:   NICK_EMAIL,
    subject,
    text,
  })
  console.log(`[email] ✅ Notification sent to ${NICK_EMAIL}`)
}

async function sendSMS(toRaw, firstName) {
  const to = normalizePhone(toRaw)
  if (!to) { console.warn('[sms] ⚠️  Could not normalize phone:', toRaw); return }
  if (!TWILIO_SID) { console.warn('[sms] ⚠️  Twilio not configured — skipping SMS'); return }

  const body =
    `Hi ${firstName}! This is Nick Jungmarker, your Maryland REALTOR®. ` +
    `I just received your message and will be reaching out to you very soon. ` +
    `Feel free to call or text me anytime at (301) 875-7182. Talk soon!`

  const creds = Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString('base64')
  const params = new URLSearchParams({ To: to, From: TWILIO_FROM, Body: body })

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`,
    {
      method:  'POST',
      headers: { Authorization: `Basic ${creds}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    params.toString(),
    }
  )
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || JSON.stringify(data))
  console.log(`[sms] ✅ Auto-reply sent to ${to} (sid: ${data.sid})`)
}

// ── Server ────────────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }

  if (req.method === 'POST' && req.url === '/api/contact') {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', async () => {
      try {
        const { name = '', email = '', phone = '', intent = '', message = '' } = JSON.parse(body)

        // Split "First Last" → separate fields
        const parts     = name.trim().split(/\s+/)
        const firstName = parts[0] || ''
        const lastName  = parts.slice(1).join(' ') || ''

        // Map form intent codes → Airtable Type values
        const intentMap = {
          buy:    'Buyer',
          sell:   'Seller',
          invest: 'Investor',
          cma:    'CMA',
          other:  'Other',
        }
        const type = intentMap[intent] || 'Other'

        // ── Airtable ──────────────────────────────────────────────────────────
        const airtableRes = await fetch(
          `https://api.airtable.com/v0/${AIRTABLE_BASE}/${AIRTABLE_TABLE}`,
          {
            method: 'POST',
            headers: {
              Authorization:  `Bearer ${AIRTABLE_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fields: {
                'First Name': firstName,
                'Last Name':  lastName,
                'Email':      email,
                'Phone':      phone,
                'Type':       type,
                'Message':    message,
                'Status':     'Cold/Long Term',
              },
            }),
          }
        )

        const data = await airtableRes.json()
        if (!airtableRes.ok) throw new Error(data.error?.message || JSON.stringify(data))
        console.log(`[contact] ✅ ${firstName} ${lastName} <${email}> added to Airtable`)

        // ── Email + SMS (fire-and-forget, don't block response) ───────────────
        const notifications = []
        notifications.push(sendEmail({ firstName, lastName, email, phone, type, message }))
        if (phone.trim()) notifications.push(sendSMS(phone, firstName))
        Promise.allSettled(notifications).then(results => {
          results.forEach(r => { if (r.status === 'rejected') console.error('[notify] ❌', r.reason?.message) })
        })

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ ok: true }))
      } catch (err) {
        console.error('[contact] ❌ Error:', err.message)
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ ok: false, error: err.message }))
      }
    })
    return
  }

  res.writeHead(404)
  res.end()
})

server.listen(PORT, () => {
  console.log(`✅ API server running on http://localhost:${PORT}`)
})
