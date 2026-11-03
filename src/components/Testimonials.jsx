import { useState, useEffect, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { testimonials } from '../data/content'

export function Testimonials() {
  const [active, setActive] = useState('clients')
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    dragFree: true,
    slidesToScroll: 1,
  })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState([])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
    onSelect()
  }, [emblaApi, onSelect])

  useEffect(() => {
    if (emblaApi) emblaApi.scrollTo(0)
    setSelectedIndex(0)
  }, [active, emblaApi])

  const items = testimonials[active]

  return (
    <section className="testimonials-section">
      <div className="container">
        <p className="eyebrow" data-reveal>Reviews</p>
        <h2 className="section-title" data-reveal>What Do Our Partners Say?</h2>

        <div className="tabs" data-reveal>
          <button type="button" aria-pressed={active === 'clients'} className={`tab-btn${active === 'clients' ? ' active' : ''}`} onClick={() => setActive('clients')}>
            Clients
          </button>
          <button type="button" aria-pressed={active === 'candidates'} className={`tab-btn${active === 'candidates' ? ' active' : ''}`} onClick={() => setActive('candidates')}>
            Candidates
          </button>
        </div>

        <div className="embla" ref={emblaRef} data-reveal>
          <div className="embla__container">
            {items.map((t, i) => (
              <div key={i} className="embla__slide">
                <div className="testimonial-card">
                  <div className="testimonial-quote" aria-hidden>“</div>
                  <p className="testimonial-text">{t.quote}</p>
                  <div className="testimonial-author">
                    <strong>{t.author}</strong>
                    <span>{t.company}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="embla-dots">
          {scrollSnaps.map((_, i) => (
            <button
              type="button"
              key={i}
              aria-current={i === selectedIndex ? 'true' : undefined}
              className={`embla-dot${i === selectedIndex ? ' active' : ''}`}
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>

        <div className="testimonials-cta" data-reveal>
          <Link to={active === 'clients' ? '/hire' : '/jobs'} className="btn btn-testimonial-cta">
            {active === 'clients' ? 'Work with us' : 'Find your next role'}
            <ArrowRight size={16} strokeWidth={2.25} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  )
}
