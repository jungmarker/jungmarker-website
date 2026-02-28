import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const ZILLOW_URL = 'https://www.zillow.com/profile/nickjungmarker6'

interface Listing {
  id: number
  address: string
  county: string
  neighborhood: string
  price: number
  beds: number
  baths: number
  sqft: number
  status: 'active' | 'under_contract'
  zillowUrl: string
  highlight: string
}

interface SoldHome {
  id: number
  address: string
  county: string
  neighborhood: string
  salePrice: number
  listPrice: number
  daysOnMarket: number
  soldDate: string
}

interface ListingsData {
  active: Listing[]
  sold: SoldHome[]
}

function fmt(n: number) {
  return '$' + n.toLocaleString()
}

function overAsk(sold: number, list: number) {
  const d = sold - list
  return { label: (d >= 0 ? '+' : '') + fmt(d), green: d >= 0 }
}

type County = 'all' | 'Baltimore City' | 'Montgomery County'

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded tracking-wide ${
      status === 'active'
        ? 'bg-emerald-500/80 text-white'
        : 'bg-amber-500/80 text-white'
    }`}>
      {status === 'active' ? 'Active' : 'Under Contract'}
    </span>
  )
}

function CountyTag({ county }: { county: string }) {
  const isMoco = county === 'Montgomery County'
  return (
    <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded border ${
      isMoco
        ? 'border-blue-400/30 text-blue-300/80'
        : 'border-gold/25 text-gold/70'
    }`}>
      {isMoco ? 'MoCo' : 'Balt. City'}
    </span>
  )
}

function ScrollRow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft]   = useState(false)
  const [canRight, setCanRight] = useState(true)

  const update = () => {
    const el = ref.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [children])

  const scroll = (dir: 1 | -1) =>
    ref.current?.scrollBy({ left: dir * 320, behavior: 'smooth' })

  return (
    <div className={`relative group ${className}`}>
      {/* Left button */}
      <button
        onClick={() => scroll(-1)}
        aria-label="Scroll left"
        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-8 h-8 bg-warm-white border border-charcoal/15 flex items-center justify-center text-ash hover:text-charcoal hover:border-charcoal/30 transition-all shadow-sm ${
          canLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Right button */}
      <button
        onClick={() => scroll(1)}
        aria-label="Scroll right"
        className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-8 h-8 bg-warm-white border border-charcoal/15 flex items-center justify-center text-ash hover:text-charcoal hover:border-charcoal/30 transition-all shadow-sm ${
          canRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Scroll container */}
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      {/* Fade edges */}
      {canLeft  && <div className="pointer-events-none absolute left-0  top-0 bottom-2 w-12 bg-gradient-to-r from-warm-white to-transparent" />}
      {canRight && <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-warm-white to-transparent" />}
    </div>
  )
}

