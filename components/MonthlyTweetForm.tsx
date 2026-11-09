'use client'

import { useState, useEffect } from 'react';
import cleanHandle from '../lib/cleanHandle';
import ResultCard from './ResultCard';

// Runs as the page is parsed, so the first paint shows the current month and year instead of the
// prerendered first options (January and the build year). The effect in MonthlyTweetForm then brings
// React's state in line.
const showCurrentDate = `{
  const now = new Date();
  document.getElementById('month').value = String(now.getMonth() + 1).padStart(2, '0');
  document.getElementById('year').value = now.getFullYear();
}`;

const MonthlyTweetForm = () => {
  const [handle, setHandle] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [query, setQuery] = useState('');

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
  // TODO: the prerendered list stops at the build year, so from New Year until the next deploy hydration
  // fails on the missing option and React falls back to client rendering. Render it from a fixed list instead.
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2006 + 1 }, (_, i) => currentYear - i);

  // Load handle from localStorage on component mount
  // TODO: the saved handle (here and in Form) only appears after hydration, so returning visitors
  // see those fields fill in, and the result below appears about 300ms later. Show them on first paint too.
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

  const user = cleanHandle(handle);

  // Automatically update query when handle, month, or year changes
  useEffect(() => {
    if (user && month && year) {
      const timer = setTimeout(() => {
        const yearNum = parseInt(year);
        const monthNum = parseInt(month);
        const daysInMonth = getDaysInMonth(yearNum, monthNum);

        const sinceDate = `${year}-${month}-01`;
        const untilDate = `${year}-${month}-${String(daysInMonth).padStart(2, '0')}`;

        const newQuery = `https://x.com/search?q=from%3A${encodeURIComponent(user)}%20since%3A${sinceDate}%20until%3A${untilDate}&src=typed_query&f=live`;
        setQuery(newQuery);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setQuery('');
    }
  }, [user, month, year]);

  const getMonthName = (monthValue: string) => {
    const monthObj = months.find(m => m.value === monthValue);
    return monthObj ? monthObj.label : '';
  };

  return (
    <>
      <div className="form-row">
        <label htmlFor="handle-monthly" className="form-label">
          Posted by
        </label>
        <input
          type="text"
          id="handle-monthly"
          value={handle}
          onChange={handleHandleChange}
          onKeyDown={(e) => {
            // This tool has no submit step, so Return just closes the on-screen keyboard.
            if (e.key === 'Enter') e.currentTarget.blur();
          }}
          enterKeyHint="done"
          className="field-input"
          placeholder="handle"
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      <div className="form-row">
        <span className="form-label">During</span>
        <div className="flex flex-wrap gap-2.5">
          <div className="relative flex-[1_1_140px]">
            <select
              id="month"
              aria-label="Month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="field-input field-select"
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <SelectCaret />
          </div>

          <div className="relative flex-[1_1_110px]">
            <select
              id="year"
              aria-label="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="field-input field-select"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <SelectCaret />
          </div>

          <script dangerouslySetInnerHTML={{ __html: showCurrentDate }} />
        </div>
      </div>

      <p className="form-hint pt-5">The link updates as you type — no button needed.</p>

      {query && (
        <ResultCard
          heading={`Posts from @${user} in ${getMonthName(month)} ${year}`}
          results={[{ href: query }]}
        />
      )}
    </>
  );
};

const SelectCaret = () => (
  <span
    aria-hidden="true"
    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-ink-muted"
  >
    ▼
  </span>
);

export default MonthlyTweetForm;
