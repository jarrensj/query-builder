'use client'

import { useEffect, useState } from 'react';
import Form from './Form';
import Form2 from './Form2';
import MonthlyTweetForm from './MonthlyTweetForm';

const tools = [
  { id: 'keyword', label: 'Keywords', Tool: Form },
  { id: 'monthly', label: 'Monthly', Tool: MonthlyTweetForm },
  { id: 'between', label: 'Between users', Tool: Form2 },
];

const ACTIVE_TOOL_KEY = 'active-tool';

const savedToolIndex = `${JSON.stringify(tools.map(({ id }) => id))}.indexOf(localStorage.getItem('${ACTIVE_TOOL_KEY}'))`;

// These run as the page is parsed, so the first paint shows the saved tool instead of the prerendered
// default. The first hides the switcher so that HTML stalling partway through can't paint the default.
const hideUntilRestored = `try {
  if (${savedToolIndex} > 0) document.currentScript.parentElement.hidden = true;
} catch {}`;

// The second applies the saved tool and unhides. It only changes attributes, which is why the active
// tab's styles key off aria-current. The effect in ToolSwitcher then brings React's state in line.
const restoreActiveTool = `{
  const switcher = document.currentScript.parentElement;
  try {
    const index = ${savedToolIndex};
    if (index > 0) {
      switcher.querySelectorAll('[data-tool-tab]').forEach((tab, i) => tab.setAttribute('aria-current', i === index));
      switcher.querySelectorAll('[data-tool-panel]').forEach((panel, i) => { panel.hidden = i !== index; });
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

      <nav aria-label="Tools" className="mt-10 flex gap-7 border-b border-line">
        {tools.map(({ label }, index) => (
          <button
            key={label}
            type="button"
            data-tool-tab
            suppressHydrationWarning
            aria-current={activeTool === index}
            onClick={() => selectTool(index)}
            className="-mb-px whitespace-nowrap border-b-2 border-transparent pb-3 text-[14px] font-medium text-ink-muted hover:text-ink aria-[current=true]:border-accent aria-[current=true]:text-ink"
          >
            {label}
          </button>
        ))}
      </nav>

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
