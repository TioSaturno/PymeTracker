"use client";

import React from "react";

interface PageHeaderProps {
  pageTitle: React.ReactNode;
  pageDescription?: string;
  children?: React.ReactNode;
}

export default function PageHeader({
  pageTitle,
  pageDescription,
  children,
}: PageHeaderProps) {
  return (
    <div className="border-b border-[#e4e2e2] bg-white/60 backdrop-blur-xl px-8 py-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#817470] m-0">
            PYMETRACKER
          </p>
          <h1
            className="text-3xl font-semibold text-[#1b1c1c] leading-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {pageTitle}
          </h1>
          {pageDescription && (
            <p className="text-sm mt-2 text-[#4f4441]">{pageDescription}</p>
          )}
        </div>
        {children && <div className="flex-shrink-0 ml-4">{children}</div>}
      </div>
    </div>
  );
}
