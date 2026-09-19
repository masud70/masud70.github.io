import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

/* ──────────────────────────────────────────────────────────────
   Ambient background animation.

   true  → three accent-coloured gradients drift slowly behind the
           page on long, offset cycles.
   false → the same gradients render, but static.

   Visitors who have "reduce motion" enabled in their OS always get
   the static version, regardless of this setting.
   ────────────────────────────────────────────────────────────── */
const BACKGROUND_ANIMATION = true;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App backgroundAnimation={BACKGROUND_ANIMATION} />
  </React.StrictMode>
);
