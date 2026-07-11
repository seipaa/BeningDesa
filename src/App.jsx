import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Badge, Space, Typography, message } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import LandingPage from './components/LandingPage';
import SmartStation from './components/SmartStation';
import EdgeDashboard from './components/EdgeDashboard';
import GovernmentDashboard from './components/GovernmentDashboard';
import MemberDashboard from './components/MemberDashboard';
import Documentation from './components/Documentation';

const { Header, Content, Sider, Footer } = Layout;
const { Text, Title } = Typography;

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [isOffline, setIsOffline] = useState(false);
  const [systemState, setSystemState] = useState({ mode_offline: 'OFF', last_sync_at: '-' });
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Fetch system state
  const fetchSystemState = async () => {
    try {
      const res = await fetch('/api/system/state');
      if (res.ok) {
        const data = await res.json();
        const mode = data.state?.mode_offline || 'OFF';
        setIsOffline(mode === 'ON');
        setSystemState(data.state || { mode_offline: 'OFF', last_sync_at: '-' });
      }
    } catch (err) {
      console.error('Gagal memuat status sistem:', err);
    }
  };

  useEffect(() => {
    fetchSystemState();
    // Poll system state every 15 seconds
    const interval = setInterval(fetchSystemState, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleMode = async (newMode) => {
    setLoading(true);
    try {
      const res = await fetch('/api/system/mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: newMode }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsOffline(data.mode_offline === 'ON');
        setSystemState((prev) => ({ ...prev, mode_offline: data.mode_offline }));
        message.success(`Mode sistem diubah ke ${data.mode_offline === 'ON' ? 'OFFLINE' : 'ONLINE'}`);
        fetchSystemState();
      } else {
        message.error('Gagal mengubah mode sistem');
      }
    } catch (err) {
      message.error('Gagal menghubungi server: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'landing':
        return (
          <LandingPage
            onNavigate={setCurrentView}
            isOffline={isOffline}
            systemState={systemState}
          />
        );
      case 'station':
        return <SmartStation isOffline={isOffline} systemState={systemState} />;
      case 'edge':
        return (
          <EdgeDashboard
            isOffline={isOffline}
            systemState={systemState}
            onToggleMode={handleToggleMode}
            onRefreshState={fetchSystemState}
            loadingMode={loading}
          />
        );
      case 'government':
        return <GovernmentDashboard />;
      case 'member':
        return <MemberDashboard />;
      case 'documentation':
        return <Documentation />;
      default:
        return <LandingPage onNavigate={setCurrentView} isOffline={isOffline} />;
    }
  };

  // Menu items for navigation (Icons removed)
  const menuItems = [
    {
      key: 'landing',
      label: 'BERANDA',
    },
    {
      key: 'station',
      label: 'SMART STATION',
    },
    {
      key: 'edge',
      label: 'EDGE SERVER',
    },
    {
      key: 'government',
      label: 'DASBOR PEMERINTAH',
    },
    {
      key: 'member',
      label: 'DASBOR ANGGOTA',
    },
    {
      key: 'documentation',
      label: 'DOKUMENTASI',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        onBreakpoint={(broken) => {
          setCollapsed(broken);
          setIsMobile(broken);
        }}
        trigger={null}
        style={{
          background: 'linear-gradient(180deg, #022c22 0%, #064e3b 40%, #065f46 100%)',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 100, // Make sure it sits above the backdrop (99)
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Logo Area */}
        <div
          style={{
            height: 72,
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            gap: 12,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(16, 185, 129, 0.3)',
              flexShrink: 0,
            }}
          >
            <span style={{ color: '#022c22', fontWeight: 900, fontSize: 15, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>BD</span>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 15, letterSpacing: '0.5px', lineHeight: 1.2 }}>
              BENINGDESA
            </div>
            <div style={{ color: 'rgba(167,243,208,0.7)', fontSize: 9, fontWeight: 600, letterSpacing: '1.5px' }}>
              SMART COOPERATIVE
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[currentView]}
          onClick={({ key }) => {
            setCurrentView(key);
            setCollapsed(true); // Close sider when menu item is clicked on mobile
          }}
          items={menuItems}
          style={{
            background: 'transparent',
            paddingTop: 12,
            fontWeight: 600,
            letterSpacing: '0.3px',
            fontSize: 12,
            border: 'none',
          }}
          className="sidebar-menu"
        />

        {/* Bottom Version Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px 20px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 8,
              padding: '8px 12px',
              textAlign: 'center',
            }}
          >
            <div style={{ color: 'rgba(167,243,208,0.8)', fontSize: 10, fontWeight: 700, letterSpacing: '1px' }}>
              v2.0.0
            </div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, fontWeight: 500, marginTop: 2 }}>
              Kemenkop RI 2026
            </div>
          </div>
        </div>
      </Sider>

      {isMobile && !collapsed && (
        <div
          onClick={() => setCollapsed(true)}
          className="sider-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            zIndex: 99,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      <Layout>
        {/* Top Header Bar */}
        <Header
          className="glass-header"
          style={{
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
            position: 'sticky',
            top: 0,
            zIndex: 9,
            height: 64,
          }}
        >
          {/* Hamburger toggle button */}
          <Button
            type="text"
            icon={<MenuOutlined style={{ fontSize: 18, color: '#0f172a' }} />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              background: 'transparent',
              padding: 0
            }}
          />
          {/* Centered Title */}
          <div style={{ 
            position: 'absolute', 
            left: '50%', 
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap'
          }}>
            <Title level={4} style={{ margin: 0, color: '#0f172a', fontWeight: 800, fontSize: 15, pointerEvents: 'auto', letterSpacing: '0.5px' }}>
              {menuItems.find((item) => item.key === currentView)?.label}
            </Title>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isOffline ? (
              <div
                onClick={() => setCurrentView('edge')}
                style={{
                  cursor: 'pointer',
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: '#f59e0b',
                  animation: 'breathe 2s infinite',
                  boxShadow: '0 0 8px rgba(245,158,11,0.6)',
                }}
                title="Offline - Klik untuk konfigurasi"
              />
            ) : (
              <div
                onClick={() => setCurrentView('edge')}
                style={{
                  cursor: 'pointer',
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: '#10b981',
                  animation: 'breathe 2s infinite',
                  boxShadow: '0 0 8px rgba(16,185,129,0.6)',
                }}
                title="Online - Klik untuk konfigurasi"
              />
            )}
          </div>
        </Header>

        {/* Main Content */}
        <Content style={{ margin: '20px 16px 0', overflow: 'initial' }}>
          <div style={{ minHeight: 'calc(100vh - 142px)' }}>{renderContent()}</div>
        </Content>

        {/* Footer */}
        <Footer
          style={{
            textAlign: 'center',
            background: 'transparent',
            color: '#94a3b8',
            fontSize: 11,
            fontWeight: 500,
            padding: '16px 24px',
            borderTop: '1px solid #f1f5f9',
          }}
        >
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#cbd5e1', marginRight: 6 }}>◆</span>
          Koperasi Desa Merah Putih ©2026 — Transparansi Keuangan Desa Terdistribusi
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#cbd5e1', marginLeft: 6 }}>◆</span>
        </Footer>
      </Layout>
    </Layout>
  );
}
