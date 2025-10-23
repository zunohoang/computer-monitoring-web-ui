import React from "react";
import { Table, Tag, Card } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  mockAuditLogs,
  mockAttempts,
  mockContestLabels,
} from "../../data/mockData";
import type { AuditLog } from "../../types";

const Logs: React.FC = () => {
  const getStudentInfo = (attemptId: number) => {
    const attempt = mockAttempts.find((a) => a.id === attemptId);
    if (!attempt || attemptId === 0) return "Hệ thống";
    const label = mockContestLabels.find((l) => l.std === attempt.std);
    return `${attempt.std} - ${label?.full_name || "N/A"}`;
  };

  const columns: ColumnsType<AuditLog> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 120,
      render: (type: string) => {
        const config = {
          login: { color: "green", text: "Đăng nhập" },
          logout: { color: "blue", text: "Đăng xuất" },
          action: { color: "orange", text: "Hành động" },
        };
        const { color, text } = config[type as keyof typeof config];
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Người dùng",
      dataIndex: "attempt_id",
      key: "user",
      width: 200,
      render: (attemptId: number) => getStudentInfo(attemptId),
    },
    {
      title: "Chi tiết",
      dataIndex: "details",
      key: "details",
      width: 300,
      ellipsis: true,
    },
    {
      title: "Thời gian",
      dataIndex: "created_at",
      key: "created_at",
      width: 180,
      render: (date: string) => new Date(date).toLocaleString("vi-VN"),
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Lịch sử Hoạt động</h1>

      <Card>
        <Table
          columns={columns}
          dataSource={mockAuditLogs}
          rowKey="id"
          pagination={{ pageSize: 15 }}
          scroll={{ x: 900 }}
        />
      </Card>
    </div>
  );
};

export default Logs;
