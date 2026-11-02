'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';

const MonthlyTweetForm = () => {
  const [handle, setHandle] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  // Generate years from 2006 (Twitter launch) to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2006 + 1 }, (_, i) => currentYear - i);

  // Load handle from localStorage on component mount
  useEffect(() => {
    const savedHandle = localStorage.getItem('twitter-handle');
    if (savedHandle) {
      setHandle(savedHandle);
    }
    
    // Set default month and year to current
    const now = new Date();
    setMonth(String(now.getMonth() + 1).padStart(2, '0'));
    setYear(String(now.getFullYear()));
  }, []);

  // Save handle to localStorage whenever it changes
  const handleHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHandle = e.target.value;
    setHandle(newHandle);
    localStorage.setItem('twitter-handle', newHandle);
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  // Automatically update query when handle, month, or year changes
  useEffect(() => {
    if (handle && month && year) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        const yearNum = parseInt(year);
        const monthNum = parseInt(month);
        const daysInMonth = getDaysInMonth(yearNum, monthNum);

        const sinceDate = `${year}-${month}-01`;
        const untilDate = `${year}-${month}-${String(daysInMonth).padStart(2, '0')}`;

        const newQuery = `https://x.com/search?q=from%3A${encodeURIComponent(handle)}%20since%3A${sinceDate}%20until%3A${untilDate}&src=typed_query&f=live`;
        setQuery(newQuery);
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setQuery('');
    }
  }, [handle, month, year]);

  const getMonthName = (monthValue: string) => {
    const monthObj = months.find(m => m.value === monthValue);
    return monthObj ? monthObj.label : '';
  };

  return (
    <div className="w-full">
      <p className="text-sm text-zinc-500 mb-4">
        Find all tweets from a user in a specific month
      </p>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="handle-monthly" className="block text-sm font-medium text-zinc-700 mb-1.5">
            Twitter Handle
          </label>
          <input
            type="text"
            id="handle-monthly"
            value={handle}
            onChange={handleHandleChange}
            className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="jarrensj"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="month" className="block text-sm font-medium text-zinc-700 mb-1.5">
              Month
            </label>
            <select
              id="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
            >
              <option value="">Select Month</option>
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-zinc-700 mb-1.5">
              Year
            </label>
            <select
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
            >
              <option value="">Select Year</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {isLoading && (
        <div className="mt-6">
          <div className="bg-zinc-100 p-4 rounded-lg animate-pulse">
            <div className="h-4 bg-zinc-300 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-zinc-300 rounded w-1/2"></div>
          </div>
        </div>
      )}
      
      {!isLoading && query && (
        <div className="mt-6">
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
            <p className="text-sm font-medium text-zinc-700 mb-2">
              Tweets from @{handle} in {getMonthName(month)} {year}:
            </p>
            <Link
              href={query}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
            >
              Open Twitter Search →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyTweetForm;
