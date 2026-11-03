'use client'

import { useState, useEffect } from 'react';
import RestoreHandle from './RestoreHandle';
import ResultCard from './ResultCard';

const Form = () => {
  const [handle, setHandle] = useState('');
  const [keywords, setKeywords] = useState(''); // all required keywords that must be found in the tweet
  const [query, setQuery] = useState('');
  const [submitCount, setSubmitCount] = useState(0);

  // Load handle from localStorage on component mount
  useEffect(() => {
    const savedHandle = localStorage.getItem('twitter-handle');
    if (savedHandle) {
      setHandle(savedHandle);
    }
  }, []);

  // Save handle to localStorage whenever it changes
  const handleHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHandle = e.target.value;
    setHandle(newHandle);
    localStorage.setItem('twitter-handle', newHandle);
  };

  const buildQuery = () => {
    let queryParts = [];

    if (keywords) {
      queryParts.push(keywords.split(' ').map((word: string) => encodeURIComponent(word)).join('%20'));
    }
    if (handle) {
      queryParts.push(`from%3A${handle}`);
    }

    if (queryParts.length > 0) {
      return `https://x.com/search?q=${queryParts.join('%20')}&src=typed_query&f=top`;
    }
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(buildQuery());
    setSubmitCount((count) => count + 1);
  };

  return (
    <>
      <section className="card">
        <form onSubmit={handleSubmit}>
          <div className="card-body">
            <div>
              <label htmlFor="handle" className="field-label">
                Tweet by:
              </label>
              <input
                type="text"
                id="handle"
                value={handle}
                onChange={handleHandleChange}
                className="field-input"
                placeholder="jarrensj"
                autoComplete="off"
                spellCheck={false}
              />
              <RestoreHandle />
            </div>
            <div>
              <label htmlFor="keywords" className="field-label">
                All these words must be found in the tweet:
              </label>
              <input
                type="text"
                id="keywords"
                value={keywords}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeywords(e.target.value)}
                className="field-input"
                placeholder="hi"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="card-footer">
            <button type="submit" className="button-primary">
              Generate
            </button>
          </div>
        </form>
      </section>
      {query && <ResultCard results={[{ label: query, href: query }]} revealSignal={submitCount} />}
    </>
  );
};

export default Form;
