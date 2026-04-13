/** @format */

import Link from "next/link";
import React from "react";
import { Menu } from "react-feather";

interface ISideBarCloserProps {
  toggleHandler: () => void;
}
const SidebarCloser: React.FC<ISideBarCloserProps> = ({ toggleHandler }) => {
  return (
    <Link
      id="close-sidebar"
      className="size-8 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-[20px] text-center bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-100 dark:border-gray-800 text-slate-900 dark:text-white rounded-full"
      href="#"
    >
      <Menu className="size-4" onClick={toggleHandler} />
    </Link>
  );
};

export default SidebarCloser;
