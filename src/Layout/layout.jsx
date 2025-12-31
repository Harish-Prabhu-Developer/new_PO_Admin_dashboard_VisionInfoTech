// src/Layout/layout.jsx
import React from "react";

const Layout = ({ header, footer, children }) => {
  return (
    <div className="flex bg-gray-50 p-2 flex-col min-w-full min-h-screen">
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
