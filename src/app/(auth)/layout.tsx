/** @format */

import AuthWrapper from "@/components/layouts/auth-wrapper";
import React from "react";

const AuthLayout = ({ children }: React.PropsWithChildren) => {
  return <AuthWrapper>{children}</AuthWrapper>;
};

export default AuthLayout;
