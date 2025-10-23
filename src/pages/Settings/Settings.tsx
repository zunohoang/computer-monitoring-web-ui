import React from "react";
import { Tabs, Card, Table, Button, Space, Tag, Switch, Input } from "antd";
import type { TabsProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  mockProcessBlacklist,
  mockAlerts,
  mockUsers,
} from "../../data/mockData";
import type { ProcessBlacklist, Alert, User } from "../../types";

const Settings: React.FC = () => {
  const processColumns: ColumnsType<ProcessBlacklist> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Tên tiến trình",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: () => (
        <Space>
          <Button type="link" icon={<EditOutlined />} size="small">
            Sửa
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} size="small">
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const alertColumns: ColumnsType<Alert> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      render: (code: string) => (
        <Tag color={code === "critical" ? "red" : "orange"}>{code}</Tag>
      ),
    },
    {
      title: "Tên cảnh báo",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Mức độ",
      dataIndex: "severity",
      key: "severity",
      render: (severity: string) => {
        const color =
          severity === "high"
            ? "red"
            : severity === "medium"
            ? "orange"
            : "blue";
        const text =
          severity === "high"
            ? "Cao"
            : severity === "medium"
            ? "Trung bình"
            : "Thấp";
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: () => (
        <Space>
          <Button type="link" icon={<EditOutlined />} size="small">
            Sửa
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} size="small">
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const userColumns: ColumnsType<User> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Họ tên",
      dataIndex: "full_name",
      key: "full_name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag color={role === "admin" ? "red" : "blue"}>
          {role === "admin" ? "Quản trị viên" : "Giám thị"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: () => <Switch defaultChecked size="small" />,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: () => (
        <Space>
          <Button type="link" icon={<EditOutlined />} size="small">
            Sửa
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} size="small">
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const items: TabsProps["items"] = [
    {
      key: "blacklist",
      label: "Danh sách đen",
      children: (
        <div>
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Input.Search
              placeholder="Tìm kiếm tiến trình..."
              style={{ width: 300 }}
            />
            <Button type="primary" icon={<PlusOutlined />}>
              Thêm tiến trình
            </Button>
          </div>
          <Table
            columns={processColumns}
            dataSource={mockProcessBlacklist}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 800 }}
          />
        </div>
      ),
    },
    {
      key: "alerts",
      label: "Cảnh báo",
      children: (
        <div>
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button type="primary" icon={<PlusOutlined />}>
              Thêm cảnh báo
            </Button>
          </div>
          <Table
            columns={alertColumns}
            dataSource={mockAlerts}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 900 }}
          />
        </div>
      ),
    },
    {
      key: "users",
      label: "Người dùng",
      children: (
        <div>
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Input.Search
              placeholder="Tìm kiếm người dùng..."
              style={{ width: 300 }}
            />
            <Button type="primary" icon={<PlusOutlined />}>
              Thêm người dùng
            </Button>
          </div>
          <Table
            columns={userColumns}
            dataSource={mockUsers}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1000 }}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Cài đặt Hệ thống</h1>
      <Card>
        <Tabs items={items} />
      </Card>
    </div>
  );
};

export default Settings;
