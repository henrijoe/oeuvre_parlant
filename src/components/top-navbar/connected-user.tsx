/** @format */

import Image from "next/image";
import React from "react";
import { Link } from "react-feather";
import { AiOutlineSetting, AiOutlineUser } from "react-icons/ai";
import { BiLockAlt } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { MdMailOutline } from "react-icons/md";

interface IConnectedUserProps {
  toggleUserHandler: () => void;
  user: boolean;
}

const ConnectedUser: React.FC<IConnectedUserProps> = ({ toggleUserHandler, user }) => {
  return (
    <>
      <button onClick={toggleUserHandler} className="dropdown-toggle items-center" type="button">
        <span className="size-8 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-[20px] text-center bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-100 dark:border-gray-800 text-slate-900 dark:text-white rounded-full">
          <Image src="/images/client/05.jpg" width={30} height={30} className="rounded-full" alt="" />
        </span>
        <span className="font-semibold text-[16px] ms-1 sm:inline-block hidden">Cristina Murfy</span>
      </button>
      <div className={`dropdown-menu absolute end-0 m-0 mt-4 z-10 w-44 rounded-md overflow-hidden bg-white dark:bg-slate-900 shadow-sm dark:shadow-gray-700 ${user ? "" : "hidden"}`}>
        <ul className="py-2 text-start">
          <li>
            <Link href="/profile" className="flex items-center font-medium py-1 px-4 dark:text-white/70 hover:text-indigo-600 dark:hover:text-white">
              <AiOutlineUser className="me-2" />
              Profile
            </Link>
          </li>
          <li>
            <Link href="/chat" className="flex items-center font-medium py-1 px-4 dark:text-white/70 hover:text-indigo-600 dark:hover:text-white">
              <FaRegComment className="me-2" />
              Chat
            </Link>
          </li>
          <li>
            <Link href="/email" className="flex items-center font-medium py-1 px-4 dark:text-white/70 hover:text-indigo-600 dark:hover:text-white">
              <MdMailOutline className="me-2" />
              Email
            </Link>
          </li>
          <li>
            <Link href="/profile-setting" className="flex items-center font-medium py-1 px-4 dark:text-white/70 hover:text-indigo-600 dark:hover:text-white">
              <AiOutlineSetting className="me-2" />
              Settings
            </Link>
          </li>
          <li className="border-t border-gray-100 dark:border-gray-800 my-2"></li>
          <li>
            <Link href="/lock-screen" className="flex items-center font-medium py-1 px-4 dark:text-white/70 hover:text-indigo-600 dark:hover:text-white">
              <BiLockAlt className="me-2" />
              Lockscreen
            </Link>
          </li>
          <li>
            <Link href="/login" className="flex items-center font-medium py-1 px-4 dark:text-white/70 hover:text-indigo-600 dark:hover:text-white">
              <IoMdLogOut className="me-2" />
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ConnectedUser;
