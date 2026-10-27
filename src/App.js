// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Используем Routes вместо Switch
import { Analytics } from '@vercel/analytics/react';
import Home from './pages/MainPage';

const App = () => {
  return (
    <div>
      <Routes> {/* Заменили Switch на Routes */}
        <Route path="/" element={<Home />} />
        </Routes>
      <Analytics />
    </div>
  );
};

export default App;
