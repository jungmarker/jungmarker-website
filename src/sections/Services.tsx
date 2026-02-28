import { motion } from 'framer-motion'

const SERVICES = [
  {
    num: '01',
    title: 'First-Time Buyers',
    blurb: "Navigating Baltimore's rowhome market for the first time? I'll walk you through every step — financing, inspections, negotiations, and closing.",
    bullets: ['Pre-approval guidance', 'Neighborhood deep-dives', 'Rowhome inspection checklist', 'Grant & down-payment programs'],
  },
  {
    num: '02',
    title: 'Sellers',
    blurb: "Strategic pricing, staging advice, and a proven marketing plan that gets Baltimore rowhomes sold fast — often over asking price.",
    bullets: ['Comparative market analysis', 'Pre-listing staging strategy', 'Professional photography', 'Multi-channel marketing'],
  },
  {
    num: '03',
    title: 'Investors',
    blurb: "From single-family value-adds to multi-unit acquisitions, I help investors identify the right Baltimore blocks before the market moves.",
    bullets: ['ARV & rental yield analysis', 'Off-market deal sourcing', 'Contractor network access', 'Portfolio strategy sessions'],
  },
]

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
})

export default function Services() {
  return (
    <section id="services" className="bg-charcoal py-28 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-10 border-b border-white/6">
          <div>
            <motion.p {...fade(0)} className="label mb-4">What I Do</motion.p>
            <motion.h2 {...fade(0.06)} className="section-title">
              Expert Guidance<br /> at Every Step.
            </motion.h2>
          </div>
          <motion.p {...fade(0.1)} className="font-body font-light text-lg text-white/45 max-w-xs md:text-right leading-relaxed">
            From Bolton Hill to Bethesda —<br />
            buyer, seller, or investor.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-white/5">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              {...fade(i * 0.1)}
              className="bg-charcoal p-10 flex flex-col gap-6 group hover:bg-white/3 transition-colors duration-300"
            >
              <div className="flex items-start justify-between">
                <span className="font-grotesk font-thin text-5xl text-white/10 leading-none">{s.num}</span>
                <div className="w-6 h-px bg-md-red mt-4 transition-all duration-300 group-hover:w-10" />
              </div>
              <div>
                <h3 className="font-grotesk font-light text-3xl text-white mb-4">{s.title}</h3>
                <p className="font-body font-light text-lg text-white/50 leading-relaxed mb-6">{s.blurb}</p>
                <ul className="space-y-2.5">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-3 font-body font-light text-base text-white/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <a href="#contact" className="mt-auto inline-flex items-center gap-2 font-grotesk font-medium text-base text-white/40 hover:text-white group-hover:text-gold transition-colors tracking-wide uppercase">
                Learn More
                <span className="w-4 h-px bg-current transition-all duration-300 group-hover:w-8" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
