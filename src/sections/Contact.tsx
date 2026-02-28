import { useState } from 'react'
import { motion } from 'framer-motion'

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
})

type Field = { name: string; email: string; phone: string; intent: string; message: string }
type State = 'idle' | 'loading' | 'success' | 'error'

const INTENTS: [string, string][] = [
  ['buy',     'Buy a Home'],
  ['sell',    'Sell My Home'],
  ['invest',  'Invest in Property'],
  ['cma',     'Get a Free CMA'],
  ['other',   'Other'],
]


export default function Contact() {
  const [form, setForm] = useState<Field>({ name: '', email: '', phone: '', intent: 'buy', message: '' })
  const [state, setState] = useState<State>('idle')
  const [errMsg, setErrMsg] = useState('')

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState('loading')
    setErrMsg('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.error || 'Submission failed')
      setState('success')
    } catch (err) {
      setState('error')
      setErrMsg(err instanceof Error ? err.message : 'Something went wrong. Please call or email directly.')
    }
  }

  return (
    <section id="contact" className="bg-warm-white py-28 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-10 border-b border-charcoal/8">
          <div>
            <motion.p {...fade(0)} className="label mb-4">Get in Touch</motion.p>
            <motion.h2 {...fade(0.06)} className="section-title-dark">
              Ready to Make<br /> a Move?
            </motion.h2>
          </div>
          <motion.p {...fade(0.1)} className="font-body font-light text-lg text-ash max-w-xs md:text-right">
            Baltimore City &amp; Montgomery County.<br />
            Nick responds within a few hours.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-12 gap-10 md:gap-16">

          {/* Left: info + map */}
          <motion.div {...fade(0.08)} className="md:col-span-4 space-y-8">

            {/* Direct contact */}
            <div>
              <p className="label mb-5">Direct</p>
              <div className="space-y-4">
                <a href="tel:+13018757182"
                  className="flex items-center gap-4 group">
                  <span className="w-10 h-10 border border-charcoal/10 flex items-center justify-center text-ash group-hover:border-md-red group-hover:text-md-red transition-colors shrink-0">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </span>
                  <div>
                    <p className="font-grotesk font-light text-base text-ash group-hover:text-charcoal transition-colors">(301) 875-7182</p>
                    <p className="font-body font-light text-sm text-charcoal/45">Mobile</p>
                  </div>
                </a>
                <a href="mailto:nickjungmarker@lnf.com"
                  className="flex items-center gap-4 group">
                  <span className="w-10 h-10 border border-charcoal/10 flex items-center justify-center text-ash group-hover:border-md-red group-hover:text-md-red transition-colors shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <div>
                    <p className="font-grotesk font-light text-base text-ash group-hover:text-charcoal transition-colors">nickjungmarker@lnf.com</p>
                    <p className="font-body font-light text-sm text-charcoal/45">Email</p>
                  </div>
                </a>
              </div>
            </div>


            {/* Social */}
            <div>
              <p className="label mb-4">Follow</p>
              <div className="flex flex-wrap gap-2">
                {[
                  ['Zillow',     'https://www.zillow.com/profile/nickjungmarker6'],
                  ['Instagram',  'https://instagram.com/nickjungmarker.realtor'],
                  ['TikTok',     'https://tiktok.com/@dorlpob'],
                ].map(([label, href]) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="font-grotesk font-light text-base text-ash hover:text-md-red transition-colors border border-charcoal/10 hover:border-md-red/30 px-4 py-2">
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div {...fade(0.14)} className="md:col-span-8">
            {state === 'success' ? (
              <div className="card-light p-14 text-center">
                <div className="w-14 h-14 border border-md-red/30 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-6 h-6 text-md-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-grotesk font-light text-3xl text-charcoal mb-3">Message Sent</h3>
                <p className="font-body font-light text-base text-ash max-w-xs mx-auto">
                  Thanks, {form.name.split(' ')[0] || 'there'}. Nick will be in touch.
                  Or reach him at{' '}
                  <a href="tel:+13018757182" className="text-md-red">(301) 875-7182</a>.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="label block mb-2">Name *</span>
                    <input name="name" value={form.name} onChange={set} required
                      placeholder="Your name" className="input-light" />
                  </label>
                  <label className="block">
                    <span className="label block mb-2">Phone</span>
                    <input name="phone" value={form.phone} onChange={set}
                      placeholder="(443) 555-0000" type="tel" className="input-light" />
                  </label>
                </div>

                <label className="block">
                  <span className="label block mb-2">Email *</span>
                  <input name="email" type="email" value={form.email} onChange={set} required
                    placeholder="your@email.com" className="input-light" />
                </label>

                <label className="block">
                  <span className="label block mb-2">I'm looking to…</span>
                  <select name="intent" value={form.intent} onChange={set} className="input-light bg-white">
                    {INTENTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </label>

                <label className="block">
                  <span className="label block mb-2">Message</span>
                  <textarea name="message" value={form.message} onChange={set} rows={5}
                    placeholder="Tell Nick what you're looking for — neighborhood, budget, timeline…"
                    className="input-light resize-none" />
                </label>

                {state === 'error' && (
                  <p className="font-body font-light text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3">
                    {errMsg}
                  </p>
                )}

                <div className="flex items-center gap-4">
                  <button type="submit" disabled={state === 'loading'}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                    {state === 'loading' ? (
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Sending…
                      </span>
                    ) : 'Send Message'}
                  </button>
                  <p className="font-body font-light text-sm text-charcoal/40">No spam, ever.</p>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
