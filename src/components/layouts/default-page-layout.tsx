/** @format */

import React, { PropsWithChildren } from "react";

const DefaultPageLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="container-fluid relative px-3">
      <div className="layout-specing">{children}</div>
    </div>
  );
};

export default DefaultPageLayout;
