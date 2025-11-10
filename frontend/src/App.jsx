import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'


function App() {


  return (
    <>
      <BrowserRouter>
        <main className="p-4">
          <Routes>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/transaction" element={<Transactions/>}/>
          </Routes>
        </main>
      </BrowserRouter>
    </>
  )
}

export default App
