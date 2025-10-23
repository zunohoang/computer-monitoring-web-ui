import React from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Tag, Card, Row, Col } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  EyeOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import {
  mockAttempts,
  mockRooms,
  mockContests,
  mockContestLabels,
  mockViolations,
} from "../../data/mockData";
import type { Attempt } from "../../types";

const Attempts: React.FC = () => {
  const navigate = useNavigate();

  const getStudentName = (std: number) => {
    const label = mockContestLabels.find((l) => l.std === std);
    return label?.full_name || "N/A";
  };

  const getRoomName = (roomId: number) => {
    const room = mockRooms.find((r) => r.id === roomId);
    return room?.access_code || "N/A";
  };

  const getContestName = (roomId: number) => {
    const room = mockRooms.find((r) => r.id === roomId);
    const contest = mockContests.find((c) => c.id === room?.contest_id);
    return contest?.name || "N/A";
  };

  const getViolationCount = (attemptId: number) => {
    return mockViolations.filter((v) => v.attempt_id === attemptId).length;
  };

  const columns: ColumnsType<Attempt> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Mã SV",
      dataIndex: "std",
      key: "std",
      width: 100,
    },
    {
      title: "Họ tên",
      dataIndex: "std",
      key: "student_name",
      render: (std: number) => getStudentName(std),
    },
    {
      title: "Cuộc thi",
      dataIndex: "room_id",
      key: "contest",
      width: 200,
      render: (roomId: number) => getContestName(roomId),
      ellipsis: true,
    },
    {
      title: "Phòng thi",
      dataIndex: "room_id",
      key: "room",
      width: 100,
      render: (roomId: number) => getRoomName(roomId),
    },
    {
      title: "Vị trí",
      dataIndex: "location",
      key: "location",
      width: 80,
    },
    {
      title: "Vi phạm",
      key: "violations",
      width: 80,
      render: (_, record) => {
        const count = getViolationCount(record.id);
        return (
          <Tag
            color={count > 0 ? "red" : "green"}
            icon={count > 0 ? <WarningOutlined /> : <CheckCircleOutlined />}
          >
            {count}
          </Tag>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const config = {
          active: {
            color: "green",
            text: "Đang thi",
            icon: <ClockCircleOutlined />,
          },
          completed: {
            color: "blue",
            text: "Hoàn thành",
            icon: <CheckCircleOutlined />,
          },
          pending: {
            color: "orange",
            text: "Chờ",
            icon: <ClockCircleOutlined />,
          },
        };
        const { color, text, icon } = config[status as keyof typeof config];
        return (
          <Tag color={color} icon={icon}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  const handleViewDetail = (attempt: Attempt) => {
    navigate(`/attempts/${attempt.id}`);
  };

  const activeAttempts = mockAttempts.filter((a) => a.status === "active");
  const completedAttempts = mockAttempts.filter(
    (a) => a.status === "completed"
  );
  const totalViolations = mockAttempts.reduce(
    (sum, a) => sum + getViolationCount(a.id),
    0
  );

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Giám sát Thí sinh</h1>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <h3>Đang thi</h3>
              <div
                style={{ fontSize: 32, fontWeight: "bold", color: "#52c41a" }}
              >
                {activeAttempts.length}
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <h3>Hoàn thành</h3>
              <div
                style={{ fontSize: 32, fontWeight: "bold", color: "#1890ff" }}
              >
                {completedAttempts.length}
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <h3>Tổng vi phạm</h3>
              <div
                style={{ fontSize: 32, fontWeight: "bold", color: "#ff4d4f" }}
              >
                {totalViolations}
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={mockAttempts}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
};

export default Attempts;
