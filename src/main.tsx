import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// ============================================
// DEBUG ENV VAR (hapus setelah bug fixed)
// ============================================
console.log('===== [KKN DEBUG] =====');
console.log('VITE_SUPABASE_URL =', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY ada?', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log('Mode:', import.meta.env.MODE);
console.log('========================');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);