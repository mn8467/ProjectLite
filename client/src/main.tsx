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

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/app" element={<App />} />
        {/* 필요하면 다른 경로도 추가 가능 */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
