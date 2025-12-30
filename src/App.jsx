import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExamplePage from "./pages/examplepage";
import Loginpage from "./pages/Loginpage";
import DashboardPage from "./pages/DashboardPage";
import LayoutPage from "./pages/LayoutPage";
import UsersPage from "./pages/UsersPage";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Login Page (without sidebar) */}
        <Route path="/" element={<Loginpage />} />
        
        {/* Pages with Sidebar Layout */}
        <Route element={<LayoutPage />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage/>} />
          <Route path="/example" element={<ExamplePage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
