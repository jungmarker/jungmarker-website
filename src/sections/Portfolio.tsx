import { motion } from 'framer-motion'

const PROJECTS = [
  {
    id: 1,
    neighborhood: 'Butchers Hill & Canton',
    type: 'Renovated Rowhome',
    desc: 'Original brick facades, hardwood floors, and open-plan kitchens — Canton and Butchers Hill\'s classic Federal rowhomes reimagined for modern living.',
    tag: 'Baltimore City',
    // CSS gradient stand-in — replace src with actual photo
    bg: 'from-[#2d1208] via-[#5c2a14] to-[#8b4a2c]',
    accent: 'bg-md-red',
    span: 'md:col-span-7',
    height: 'h-[520px]',
  },
  {
    id: 2,
    neighborhood: 'Federal Hill',
    type: 'Rooftop Deck · Harbor Views',
    desc: 'South-facing rooftop decks with unobstructed Inner Harbor sightlines. The best views in Baltimore, held by some of its oldest brick.',
    tag: 'Baltimore City',
    bg: 'from-[#0a1520] via-[#0f2540] to-[#1a3d60]',
    accent: 'bg-gold',
    span: 'md:col-span-5',
    height: 'h-[520px]',
  },
  {
    id: 3,
    neighborhood: 'Mount Vernon',
    type: 'Historic Brownstone',
    desc: 'Crown molding, marble mantels, and soaring 12-foot ceilings. Baltimore\'s grandest pre-war architecture, restored with precision.',
    tag: 'Baltimore City',
    bg: 'from-[#1a1612] via-[#2e2820] to-[#453d30]',
    accent: 'bg-gold',
    span: 'md:col-span-5',
    height: 'h-[440px]',
  },
  {
    id: 4,
    neighborhood: 'Harbor East',
    type: 'Waterfront Luxury Condo',
    desc: 'Glass, steel, and Chesapeake views. Harbor East condominiums at the intersection of the Bay and Fells Point\'s historic waterfront.',
    tag: 'Baltimore City',
    bg: 'from-[#071825] via-[#0d2e45] to-[#163d58]',
    accent: 'bg-md-red',
    span: 'md:col-span-7',
    height: 'h-[440px]',
  },
]

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
})

export default function Portfolio() {
  return (
    <section id="portfolio" className="bg-stone py-28 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 pb-10 border-b border-charcoal/8">
          <div>
            <motion.p {...fade(0)} className="label mb-4">Properties</motion.p>
            <motion.h2 {...fade(0.06)} className="section-title-dark">
              Baltimore,<br className="hidden sm:block" /> Up Close.
            </motion.h2>
          </div>
          <motion.p {...fade(0.1)} className="font-body font-light text-lg text-ash max-w-xs md:text-right leading-relaxed">
            Rowhomes, brownstones, waterfront — every corner of the city has a story. Nick knows them all.
          </motion.p>
        </div>

        {/* Photo grid */}
        <div className="grid md:grid-cols-12 gap-3">
          {PROJECTS.map((p, i) => (
            <motion.div
              key={p.id}
              {...fade(i * 0.08)}
              className={`${p.span} ${p.height} relative overflow-hidden group cursor-pointer`}
            >
              {/* Atmospheric gradient placeholder — swap for <img src="..."> */}
              <div className={`absolute inset-0 bg-gradient-to-br ${p.bg} transition-transform duration-700 ease-out group-hover:scale-105`} />

              {/* Grain texture overlay */}
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")' }}
              />

              {/* Bottom gradient for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <div className={`w-8 h-px ${p.accent} mb-4 transition-all duration-300 group-hover:w-12`} />
                <p className="font-grotesk font-medium text-xs tracking-[.16em] uppercase text-white/60 mb-2">{p.tag}</p>
                <h3 className="font-grotesk font-thin text-3xl md:text-4xl text-white leading-tight mb-1">{p.neighborhood}</h3>
                <p className="font-grotesk font-light text-base text-white/60 mb-3">{p.type}</p>
                <p className="font-body font-light text-base text-white/50 leading-relaxed max-w-sm opacity-0 translate-y-4 transition-all duration-400 group-hover:opacity-100 group-hover:translate-y-0">
                  {p.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div {...fade(0.3)} className="mt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-10 border-t border-charcoal/8">
          <p className="font-body font-light text-lg text-ash max-w-md">
            Ready to find your place in Baltimore? Nick's market knowledge turns searches into homes.
          </p>
          <div className="flex gap-4">
            <a href="#listings" className="btn-outline-light">Browse Listings</a>
            <a href="#contact"  className="btn-primary">Work With Nick</a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
