import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Descriptions,
  Button,
  Table,
  Tag,
  Row,
  Col,
  Statistic,
  Tabs,
  Image,
  Timeline,
} from "antd";
import type { TabsProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ArrowLeftOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  StopOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import {
  mockAttempts,
  mockContestLabels,
  mockViolations,
  mockProcesses,
  mockImages,
  mockRooms,
  mockContests,
  mockAuditLogs,
} from "../../data/mockData";
import type { Violation, Process } from "../../types";

const AttemptDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const attempt = mockAttempts.find((a) => a.id === parseInt(id || "0"));
  const student = mockContestLabels.find((l) => l.std === attempt?.std);
  const room = mockRooms.find((r) => r.id === attempt?.room_id);
  const contest = mockContests.find((c) => c.id === room?.contest_id);

  const attemptViolations = mockViolations.filter(
    (v) => v.attempt_id === parseInt(id || "0")
  );
  const attemptProcesses = mockProcesses.filter(
    (p) => p.attempt_id === parseInt(id || "0")
  );
  const attemptLogs = mockAuditLogs.filter(
    (l) => l.attempt_id === parseInt(id || "0")
  );

  if (!attempt) {
    return (
      <div>
        <h1>Không tìm thấy thông tin thí sinh</h1>
        <Button onClick={() => navigate("/attempts")}>Quay lại</Button>
      </div>
    );
  }

  const violationColumns: ColumnsType<Violation> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
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
      width: 120,
      render: (severity: string) => {
        const config = {
          high: { color: "red", text: "Cao" },
          medium: { color: "orange", text: "Trung bình" },
          low: { color: "blue", text: "Thấp" },
        };
        const { color, text } = config[severity as keyof typeof config];
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "handled",
      key: "handled",
      width: 120,
      render: (handled: boolean) => (
        <Tag color={handled ? "green" : "orange"}>
          {handled ? "Đã xử lý" : "Chưa xử lý"}
        </Tag>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "created_at",
      key: "created_at",
      width: 160,
      render: (date: string) => new Date(date).toLocaleString("vi-VN"),
    },
  ];

  const processColumns: ColumnsType<Process> = [
    {
      title: "PID",
      dataIndex: "pid",
      key: "pid",
      width: 80,
    },
    {
      title: "Tên tiến trình",
      dataIndex: "name",
      key: "name",
      render: (name: string) => <strong>{name}</strong>,
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "start_time",
      key: "start_time",
      width: 160,
      render: (date: string) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_time",
      key: "end_time",
      width: 160,
      render: (date: string) =>
        date ? new Date(date).toLocaleString("vi-VN") : "-",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => (
        <Tag
          color={status === "running" ? "green" : "default"}
          icon={
            status === "running" ? <PlayCircleOutlined /> : <StopOutlined />
          }
        >
          {status === "running" ? "Đang chạy" : "Đã dừng"}
        </Tag>
      ),
    },
  ];

  const getImagePlaceholder = (imgId: number) => {
    return `https://via.placeholder.com/300x200/1890ff/ffffff?text=Screenshot+${imgId}`;
  };

  const tabItems: TabsProps["items"] = [
    {
      key: "overview",
      label: "Tổng quan",
      children: (
        <div>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Vi phạm"
                  value={attemptViolations.length}
                  prefix={<WarningOutlined />}
                  valueStyle={{
                    color: attemptViolations.length > 0 ? "#ff4d4f" : "#52c41a",
                  }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Tiến trình"
                  value={attemptProcesses.length}
                  prefix={<PlayCircleOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Đang chạy"
                  value={
                    attemptProcesses.filter((p) => p.status === "running")
                      .length
                  }
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Ảnh chụp"
                  value={mockImages.length}
                  prefix={<PictureOutlined />}
                  valueStyle={{ color: "#722ed1" }}
                />
              </Card>
            </Col>
          </Row>

          <Card title="Timeline hoạt động" style={{ marginTop: 24 }}>
            <Timeline
              items={attemptLogs.map((log) => ({
                color:
                  log.type === "login"
                    ? "green"
                    : log.type === "logout"
                    ? "blue"
                    : "orange",
                children: (
                  <>
                    <strong>
                      {log.type === "login"
                        ? "Đăng nhập"
                        : log.type === "logout"
                        ? "Đăng xuất"
                        : "Hành động"}
                    </strong>
                    <br />
                    {log.details}
                    <br />
                    <small>
                      {new Date(log.created_at).toLocaleString("vi-VN")}
                    </small>
                  </>
                ),
              }))}
            />
          </Card>
        </div>
      ),
    },
    {
      key: "violations",
      label: `Vi phạm (${attemptViolations.length})`,
      children: (
        <Table
          columns={violationColumns}
          dataSource={attemptViolations}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 800 }}
        />
      ),
    },
    {
      key: "processes",
      label: `Tiến trình (${attemptProcesses.length})`,
      children: (
        <Table
          columns={processColumns}
          dataSource={attemptProcesses}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 800 }}
        />
      ),
    },
    {
      key: "screenshots",
      label: `Ảnh chụp (${mockImages.length})`,
      children: (
        <Row gutter={[16, 16]}>
          {mockImages.slice(0, 6).map((img) => (
            <Col xs={24} sm={12} md={8} key={img.id}>
              <Card
                hoverable
                cover={
                  <Image
                    alt={img.text}
                    src={getImagePlaceholder(img.id)}
                    style={{ height: 200, objectFit: "cover" }}
                  />
                }
              >
                <Card.Meta
                  title={<div style={{ fontSize: 12 }}>{img.text}</div>}
                  description={new Date(img.created_at).toLocaleString("vi-VN")}
                />
              </Card>
            </Col>
          ))}
        </Row>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(`/rooms/${room?.id}`)}
        >
          Quay lại phòng thi
        </Button>
      </div>

      <Card
        title={
          <h2 style={{ margin: 0 }}>
            Chi tiết Máy tính - {attempt.std} ({student?.full_name})
          </h2>
        }
        style={{ marginBottom: 24 }}
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="ID">{attempt.id}</Descriptions.Item>
          <Descriptions.Item label="Mã sinh viên">
            {attempt.std}
          </Descriptions.Item>
          <Descriptions.Item label="Họ tên">
            {student?.full_name || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Vị trí">
            {attempt.location}
          </Descriptions.Item>
          <Descriptions.Item label="Phòng thi">
            <a onClick={() => navigate(`/rooms/${room?.id}`)}>
              {room?.access_code || "N/A"}
            </a>
          </Descriptions.Item>
          <Descriptions.Item label="Cuộc thi">
            <a onClick={() => navigate(`/contests/${contest?.id}`)}>
              {contest?.name || "N/A"}
            </a>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag
              color={
                attempt.status === "active"
                  ? "green"
                  : attempt.status === "completed"
                  ? "blue"
                  : "orange"
              }
            >
              {attempt.status === "active"
                ? "Đang thi"
                : attempt.status === "completed"
                ? "Hoàn thành"
                : "Chờ"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Vi phạm">
            <Tag color={attemptViolations.length > 0 ? "red" : "green"}>
              {attemptViolations.length}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian bắt đầu">
            {attempt.started_at
              ? new Date(attempt.started_at).toLocaleString("vi-VN")
              : "Chưa bắt đầu"}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian kết thúc">
            {attempt.ended_at
              ? new Date(attempt.ended_at).toLocaleString("vi-VN")
              : "Chưa kết thúc"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card>
        <Tabs items={tabItems} />
      </Card>
    </div>
  );
};

export default AttemptDetail;
