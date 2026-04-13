/** @format */

// components/Sidebar.tsx
import React from "react";
import SimpleBarReact from "simplebar-react";
import { IMenuItem, SidebarContent } from "./sidebar-content";
import { SidebarFooter } from "./sidebar-footer";
import { SidebarHeader } from "./sidebar-header";
import { twMerge } from "tailwind-merge";

interface SidebarProps {
  logo: {
    src: string;
    width: number;
    height: number;
    alt: string;
  };
  menuItems: IMenuItem[];
  activeMenu: string;
  activeSubMenu: string;
  setActiveSubMenu: (subMenu: string) => void;
  footerContent?: React.ReactNode;
  variant?: "colored" | "dark";
}

export const Sidebar: React.FC<SidebarProps> = ({ logo, menuItems, activeMenu, activeSubMenu, setActiveSubMenu, footerContent, variant }) => {
  return (
    <nav className={twMerge("sidebar-wrapper", variant ? `sidebar-${variant}` : "")}>
      <div className="sidebar-content">
        <SidebarHeader logo={logo} />

        <SimpleBarReact style={{ height: "calc(100% - 70px)" }}>
          <SidebarContent menuItems={menuItems} activeMenu={activeMenu} activeSubMenu={activeSubMenu} setActiveSubMenu={setActiveSubMenu} />

          {footerContent && <SidebarFooter>{footerContent}</SidebarFooter>}
        </SimpleBarReact>
      </div>
    </nav>
  );
};
