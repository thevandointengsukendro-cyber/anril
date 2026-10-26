import React from 'react';

/**
 * Replaces Unicode subscript characters (ₙ, ₁, ₂) and special math symbols
 * that may lack glyph coverage in headless Linux sans-serif fonts with
 * proper HTML <sub>/<sup> elements and universally supported glyphs.
 */
export function formatSafeMathString(input: string): string {
  return input
    .replace(/ₙ/g, '_n')
    .replace(/₁/g, '_1')
    .replace(/₂/g, '_2')
    .replace(/∋/g, ' : ')
    .replace(/ℕ/g, 'N')
    .replace(/ℝ/g, 'R')
    .replace(/⟺/g, '<=>')
    .replace(/⟹/g, '=>')
    .replace(/✓/g, '[OK]');
}

interface MathTextProps {
  text: string;
  className?: string;
}

const TOKEN_REGEX =
  /(xₙ|yₙ|zₙ|K₁|K₂|K_ε|V_ε|x_n|y_n|z_n|K_1|K_2|∀|∃|∋|∈|∉|ℕ|ℝ|⟺|⟹|✓)/g;

export const MathText: React.FC<MathTextProps> = ({ text, className }) => {
  const parts = text.split(TOKEN_REGEX);

  return (
    <span className={className}>
      {parts.map((part, idx) => {
        switch (part) {
          case 'xₙ':
          case 'x_n':
            return (
              <span key={idx} className="font-mono-tabular">
                x<sub>n</sub>
              </span>
            );
          case 'yₙ':
          case 'y_n':
            return (
              <span key={idx} className="font-mono-tabular">
                y<sub>n</sub>
              </span>
            );
          case 'zₙ':
          case 'z_n':
            return (
              <span key={idx} className="font-mono-tabular">
                z<sub>n</sub>
              </span>
            );
          case 'K₁':
          case 'K_1':
            return (
              <span key={idx} className="font-mono-tabular">
                K<sub>1</sub>
              </span>
            );
          case 'K₂':
          case 'K_2':
            return (
              <span key={idx} className="font-mono-tabular">
                K<sub>2</sub>
              </span>
            );
          case 'K_ε':
            return (
              <span key={idx} className="font-mono-tabular">
                K<sub>ε</sub>
              </span>
            );
          case 'V_ε':
            return (
              <span key={idx} className="font-mono-tabular">
                V<sub>ε</sub>
              </span>
            );
          case '∀':
            return (
              <span key={idx} className="font-semibold text-sky-900" title="Untuk setiap (for all)">
                ∀
              </span>
            );
          case '∃':
            return (
              <span key={idx} className="font-semibold text-amber-900" title="Terdapat (there exists)">
                ∃
              </span>
            );
          case '∋':
            return (
              <span key={idx} className="italic text-slate-600">
                {' '}
                s.d.{' '}
              </span>
            );
          case '∈':
            return (
              <span key={idx} className="font-serif px-0.5">
                ∈
              </span>
            );
          case '∉':
            return (
              <span key={idx} className="font-serif px-0.5">
                ∉
              </span>
            );
          case 'ℕ':
            return (
              <strong key={idx} className="font-serif font-bold text-slate-900">
                N
              </strong>
            );
          case 'ℝ':
            return (
              <strong key={idx} className="font-serif font-bold text-slate-900">
                R
              </strong>
            );
          case '⟺':
            return (
              <span key={idx} className="font-mono-tabular font-bold text-sky-800 px-1">
                &lt;=&gt;
              </span>
            );
          case '⟹':
            return (
              <span key={idx} className="font-mono-tabular font-bold text-emerald-800 px-1">
                =&gt;
              </span>
            );
          case '✓':
            return (
              <span key={idx} className="font-bold text-emerald-700">
                [Valid]
              </span>
            );
          default:
            return <React.Fragment key={idx}>{part}</React.Fragment>;
        }
      })}
    </span>
  );
};
