'use client'

import { useState } from 'react';
import Form from './Form';
import Form2 from './Form2';
import MonthlyTweetForm from './MonthlyTweetForm';

type TabId = 'monthly' | 'keyword' | 'conversation';

interface Tab {
  id: TabId;
  label: string;
  icon: string;
}

const tabs: Tab[] = [
  { id: 'monthly', label: 'Monthly Archive', icon: '📅' },
  { id: 'keyword', label: 'Keyword Search', icon: '🔍' },
  { id: 'conversation', label: 'Conversations', icon: '💬' },
];

const TabbedForms = () => {
  const [activeTab, setActiveTab] = useState<TabId>('monthly');

  return (
    <div className="w-full max-w-lg mt-8">
      {/* Tab Navigation */}
      <div className="flex border-b-2 border-zinc-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 py-3 px-4 text-sm font-medium transition-all duration-200
              ${activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-600 -mb-[2px] bg-blue-50/50'
                : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50'
              }
            `}
          >
            <span className="mr-1.5">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6 bg-white border border-t-0 border-zinc-200 rounded-b-lg shadow-sm">
        <div className={activeTab === 'monthly' ? 'block' : 'hidden'}>
          <MonthlyTweetForm />
        </div>
        <div className={activeTab === 'keyword' ? 'block' : 'hidden'}>
          <Form />
        </div>
        <div className={activeTab === 'conversation' ? 'block' : 'hidden'}>
          <Form2 />
        </div>
      </div>
    </div>
  );
};

export default TabbedForms;
