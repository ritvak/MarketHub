import { DollarOutlined, WechatOutlined, ProfileOutlined, UserOutlined, ContactsOutlined, QuestionCircleOutlined, LogoutOutlined } from '@ant-design/icons';

const initialState = {
  isCollapsed: false,
  activatedSidebarKey: {
    key: window.location.pathname,
  },
  sidebarData: [
    {
      key: '/my-profile',
      label: ' My Profile',
      icon: <UserOutlined />,
      url: '/my-profile',
    },
    {
      key: '/my-products',
      label: 'My Products',
      icon: <ProfileOutlined />,
      url: '/my-products',
    },
    {
      key: '/chats',
      label: 'Chats',
      icon: <WechatOutlined />,
      url: '/chats',
    },
    {
      key: '/transactions',
      label: 'Transactions',
      icon: <DollarOutlined />,
      url: '/transactions',
    },
    {
      key: '/contact-us',
      label: 'Contact Us',
      icon: <ContactsOutlined />,
      url: '/contact-us',
    },
    {
      key: '/faq',
      label: 'FAQ',
      icon: <QuestionCircleOutlined />,
      url: '/faq',
    },
    {
       key: '/logout',
       label: 'Logout',
       icon: <LogoutOutlined />,
       url: '/login',
    },
  ],
};

const SidebarReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'COLLAPSE':
      return {
        ...state,
        isCollapsed: !state.isCollapsed,
      };
    case 'CHANGE_SIDEBAR':
      return {
        ...state,
        activatedSidebarKey: payload,
      };
    default:
      return state;
  }
};

export default SidebarReducer;
