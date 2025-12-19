import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExamplePage from "./pages/examplepage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ExamplePage />} />
      </Routes>
    </Router>
  );
};

export default App;
