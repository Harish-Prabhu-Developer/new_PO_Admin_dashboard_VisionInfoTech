// src/Layout/layout.jsx
import React from "react";

const Layout = ({ header, footer, children }) => {
  return (
    <div className="flex bg-gray-200 p-4 md:p-6 flex-col min-w-full min-h-screen">
      {/* Header */}
      <div>{header}</div>

      {/* Main Content */}
      <div className="grow">{children}</div>

      {/* Footer */}
      <div>{footer}</div>
    </div>
  );
};

export default Layout;
