import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-end pb-20 px-6 md:px-10 overflow-hidden"
    >
      {/* Background photo */}
      <img
        src="/rowhomes.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        style={{ filter: 'brightness(0.55) contrast(1.05) saturate(0.9)' }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/30 to-transparent pointer-events-none" />

      {/* Maryland flag accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-0 left-0 right-0 h-px bg-md-red origin-left"
      />

      <div className="relative z-10 max-w-7xl w-full mx-auto">

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="label mb-8"
        >
          Maryland REALTOR® · Long &amp; Foster Real Estate
        </motion.p>

        {/* Headshot inline with headline */}
        <div className="flex items-end gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/25 overflow-hidden shrink-0 mb-2"
          >
            <img
              src="/headshot.png"
              alt="Nick Jungmarker"
              className="w-full h-full object-cover object-top"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            <p className="font-grotesk font-light text-white/60 text-base tracking-widest uppercase mb-1">
              Nick Jungmarker
            </p>
            <p className="font-body font-light text-white/40 text-sm">
              Baltimore &amp; Montgomery County
            </p>
          </motion.div>
        </div>

        {/* Main headline */}
        <div className="overflow-hidden mb-3">
          <motion.h1
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="font-grotesk font-thin text-[clamp(3rem,9vw,8rem)] leading-[.92] tracking-[-0.02em] text-white"
          >
            Baltimore
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-2">
          <motion.h1
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-grotesk font-thin text-[clamp(3rem,9vw,8rem)] leading-[.92] tracking-[-0.02em] text-white/30"
          >
            Real Estate
          </motion.h1>
        </div>

        {/* Subline + CTAs side by side */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.45 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mt-10 border-t border-white/10 pt-8"
        >
          <p className="font-body font-light text-white/55 text-lg max-w-sm leading-relaxed">
            Born and raised in Baltimore. Every block, every neighborhood, every story — I know this city from the inside.
          </p>

          <div className="flex items-center gap-4 shrink-0">
            <a href="#listings" className="btn-primary">
              View Properties
            </a>
            <a href="#contact" className="btn-outline-dark">
              Get in Touch
            </a>
          </div>
        </motion.div>

        {/* Se habla español */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.9 }}
          className="mt-5"
        >
          <span className="inline-flex items-center gap-2 font-grotesk font-light text-sm text-white/35 border border-white/10 px-4 py-2 tracking-wide">
            <span>🇦🇷</span> Hablo español
          </span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 right-10 flex items-center gap-3 text-white/25 pointer-events-none"
      >
        <span className="font-grotesk font-light text-[10px] tracking-[.25em] uppercase">Scroll</span>
        <div className="w-8 h-px bg-white/20" />
      </motion.div>
    </section>
  )
}
