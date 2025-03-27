import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './app/App';
import './index.css';

const root = createRoot(document.getElementById('root'));

root.render(
    <Router>
        <App />
    </Router>
);
