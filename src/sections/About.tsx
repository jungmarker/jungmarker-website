import { motion } from 'framer-motion'

const STATS = [
  { v: '5.0',      l: 'Google Rating'   },
  { v: '47+',      l: '5-Star Reviews'  },
  { v: 'Free',     l: 'Home Valuation'  },
  { v: 'Same Day', l: 'Response'        },
]

const BALT_NEIGHBORHOODS = [
  'Bolton Hill', 'Federal Hill', 'Hampden', 'Mount Vernon',
  'Remington', 'Charles Village', 'Fells Point', 'Canton',
  'Greenmount West', 'Waverly', 'Roland Park', 'Reservoir Hill',
]

const MOCO_NEIGHBORHOODS = [
  'Bethesda', 'Silver Spring', 'Potomac', 'Chevy Chase',
  'Rockville', 'Gaithersburg', 'North Bethesda', 'Takoma Park',
]

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
})

export default function About() {
  return (
    <section id="about" className="bg-warm-white py-28 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">

        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-10 border-b border-charcoal/8">
          <div>
            <motion.p {...fade(0)} className="label mb-4">About</motion.p>
            <motion.h2 {...fade(0.06)} className="section-title-dark">
              Nick Jungmarker
            </motion.h2>
          </div>
          <motion.p {...fade(0.1)} className="font-body font-light text-lg text-ash max-w-xs md:text-right leading-relaxed">
            Serving Baltimore City, Montgomery County,<br />
            and all of Maryland.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-12 gap-12 md:gap-16">

          {/* Left: photo */}
          <motion.div {...fade(0.08)} className="md:col-span-4">
            <div className="relative">
              <img
                src="/headshot.png"
                alt="Nick Jungmarker"
                className="w-full object-cover object-top"
                style={{ maxHeight: '520px' }}
              />
              {/* Maryland red accent bar */}
              <div className="h-1 bg-md-red" />
              {/* Credential tag */}
              <div className="mt-4 space-y-2">
                {[
                  'MD License #5017475',
                  'Long & Foster Real Estate',
                  'Bilingual — English / Español',
                ].map((c) => (
                  <div key={c} className="flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-md-red shrink-0" />
                    <span className="font-body font-light text-base text-ash">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Middle: bio */}
          <motion.div {...fade(0.12)} className="md:col-span-5 space-y-7">
            <p className="section-body-dark">
              I serve buyers, sellers, and investors across Baltimore City, Montgomery
              County, and the rest of Maryland — from historic rowhome neighborhoods
              like Fells Point and Federal Hill to the suburbs of Bethesda and Silver Spring.
            </p>
            <p className="section-body-dark">
              Whether you're buying your first home, ready to sell, or looking to grow a
              portfolio, I'm in your corner. I negotiate hard for every client — the same
              way I would if it were my own home on the line.
            </p>
            <p className="section-body-dark">
              Honest advice, local knowledge, and a commitment to getting you the
              best possible deal. That's what you'll get every time.
            </p>

            {/* Spanish callout */}
            <div className="border-l-2 border-md-red pl-5 py-1">
              <p className="font-grotesk font-medium text-base tracking-[.12em] uppercase text-md-red mb-2">🇦🇷 Hablo español</p>
              <p className="font-body font-light text-lg text-charcoal/55 leading-relaxed">
                Atiendo clientes en español. Si prefiere comunicarse en español, no dude en contactarme.
              </p>
            </div>

            <div className="pt-4">
              <a href="#contact" className="btn-primary">
                Start a Conversation
              </a>
            </div>
          </motion.div>

          {/* Right: stats + markets */}
          <motion.div {...fade(0.18)} className="md:col-span-3 space-y-8">

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {STATS.map((s) => (
                <div key={s.l} className="card-light p-5 border-t-2 border-md-red">
                  <div className="font-grotesk font-thin text-4xl text-charcoal leading-none mb-2">{s.v}</div>
                  <div className="font-grotesk font-medium text-xs tracking-[.12em] uppercase text-ash">{s.l}</div>
                </div>
              ))}
            </div>

            {/* Baltimore */}
            <div>
              <p className="label mb-3">Baltimore City</p>
              <div className="flex flex-wrap gap-1.5">
                {BALT_NEIGHBORHOODS.map((n) => (
                  <span key={n} className="font-body font-light text-sm text-ash border border-charcoal/10 px-2.5 py-1.5 hover:border-md-red/30 hover:text-charcoal transition-colors cursor-default">
                    {n}
                  </span>
                ))}
              </div>
            </div>

            {/* Montgomery County */}
            <div>
              <p className="label mb-3">Montgomery County</p>
              <div className="flex flex-wrap gap-1.5">
                {MOCO_NEIGHBORHOODS.map((n) => (
                  <span key={n} className="font-body font-light text-sm text-ash border border-charcoal/10 px-2.5 py-1.5 hover:border-md-red/30 hover:text-charcoal transition-colors cursor-default">
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
