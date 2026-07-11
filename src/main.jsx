import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ConfigProvider } from 'antd';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#059669',
          colorInfo: '#8b5cf6',
          colorError: '#dc2626',
          colorWarning: '#f59e0b',
          colorSuccess: '#10b981',
          fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif",
          borderRadius: 10,
          colorBgContainer: '#ffffff',
          colorBgLayout: '#f5f6f8',
          colorBorder: '#e2e8f0',
          colorBorderSecondary: '#f1f5f9',
          fontSize: 14,
          controlHeight: 40,
          controlHeightLG: 48,
          controlHeightSM: 32,
        },
        components: {
          Card: {
            borderRadiusLG: 14,
            paddingLG: 20,
          },
          Button: {
            borderRadius: 8,
            controlHeight: 38,
            controlHeightLG: 46,
            fontWeight: 600,
          },
          Table: {
            borderRadius: 10,
            headerBg: '#f8fafc',
            headerColor: '#64748b',
          },
          Input: {
            borderRadius: 8,
            controlHeight: 40,
          },
          Select: {
            borderRadius: 8,
            controlHeight: 40,
          },
          Modal: {
            borderRadiusLG: 16,
          },
          Tag: {
            borderRadiusSM: 6,
          },
          Tabs: {
            inkBarColor: '#059669',
            itemSelectedColor: '#047857',
            itemHoverColor: '#10b981',
          },
          Alert: {
            borderRadiusLG: 10,
          },
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
