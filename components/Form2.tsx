'use client'

import { useState } from 'react';
import ResultCard from './ResultCard';

const buildSearchUrl = (from: string, to: string) =>
  `https://x.com/search?q=(from%3A${encodeURIComponent(from)})%20(to%3A${encodeURIComponent(to)})&src=typed_query`;

const Form2 = () => {
  const [user1, setUser1] = useState('');
  const [user2, setUser2] = useState('');
  const [query, setQuery] = useState('');
  const [bothDirections, setBothDirections] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(user1 && user2 ? buildSearchUrl(user1, user2) : '');
    setSubmitCount((count) => count + 1);
  };

  const results = bothDirections
    ? [
        { label: `search for tweets from ${user1} to ${user2}`, href: buildSearchUrl(user1, user2) },
        { label: `search for tweets from ${user2} to ${user1}`, href: buildSearchUrl(user2, user1) },
      ]
    : [{ label: query, href: query }];

  return (
    <>
      <section className="card">
        <h2 className="card-title">
          Search for tweets between two users
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="card-body">
            <div className="field-row">
              <div>
                <label htmlFor="user1" className="field-label">
                  From User:
                </label>
                <input
                  type="text"
                  id="user1"
                  value={user1}
                  onChange={(e) => setUser1(e.target.value)}
                  className="field-input"
                  placeholder="jarrensj"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
              <div>
                <label htmlFor="user2" className="field-label">
                  To User:
                </label>
                <input
                  type="text"
                  id="user2"
                  value={user2}
                  onChange={(e) => setUser2(e.target.value)}
                  className="field-input"
                  placeholder="omakasemoney"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
            </div>
            <label className="flex cursor-pointer items-center gap-2.5 text-[14px] text-ink-secondary">
              <input
                type="checkbox"
                id="bothDirections"
                checked={bothDirections}
                onChange={(e) => setBothDirections(e.target.checked)}
                className="h-4 w-4 accent-accent"
              />
              Create link for both directions
            </label>
          </div>
          <div className="card-footer">
            <button type="submit" className="button-primary">
              Generate
            </button>
          </div>
        </form>
      </section>
      {query && <ResultCard results={results} revealSignal={submitCount} />}
    </>
  );
};

export default Form2;
