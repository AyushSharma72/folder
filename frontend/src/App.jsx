import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./Login";
import Dashboard from "./DashBoard";
import Home from "./Home";

const App = () => {
  return (
   
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard/:id" element={<Dashboard />} />
      </Routes>
    
  );
};

export default App;
