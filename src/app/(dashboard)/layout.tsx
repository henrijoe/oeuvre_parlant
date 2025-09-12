/** @format */

import DefaultPageLayout from "@/components/layouts/default-page-layout";
import SideBarWrapper from "@/components/layouts/sidebar-wrapper";
import React from "react";

const DashboardLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <SideBarWrapper>
      <DefaultPageLayout>{children}</DefaultPageLayout>
    </SideBarWrapper>
  );
};

export default DashboardLayout;
