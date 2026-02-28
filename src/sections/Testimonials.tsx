import { motion } from 'framer-motion'
import { TESTIMONIALS } from '../data'

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
})

export default function Testimonials() {
  return (
    <section id="stories" className="bg-stone py-28 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-10 border-b border-charcoal/8">
          <div>
            <motion.p {...fade(0)} className="label mb-4">Client Stories</motion.p>
            <motion.h2 {...fade(0.06)} className="section-title-dark">
              Real People.<br /> Real Results.
            </motion.h2>
          </div>
          <motion.div {...fade(0.1)} className="md:text-right">
            <div className="font-grotesk font-thin text-5xl text-charcoal mb-1">5.0</div>
            <p className="font-body font-light text-base text-ash">47 Google Reviews</p>
            <div className="flex md:justify-end gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-charcoal/8">
          {TESTIMONIALS.map((t, i) => (
            <motion.blockquote
              key={t.id}
              {...fade(i * 0.1)}
              className="bg-stone p-10 flex flex-col gap-6"
            >
              {/* Large quote mark */}
              <span className="font-grotesk font-thin text-8xl text-md-red/20 leading-none -mb-4" aria-hidden="true">"</span>

              <p className="font-body font-light text-xl text-charcoal/70 leading-relaxed flex-1">
                {t.quote}
              </p>

              <footer className="flex items-center justify-between pt-4 border-t border-charcoal/8">
                <div>
                  <p className="font-grotesk font-medium text-lg text-charcoal">{t.name}</p>
                  <p className="font-body font-light text-base text-ash mt-0.5">{t.role} · {t.neighborhood}</p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(t.stars)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
