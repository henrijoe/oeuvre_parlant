/** @format */

"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { AiOutlineLineChart } from "react-icons/ai";
import { PiBrowsersBold } from "react-icons/pi";
import { Sidebar } from "../sidebar";
import Topnav from "../topnav";
import TopNavbar from "../top-navbar";
import { IMenuItem } from "../sidebar/sidebar-content";

const SideBarWrapper = (props: React.PropsWithChildren) => {
  let [toggle, setToggle] = useState(true);
  const [activeMenu, setActiveMenu] = React.useState("");
  const [activeSubMenu, setActiveSubMenu] = React.useState("");

  const pathname = usePathname();
  // Liste des menus
  const menuItems: IMenuItem[] = [
    // {
    //   id: "dashboard",
    //   title: "Dashboard",
    //   icon: <AiOutlineLineChart className="me-3 icon" />,
    //   subItems: [
    //     { id: "analytics", title: "Analytics", href: "/" },
    //     { id: "crypto", title: "Cryptocurrency", href: "/index-crypto" },
    //     { id: "ecommerce", title: "eCommerce", href: "/index-ecommerce" },
    //   ],
    // },
    {
      id: "starter",
      title: "Starter page",
      icon: <AiOutlineLineChart className="me-3 icon" />,
      href: "/dashboard",
      subItems: [],
    },
  ];

  React.useEffect(() => {
    setActiveMenu(pathname);
    setActiveSubMenu(pathname);
    window.scrollTo(0, 0);
  }, [setActiveSubMenu, setActiveMenu, pathname]);

  return (
    <section className={`page-wrapper  ${toggle ? "toggled" : ""}`}>
      <Sidebar
        logo={{
          src: "/images/logo-dark.png",
          width: 138,
          height: 24,
          alt: "",
        }}
        menuItems={menuItems}
        activeMenu={activeMenu}
        activeSubMenu={activeSubMenu}
        setActiveSubMenu={setActiveSubMenu}
      />
      <main className="page-content bg-gray-50 dark:bg-slate-800">
        <TopNavbar toggle={toggle} setToggle={setToggle} />
        {props.children}
      </main>
    </section>
  );
};

export default SideBarWrapper;
