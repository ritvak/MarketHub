import React from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout, Button, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { handleCollapse, handleSidebarChange } from '../redux/actions/sidebarAction';
import { logout } from '../redux/actions/authActions';

const { Header } = Layout;

const GlobalHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isCollapsed, activatedSidebarKey } = useSelector(state => state.sidebar);
  const { isAuthenticated } = useSelector(state => state.auth);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleLogout = async () => {
    const data = {
      key: 'marketplace',
    };
    await dispatch(logout());
    await dispatch(handleSidebarChange(data));
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Header
      style={{
        padding: 0,
        background: colorBgContainer,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {isAuthenticated && (
          <Button
            type="text"
            icon={isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => dispatch(handleCollapse())}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        )}
        <div style={{ marginLeft: '20px', display: 'flex', alignItems: 'center' }}>
          {activatedSidebarKey.key === 'marketplace' ? (
            <>
              <span
                style={{ marginRight: '20px', cursor: 'pointer' }}
                role="presentation"
                onClick={() => navigate('/contact-us')}
              >
                Contact Us
              </span>
              <span
                style={{ marginRight: '20px', cursor: 'pointer' }}
                role="presentation"
                onClick={() => navigate('/faq')}
              >
                FAQ
              </span>
            </>
          ) : (
            <span>{activatedSidebarKey.label}</span>
          )}
        </div>
      </div>
      {isAuthenticated ? (
        <Button
          type="primary"
          onClick={handleLogout}
          style={{
            height: '32px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: '10px',
          }}
        >
          Logout
        </Button>
      ) : (
        <Button
          type="primary"
          onClick={() => navigate('/login')}
          style={{
            height: '32px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: '10px',
          }}
        >
          Login
        </Button>
      )}
    </Header>
  );
};

export default GlobalHeader;
