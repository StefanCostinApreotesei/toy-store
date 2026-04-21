"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className={`bg-white rounded-xl border overflow-hidden transition-all duration-300 ${
              isOpen ? "border-coral/30 shadow-sm" : "border-gray-100"
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-lightgray/50 transition-colors duration-200"
            >
              <span className={`text-sm font-medium pr-4 transition-colors duration-200 ${isOpen ? "text-coral" : "text-darkgray"}`}>
                {item.question}
              </span>
              <svg
                className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ease-out ${
                  isOpen ? "rotate-180 text-coral" : "text-darkgray-light"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="accordion-content" data-open={isOpen}>
              <div>
                <div className="px-5 pb-4">
                  <p className="text-sm text-darkgray-light leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
