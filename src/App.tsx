import Nav from './components/ui/Nav'
import Hero from './sections/Hero'
import About from './sections/About'
import Portfolio from './sections/Portfolio'
import Services from './sections/Services'
import ListingsSold from './sections/ListingsSold'
import Testimonials from './sections/Testimonials'
import Contact from './sections/Contact'

export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <About />
      <Portfolio />
      <Services />
      <ListingsSold />
      <Testimonials />
      <Contact />

      <footer className="bg-charcoal py-16 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">

          {/* Top row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-white/6">
            <div className="flex flex-wrap items-center gap-8">
              <img src="/lnf-logo.jpg"     alt="Long & Foster Real Estate" className="h-14 opacity-85 bg-white/90 p-1.5" />
              <img src="/realtor-logo.png" alt="REALTOR®"                  className="h-10 opacity-85 bg-white/90 p-1.5" />
              <img src="/eho-logo.svg"     alt="Equal Housing Opportunity" className="h-10 opacity-70 bg-white/90 p-1.5" />
            </div>
            <div className="flex flex-col gap-1 md:text-right">
              <a href="tel:+13018757182"
                className="font-grotesk font-light text-base text-white/50 hover:text-white transition-colors">
                (301) 875-7182
              </a>
              <a href="mailto:nickjungmarker@lnf.com"
                className="font-grotesk font-light text-sm text-white/30 hover:text-white/60 transition-colors">
                nickjungmarker@lnf.com
              </a>
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-8">
            <div className="space-y-1">
              <p className="font-grotesk font-light text-sm text-white/35">
                © {new Date().getFullYear()} Nick Jungmarker · Long &amp; Foster Real Estate · MD License #5017475
              </p>
              <p className="font-body font-light text-xs text-white/20">
                12520 Prosperity Dr #105, Silver Spring, MD 20904 · (301) 388-2600
              </p>
            </div>
            {/* Maryland flag color block accent */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-md-red" />
              <div className="w-3 h-3 bg-gold" />
              <div className="w-3 h-3 border border-white/15" />
              <div className="w-3 h-3 bg-white/15" />
              <span className="font-grotesk font-light text-xs text-white/20 ml-2 tracking-widest uppercase">Maryland</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
