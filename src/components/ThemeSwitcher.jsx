import { useTheme } from '../theme/ThemeProvider.jsx';
import { Check } from 'lucide-react';

/**
 * Compact palette picker. Renders one chip per palette showing its actual
 * background / accent so the choice is legible without applying it first.
 */
export default function ThemeSwitcher({ compact = false }) {
  const { theme, setTheme, palettes } = useTheme();

  return (
    <div className={compact ? '' : 'w-full'}>
      {/* {!compact && (
        <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-inkMute mb-2">
          Theme
        </div>
      )} */}
      <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Colour theme">
        {palettes.map((p) => {
          const active = p.id === theme;
          return (
            <button
              key={p.id}
              role="radio"
              aria-checked={active}
              aria-label={`${p.name} — ${p.hint}`}
              title={`${p.name} — ${p.hint}`}
              onClick={() => setTheme(p.id)}
              className={[
                'relative h-7 w-7 rounded-full border transition-all',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
                active
                  ? 'border-accent scale-110 shadow-soft'
                  : 'border-line hover:scale-105 hover:border-inkMute',
              ].join(' ')}
              style={{ background: p.swatch.bg }}
            >
              {/* Accent dot */}
              <span
                className="absolute inset-0 m-auto h-3 w-3 rounded-full"
                style={{ background: p.swatch.accent }}
              />
              {active && (
                <Check
                  size={10}
                  strokeWidth={3}
                  className="absolute inset-0 m-auto"
                  style={{ color: p.swatch.bg }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
