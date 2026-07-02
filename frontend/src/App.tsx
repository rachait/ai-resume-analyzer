import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Dashboard */}
        <Route path="/dashboard/:sessionId" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}