'use client'

import { useState, useEffect } from 'react';
import ResultCard from './ResultCard';

// Runs as the page is parsed, so the first paint shows the current month and year instead of the
// prerendered "Select Month" and "Select Year". The effect in MonthlyTweetForm then brings React's
// state in line.
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

  // Automatically update query when handle, month, or year changes
  useEffect(() => {
    if (handle && month && year) {
      const timer = setTimeout(() => {
        const yearNum = parseInt(year);
        const monthNum = parseInt(month);
        const daysInMonth = getDaysInMonth(yearNum, monthNum);

        const sinceDate = `${year}-${month}-01`;
        const untilDate = `${year}-${month}-${String(daysInMonth).padStart(2, '0')}`;

        const newQuery = `https://x.com/search?q=from%3A${encodeURIComponent(handle)}%20since%3A${sinceDate}%20until%3A${untilDate}&src=typed_query&f=live`;
        setQuery(newQuery);
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
    <>
      <section className="card">
        <h2 className="card-title">
          Monthly Tweet Summary
        </h2>
        <div className="card-body">
          <div>
            <label htmlFor="handle-monthly" className="field-label">
              Twitter Handle:
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
              placeholder="jarrensj"
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <div className="field-row">
            <div>
              <label htmlFor="month" className="field-label">
                Month:
              </label>
              <select
                id="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="field-input"
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
              <label htmlFor="year" className="field-label">
                Year:
              </label>
              <select
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="field-input"
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

          <script dangerouslySetInnerHTML={{ __html: showCurrentDate }} />
        </div>
      </section>

      {query && (
        <ResultCard
          heading={`Search for tweets from @${handle} in ${getMonthName(month)} ${year}:`}
          results={[{ label: 'Open Twitter Search →', href: query }]}
        />
      )}
    </>
  );
};

export default MonthlyTweetForm;
