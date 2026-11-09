'use client'

import { useState } from 'react';
import cleanHandle from '../lib/cleanHandle';
import ResultCard from './ResultCard';

const buildSearchUrl = (from: string, to: string) =>
  `https://x.com/search?q=(from%3A${encodeURIComponent(from)})%20(to%3A${encodeURIComponent(to)})&src=typed_query`;

const Form2 = () => {
  const [user1, setUser1] = useState('');
  const [user2, setUser2] = useState('');
  const [query, setQuery] = useState('');
  const [bothDirections, setBothDirections] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  const from = cleanHandle(user1);
  const to = cleanHandle(user2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(from && to ? buildSearchUrl(from, to) : '');
    setSubmitCount((count) => count + 1);
  };

  const results = bothDirections
    ? [
        { label: `From @${from} to @${to}`, href: buildSearchUrl(from, to) },
        { label: `From @${to} to @${from}`, href: buildSearchUrl(to, from) },
      ]
    : [{ href: query }];

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="user1" className="form-label">
            From
          </label>
          <input
            type="text"
            id="user1"
            value={user1}
            onChange={(e) => setUser1(e.target.value)}
            className="field-input"
            placeholder="@handle"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="form-row">
          <label htmlFor="user2" className="form-label">
            To
          </label>
          <input
            type="text"
            id="user2"
            value={user2}
            onChange={(e) => setUser2(e.target.value)}
            className="field-input"
            placeholder="@handle"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="form-row">
          <span className="form-label">Direction</span>
          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              id="bothDirections"
              checked={bothDirections}
              onChange={(e) => setBothDirections(e.target.checked)}
              className="h-4 w-4 shrink-0 accent-accent"
            />
            Both ways — build a second link for the replies back
          </label>
        </div>
        <div className="form-actions">
          <p className="form-hint">Opens on x.com in a new tab.</p>
          <button type="submit" className="button-primary">
            Build the link
          </button>
        </div>
      </form>
      {query && <ResultCard results={results} revealSignal={submitCount} />}
    </>
  );
};

export default Form2;
