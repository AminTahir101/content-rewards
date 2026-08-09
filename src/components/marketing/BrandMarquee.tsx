'use client'

const BRANDS = [
  'Riyadh Season', 'ROSHN', 'stc', 'Jarir', 'Saudia Airlines', 'Noon',
  'Riyadh Season', 'ROSHN', 'stc', 'Jarir', 'Saudia Airlines', 'Noon',
]

export default function BrandMarquee() {
  return (
    <div className="overflow-hidden select-none" aria-hidden="true">
      <div className="flex items-center gap-16 animate-[marquee_28s_linear_infinite] w-max">
        {BRANDS.map((name, i) => (
          <span
            key={i}
            className="text-[15px] font-semibold text-zinc-400 tracking-tight whitespace-nowrap"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  )
}
