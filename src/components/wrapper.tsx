"use client"
import React,{useState} from "react";
import Sidebar from "./sidebar";
import Topnav from "./topnav";

export default function Wrapper(props:any){
  

    return(
    <div className="page-wrapper">
      <Topnav />
      <main className="page-content bg-gray-50 dark:bg-slate-800">
        {props.children}
      </main>
    </div>
    )
}