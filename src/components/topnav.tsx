"use client"
import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef } from "react";

import * as Icon from "react-feather";
import { LuSearch } from "react-icons/lu";

import SimpleBarReact from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { useCart } from "react-use-cart"; // ← Importez useCart
import CartModal from "./cartModal";
import { useAuth } from "@/contexts/AuthContext";

export default function Topnav() {
  let [country, setCountry] = useState<boolean>(false);
  let [cart, setCart] = useState<boolean>(false);
  let [notification, setNotification] = useState<boolean>(false);
  // let [user, setUser] = useState<boolean>(false);
  let [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);
  let [adminDropdownOpen, setAdminDropdownOpen] = useState<boolean>(false);

  const cartModalRef = useRef<HTMLDivElement>(null);
  const { totalItems } = useCart();

  const { user, logout, hasPermission, loading } = useAuth();

 React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Fermer les dropdowns seulement si on clique en dehors
      if (country && !event.composedPath().includes(document.querySelector('.country-dropdown')!)) {
        setCountry(false);
      }
      if (notification && !event.composedPath().includes(document.querySelector('.notification-dropdown')!)) {
        setNotification(false);
      }
      if (userDropdownOpen && !event.composedPath().includes(document.querySelector('.user-dropdown')!)) {
        setUserDropdownOpen(false);
      }
      if (adminDropdownOpen && !event.composedPath().includes(document.querySelector('.admin-dropdown')!)) {
        setAdminDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [country, notification, userDropdownOpen, adminDropdownOpen]);


    const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
  };

return (
    <>
      <div className="top-header fixed top-0 left-0 right-0 z-50">
        <div className="header-bar flex justify-between items-center p-6 bg-white dark:bg-slate-900 h-[70px] shadow-sm dark:shadow-gray-700 bg-[#EA580C]">
          <div className="flex items-center space-x-1">
            <Link href="/" className="block me-2">
              <span className="md:block hidden">
                <p className="text-transparent bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text italic font-semibold">
                  Arts parlants
                </p>
              </span>
            </Link>

            <div className="ps-1.5">
              <div className="form-icon relative sm:block hidden">
                <LuSearch className="absolute top-1/2 -translate-y-1/2 start-3" />
                <input
                  type="text"
                  className="form-input w-56 ps-9 py-2 px-3 h-8 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-3xl outline-none border border-gray-100 dark:border-gray-800 focus:ring-0"
                  name="s"
                  id="searchItem"
                  placeholder="Search..."
                />
              </div>
            </div>
          </div>

          <ul className="list-none mb-0 space-x-1 flex items-center">
            {/* Icône Admin - Visible seulement pour ADMIN et SUPER_ADMIN */}
            {(hasPermission('ADMIN') || hasPermission('SUPER_ADMIN')) && (
              <li className="dropdown inline-block relative admin-dropdown">
                <button
                  onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                  className="dropdown-toggle size-8 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-[20px] text-center bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-100 dark:border-gray-800 text-slate-900 dark:text-white rounded-full"
                  type="button"
                >
                  <Icon.Settings className="size-4" />
                </button>

                <div className={`dropdown-menu absolute end-0 m-0 mt-4 z-10 w-48 rounded-md overflow-hidden bg-white dark:bg-slate-900 shadow-sm dark:shadow-gray-700 ${adminDropdownOpen ? "" : "hidden"}`}>
                  <div className="py-2">
                    <Link 
                      href="/admin/products" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800"
                      onClick={() => setAdminDropdownOpen(false)}
                    >
                      <Icon.Grid className="size-4 me-2" />
                      Gérer les œuvres
                    </Link>
                    <Link 
                      href="/admin/users" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800"
                      onClick={() => setAdminDropdownOpen(false)}
                    >
                      <Icon.Users className="size-4 me-2" />
                      Gérer les utilisateurs
                    </Link>
                    {hasPermission('SUPER_ADMIN') && (
                      <Link 
                        href="/admin/settings" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800"
                        onClick={() => setAdminDropdownOpen(false)}
                      >
                        <Icon.Sliders className="size-4 me-2" />
                        Paramètres
                      </Link>
                    )}
                  </div>
                </div>
              </li>
            )}
            {/* Panier */}
            <li className="inline-block relative">
              <button
                onClick={() => setCart(!cart)}
                className="size-8 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-[20px] text-center bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-100 dark:border-gray-800 text-slate-900 dark:text-white rounded-full"
                type="button"
              >
                <Icon.ShoppingCart className="size-4" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center bg-red-600 text-white text-[10px] font-bold rounded-full size-4">
                    {totalItems}
                  </span>
                )}
              </button>
            </li>

            {/* Drapeau Pays */}
            <li className="dropdown inline-block relative">
              <button
                onClick={() => setCountry(!country)}
                className="dropdown-toggle size-8 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-[20px] text-center bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-100 dark:border-gray-800 text-slate-900 dark:text-white rounded-full"
                type="button"
              >
                <Image src="/images/flags/civ.png" width={30} height={30} alt="Côte d'Ivoire" />
              </button>
            </li>

            {/* Notifications */}
            <li className="dropdown inline-block relative notification-dropdown">
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
                  </ul>
                </SimpleBarReact>
              </div>
            </li>

            {/* Icône de Connexion/Profil Utilisateur */}
            <li className="dropdown inline-block relative user-dropdown">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="dropdown-toggle size-8 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-[20px] text-center bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-100 dark:border-gray-800 text-slate-900 dark:text-white rounded-full"
                type="button"
              >
                {user ? (
                  <div className="size-6 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <Icon.User className="size-4" />
                )}
              </button>

              <div className={`dropdown-menu absolute end-0 m-0 mt-4 z-10 w-48 rounded-md overflow-hidden bg-white dark:bg-slate-900 shadow-sm dark:shadow-gray-700 ${userDropdownOpen ? "" : "hidden"}`}>
                {user ? (
                  <>
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center">
                        <div className="size-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ms-3">
                          <span className="block text-sm font-semibold truncate max-w-[120px]">{user.name}</span>
                          <span className="block text-xs text-gray-500 capitalize">
                            {user.role.toLowerCase().replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <Link 
                        href="/profile" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <Icon.User className="size-4 me-2" />
                        Mon profil
                      </Link>
                      <Link 
                        href="/orders" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <Icon.ShoppingBag className="size-4 me-2" />
                        Mes commandes
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-slate-800"
                      >
                        <Icon.LogOut className="size-4 me-2" />
                        Déconnexion
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-4">
                    <Link 
                      href="/Auth/login" 
                      className="block w-full text-center bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      Se connecter
                    </Link>
                    <div className="mt-2 text-center">
                      <Link 
                        href="/Auth/register" 
                        className="text-xs text-orange-600 hover:text-orange-700"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        Créer un compte
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Modal du panier */}
      <CartModal
        isOpen={cart}
        onClose={() => setCart(false)}
      />
    </>
  );
}