// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App'; // Главный компонент приложения
import { BrowserRouter as Router } from 'react-router-dom'; // Для маршрутизации

// Рендерим приложение в элемент с id 'root'
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

// Оборачиваем приложение в Router для использования маршрутизации
root.render(
    <React.StrictMode>
        <Router>
            <App />
        </Router>
    </React.StrictMode>
);
