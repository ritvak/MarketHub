
import React, { useState, useEffect } from "react";
import { Menu, Layout, Avatar } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Chart from "../Chart/chart";
import UserManagement from "../UserManagement/usermanagement";
import PostApproval from "../PostApproval/postapproval";
import ChangePassword from "../ChangePassword/changepassword";
import store from "../../redux/store";
import { logout } from "../../redux/actions/authActions";
import { useSelector } from "react-redux";

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("/admin-dashboard");
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleMenuClick = ({ key }) => {
    if (key === "/logout") {
      handleLogout();
      navigate("/login");
    } else {
      setSelectedMenuItem(key);
    }
  };

  useEffect(() => {
    setSelectedMenuItem("/admin-dashboard");
  }, []);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = async () => {
    await store.dispatch(logout());
    localStorage.removeItem("token");
    navigate("/login");
  };

  const render = () => {
    if (isAuthenticated) {
      return (
        <Layout style={{ minHeight: "100vh" ,margin:0}}>
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            breakpoint="md" 
            collapsedWidth={0} 
          >
            <div className="logo" />
            <Menu
              theme="dark"
              defaultSelectedKeys={["/"]}
              selectedKeys={[selectedMenuItem]}
              onClick={handleMenuClick}
            >
              <Menu.Item key="/admin-dashboard" icon={<DashboardOutlined />}>
                Dashboard
              </Menu.Item>
              <Menu.Item key="/userAccount" icon={<UserOutlined />}>
                User Account Management
              </Menu.Item>
              <Menu.Item key="/posts" icon={<ShoppingCartOutlined />}>
                Post Approval
              </Menu.Item>
              <Menu.Item key="/password" icon={<SearchOutlined />}>
                Change Password
              </Menu.Item>
              <Menu.Item
                key="/logout"
                icon={<LogoutOutlined />}
                danger
              >
                Logout
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Header
              className="site-layout-background"
              style={{ padding: 0, background: "grey" }}
            >
              {collapsed ? (
                <MenuUnfoldOutlined
                  className="trigger"
                  onClick={toggleCollapse}
                />
              ) : (
                <MenuFoldOutlined
                  className="trigger"
                  onClick={toggleCollapse}
                />
              )}
             

<div style={{ marginLeft: "250px", flex: 1, float: "right", display: "flex", alignItems: "center",justifyContent: "flex-end", }}>
    <Avatar style={{ backgroundColor: "#87d068", marginRight: "10px" }} icon={<UserOutlined />} />
    <span>rt664810@dal.ca</span>
  </div>


            </Header>
            <Content >
              <div
                style={{ padding: "24px",  minHeight: 360 }}
              >
                {selectedMenuItem === "/admin-dashboard" && <Chart />}
                {selectedMenuItem === "/statistics" && (
                  <div>Statistics Content</div>
                )}
                {selectedMenuItem === "/userAccount" && <UserManagement />}
                {selectedMenuItem === "/posts" && <PostApproval />}
                {selectedMenuItem === "/password" && <ChangePassword />}
                {selectedMenuItem === "/logout" && <div>Logout Content</div>}
                
              </div>
            </Content>
          </Layout>
        </Layout>
      );
    } else {
      handleLogout();
      return null;
    }
  };

  return render();
};

export default Dashboard;
