import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ConfigProvider } from 'antd';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#059669', // Emerald Green (Valid/Masuk)
          colorInfo: '#8b5cf6',     // Violet (Hash-Chain Accent)
          colorError: '#dc2626',    // Red (Keluar/Peringatan)
          colorWarning: '#f59e0b',  // Amber
          colorSuccess: '#10b981',  // Emerald Green
          fontFamily: "'Inter', sans-serif",
          borderRadius: 8,
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
