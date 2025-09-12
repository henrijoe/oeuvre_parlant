/** @format */

// components/SidebarFooter.tsx
import React from "react";

interface SidebarFooterProps {
  children: React.ReactNode;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ children }) => {
  return <div className="relative lg:m-8 m-6 px-8 py-10 rounded-lg bg-gradient-to-b to-transparent from-slate-800 text-center">{children}</div>;
};
