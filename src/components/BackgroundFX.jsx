/**
 * BackgroundFX — slow, ambient motion behind the page content.
 *
 * Three large radial gradients in the accent colour drift on long, offset
 * cycles. Because they are heavily blurred and very low opacity, the effect
 * reads as a subtle shift in light rather than as moving shapes, and it works
 * against both the light and dark palettes without adjustment.
 *
 * Enabled/disabled from main.jsx — see BACKGROUND_ANIMATION there. When
 * disabled, a single static wash is rendered instead so the page keeps a
 * little depth. Users who ask for reduced motion get the static version too,
 * via the global media query in index.css.
 */
export default function BackgroundFX({ enabled = true }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <div
        className={[
          'absolute -left-40 -top-40 h-[38rem] w-[38rem] rounded-full',
          'bg-accent/10 blur-[130px]',
          enabled ? 'animate-drift1' : '',
        ].join(' ')}
      />
      <div
        className={[
          'absolute -right-40 top-1/3 h-[34rem] w-[34rem] rounded-full',
          'bg-accent/[0.07] blur-[130px]',
          enabled ? 'animate-drift2' : '',
        ].join(' ')}
      />
      <div
        className={[
          'absolute bottom-0 left-1/4 h-[30rem] w-[30rem] rounded-full',
          'bg-accent/[0.06] blur-[130px]',
          enabled ? 'animate-drift3' : '',
        ].join(' ')}
      />
    </div>
  );
}
