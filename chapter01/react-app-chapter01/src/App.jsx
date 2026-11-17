import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import StudyRecords from "./components/StudyRecords";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/records" element={<StudyRecords />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
