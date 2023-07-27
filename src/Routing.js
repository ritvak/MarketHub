import React, { Suspense, lazy } from 'react';

import { Route, Routes } from 'react-router-dom';

import { Layout } from 'antd';
import Loader from './shared/loader';

const Login = lazy(() => import('./components/Login/login'));

const Dashboard = lazy(() => import('./components/Dashboard/dashboard'));

const { Content } = Layout;

const Routing = () => {
 
  const PublicRoutes = [
    {
      export: true,
      path: '/',
      component: <Login />,
    },
    {
      export: true,
      path: '/login',
      component: <Login />,
    },
  ].filter(cur => cur);

  

  return (
    <Suspense fallback={<Loader />}>
      <Layout style={{ minHeight: '100vh', display: 'flex' }}>
        <Layout style={{ flex: 1, overflow: 'hidden' }}>
          <Content style={{  overflow: 'auto' }}>
            <Routes>
              {PublicRoutes.map(route => (
                <Route
                  exact={route.exact}
                  key={route.path}
                  path={route.path}
                  element={route.component}
                />
              ))}
              <Route
                path="/dashboard"
                element={<Dashboard />}
              />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Suspense>
  );
};

export default Routing;
