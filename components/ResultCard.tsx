'use client'

import { useEffect, useRef, useState } from 'react';

type Result = {
  label: string;
  href: string;
};

type ResultCardProps = {
  heading?: string;
  results: Result[];
  // Forms with a submit step increment this on each submit.
  revealSignal?: number;
};

const COPIED_LABEL_MS = 1500;

const ResultCard = ({ heading, results, revealSignal }: ResultCardProps) => {
  const [copiedHref, setCopiedHref] = useState('');
  const copiedTimer = useRef<ReturnType<typeof setTimeout>>();
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => () => clearTimeout(copiedTimer.current), []);

  // The result renders below the form, where an on-screen keyboard would hide it.
  // On touch devices, close the keyboard after a submit and bring the result into view.
  useEffect(() => {
    if (!revealSignal || !window.matchMedia('(pointer: coarse)').matches) return;
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    cardRef.current?.scrollIntoView({ block: 'nearest' });
  }, [revealSignal]);

  const copy = async (href: string) => {
    try {
      await navigator.clipboard.writeText(href);
    } catch {
      return; // Clipboard unavailable or denied: leave the label as "Copy".
    }
    setCopiedHref(href);
    clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopiedHref(''), COPIED_LABEL_MS);
  };

  return (
    <section ref={cardRef} className="mt-3 grid gap-3 rounded-[10px] border border-line bg-white px-5 py-4">
      {heading && <p className="font-medium">{heading}</p>}
      <div className="grid gap-3.5">
        {results.map(({ label, href }, index) => (
          <div key={index} className="grid gap-2.5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`min-w-0 flex-[1_1_200px] text-[14px] font-medium text-accent underline underline-offset-[3px] hover:text-accent-hover ${
                  label === href ? 'break-all' : '[overflow-wrap:anywhere]'
                }`}
              >
                {label}
              </a>
              <button
                type="button"
                onClick={() => copy(href)}
                className="rounded-md border border-line-strong bg-white px-2.5 py-[5px] text-[13px] text-ink-secondary hover:border-accent hover:text-accent"
              >
                {copiedHref === href ? 'Copied' : 'Copy'}
              </button>
            </div>
            {label !== href && (
              <code className="block break-all rounded-md border border-line bg-ground px-3 py-2.5 font-mono text-[12.5px] text-ink-secondary">
                {href}
              </code>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ResultCard;
