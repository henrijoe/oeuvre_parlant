/** @format */

// components/SidebarContent.tsx
import React from "react";
import { SidebarMenuItem } from "./sidebar-content-item";

export interface IMenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  href?: string;
  subItems?: {
    id: string;
    title: string;
    href: string;
  }[];
}

interface SidebarContentProps {
  menuItems: IMenuItem[];
  activeMenu: string;
  activeSubMenu: string;
  setActiveSubMenu: (subMenu: string) => void;
}

export const SidebarContent: React.FC<SidebarContentProps> = ({ menuItems, activeMenu, activeSubMenu, setActiveSubMenu }) => {
  return (
    <ul className="sidebar-menu border-t border-white/10">
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.id} item={item} activeMenu={activeMenu} activeSubMenu={activeSubMenu} setActiveSubMenu={setActiveSubMenu} />
      ))}
    </ul>
  );
};
