'use client'

import { useEffect, useState } from 'react';
import Form from './Form';
import Form2 from './Form2';
import MonthlyTweetForm from './MonthlyTweetForm';

const tools = [
  { id: 'keyword', label: 'Keyword search', Tool: Form },
  { id: 'monthly', label: 'Monthly summary', Tool: MonthlyTweetForm },
  { id: 'between', label: 'Between two users', Tool: Form2 },
];

const ACTIVE_TOOL_KEY = 'active-tool';

const savedToolIndex = `${JSON.stringify(tools.map(({ id }) => id))}.indexOf(localStorage.getItem('${ACTIVE_TOOL_KEY}'))`;

// These run as the page is parsed, so the first paint shows the saved tool instead of the prerendered
// default. The first hides the switcher so that HTML stalling partway through can't paint the default.
const hideUntilRestored = `try {
  if (${savedToolIndex} > 0) document.currentScript.parentElement.hidden = true;
} catch {}`;

// The second applies the saved tool and unhides. It only changes attributes and the dropdown's value,
// which is why the active tab's styles key off aria-current. The effect in ToolSwitcher then brings
// React's state in line.
const restoreActiveTool = `{
  const switcher = document.currentScript.parentElement;
  try {
    const index = ${savedToolIndex};
    if (index > 0) {
      switcher.querySelectorAll('[data-tool-tab]').forEach((tab, i) => tab.setAttribute('aria-current', i === index));
      switcher.querySelectorAll('[data-tool-panel]').forEach((panel, i) => { panel.hidden = i !== index; });
      switcher.querySelector('#tool').value = index;
    }
  } catch {}
  switcher.hidden = false;
}`;

const ToolSwitcher = () => {
  const [activeTool, setActiveTool] = useState(0);

  // Reopen the tool that was used last
  useEffect(() => {
    const savedTool = localStorage.getItem(ACTIVE_TOOL_KEY);
    const savedIndex = tools.findIndex(({ id }) => id === savedTool);
    if (savedIndex !== -1) {
      setActiveTool(savedIndex);
    }
  }, []);

  const selectTool = (index: number) => {
    setActiveTool(index);
    localStorage.setItem(ACTIVE_TOOL_KEY, tools[index].id);
  };

  return (
    <div>
      <script dangerouslySetInnerHTML={{ __html: hideUntilRestored }} />

      {/* Segmented control when the column is at least 520px wide, dropdown below that. */}
      <div className="[container-type:inline-size]">
        <nav
          aria-label="Tools"
          className="hidden gap-0.5 rounded-lg border border-track-line bg-track p-[3px] [@container(min-width:520px)]:flex"
        >
          {tools.map(({ label }, index) => (
            <button
              key={label}
              type="button"
              data-tool-tab
              suppressHydrationWarning
              aria-current={activeTool === index}
              onClick={() => selectTool(index)}
              className="flex-1 whitespace-nowrap rounded-md px-3.5 py-[7px] text-[13.5px] font-medium text-ink-muted hover:text-ink aria-[current=true]:bg-white aria-[current=true]:text-ink aria-[current=true]:shadow-tab-active"
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="[@container(min-width:520px)]:hidden">
          <label
            htmlFor="tool"
            className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.04em] text-ink-muted"
          >
            Tool
          </label>
          <div className="relative">
            <select
              id="tool"
              value={activeTool}
              onChange={(e) => selectTool(Number(e.target.value))}
              className="block w-full cursor-pointer appearance-none rounded-lg border border-line-strong bg-white py-2.5 pl-3.5 pr-10 text-[15px] font-medium text-ink outline-none focus:border-accent focus:shadow-focus [@media(pointer:coarse)]:text-[16px]"
            >
              {tools.map(({ label }, index) => (
                <option key={label} value={index}>
                  {label}
                </option>
              ))}
            </select>
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
            >
              <path
                d="M4 6l4 4 4-4"
                stroke="#6b675f"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Tools stay mounted while hidden so each keeps its form state across switches. */}
      {tools.map(({ label, Tool }, index) => (
        <div key={label} data-tool-panel suppressHydrationWarning hidden={activeTool !== index}>
          <Tool />
        </div>
      ))}

      <script dangerouslySetInnerHTML={{ __html: restoreActiveTool }} />
    </div>
  );
};

export default ToolSwitcher;
