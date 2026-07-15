import { useState } from 'react'

// Bouton style "ordre de bourse" avec effet de validation (flash) au clic.
// variant : 'market' (Option A / vert) | 'urn' (Option B / bleu) | 'ghost'
export default function OrderButton({
  children,
  onClick,
  active = false,
  variant = 'market',
  className = '',
  ...rest
}) {
  const [flash, setFlash] = useState(false)

  const base =
    'relative select-none rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-150 active:scale-[0.98] focus-visible:outline-2'

  const palettes = {
    market: active
      ? 'border-up bg-up/20 text-up shadow-[0_0_0_1px_rgba(22,163,74,0.5)]'
      : 'border-edge bg-surface text-ink hover:border-up/60 hover:bg-up/10',
    urn: active
      ? 'border-info bg-info/20 text-info shadow-[0_0_0_1px_rgba(59,130,246,0.5)]'
      : 'border-edge bg-surface text-ink hover:border-info/60 hover:bg-info/10',
    ghost: 'border-edge bg-surface text-muted hover:text-ink hover:border-edge',
  }

  function handleClick(e) {
    setFlash(true)
    setTimeout(() => setFlash(false), 400)
    onClick?.(e)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      className={`${base} ${palettes[variant]} ${flash ? 'animate-flash' : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
