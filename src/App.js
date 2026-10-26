// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Используем Routes вместо Switch
import Home from './pages/MainPage';

const App = () => {
  return (
    <div>
      <Routes> {/* Заменили Switch на Routes */}
        <Route path="/" element={<Home />} />
        </Routes>
    </div>
  );
};

export default App;
