import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import {
  LayoutDashboard,
  Users,
  FileText,
  MapPin,
  MessageSquare,
  Settings,
  Menu,
  X,
  ChevronLeft,
  LogOut,
  Shield,
} from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Articles', path: '/admin/articles', icon: FileText },
    { name: 'Places', path: '/admin/places', icon: MapPin },
    { name: 'Chats', path: '/admin/chats', icon: MessageSquare },
    { name: 'Homepage Manager', path: '/admin/homepage', icon: Settings },
  ];

  const SidebarContent = () => (
    <>
      {/* Logo / Brand */}
      <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid rgba(139, 92, 246, 0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Shield size={22} color="white" />
          </div>
          <div>
            <h2 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '18px', color: '#f59e0b', margin: 0 }}>
              Admin Portal
            </h2>
            <p style={{ fontSize: '11px', color: '#7c7a9e', margin: 0 }}>Lion Lanka</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.exact}
              onClick={() => setSidebarOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '14px',
                transition: 'all 0.3s',
                background: isActive ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                color: isActive ? '#f59e0b' : '#7c7a9e',
                border: isActive ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid transparent',
                boxShadow: isActive ? '0 0 15px rgba(245, 158, 11, 0.1)' : 'none',
              })}
            >
              <Icon size={20} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(139, 92, 246, 0.15)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Link
          to="/"
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 16px', borderRadius: '12px', textDecoration: 'none',
            color: '#7c7a9e', fontSize: '14px', fontWeight: 500,
          }}
        >
          <ChevronLeft size={20} />
          Back to Site
        </Link>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 16px', borderRadius: '12px', border: 'none',
            background: 'transparent', color: '#f87171', fontSize: '14px',
            fontWeight: 500, cursor: 'pointer', width: '100%', textAlign: 'left',
          }}
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#060414' }}>

      {/* =================== DESKTOP SIDEBAR =================== */}
      {!isMobile && (
        <aside
          style={{
            width: '260px',
            minWidth: '260px',
            height: '100vh',
            background: 'linear-gradient(180deg, #0d0b1f 0%, #13112b 50%, #0d0b1f 100%)',
            borderRight: '1px solid rgba(139, 92, 246, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          <SidebarContent />
        </aside>
      )}

      {/* =================== MOBILE HEADER =================== */}
      {isMobile && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
            padding: '12px 16px',
            background: 'rgba(13, 11, 31, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={20} color="#f59e0b" />
            <h2 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '16px', color: '#f59e0b', margin: 0 }}>
              Admin Portal
            </h2>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '8px' }}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      )}

      {/* =================== MOBILE SIDEBAR OVERLAY =================== */}
      {isMobile && sidebarOpen && (
        <>
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
              zIndex: 55,
            }}
          />
          <aside
            style={{
              position: 'fixed', top: 0, left: 0, bottom: 0,
              width: '260px', zIndex: 60,
              background: 'linear-gradient(180deg, #0d0b1f 0%, #13112b 50%, #0d0b1f 100%)',
              borderRight: '1px solid rgba(139, 92, 246, 0.2)',
              display: 'flex', flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            <SidebarContent />
          </aside>
        </>
      )}

      {/* =================== MAIN CONTENT =================== */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: isMobile ? '70px 16px 16px' : '32px',
          background: '#060414',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
