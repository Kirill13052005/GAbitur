// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Используем Routes вместо Switch
import Home from './pages/MainPage';
import AdminPanel from './pages/adminpanel';

const App = () => {
  return (
    <div>
      <Routes> {/* Заменили Switch на Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPanel />} />
        </Routes>
    </div>
  );
};

export default App;
