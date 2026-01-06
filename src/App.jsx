import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExamplePage from "./pages/examplepage";
import Loginpage from "./pages/Loginpage";
import DashboardPage from "./pages/DashboardPage";
import LayoutPage from "./pages/LayoutPage";
import UsersPage from "./pages/UsersPage";
import PurchaseOrderPage from "./pages/PurchaseOrderPage";
import TestPage from "./pages/TestPage";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Login Page (without sidebar) */}
        <Route path="/" element={<Loginpage />} />
        <Route path="/test" element={<TestPage />} />
        {/* Pages with Sidebar Layout */}
        <Route element={<LayoutPage />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/purchase_orders" element={<PurchaseOrderPage />} />
          <Route path="/users" element={<UsersPage/>} />
          <Route path="/example" element={<ExamplePage />} />
          
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
