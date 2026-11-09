'use client'

import { useState, useEffect } from 'react';
import cleanHandle from '../lib/cleanHandle';
import ResultCard from './ResultCard';

// Runs as the page is parsed, so the first paint shows the current month and year instead of the
// prerendered first options (January and the build year). The effect in TimeFrameForm then brings
// React's state in line.
const showCurrentDate = `{
  const now = new Date();
  document.getElementById('month').value = String(now.getMonth() + 1).padStart(2, '0');
  document.getElementById('year').value = now.getFullYear();
}`;

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

type Mode = 'month' | 'range';

const modes: { value: Mode; label: string }[] = [
  { value: 'month', label: 'A month' },
  { value: 'range', label: 'Date range' },
];

// The first post on Twitter.
const FIRST_POST_DAY = '2006-03-21';

// Days are YYYY-MM-DD strings, like date inputs use. The arithmetic runs in UTC so time zones can't shift a day.
const toDate = (day: string) => new Date(`${day}T00:00:00Z`);

const addDays = (day: string, days: number) => {
  const date = toDate(day);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

// month is 1-based, so as a 0-based month index it already points at the next month.
const firstDayOfNextMonth = (year: string, month: string) =>
  new Date(Date.UTC(Number(year), Number(month), 1)).toISOString().slice(0, 10);

const formatDay = (day: string) =>
  toDate(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

// X's since: includes the day it names and until: leaves it out, so until gets the day after the last one to search.
const buildQuery = (user: string, since: string, until: string) =>
  `https://x.com/search?q=from%3A${encodeURIComponent(user)}%20since%3A${since}%20until%3A${until}&src=typed_query&f=live`;

const TimeFrameForm = () => {
  const [handle, setHandle] = useState('');
  const [mode, setMode] = useState<Mode>('month');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [startDay, setStartDay] = useState('');
  const [endDay, setEndDay] = useState('');
  const [query, setQuery] = useState('');

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

  const selectMode = (next: Mode) => {
    setMode(next);
    // The first switch to a range starts it on the picked month, so the dates carry over.
    if (next === 'range' && !startDay && !endDay && month && year) {
      setStartDay(`${year}-${month}-01`);
      setEndDay(addDays(firstDayOfNextMonth(year, month), -1));
    }
  };

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const day = e.target.value;
    setStartDay(day);
    // Moving the start past the end drags the end along, so the range never runs backwards from the picker.
    if (day && endDay && day > endDay) setEndDay(day);
  };

  const user = cleanHandle(handle);
  const rangeIsBackwards = mode === 'range' && !!startDay && !!endDay && endDay < startDay;

  // The days to search: since is included and until is left out. Empty until the chosen time frame is complete.
  let since = '';
  let until = '';
  if (mode === 'month' && month && year) {
    since = `${year}-${month}-01`;
    until = firstDayOfNextMonth(year, month);
  } else if (mode === 'range' && startDay && endDay && !rangeIsBackwards) {
    since = startDay;
    until = addDays(endDay, 1);
  }

  // Automatically update query when the handle or time frame changes
  useEffect(() => {
    if (user && since && until) {
      const timer = setTimeout(() => setQuery(buildQuery(user, since, until)), 300);

      return () => clearTimeout(timer);
    } else {
      setQuery('');
    }
  }, [user, since, until]);

  const getMonthName = (monthValue: string) => {
    const monthObj = months.find(m => m.value === monthValue);
    return monthObj ? monthObj.label : '';
  };

  let heading = `Posts from @${user} in ${getMonthName(month)} ${year}`;
  if (mode === 'range') {
    heading = startDay === endDay
      ? `Posts from @${user} on ${formatDay(startDay)}`
      : `Posts from @${user} between ${formatDay(startDay)} and ${formatDay(endDay)}`;
  }

  let hint = 'The link updates as you type — no button needed.';
  if (rangeIsBackwards) {
    hint = 'The end date is before the start date.';
  } else if (mode === 'range') {
    hint = 'Both dates are included. The link updates as you go — no button needed.';
  }

  return (
    <>
      <div className="form-row">
        <label htmlFor="handle-timeframe" className="form-label">
          Posted by
        </label>
        <input
          type="text"
          id="handle-timeframe"
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

      <div className="form-row">
        <span id="timeframe-mode" className="form-label">
          Time frame
        </span>
        <div role="radiogroup" aria-labelledby="timeframe-mode" className="flex flex-wrap gap-x-6 gap-y-2">
          {modes.map(({ value, label }) => (
            <label key={value} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="radio"
                name="timeframe-mode"
                value={value}
                checked={mode === value}
                onChange={() => selectMode(value)}
                className="h-4 w-4 shrink-0 accent-accent"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {mode === 'month' ? (
        <div className="form-row">
          <span className="form-label">Month</span>
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
      ) : (
        <>
          <div className="form-row">
            <label htmlFor="start-day" className="form-label">
              Start date
            </label>
            <input
              type="date"
              id="start-day"
              value={startDay}
              min={FIRST_POST_DAY}
              onChange={handleStartChange}
              className="field-input field-date"
            />
          </div>
          <div className="form-row">
            <label htmlFor="end-day" className="form-label">
              End date
            </label>
            <input
              type="date"
              id="end-day"
              value={endDay}
              min={startDay || FIRST_POST_DAY}
              onChange={(e) => setEndDay(e.target.value)}
              aria-invalid={rangeIsBackwards}
              aria-describedby="timeframe-hint"
              className="field-input field-date"
            />
          </div>
        </>
      )}

      <p id="timeframe-hint" className="form-hint pt-5">
        {hint}
      </p>

      {query && since && <ResultCard heading={heading} results={[{ href: query }]} />}
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

export default TimeFrameForm;
