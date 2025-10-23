import React from "react";
import { Row, Col, Card, Statistic, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  TrophyOutlined,
  UserOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import {
  mockContests,
  mockAttempts,
  mockViolations,
  mockRooms,
} from "../../data/mockData";
import type { Violation } from "../../types";

const Dashboard: React.FC = () => {
  const activeContests = mockContests.filter(
    (c) =>
      new Date(c.start_time) <= new Date() && new Date(c.end_time) >= new Date()
  ).length;
  const totalAttempts = mockAttempts.length;
  const activeAttempts = mockAttempts.filter(
    (a) => a.status === "active"
  ).length;
  const pendingApprovals = mockAttempts.filter(
    (a) => a.approval_status === "pending"
  ).length;
  const totalViolations = mockViolations.length;
  const unhandledViolations = mockViolations.filter((v) => !v.handled).length;

  const recentViolations = mockViolations.slice(0, 5);

  const violationColumns: ColumnsType<Violation> = [
    {
      title: "Mã SV",
      dataIndex: "attempt_id",
      key: "student",
      render: (attemptId) => {
        const attempt = mockAttempts.find((a) => a.id === attemptId);
        return attempt?.std || "N/A";
      },
    },
    {
      title: "Mô tả",
      dataIndex: "text",
      key: "text",
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
      title: "Trạng thái",
      dataIndex: "handled",
      key: "handled",
      render: (handled: boolean) => (
        <Tag
          color={handled ? "green" : "orange"}
          icon={handled ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
        >
          {handled ? "Đã xử lý" : "Chưa xử lý"}
        </Tag>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => new Date(date).toLocaleString("vi-VN"),
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Dashboard</h1>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Cuộc thi đang diễn ra"
              value={activeContests}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Thí sinh đang thi"
              value={activeAttempts}
              suffix={`/ ${totalAttempts}`}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Chờ duyệt"
              value={pendingApprovals}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Vi phạm chưa xử lý"
              value={unhandledViolations}
              suffix={`/ ${totalViolations}`}
              prefix={<WarningOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số phòng thi"
              value={mockRooms.length}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Vi phạm gần đây" style={{ marginTop: 24 }}>
        <Table
          columns={violationColumns}
          dataSource={recentViolations}
          rowKey="id"
          pagination={false}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
