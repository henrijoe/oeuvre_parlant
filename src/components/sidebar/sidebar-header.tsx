/** @format */

// components/SidebarHeader.tsx
import React from "react";
import Link from "next/link";
import Image, { ImageProps } from "next/image";
import { twMerge } from "tailwind-merge";

interface SidebarHeaderProps {
  logo: ImageProps;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ logo }) => {
  return (
    <div className="sidebar-brand">
      <Link href="/">
        <Image
          src={logo.src}
          // placeholder="blur"
          blurDataURL={logo.src as string}
          width={logo.width}
          height={logo.height}
          alt={logo.alt}
          className={twMerge("object-center object-cover", logo.className)}
        />
      </Link>
    </div>
  );
};
