import "./App.css";
import { useEffect, lazy } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Auth/Login'
import Register from './Auth/Register'

function App() {

  useEffect(() => {
    const root = document.querySelector(".App");
    root.style.backgroundColor =` #1d1c1c`
    }, [])

  return (
    <div className="App">
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />}/>
      <Route path="/*" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;