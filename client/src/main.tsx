import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '@mdi/font/css/materialdesignicons.min.css'
import 'prismjs/themes/prism.css'
import 'dropzone/dist/dropzone.css'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React from 'react'
import Home from './Home.tsx';
import Signup from './pages/Signup.tsx'
import Login from './pages/Login.tsx'
import Logout from './pages/Logout.tsx'
import Mypage from './pages/Mypage.tsx';
import Withdrawal from './pages/Withdrawal.tsx';
import BoardDetail from './pages/BoardDetail.tsx'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/board/:boardId" element={<BoardDetail/>} />
        <Route path="/app" element={<App />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/withdrawal" element={<Withdrawal />} />

        {/* 다른 경로도 필요에 따라 추가 가능 */}        
        {/* 필요하면 다른 경로도 추가 가능 */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
