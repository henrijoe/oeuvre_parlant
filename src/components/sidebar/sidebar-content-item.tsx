/** @format */

// components/SidebarMenuItem.tsx
import React from "react";
import Link from "next/link";

interface SidebarMenuItemProps {
  item: {
    id: string;
    title: string;
    icon: React.ReactNode;
    href?: string;
    subItems?: {
      id: string;
      title: string;
      href: string;
    }[];
  };
  activeMenu: string;
  activeSubMenu: string;
  setActiveSubMenu: (subMenu: string) => void;
}

export const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ item, activeMenu, activeSubMenu, setActiveSubMenu }) => {
  const hasSubItems = !!item.subItems && item.subItems.length > 0;

  // Check if this menu item is active
  const isActive = hasSubItems
    ? item.subItems?.some((subItem) => subItem.href === activeMenu) || activeSubMenu === item.id
    : item.href === activeMenu || (item.href?.startsWith(activeMenu) && item.href !== "/");

  return (
    <li className={`${isActive ? "active" : ""}`}>
      {!!hasSubItems ? (
        <>
          <Link
            className="sidebar-dropdown"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveSubMenu(activeSubMenu === item.id ? "" : item.id);
            }}
          >
            {item.icon}
            {item.title}
          </Link>
          <div className={`sidebar-submenu ${activeSubMenu === item.id ? "block" : ""}`}>
            <ul>
              {item.subItems?.map((subItem) => (
                <li key={subItem.id} className={activeMenu === subItem.href ? "active" : ""}>
                  <Link href={subItem.href}>{subItem.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <Link href={item.href || "#"}>
          {item.icon}
          {item.title}
        </Link>
      )}
    </li>
  );
};
