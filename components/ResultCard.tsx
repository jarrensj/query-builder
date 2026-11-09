'use client'

import { useEffect, useRef, useState } from 'react';

type Result = {
  // Only needed when there is more than one link.
  label?: string;
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
    <section ref={cardRef} className="mt-11 border-t-2 border-accent pt-4">
      <h2 className="text-[12px] font-medium uppercase tracking-[0.06em] text-ink-muted">
        {results.length > 1 ? 'Your links' : 'Your link'}
      </h2>
      {heading && <p className="mt-2 text-[17px] font-medium">{heading}</p>}
      <div className="mt-3.5 grid gap-[22px]">
        {results.map(({ label, href }, index) => (
          <div key={index} className="grid gap-2.5">
            {label && <p className="text-[14px] font-medium text-ink-muted">{label}</p>}
            <code className="block break-all font-mono text-[12.5px] leading-[1.6] text-ink-muted">
              {href}
            </code>
            <div className="flex flex-wrap gap-2.5">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="button-primary button-small"
              >
                Open on X
              </a>
              <button type="button" onClick={() => copy(href)} className="button-secondary">
                {copiedHref === href ? 'Copied' : 'Copy link'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ResultCard;
