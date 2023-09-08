import React, { Suspense, lazy } from 'react';
import { Route, useNavigate, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Layout } from 'antd';
import Loader from './shared/loader';

const Chat = lazy(() => import('./components/Chat/chat'));
const ChatList = lazy(() => import('./components/Chat/chatList'));
const Sidebar = lazy(() => import('./shared/sidebar'));
const Login = lazy(() => import('./components/Login/login'));
const Product = lazy(() => import('./components/Product/product'));
const ProductDetails = lazy(() => import('./components/Product/productDetails'));
const ContactUs = lazy(() => import('./components/ContactUs/contactUs'));
const Faq = lazy(() => import('./components/FAQ/FAQ'));
const Comment = lazy(() => import('./components/Comment/comment'));
const Transactions = lazy(() => import('./components/Transactions/transaction'));
const Register = lazy(() => import('./components/Register/register'));
const ForgotPassword = lazy(() => import('./components/ForgotPassword/forgotPassword'));
const ChangePassword = lazy(() => import('./components/changePassword/changePassword'));
const MyProducts = lazy(() => import('./components/MyProducts/myProducts'));
const MyProductDetails = lazy(() => import('./components/MyProducts/myProductDetails'));
const AddProduct = lazy(() => import('./components/MyProducts/addProduct'));
const MyProfile = lazy(() => import('./components/MyProfile/myProfile'));
const EditProfile = lazy(() => import('./components/MyProfile/editProfile'));
const ChangeUserPassword = lazy(() => import('./components/changePassword/changeUserPassword'));
const EditProduct = lazy(() => import('./components/MyProducts/editProduct'));
const { Content } = Layout;

const Routing = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const PublicRoutes = [
    {
      path: '/',
      component: <Login />,
    },
    {
      path: '/login',
      component: <Login />,
    },
    {
      path: '/register',
      component: <Register />,
    },
    {
      path: '/forgot-password',
      component: <ForgotPassword />,
    },
    {
      path: '/change-password/:id/:token',
      component: <ChangePassword />,
    },
  ].filter(cur => cur);

  const PrivateRoutes = [
    {
      path: '/products',
      component: <Product />,
    },
    {
      path: '/products/:id',
      component: <ProductDetails />,
    },
    {
      path: '/comment/:id',
      component: <Comment />,
    },
    {
      path: '/chats',
      component: <ChatList />,
    },
    {
      path: '/chats/:id',
      component: <Chat />,
    },
    {
      path: '/transactions',
      component: <Transactions />,
    },
    {
      path: '/my-products',
      component: <MyProducts />,
    },
    {
      path: '/my-products/:id',
      component: <MyProductDetails />,
    },
    {
      path: '/my-products/add-product',
      component: <AddProduct />,
    },
    {
      path: '/my-profile',
      component: <MyProfile />,
    },
    {
      path: '/my-profile/edit-profile',
      component: <EditProfile />,
    },
    {
      path: '/my-profile/edit-profile/change-password/:id',
      component: <ChangeUserPassword />,
    },
    {
      path: '/edit-product/:id',
      component: <EditProduct />,
    },

  ].filter(cur => cur);

  const PrivateRoute = ({ children }) => {
    if (!isAuthenticated) navigate('/login', { replace: true });
    return isAuthenticated ? children : <Login />;
  };

  const PublicRoute = ({ children }) => {
    if (isAuthenticated) navigate('/products', { replace: true });
    return isAuthenticated ? <Product /> : children;
  };

  return (
    <Suspense className="loader" fallback={<Loader />}>
      <Layout style={{ minHeight: '100vh', display: 'flex' }}>
        {isAuthenticated && <Sidebar style={{ backgroundColor: '#f0f0f0' }} />}
        <Routes>
          <Route exact={true} key={'/contact-us'} path={'/contact-us'} element={<ContactUs />} />
          <Route exact={true} key={'/faq'} path={'/faq'} element={<Faq />} />
          {PublicRoutes.map(route => (
            <Route
              exact={route.exact}
              key={route.path}
              path={route.path}
              element={<PublicRoute>{route.component}</PublicRoute>}
            />
          ))}
          {PrivateRoutes.map(route => (
            <Route
              exact={route.exact}
              key={route.path}
              path={route.path}
              element={<PrivateRoute>{route.component}</PrivateRoute>}
            />
          ))}
        </Routes>
      </Layout>
    </Suspense>
  );
};

export default Routing;
