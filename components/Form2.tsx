'use client'

import { useState } from 'react';
import Link from 'next/link';

const Form2 = () => {
  const [user1, setUser1] = useState('');
  const [user2, setUser2] = useState('');
  const [query, setQuery] = useState('');
  const [bothDirections, setBothDirections] = useState(false);

  const buildQuery = () => {
    if (user1 && user2) {
      const query1 = `https://x.com/search?q=(from%3A${encodeURIComponent(user1)})%20(to%3A${encodeURIComponent(user2)})&src=typed_query`;
      if (bothDirections) {
        const query2 = `https://x.com/search?q=(from%3A${encodeURIComponent(user2)})%20(to%3A${encodeURIComponent(user1)})&src=typed_query`;
        return `${query1} OR ${query2}`;
      }
      return query1;
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
        Find tweets where one user mentions or replies to another
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="user1" className="block text-sm font-medium text-zinc-700 mb-1.5">
            From User
          </label>
          <input
            type="text"
            id="user1"
            value={user1}
            onChange={(e) => setUser1(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="jarrensj"
          />
        </div>
        
        <div>
          <label htmlFor="user2" className="block text-sm font-medium text-zinc-700 mb-1.5">
            To User
          </label>
          <input
            type="text"
            id="user2"
            value={user2}
            onChange={(e) => setUser2(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="omakasemoney"
          />
        </div>
        
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            id="bothDirections"
            checked={bothDirections}
            onChange={(e) => setBothDirections(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-zinc-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-zinc-600">Search both directions</span>
        </label>
        
        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Generate Search Link
        </button>
      </form>
      
      {query && (
        <div className="mt-6">
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg space-y-2">
            {bothDirections ? (
              <>
                <Link
                  href={`https://x.com/search?q=(from%3A${encodeURIComponent(user1)})%20(to%3A${encodeURIComponent(user2)})&src=typed_query`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                >
                  🔗 {user1} → {user2}
                </Link>
                <Link
                  href={`https://x.com/search?q=(from%3A${encodeURIComponent(user2)})%20(to%3A${encodeURIComponent(user1)})&src=typed_query`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                >
                  🔗 {user2} → {user1}
                </Link>
              </>
            ) : (
              <Link
                href={query}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm break-all underline"
              >
                {query}
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Form2;
