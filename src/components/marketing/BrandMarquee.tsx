'use client'

// Doubled for seamless loop — marquee shifts by 50%
const BRANDS = [
  'Riyadh Season', 'ROSHN', 'stc', 'Jarir', 'Saudia Airlines', 'Noon', 'AlUla', 'Almarai',
  'Riyadh Season', 'ROSHN', 'stc', 'Jarir', 'Saudia Airlines', 'Noon', 'AlUla', 'Almarai',
]

export default function BrandMarquee() {
  return (
    <div className="overflow-hidden select-none" aria-hidden="true">
      <div className="flex items-center gap-12 animate-[marquee_36s_linear_infinite] w-max">
        {BRANDS.map((name, i) => (
          <span
            key={i}
            className="text-[13px] font-black text-white/30 uppercase tracking-[0.14em] whitespace-nowrap"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  )
}
