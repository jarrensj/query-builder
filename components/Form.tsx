'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';

const Form = () => {
  const [handle, setHandle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [query, setQuery] = useState('');

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
  };

  return (
    <div className="w-full">
      <p className="text-sm text-zinc-500 mb-4">
        Search tweets from a user containing specific words
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="handle" className="block text-sm font-medium text-zinc-700 mb-1.5">
            Tweet by
          </label>
          <input
            type="text"
            id="handle"
            value={handle}
            onChange={handleHandleChange}
            className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="jarrensj"
          />
        </div>
        
        <div>
          <label htmlFor="keywords" className="block text-sm font-medium text-zinc-700 mb-1.5">
            Required keywords
          </label>
          <input
            type="text"
            id="keywords"
            value={keywords}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeywords(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="machine learning"
          />
          <p className="text-xs text-zinc-400 mt-1">All words must appear in the tweet</p>
        </div>
        
        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Generate Search Link
        </button>
      </form>
      
      {query && (
        <div className="mt-6">
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
            <p className="text-sm font-medium text-zinc-700 mb-2">Your search query:</p>
            <Link
              href={query}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 text-sm break-all underline"
            >
              {query}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;
