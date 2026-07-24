'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-1 sm:space-x-2 text-[11px] sm:text-[13px] font-bold text-gray-400 mb-4 overflow-x-auto whitespace-nowrap pb-1 scrollbar-hide">
      <Link href="/" className="hover:text-white transition-colors flex items-center gap-1 shrink-0">
        <Home size={14} className="mb-[2px]" />
        <span>Ana Sayfa</span>
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1 sm:space-x-2 shrink-0">
          <ChevronRight size={14} className="text-gray-600" />
          {item.href ? (
            <Link href={item.href} className="hover:text-white transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-200">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
