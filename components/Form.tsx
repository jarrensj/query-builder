'use client'

import { useState, useEffect } from 'react';
import cleanHandle from '../lib/cleanHandle';
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
    const queryParts = [];

    const words = keywords.trim();
    if (words) {
      queryParts.push(words.split(/\s+/).map((word) => encodeURIComponent(word)).join('%20'));
    }
    const user = cleanHandle(handle);
    if (user) {
      queryParts.push(`from%3A${encodeURIComponent(user)}`);
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
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="handle" className="form-label">
            Posted by
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
        <div className="form-row">
          <label htmlFor="keywords" className="form-label">
            Must include
          </label>
          <input
            type="text"
            id="keywords"
            value={keywords}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeywords(e.target.value)}
            className="field-input"
            placeholder="words separated by spaces"
            autoComplete="off"
          />
        </div>
        <div className="form-actions">
          <p className="form-hint">Finds posts with every word, in any order. Opens on x.com in a new tab.</p>
          <button type="submit" className="button-primary">
            Build the link
          </button>
        </div>
      </form>
      {query && <ResultCard results={[{ href: query }]} revealSignal={submitCount} />}
    </>
  );
};

export default Form;
