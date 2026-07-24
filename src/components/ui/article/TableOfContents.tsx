'use client';

import { useEffect, useState } from 'react';
import { List } from 'lucide-react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  contentSelector: string; // Selector for the element containing the content (e.g. '.prose')
}

export default function TableOfContents({ contentSelector }: TableOfContentsProps) {
  const [items, setItems] = useState<TocItem[]>([]);

  useEffect(() => {
    // Small delay to ensure content is rendered
    const timeout = setTimeout(() => {
      const contentEl = document.querySelector(contentSelector);
      if (!contentEl) return;

      const headings = contentEl.querySelectorAll('h2, h3, h4');
      const newItems: TocItem[] = [];

      headings.forEach((heading, index) => {
        // Add ID if it doesn't have one so we can link to it
        if (!heading.id) {
          const text = heading.textContent || '';
          heading.id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `heading-${index}`;
        }

        newItems.push({
          id: heading.id,
          text: heading.textContent || '',
          level: parseInt(heading.tagName.substring(1))
        });
      });

      setItems(newItems);
    }, 100);

    return () => clearTimeout(timeout);
  }, [contentSelector]);

  if (items.length === 0) return null;

  return (
    <div className="bg-[#1e293b] rounded-[4px] border border-black shadow-[0_4px_0_#000] p-4 mb-8">
      <div className="flex items-center gap-2 mb-3 border-b border-gray-700 pb-2">
        <List size={16} className="text-[#facc15]" />
        <h3 className="font-bold text-white text-[14px] uppercase tracking-wider">İçindekiler</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li 
            key={item.id} 
            style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
            className="text-[13px]"
          >
            <a 
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(item.id);
                if (el) {
                  const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
              className="text-gray-300 hover:text-[#facc15] transition-colors flex items-center gap-2"
            >
              <span className="w-1 h-1 rounded-full bg-gray-500 shrink-0"></span>
              <span className="truncate">{item.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
