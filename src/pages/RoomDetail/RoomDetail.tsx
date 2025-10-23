import React, { useState } from "react";
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
  Progress,
  Modal,
  message,
  Space,
  Tabs,
  Input,
  Form,
  Select,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ArrowLeftOutlined,
  EyeOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  UserOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  mockRooms,
  mockContests,
  mockAttempts,
  mockContestLabels,
  mockViolations,
} from "../../data/mockData";
import type { Attempt, Violation } from "../../types";

const RoomDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState<Attempt[]>(mockAttempts);
  const [joinCode, setJoinCode] = useState<string>("");
  const [violations, setViolations] = useState(mockViolations);
  const [isViolationModalOpen, setIsViolationModalOpen] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState<Attempt | null>(null);
  const [violationForm] = Form.useForm();

  const room = mockRooms.find((r) => r.id === parseInt(id || "0"));
  const contest = mockContests.find((c) => c.id === room?.contest_id);
  const roomAttempts = attempts.filter(
    (a) => a.room_id === parseInt(id || "0")
  );

  if (!room) {
    return (
      <div>
        <h1>Không tìm thấy phòng thi</h1>
        <Button onClick={() => navigate("/rooms")}>Quay lại</Button>
      </div>
    );
  }

  const getStudentName = (std: number) => {
    const label = mockContestLabels.find((l) => l.std === std);
    return label?.full_name || "N/A";
  };

  const getViolationCount = (attemptId: number) => {
    return violations.filter((v) => v.attempt_id === attemptId).length;
  };

  const handleDelete = (record: Attempt) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa thí sinh ${getStudentName(
        record.std
      )} khỏi phòng thi?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        setAttempts(attempts.filter((a) => a.id !== record.id));
        message.success("Đã xóa thí sinh khỏi phòng thi");
      },
    });
  };

  const handleCreateViolation = (record: Attempt) => {
    setSelectedAttempt(record);
    setIsViolationModalOpen(true);
    violationForm.resetFields();
  };

  const handleViolationSubmit = () => {
    violationForm.validateFields().then((values) => {
      const newViolation: Violation = {
        id: violations.length + 1,
        severity: values.severity,
        text: values.text,
        handled: false,
        handled_at: "",
        handled_by: 0,
        attempt_id: selectedAttempt!.id,
        alert_id: 1,
        created_by: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        log_start_time: new Date().toISOString(),
        log_end_time: new Date().toISOString(),
      };
      setViolations([...violations, newViolation]);
      message.success("Đã tạo vi phạm mới");
      setIsViolationModalOpen(false);
      violationForm.resetFields();
    });
  };

  const handleApprove = (record: Attempt) => {
    Modal.confirm({
      title: "Xác nhận duyệt",
      content: `Bạn có chắc chắn muốn duyệt thí sinh ${getStudentName(
        record.std
      )} vào phòng?`,
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

  const handleGenerateCode = () => {
    // Generate random 6-digit code
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setJoinCode(randomCode);
    message.success("Đã tạo mã tham gia mới");
  };

  const activeAttempts = roomAttempts.filter(
    (a) => a.status === "active"
  ).length;
  const completedAttempts = roomAttempts.filter(
    (a) => a.status === "completed"
  ).length;
  const pendingApprovals = roomAttempts.filter(
    (a) => a.approval_status === "pending"
  ).length;
  const totalViolations = roomAttempts.reduce(
    (sum, a) => sum + getViolationCount(a.id),
    0
  );

  const attemptColumns: ColumnsType<Attempt> = [
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
      title: "Vị trí",
      dataIndex: "location",
      key: "location",
      width: 80,
    },
    {
      title: "Trạng thái duyệt",
      dataIndex: "approval_status",
      key: "approval_status",
      width: 120,
      render: (status: string) => {
        const config = {
          pending: { color: "orange", text: "Chờ duyệt" },
          approved: { color: "green", text: "Đã duyệt" },
          rejected: { color: "red", text: "Từ chối" },
        };
        const { color, text } = config[status as keyof typeof config];
        return <Tag color={color}>{text}</Tag>;
      },
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
      title: "Trạng thái thi",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => {
        const config = {
          active: { color: "green", text: "Đang thi" },
          completed: { color: "blue", text: "Hoàn thành" },
          pending: { color: "orange", text: "Chờ" },
        };
        const { color, text } = config[status as keyof typeof config];
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "started_at",
      key: "started_at",
      width: 160,
      render: (date: string) =>
        date ? new Date(date).toLocaleString("vi-VN") : "-",
    },
    {
      title: "Thao tác",
      key: "action",
      width: 280,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          {record.approval_status === "pending" && !room.auto_approve && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<CheckCircleOutlined />}
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
          <Button
            size="small"
            icon={<WarningOutlined />}
            onClick={() => handleCreateViolation(record)}
            style={{ color: "#ff4d4f", borderColor: "#ff4d4f" }}
          >
            Vi phạm
          </Button>
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            Xóa
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/attempts/${record.id}`)}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(`/contests/${room.contest_id}`)}
        >
          Quay lại cuộc thi
        </Button>
        <Space.Compact style={{ width: 300 }}>
          <Input
            placeholder="Mã tham gia (6 chữ số)"
            value={joinCode}
            readOnly
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleGenerateCode}
          >
            Tạo mã
          </Button>
        </Space.Compact>
      </div>

      <Card
        title={<h2 style={{ margin: 0 }}>Phòng thi: {room.access_code}</h2>}
        style={{ marginBottom: 24 }}
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="ID">{room.id}</Descriptions.Item>
          <Descriptions.Item label="Mã phòng">
            <Tag color="blue">{room.access_code}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Cuộc thi" span={2}>
            <a onClick={() => navigate(`/contests/${contest?.id}`)}>
              {contest?.name || "N/A"}
            </a>
          </Descriptions.Item>
          <Descriptions.Item label="Sức chứa">
            {room.capacity} người
          </Descriptions.Item>
          <Descriptions.Item label="Số thí sinh hiện tại">
            {roomAttempts.length} người
          </Descriptions.Item>
          <Descriptions.Item label="Chế độ duyệt" span={2}>
            <Tag color={room.auto_approve ? "green" : "orange"}>
              {room.auto_approve ? "Tự động duyệt" : "Duyệt thủ công"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Tỷ lệ lấp đầy" span={2}>
            <Progress
              percent={Math.round((roomAttempts.length / room.capacity) * 100)}
              status={
                roomAttempts.length >= room.capacity ? "exception" : "normal"
              }
            />
          </Descriptions.Item>
          <Descriptions.Item label="Đăng ký từ" span={2}>
            {new Date(room.registration_start_time).toLocaleString("vi-VN")}
          </Descriptions.Item>
          <Descriptions.Item label="Đăng ký đến" span={2}>
            {new Date(room.registration_end_time).toLocaleString("vi-VN")}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian thi bắt đầu" span={2}>
            {new Date(room.rs_start_time).toLocaleString("vi-VN")}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian thi kết thúc" span={2}>
            {new Date(room.rs_end_time).toLocaleString("vi-VN")}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đang thi"
              value={activeAttempts}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Hoàn thành"
              value={completedAttempts}
              prefix={<CheckCircleOutlined />}
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
              title="Tổng vi phạm"
              value={totalViolations}
              prefix={<WarningOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Danh sách Thí sinh (Máy tính)">
        <Tabs
          defaultActiveKey="approved"
          items={[
            {
              key: "approved",
              label: `Đã vào (${
                roomAttempts.filter((a) => a.approval_status === "approved")
                  .length
              })`,
              children: (
                <Table
                  columns={attemptColumns}
                  dataSource={roomAttempts.filter(
                    (a) => a.approval_status === "approved"
                  )}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 1400 }}
                />
              ),
            },
            {
              key: "pending",
              label: `Đang chờ duyệt (${
                roomAttempts.filter((a) => a.approval_status === "pending")
                  .length
              })`,
              children: (
                <Table
                  columns={attemptColumns}
                  dataSource={roomAttempts.filter(
                    (a) => a.approval_status === "pending"
                  )}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 1400 }}
                />
              ),
            },
            {
              key: "rejected",
              label: `Đã từ chối (${
                roomAttempts.filter((a) => a.approval_status === "rejected")
                  .length
              })`,
              children: (
                <Table
                  columns={attemptColumns}
                  dataSource={roomAttempts.filter(
                    (a) => a.approval_status === "rejected"
                  )}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 1400 }}
                />
              ),
            },
          ]}
        />
      </Card>

      {/* Modal tạo vi phạm */}
      <Modal
        title={`Tạo vi phạm cho thí sinh: ${
          selectedAttempt ? getStudentName(selectedAttempt.std) : ""
        }`}
        open={isViolationModalOpen}
        onOk={handleViolationSubmit}
        onCancel={() => {
          setIsViolationModalOpen(false);
          violationForm.resetFields();
        }}
        okText="Tạo vi phạm"
        cancelText="Hủy"
        width={600}
      >
        <Form form={violationForm} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item
            name="severity"
            label="Mức độ nghiêm trọng"
            rules={[{ required: true, message: "Vui lòng chọn mức độ" }]}
          >
            <Select placeholder="Chọn mức độ nghiêm trọng">
              <Select.Option value="low">Thấp</Select.Option>
              <Select.Option value="medium">Trung bình</Select.Option>
              <Select.Option value="high">Cao</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="text"
            label="Mô tả vi phạm"
            rules={[{ required: true, message: "Vui lòng nhập mô tả vi phạm" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Nhập mô tả chi tiết vi phạm..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoomDetail;
