import React, { useState } from "react";
import { Layout, Menu, theme, Avatar, Dropdown } from "antd";
import type { MenuProps } from "antd";
import {
  DashboardOutlined,
  TrophyOutlined,
  //   TeamOutlined,
  WarningOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  BankOutlined,
  HistoryOutlined,
  MessageOutlined,
  //   AppstoreOutlined,
  CameraOutlined,
  //   CheckCircleOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const { Header, Content, Sider } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuProps["items"] = [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/contests",
      icon: <TrophyOutlined />,
      label: "Quản lý Cuộc thi",
    },
    {
      key: "/rooms",
      icon: <BankOutlined />,
      label: "Quản lý Phòng thi",
    },
    // {
    //   key: "/attempts",
    //   icon: <TeamOutlined />,
    //   label: "Giám sát Thí sinh",
    // },
    // {
    //   key: "/approvals",
    //   icon: <CheckCircleOutlined />,
    //   label: "Duyệt Thí sinh",
    // },
    {
      key: "/violations",
      icon: <WarningOutlined />,
      label: "Vi phạm",
    },
    // {
    //   key: "/processes",
    //   icon: <AppstoreOutlined />,
    //   label: "Giám sát Tiến trình",
    // },
    {
      key: "/screenshots",
      icon: <CameraOutlined />,
      label: "Ảnh chụp Màn hình",
    },
    {
      key: "/messages",
      icon: <MessageOutlined />,
      label: "Tin nhắn",
    },
    {
      key: "/logs",
      icon: <HistoryOutlined />,
      label: "Lịch sử Hoạt động",
    },
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: "Cài đặt",
    },
  ];

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Thông tin cá nhân",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      danger: true,
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div
          style={{
            height: 64,
            margin: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: collapsed ? 16 : 20,
            fontWeight: "bold",
          }}
        >
          {collapsed ? "CM" : "Ratake Pool"}
        </div>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          mode="inline"
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 500 }}>
            Hệ thống Giám sát Thi Trực tuyến
          </div>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Avatar icon={<UserOutlined />} />
              <span>Admin</span>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ margin: "24px 16px 0" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