export default function ListingsSold() {
  const [tab, setTab]       = useState<'active' | 'sold'>('active')
  const [county, setCounty] = useState<County>('all')
  const [data, setData]     = useState<ListingsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(false)

  useEffect(() => {
    fetch('/listings.json')
      .then((r) => { if (!r.ok) throw new Error(); return r.json() })
      .then((d: ListingsData) => { setData(d); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  const activeFiltered = data?.active.filter(
    (l) => county === 'all' || l.county === county
  ) ?? []

  const soldFiltered = data?.sold.filter(
    (l) => county === 'all' || l.county === county
  ) ?? []

  return (
    <section id="listings" className="bg-warm-white py-28 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.p
          initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="label-dark mb-4"
        >
          Properties
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.06 }}
          className="flex flex-wrap items-end justify-between gap-4 mb-8"
        >
          <h2 className="section-title-dark">Listings &amp; Recent Sales</h2>
          <a
            href={ZILLOW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-gold/70 hover:text-gold transition-colors border border-gold/20 hover:border-gold/40 px-3 py-1.5"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
            View all on Zillow
          </a>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.1 }}
          className="flex flex-wrap items-center gap-3 mb-8"
        >
          <div className="inline-flex overflow-hidden border border-charcoal/15">
            {(['active', 'sold'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2.5 text-base font-medium transition-colors ${
                  tab === t ? 'bg-charcoal text-white' : 'text-ash hover:text-charcoal hover:bg-charcoal/5'
                }`}
              >
                {t === 'active' ? `Active (${data?.active.length ?? '…'})` : `Sold (${data?.sold.length ?? '…'})`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 text-sm">
            {(['all', 'Baltimore City', 'Montgomery County'] as County[]).map((c) => (
              <button
                key={c}
                onClick={() => setCounty(c)}
                className={`px-3 py-1.5 border transition-colors ${
                  county === c
                    ? 'border-gold/60 text-gold bg-gold/8'
                    : 'border-charcoal/12 text-ash hover:text-charcoal hover:border-charcoal/25'
                }`}
              >
                {c === 'all' ? 'All Maryland' : c === 'Baltimore City' ? 'Baltimore' : 'Montgomery Co.'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        {loading && (
          <div className="py-20 text-center text-slate text-base animate-pulse">Loading listings…</div>
        )}

        {error && (
          <div className="py-12 text-center space-y-3">
            <p className="text-slate text-base">Could not load listings.</p>
            <a href={ZILLOW_URL} target="_blank" rel="noopener noreferrer" className="btn-outline text-base">
              View on Zillow instead →
            </a>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* ── Active listings carousel ── */}
            {tab === 'active' && (
              <motion.div
                key="active"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {activeFiltered.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-slate text-base mb-4">No active listings in this area right now.</p>
                    <a href={ZILLOW_URL} target="_blank" rel="noopener noreferrer" className="btn-outline text-base">
                      Check Zillow for updates →
                    </a>
                  </div>
                ) : (
                  <ScrollRow>
                    {activeFiltered.map((l) => (
                      <div
                        key={l.id}
                        className="card-light overflow-hidden flex flex-col shrink-0 w-80"
                      >
                        {/* Image / price bar */}
                        <div className="h-40 bg-gradient-to-br from-brick/20 to-[#0a1520] relative flex items-end p-3">
                          <div className="absolute top-2.5 right-2.5 flex gap-1.5">
                            <CountyTag county={l.county} />
                            <StatusBadge status={l.status} />
                          </div>
                          <p className="font-serif text-cream text-2xl font-semibold">{fmt(l.price)}</p>
                        </div>

                        <div className="p-5 flex flex-col flex-1 gap-3">
                          <div>
                            <p className="text-charcoal font-medium text-base">{l.address}</p>
                            <p className="text-ash text-sm mt-0.5">{l.neighborhood}, {l.county}</p>
                          </div>

                          <div className="flex gap-3 text-sm text-ash">
                            <span>{l.beds} bd</span>
                            <span className="text-charcoal/20">·</span>
                            <span>{l.baths} ba</span>
                            <span className="text-charcoal/20">·</span>
                            <span>{l.sqft.toLocaleString()} sqft</span>
                          </div>

                          <p className="text-ash text-sm leading-snug flex-1">{l.highlight}</p>

                          <div className="flex gap-2 mt-auto">
                            <a
                              href={l.zillowUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 btn-outline text-center text-sm py-2"
                            >
                              View on Zillow
                            </a>
                            <a href="#contact" className="flex-1 btn-gold text-center text-sm py-2">
                              Schedule Tour
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </ScrollRow>
                )}
              </motion.div>
            )}

            {/* ── Sold carousel ── */}
            {tab === 'sold' && (
              <motion.div
                key="sold"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <ScrollRow>
                  {soldFiltered.map((s) => {
                    const res = overAsk(s.salePrice, s.listPrice)
                    return (
                      <div
                        key={s.id}
                        className="card-light p-5 shrink-0 w-72 flex flex-col gap-3"
                      >
                        <div className="w-8 h-8 rounded bg-brick/25 flex items-center justify-center">
                          <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>

                        <div>
                          <p className="text-charcoal text-base font-medium leading-tight">{s.address}</p>
                          <p className="text-ash text-sm mt-0.5">{s.neighborhood}</p>
                          <div className="mt-1"><CountyTag county={s.county} /></div>
                        </div>

                        <div className="border-t border-charcoal/8 pt-3 space-y-1">
                          <p className="text-charcoal font-semibold text-lg">{fmt(s.salePrice)}</p>
                          <p className={`text-sm font-medium ${res.green ? 'text-emerald-600' : 'text-red-600'}`}>
                            {res.label} over ask
                          </p>
                          <div className="flex gap-3 text-xs text-ash pt-1">
                            <span>{s.soldDate}</span>
                            <span className="text-charcoal/20">·</span>
                            <span>{s.daysOnMarket}d on market</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </ScrollRow>
              </motion.div>
            )}
          </>
        )}

        {/* Bottom CTAs */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 flex flex-wrap gap-3 justify-center"
          >
            <a href={ZILLOW_URL} target="_blank" rel="noopener noreferrer" className="btn-outline">
              Full profile on Zillow
            </a>
            <a href="#contact" className="btn-gold">
              Request a Free CMA
            </a>
          </motion.div>
        )}
      </div>
    </section>
  )
}
