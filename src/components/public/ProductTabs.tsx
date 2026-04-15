"use client";

import { useState } from "react";

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface ProductTabsProps {
  tabs: Tab[];
  children: React.ReactNode[];
}

export default function ProductTabs({ tabs, children }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "");

  const activeIndex = tabs.findIndex((t) => t.id === activeTab);

  return (
    <div className="mt-10">
      {/* Tab headers */}
      <div className="border-b border-gray-200">
        <div className="flex gap-0 -mb-px overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-coral text-coral"
                  : "border-transparent text-darkgray-light hover:text-darkgray hover:border-gray-300"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-1.5 text-xs bg-gray-100 text-darkgray-light px-1.5 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="py-6">
        {children[activeIndex] || null}
      </div>
    </div>
  );
}
