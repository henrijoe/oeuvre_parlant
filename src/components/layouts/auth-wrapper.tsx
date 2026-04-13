/** @format */

import React from "react";

const AuthWrapper = ({ children }: React.PropsWithChildren) => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-indigo-600/[0.02]"></div>
      <div className="container-fluid relative">
        <div className="md:flex items-center">{children}</div>
      </div>
    </section>
  );
};

export default AuthWrapper;
