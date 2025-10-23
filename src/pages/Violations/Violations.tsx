import React, { useState } from "react";
import {
  Table,
  Button,
  Tag,
  Card,
  Descriptions,
  Modal,
  Select,
  Input,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { EyeOutlined, CheckOutlined, WarningOutlined } from "@ant-design/icons";
import {
  mockViolations,
  mockAttempts,
  mockAlerts,
  mockContestLabels,
} from "../../data/mockData";
import type { Violation } from "../../types";

const { TextArea } = Input;

const Violations: React.FC = () => {
  const [violations, setViolations] = useState<Violation[]>(mockViolations);
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(
    null
  );
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [handleModalVisible, setHandleModalVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  const getStudentInfo = (attemptId: number) => {
    const attempt = mockAttempts.find((a) => a.id === attemptId);
    if (!attempt) return { std: "N/A", name: "N/A" };
    const label = mockContestLabels.find((l) => l.std === attempt.std);
    return { std: attempt.std, name: label?.full_name || "N/A" };
  };

  const getAlertName = (alertId: number) => {
    const alert = mockAlerts.find((a) => a.id === alertId);
    return alert?.name || "N/A";
  };

  const columns: ColumnsType<Violation> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Mã SV",
      key: "std",
      width: 100,
      render: (_, record) => getStudentInfo(record.attempt_id).std,
    },
    {
      title: "Họ tên",
      key: "student_name",
      render: (_, record) => getStudentInfo(record.attempt_id).name,
    },
    {
      title: "Loại vi phạm",
      dataIndex: "alert_id",
      key: "alert",
      width: 200,
      render: (alertId: number) => getAlertName(alertId),
      ellipsis: true,
    },
    {
      title: "Mô tả",
      dataIndex: "text",
      key: "text",
      width: 250,
      ellipsis: true,
    },
    {
      title: "Mức độ",
      dataIndex: "severity",
      key: "severity",
      width: 120,
      filters: [
        { text: "Cao", value: "high" },
        { text: "Trung bình", value: "medium" },
        { text: "Thấp", value: "low" },
      ],
      onFilter: (value, record) => record.severity === value,
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
      filters: [
        { text: "Đã xử lý", value: true },
        { text: "Chưa xử lý", value: false },
      ],
      onFilter: (value, record) => record.handled === value,
      render: (handled: boolean) => (
        <Tag
          color={handled ? "green" : "orange"}
          icon={handled ? <CheckOutlined /> : <WarningOutlined />}
        >
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
    {
      title: "Thao tác",
      key: "action",
      width: 180,
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            Chi tiết
          </Button>
          {!record.handled && (
            <Button
              type="link"
              icon={<CheckOutlined />}
              onClick={() => handleMarkAsHandled(record)}
            >
              Xử lý
            </Button>
          )}
        </div>
      ),
    },
  ];

  const handleViewDetail = (violation: Violation) => {
    setSelectedViolation(violation);
    setDetailModalVisible(true);
  };

  const handleMarkAsHandled = (violation: Violation) => {
    setSelectedViolation(violation);
    setHandleModalVisible(true);
  };

  const confirmHandle = () => {
    if (selectedViolation) {
      setViolations(
        violations.map((v) =>
          v.id === selectedViolation.id
            ? {
                ...v,
                handled: true,
                handled_at: new Date().toISOString(),
                handled_by: 1,
                updated_at: new Date().toISOString(),
              }
            : v
        )
      );
      message.success("Đã đánh dấu vi phạm là đã xử lý");
      setHandleModalVisible(false);
    }
  };

  const filteredViolations = violations.filter((v) => {
    if (filterStatus !== "all" && v.handled.toString() !== filterStatus)
      return false;
    if (filterSeverity !== "all" && v.severity !== filterSeverity) return false;
    return true;
  });

  const unhandledCount = violations.filter((v) => !v.handled).length;
  const highSeverityCount = violations.filter(
    (v) => v.severity === "high"
  ).length;

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Quản lý Vi phạm</h1>

      <div
        style={{
          marginBottom: 16,
          display: "flex",
          gap: 16,
          alignItems: "center",
        }}
      >
        <Card style={{ flex: 1 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 16 }}>Chưa xử lý</div>
            <div style={{ fontSize: 32, fontWeight: "bold", color: "#ff4d4f" }}>
              {unhandledCount}
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 16 }}>Mức độ cao</div>
            <div style={{ fontSize: 32, fontWeight: "bold", color: "#faad14" }}>
              {highSeverityCount}
            </div>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 16 }}>Tổng vi phạm</div>
            <div style={{ fontSize: 32, fontWeight: "bold", color: "#1890ff" }}>
              {violations.length}
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ marginBottom: 16, display: "flex", gap: 16 }}>
          <Select
            style={{ width: 200 }}
            placeholder="Lọc theo trạng thái"
            value={filterStatus}
            onChange={setFilterStatus}
          >
            <Select.Option value="all">Tất cả trạng thái</Select.Option>
            <Select.Option value="false">Chưa xử lý</Select.Option>
            <Select.Option value="true">Đã xử lý</Select.Option>
          </Select>
          <Select
            style={{ width: 200 }}
            placeholder="Lọc theo mức độ"
            value={filterSeverity}
            onChange={setFilterSeverity}
          >
            <Select.Option value="all">Tất cả mức độ</Select.Option>
            <Select.Option value="high">Cao</Select.Option>
            <Select.Option value="medium">Trung bình</Select.Option>
            <Select.Option value="low">Thấp</Select.Option>
          </Select>
        </div>

        <Table
          columns={columns}
          dataSource={filteredViolations}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title="Chi tiết vi phạm"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={700}
      >
        {selectedViolation && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="ID">
              {selectedViolation.id}
            </Descriptions.Item>
            <Descriptions.Item label="Mã sinh viên">
              {getStudentInfo(selectedViolation.attempt_id).std}
            </Descriptions.Item>
            <Descriptions.Item label="Họ tên" span={2}>
              {getStudentInfo(selectedViolation.attempt_id).name}
            </Descriptions.Item>
            <Descriptions.Item label="Loại vi phạm" span={2}>
              {getAlertName(selectedViolation.alert_id)}
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả" span={2}>
              {selectedViolation.text}
            </Descriptions.Item>
            <Descriptions.Item label="Mức độ">
              <Tag
                color={
                  selectedViolation.severity === "high"
                    ? "red"
                    : selectedViolation.severity === "medium"
                    ? "orange"
                    : "blue"
                }
              >
                {selectedViolation.severity === "high"
                  ? "Cao"
                  : selectedViolation.severity === "medium"
                  ? "Trung bình"
                  : "Thấp"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={selectedViolation.handled ? "green" : "orange"}>
                {selectedViolation.handled ? "Đã xử lý" : "Chưa xử lý"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian phát hiện" span={2}>
              {new Date(selectedViolation.created_at).toLocaleString("vi-VN")}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian bắt đầu">
              {new Date(selectedViolation.log_start_time).toLocaleString(
                "vi-VN"
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian kết thúc">
              {new Date(selectedViolation.log_end_time).toLocaleString("vi-VN")}
            </Descriptions.Item>
            {selectedViolation.handled && (
              <Descriptions.Item label="Thời gian xử lý" span={2}>
                {selectedViolation.handled_at
                  ? new Date(selectedViolation.handled_at).toLocaleString(
                      "vi-VN"
                    )
                  : "N/A"}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      <Modal
        title="Xử lý vi phạm"
        open={handleModalVisible}
        onOk={confirmHandle}
        onCancel={() => setHandleModalVisible(false)}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn đánh dấu vi phạm này là đã xử lý?</p>
        <TextArea
          rows={4}
          placeholder="Ghi chú (tùy chọn)"
          style={{ marginTop: 16 }}
        />
      </Modal>
    </div>
  );
};

export default Violations;
