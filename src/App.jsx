import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Badge, Space, Typography, message } from 'antd';
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
        style={{
          background: '#047857',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 10,
        }}
      >
        <div style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 24px', background: '#065f46' }}>
          <Title level={4} style={{ color: '#fff', margin: 0, fontWeight: 800, letterSpacing: '1px' }}>
            BENINGDESA
          </Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[currentView]}
          onClick={({ key }) => setCurrentView(key)}
          items={menuItems}
          style={{
            background: '#047857',
            paddingTop: 16,
            fontWeight: 600,
            letterSpacing: '0.5px',
          }}
          className="sidebar-menu"
        />
        <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, textAlign: 'center' }}>
          <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11px', fontWeight: 500 }}>
            v2.0.0 — Kemenkop RI
          </Text>
        </div>
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            position: 'sticky',
            top: 0,
            zIndex: 9,
            height: 64,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Title level={4} style={{ margin: 0, color: '#1e293b', fontWeight: 700 }}>
              {menuItems.find((item) => item.key === currentView)?.label}
            </Title>
          </div>
          <Space size="large">
            {isOffline ? (
              <Badge status="warning">
                <Button
                  type="primary"
                  danger
                  size="small"
                  onClick={() => setCurrentView('edge')}
                  style={{
                    borderRadius: 4,
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                  }}
                >
                  MODE OFFLINE
                </Button>
              </Badge>
            ) : (
              <Badge status="success">
                <Button
                  type="primary"
                  size="small"
                  onClick={() => setCurrentView('edge')}
                  style={{
                    borderRadius: 4,
                    backgroundColor: '#059669',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                  }}
                >
                  MODE ONLINE
                </Button>
              </Badge>
            )}
          </Space>
        </Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div style={{ minHeight: 'calc(100vh - 142px)' }}>{renderContent()}</div>
        </Content>
        <Footer style={{ textAlign: 'center', background: '#f1f5f9', color: '#64748b', fontSize: 12, fontWeight: 500 }}>
          Koperasi Desa Merah Putih ©2026 — Transparansi Keuangan Desa Terdistribusi (Hash-Chain Ledger)
        </Footer>
      </Layout>
    </Layout>
  );
}
