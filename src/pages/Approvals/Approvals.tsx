import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  message,
  Card,
  Row,
  Col,
  Statistic,
  Select,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  CheckOutlined,
  CloseOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import {
  mockAttempts,
  mockRooms,
  mockContests,
  mockContestLabels,
} from "../../data/mockData";
import type { Attempt } from "../../types";

const Approvals: React.FC = () => {
  const [attempts, setAttempts] = useState<Attempt[]>(mockAttempts);
  const [filterStatus, setFilterStatus] = useState<string>("all");

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

  const handleApprove = (record: Attempt) => {
    Modal.confirm({
      title: "Xác nhận duyệt",
      content: `Bạn có chắc chắn muốn duyệt thí sinh ${getStudentName(
        record.std
      )} vào phòng ${getRoomName(record.room_id)}?`,
      okText: "Duyệt",
      cancelText: "Hủy",
      onOk: () => {
        setAttempts(
          attempts.map((a) =>
            a.id === record.id ? { ...a, approval_status: "approved" } : a
          )
        );
        message.success("Đã duyệt thí sinh thành công");
      },
    });
  };

  const handleReject = (record: Attempt) => {
    Modal.confirm({
      title: "Xác nhận từ chối",
      content: `Bạn có chắc chắn muốn từ chối thí sinh ${getStudentName(
        record.std
      )}?`,
      okText: "Từ chối",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        setAttempts(
          attempts.map((a) =>
            a.id === record.id ? { ...a, approval_status: "rejected" } : a
          )
        );
        message.warning("Đã từ chối thí sinh");
      },
    });
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
      width: 180,
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
      width: 120,
      render: (roomId: number) => getRoomName(roomId),
    },
    {
      title: "Vị trí",
      dataIndex: "location",
      key: "location",
      width: 80,
    },
    {
      title: "Thời gian đăng ký",
      dataIndex: "rs_ct",
      key: "rs_ct",
      width: 160,
      render: (date: string) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Trạng thái duyệt",
      dataIndex: "approval_status",
      key: "approval_status",
      width: 140,
      render: (status: string) => {
        const config = {
          pending: {
            color: "orange",
            text: "Chờ duyệt",
            icon: <ClockCircleOutlined />,
          },
          approved: {
            color: "green",
            text: "Đã duyệt",
            icon: <CheckOutlined />,
          },
          rejected: {
            color: "red",
            text: "Từ chối",
            icon: <CloseOutlined />,
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
      width: 200,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          {record.approval_status === "pending" && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => handleApprove(record)}
              >
                Duyệt
              </Button>
              <Button
                danger
                size="small"
                icon={<CloseOutlined />}
                onClick={() => handleReject(record)}
              >
                Từ chối
              </Button>
            </>
          )}
          {record.approval_status !== "pending" && (
            <Tag>
              {record.approval_status === "approved"
                ? "Đã duyệt"
                : "Đã từ chối"}
            </Tag>
          )}
        </Space>
      ),
    },
  ];

  const pendingCount = attempts.filter(
    (a) => a.approval_status === "pending"
  ).length;
  const approvedCount = attempts.filter(
    (a) => a.approval_status === "approved"
  ).length;
  const rejectedCount = attempts.filter(
    (a) => a.approval_status === "rejected"
  ).length;

  const filteredAttempts = attempts.filter((a) => {
    if (filterStatus === "all") return true;
    return a.approval_status === filterStatus;
  });

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Duyệt Thí sinh</h1>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Chờ duyệt"
              value={pendingCount}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Đã duyệt"
              value={approvedCount}
              prefix={<CheckOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Đã từ chối"
              value={rejectedCount}
              prefix={<CloseOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <span>Lọc theo trạng thái:</span>
            <Select
              value={filterStatus}
              style={{ width: 200 }}
              onChange={setFilterStatus}
              options={[
                { value: "all", label: "Tất cả" },
                { value: "pending", label: "Chờ duyệt" },
                { value: "approved", label: "Đã duyệt" },
                { value: "rejected", label: "Đã từ chối" },
              ]}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredAttempts}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default Approvals;
