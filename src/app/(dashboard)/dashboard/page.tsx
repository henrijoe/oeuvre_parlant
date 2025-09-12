/** @format */

import DefaultPageLayout from "@/components/layouts/default-page-layout";
import Link from "next/link";
import React from "react";
import { MdKeyboardArrowRight } from "react-icons/md";

const DashboardPage = () => {
  return (
    <>
      <div className="md:flex justify-between items-center">
        <h5 className="text-lg font-semibold">Starter Page</h5>
        <ul className="tracking-[0.5px] inline-flex items-center sm:mt-0 mt-3">
          <li className="inline-block capitalize text-[14px] font-bold duration-500 dark:text-white/70 hover:text-indigo-600 dark:hover:text-white">
            <Link href="/">Techwind</Link>
          </li>
          <li className="inline-block text-base text-slate-950 dark:text-white/70 mx-0.5 ltr:rotate-0 rtl:rotate-180">
            <MdKeyboardArrowRight />
          </li>
          <li className="inline-block capitalize text-[14px] font-bold text-indigo-600 dark:text-white" aria-current="page">
            Starter Page
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-1 mt-6">
        <div className="rounded-md shadow-sm dark:shadow-gray-700 p-6 bg-white dark:bg-slate-900">
          <p className="text-slate-400">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero, aliquid soluta. Voluptas neque adipisci fuga magnam nulla exercitationem corrupti ducimus itaque soluta earum! Fugiat,
            animi id sit ad magnam facilis.
          </p>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
