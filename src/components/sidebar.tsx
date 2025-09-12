import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation'

import SimpleBarReact from "simplebar-react";
import 'simplebar-react/dist/simplebar.min.css';

import { AiOutlineAppstore, AiOutlineCamera, AiOutlineFile, AiOutlineLineChart, AiOutlineShoppingCart, AiOutlineUser } from "react-icons/ai";
import {PiBrowsersBold} from "react-icons/pi"
import { TbBrandBlogger } from "react-icons/tb";
import { MdOutlineEmail } from "react-icons/md";
import {LiaFileInvoiceDollarSolid} from "react-icons/lia"
import { BiLayer, BiLogOutCircle } from "react-icons/bi";


export default function Sidebar(){
    let [manu , setManu] = useState('');
    let [subManu , setSubManu] = useState('');
    let pathname = usePathname()

    useEffect(()=>{
        setManu(pathname)
        setSubManu(pathname)
        window.scrollTo(0, 0);
    },[setManu, setSubManu])
    
    return(
        <nav className="sidebar-wrapper sidebar-dark">
            <div className=" sidebar-content">

                <div className="sidebar-brand">
                    <Link href="/">
                    <p> Arts Parlants</p>
                    <Image src='/images/logo-light.png' placeholder="blur" blurDataURL="/images/logo-light.png" width={138} height="24" alt=""/>
                    </Link>
                </div>

            <SimpleBarReact style={{height:"calc(100% - 70px)"}}> 
                <ul className="sidebar-menu border-t border-white/10">


                    <li className={`sidebar-dropdown ${["/shop","/shop-item-detail", "/shop-cart", "/checkout"].includes(manu)? "active" : ""}`}>
                        <Link href="#" onClick={(e)=>{setSubManu(subManu === "/shop-item" ? "" : "/shop-item")}}><AiOutlineShoppingCart className="me-3 icon"/>E-Commerce</Link>
                        <div className={`sidebar-submenu ${["/shop","/shop-item-detail", "/shop-cart", "/checkout","/shop-item"].includes(subManu)? "block" : ""}`}>
                            <ul>
                                <li className={manu === "/shop" ? "active" : ""}><Link href="/shop">Shop</Link></li>
                                <li className={manu === "/shop-item-detail" ? "active" : ""}><Link href="/shop-item-detail">Shop Detail</Link></li>
                                <li className={manu === "/shop-cart" ? "active" : ""}><Link href="/shop-cart">Shopcart</Link></li>
                                {/* <li className={manu === "/checkout" ? "active" : ""}><Link href="/checkout">Checkout</Link></li> */}
                            </ul>
                        </div>
                    </li>
                </ul>
            </SimpleBarReact>
            </div>
        </nav>
        
    )
}