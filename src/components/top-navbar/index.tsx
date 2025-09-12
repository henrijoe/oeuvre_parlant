/** @format */
"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import * as Icon from "react-feather";
import { LuSearch } from "react-icons/lu";
import SidebarCloser from "./sidebar-closer";
import ConnectedUser from "./connected-user";
import SimpleBarReact from "simplebar-react";

interface ITopNavbarProps {
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
  toggle: boolean;
}

const TopNavbar: React.FC<ITopNavbarProps> = ({ setToggle, toggle }) => {
  let [user, setUser] = React.useState<boolean>(false);
  let [country, setCountry] = React.useState<boolean>(false);
  let [cart, setCart] = React.useState<boolean>(false);
  let [notification, setNotification] = React.useState<boolean>(false);

  const toggleHandler = () => {
    setToggle(!toggle);
  };
  const toggleUserHandler = () => setUser(!user);
  return (
    <div className="top-header">
      <div className="header-bar flex justify-between">
        <div className="flex items-center space-x-1">
          <Link href="#" className="xl:hidden block me-2">
            <Image src="/images/logo-icon-32.png" width={32} height={32} className="md:hidden block" alt="" />
            <span className="md:block hidden">
              <Image src="/images/logo-dark.png" width={138} height={24} placeholder="blur" blurDataURL="/images/logo-dark.png" className="inline-block dark:hidden" alt="" />
              <Image src="/images/logo-light.png" width={138} height={24} placeholder="blur" blurDataURL="/images/logo-light.png" className="hidden dark:inline-block" alt="" />
            </span>
          </Link>

          <SidebarCloser toggleHandler={toggleHandler} />

          {/* Search input */}
          <div className="ps-1.5">
            <div className="form-icon relative sm:block hidden">
              <LuSearch className="absolute top-1/2 -translate-y-1/2 start-3" />
              <input
                type="text"
                className="form-input w-56 ps-9 py-2 px-3 h-8 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-3xl outline-none border border-gray-100 dark:border-gray-800 focus:ring-0 "
                name="s"
                id="searchItem"
                placeholder="Search..."
              />
            </div>
          </div>
        </div>

        <ul className="list-none mb-0 space-x-1">
          {/* Select country */}
          <li className="dropdown inline-block relative">
            <button
              onClick={() => setCountry(!country)}
              className="dropdown-toggle size-8 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-[20px] text-center bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-100 dark:border-gray-800 text-slate-900 dark:text-white rounded-full"
              type="button"
            >
              <Image src="/images/flags/usa.png" width={30} height={30} alt="" />
            </button>
            <div className={`dropdown-menu absolute start-0 m-0 mt-4 z-10 w-36 rounded-md overflow-hidden bg-white dark:bg-slate-900 shadow-sm dark:shadow-gray-700 ${country ? "" : "hidden"}`}>
              <ul className="list-none py-2 text-start">
                <li className="my-1">
                  <Link href="" className="flex items-center text-[15px] font-semibold py-1.5 px-4 dark:text-white/70 hover:text-indigo-600 dark:hover:text-white">
                    <Image src="/images/flags/germany.png" width={24} height={24} className="size-6 rounded-full me-2 shadow-sm dark:shadow-gray-700" alt="" /> German
                  </Link>
                </li>
                <li className="my-1">
                  <Link href="" className="flex items-center text-[15px] font-semibold py-1.5 px-4 dark:text-white/70 hover:text-indigo-600 dark:hover:text-white">
                    <Image src="/images/flags/italy.png" width={24} height={24} className="size-6 rounded-full me-2 shadow-sm dark:shadow-gray-700" alt="" /> Italian
                  </Link>
                </li>
                <li className="my-1">
                  <Link href="" className="flex items-center text-[15px] font-semibold py-1.5 px-4 dark:text-white/70 hover:text-indigo-600 dark:hover:text-white">
                    <Image src="/images/flags/russia.png" width={24} height={24} className="size-6 rounded-full me-2 shadow-sm dark:shadow-gray-700" alt="" /> Russian
                  </Link>
                </li>
                <li className="my-1">
                  <Link href="" className="flex items-center text-[15px] font-semibold py-1.5 px-4 dark:text-white/70 hover:text-indigo-600 dark:hover:text-white">
                    <Image src="/images/flags/spain.png" width={24} height={24} className="size-6 rounded-full me-2 shadow-sm dark:shadow-gray-700" alt="" /> Spanish
                  </Link>
                </li>
              </ul>
            </div>
          </li>

          {/* Cart */}
          <li className="dropdown inline-block relative">
            <button
              onClick={() => setCart(!cart)}
              className="dropdown-toggle size-8 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-[20px] text-center bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-100 dark:border-gray-800 text-slate-900 dark:text-white rounded-full"
              type="button"
            >
              <Icon.ShoppingCart className="size-4" />
              <span className="absolute top-0 end-0 flex items-center justify-center bg-emerald-600 text-white text-[10px] font-bold rounded-full size-2 after:content-[''] after:absolute after:size-2 after:bg-emerald-600 after:top-0 after:end-0 after:rounded-full after:animate-ping"></span>
            </button>

            <div className={`dropdown-menu absolute end-0 m-0 mt-4 z-10 w-60 rounded-md bg-white dark:bg-slate-900 shadow-sm dark:shadow-gray-700  ${cart ? "" : "hidden"}`}>
              <ul className="py-3 text-start">
                <li>
                  <Link href="#" className="flex items-center justify-between py-1.5 px-4">
                    <span className="flex items-center">
                      <Image src="/images/shop/items/s1.jpg" width={36} height={45} className="rounded shadow-sm dark:shadow-gray-700 w-9" alt="" />
                      <span className="ms-3">
                        <span className="block font-semibold">T-shirt (M)</span>
                        <span className="block text-sm text-slate-400">$320 X 2</span>
                      </span>
                    </span>

                    <span className="font-semibold">$640</span>
                  </Link>
                </li>

                <li>
                  <Link href="#" className="flex items-center justify-between py-1.5 px-4">
                    <span className="flex items-center">
                      <Image src="/images/shop/items/s2.jpg" width={36} height={45} className="rounded shadow-sm dark:shadow-gray-700 w-9" alt="" />
                      <span className="ms-3">
                        <span className="block font-semibold">Bag</span>
                        <span className="block text-sm text-slate-400">$50 X 5</span>
                      </span>
                    </span>

                    <span className="font-semibold">$250</span>
                  </Link>
                </li>

                <li>
                  <Link href="#" className="flex items-center justify-between py-1.5 px-4">
                    <span className="flex items-center">
                      <Image src="/images/shop/items/s3.jpg" width={36} height={45} className="rounded shadow-sm dark:shadow-gray-700 w-9" alt="" />
                      <span className="ms-3">
                        <span className="block font-semibold">Watch (Men)</span>
                        <span className="block text-sm text-slate-400">$800 X 1</span>
                      </span>
                    </span>

                    <span className="font-semibold">$800</span>
                  </Link>
                </li>

                <li className="border-t border-gray-100 dark:border-gray-800 my-2"></li>

                <li className="flex items-center justify-between py-1.5 px-4">
                  <h6 className="font-semibold mb-0">Total($):</h6>
                  <h6 className="font-semibold mb-0">$1690</h6>
                </li>

                <li className="py-1.5 px-4 space-x-1">
                  <Link
                    href="#"
                    className="py-[5px] px-4 inline-block font-semibold tracking-wide align-middle duration-500 text-sm text-center rounded-md bg-indigo-600 hover:bg-indigo-700 border border-indigo-600 hover:border-indigo-700 text-white"
                  >
                    View Cart
                  </Link>
                  <Link
                    href="#"
                    className="py-[5px] px-4 inline-block font-semibold tracking-wide align-middle duration-500 text-sm text-center rounded-md bg-indigo-600 hover:bg-indigo-700 border border-indigo-600 hover:border-indigo-700 text-white"
                  >
                    Checkout
                  </Link>
                  <p className="text-sm text-slate-400 mt-1">*T&C Apply</p>
                </li>
              </ul>
            </div>
          </li>

          {/* Notification */}
          <li className="dropdown inline-block relative">
            <button
              onClick={() => setNotification(!notification)}
              className="dropdown-toggle size-8 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-[20px] text-center bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-100 dark:border-gray-800 text-slate-900 dark:text-white rounded-full"
              type="button"
            >
              <Icon.Bell className="size-4" />
              <span className="absolute top-0 end-0 flex items-center justify-center bg-red-600 text-white text-[10px] font-bold rounded-full size-2 after:content-[''] after:absolute after:size-2 after:bg-red-600 after:top-0 after:end-0 after:rounded-full after:animate-ping"></span>
            </button>

            <div className={`dropdown-menu absolute end-0 m-0 mt-4 z-10 w-64 rounded-md overflow-hidden bg-white dark:bg-slate-900 shadow-sm dark:shadow-gray-700 ${notification ? "" : "hidden"}`}>
              <span className="px-4 py-4 flex justify-between">
                <span className="font-semibold">Notifications</span>
                <span className="flex items-center justify-center bg-red-600/20 text-red-600 text-[10px] font-bold rounded-full w-5 max-h-5 ms-1">3</span>
              </span>
              <SimpleBarReact className="h-64">
                <ul className="py-2 text-start h-64 border-t border-gray-100 dark:border-gray-800">
                  <li>
                    <Link href="#!" className="block font-medium py-1.5 px-4">
                      <div className="flex items-center">
                        <div className="size-10 rounded-md shadow-sm shadow-indigo-600/10 dark:shadow-gray-700 bg-indigo-600/10 dark:bg-slate-800 text-indigo-600 dark:text-white flex items-center justify-center">
                          <Icon.ShoppingCart className="size-4" />
                        </div>
                        <div className="ms-2">
                          <span className="text-[15px] font-semibold block">Order Complete</span>
                          <small className="text-slate-400">15 min ago</small>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="#!" className="block font-medium py-1.5 px-4">
                      <div className="flex items-center">
                        <Image src="/images/client/01.jpg" width={30} height={30} className="size-10 rounded-md shadow-sm dark:shadow-gray-700" alt="" />
                        <div className="ms-2">
                          <span className="text-[15px] font-semibold block">
                            <span className="font-bold">Message</span> from Luis
                          </span>
                          <small className="text-slate-400">1 hour ago</small>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="#!" className="block font-medium py-1.5 px-4">
                      <div className="flex items-center">
                        <div className="size-10 rounded-md shadow-sm shadow-indigo-600/10 dark:shadow-gray-700 bg-indigo-600/10 dark:bg-slate-800 text-indigo-600 dark:text-white flex items-center justify-center">
                          <Icon.DollarSign className="size-4" />
                        </div>
                        <div className="ms-2">
                          <span className="text-[15px] font-semibold block">
                            <span className="font-bold">One Refund Request</span>
                          </span>
                          <small className="text-slate-400">2 hour ago</small>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="#!" className="block font-medium py-1.5 px-4">
                      <div className="flex items-center">
                        <div className="size-10 rounded-md shadow-sm shadow-indigo-600/10 dark:shadow-gray-700 bg-indigo-600/10 dark:bg-slate-800 text-indigo-600 dark:text-white flex items-center justify-center">
                          <Icon.Truck className="size-4" />
                        </div>
                        <div className="ms-2">
                          <span className="text-[15px] font-semibold block">Deliverd your Order</span>
                          <small className="text-slate-400">Yesterday</small>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="#!" className="block font-medium py-1.5 px-4">
                      <div className="flex items-center">
                        <Image src="/images/client/02.jpg" width={30} height={30} className="size-10 rounded-md shadow-sm dark:shadow-gray-700" alt="" />
                        <div className="ms-2">
                          <span className="text-[15px] font-semibold block">
                            <span className="font-bold">Cally</span> started following you
                          </span>
                          <small className="text-slate-400">2 days ago</small>
                        </div>
                      </div>
                    </Link>
                  </li>
                </ul>
              </SimpleBarReact>
            </div>
          </li>

          {/* Connnected user */}
          <li className="dropdown inline-block relative">
            <ConnectedUser toggleUserHandler={toggleUserHandler} user={user} />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TopNavbar;
