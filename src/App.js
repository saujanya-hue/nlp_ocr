import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OCRPage from "./OCRPage"; 
import LoginPage from "./LoginPage"; 
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/ocr" element={<OCRPage />} />
      </Routes>
    </Router>
  );
}
export default App;
