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
  Form,
  Input,
  message,
  Space,
  Upload,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ArrowLeftOutlined,
  EyeOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  UploadOutlined,
  DeleteOutlined,
  DownloadOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import {
  mockContests,
  mockRooms,
  mockAttempts,
  mockViolations,
  mockUsers,
  mockContestLabels,
} from "../../data/mockData";
import type { Room, ContestLabel } from "../../types";

const ContestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [students, setStudents] = useState<ContestLabel[]>(
    mockContestLabels.filter((s) => s.contest_id === parseInt(id || "0"))
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [form] = Form.useForm();

  const contest = mockContests.find((c) => c.id === parseInt(id || "0"));
  const contestRooms = mockRooms.filter(
    (r) => r.contest_id === parseInt(id || "0")
  );
  const creator = mockUsers.find((u) => u.id === contest?.created_by);

  if (!contest) {
    return (
      <div>
        <h1>Không tìm thấy cuộc thi</h1>
        <Button onClick={() => navigate("/contests")}>Quay lại</Button>
      </div>
    );
  }

  // Tính toán thống kê
  const totalAttempts = contestRooms.reduce(
    (sum, room) =>
      sum + mockAttempts.filter((a) => a.room_id === room.id).length,
    0
  );
  const activeAttempts = contestRooms.reduce(
    (sum, room) =>
      sum +
      mockAttempts.filter((a) => a.room_id === room.id && a.status === "active")
        .length,
    0
  );
  const totalViolations = contestRooms.reduce(
    (sum, room) =>
      sum +
      mockAttempts
        .filter((a) => a.room_id === room.id)
        .reduce(
          (vSum, attempt) =>
            vSum +
            mockViolations.filter((v) => v.attempt_id === attempt.id).length,
          0
        ),
    0
  );
  const totalCapacity = contestRooms.reduce(
    (sum, room) => sum + room.capacity,
    0
  );

  const getAttemptCount = (roomId: number) => {
    return mockAttempts.filter((a) => a.room_id === roomId).length;
  };

  // Handler functions cho quản lý thí sinh
  const handleAddStudent = () => {
    form.validateFields().then((values) => {
      const newStudent: ContestLabel = {
        id: students.length + 1,
        std: parseInt(values.std),
        full_name: values.full_name,
        contest_id: parseInt(id || "0"),
        user_id: 1,
      };
      setStudents([...students, newStudent]);
      message.success("Đã thêm thí sinh thành công");
      setIsAddModalOpen(false);
      form.resetFields();
    });
  };

  const handleDeleteStudent = (record: ContestLabel) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa thí sinh ${record.full_name} (${record.std})?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        setStudents(students.filter((s) => s.id !== record.id));
        message.success("Đã xóa thí sinh");
      },
    });
  };

  const handleImportExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet) as Record<
          string,
          string | number
        >[];

        const newStudents: ContestLabel[] = json.map((row, index) => ({
          id: students.length + index + 1,
          std: parseInt(String(row["Mã sinh viên"] || row.std || row.MSV)),
          full_name: String(row["Họ tên"] || row.full_name || row.name),
          contest_id: parseInt(id || "0"),
          user_id: 1,
        }));

        setStudents([...students, ...newStudents]);
        message.success(`Đã import ${newStudents.length} thí sinh`);
        setIsImportModalOpen(false);
      } catch {
        message.error(
          "Lỗi khi đọc file Excel. Vui lòng kiểm tra định dạng file."
        );
      }
    };
    reader.readAsBinaryString(file);
    return false; // Prevent upload
  };

  const handleExportTemplate = () => {
    const template = [
      { "Mã sinh viên": "20210001", "Họ tên": "Nguyễn Văn A" },
      { "Mã sinh viên": "20210002", "Họ tên": "Trần Thị B" },
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Danh sách");
    XLSX.writeFile(wb, "template_danh_sach_thi_sinh.xlsx");
    message.success("Đã tải xuống file mẫu");
  };

  const handleExportStudents = () => {
    const data = students.map((s) => ({
      "Mã sinh viên": s.std,
      "Họ tên": s.full_name,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Danh sách");
    XLSX.writeFile(wb, `danh_sach_thi_sinh_${contest?.name}.xlsx`);
    message.success("Đã xuất danh sách thí sinh");
  };

  // Student table columns
  const studentColumns: ColumnsType<ContestLabel> = [
    {
      title: "STT",
      key: "index",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã sinh viên",
      dataIndex: "std",
      key: "std",
      width: 120,
    },
    {
      title: "Họ tên",
      dataIndex: "full_name",
      key: "full_name",
      width: 200,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Button
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteStudent(record)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  const roomColumns: ColumnsType<Room> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Mã phòng",
      dataIndex: "access_code",
      key: "access_code",
      width: 120,
      render: (code: string) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: "Sức chứa",
      dataIndex: "capacity",
      key: "capacity",
      width: 100,
    },
    {
      title: "Số thí sinh",
      key: "students",
      width: 140,
      render: (_, record) => {
        const count = getAttemptCount(record.id);
        const percent = Math.round((count / record.capacity) * 100);
        return (
          <div>
            <div>
              {count}/{record.capacity} ({percent}%)
            </div>
            <Progress percent={percent} size="small" showInfo={false} />
          </div>
        );
      },
    },
    {
      title: "Chế độ duyệt",
      dataIndex: "auto_approve",
      key: "auto_approve",
      width: 130,
      render: (autoApprove: boolean) => (
        <Tag color={autoApprove ? "green" : "orange"}>
          {autoApprove ? "Tự động" : "Thủ công"}
        </Tag>
      ),
    },
    {
      title: "Thời gian đăng ký",
      key: "registration_time",
      width: 180,
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>
          <div>
            {new Date(record.registration_start_time).toLocaleDateString(
              "vi-VN"
            )}
          </div>
          <div>→</div>
          <div>
            {new Date(record.registration_end_time).toLocaleDateString("vi-VN")}
          </div>
        </div>
      ),
    },
    {
      title: "Thời gian thi",
      key: "exam_time",
      width: 180,
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>
          <div>
            {new Date(record.rs_start_time).toLocaleDateString("vi-VN")}{" "}
            {new Date(record.rs_start_time).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div>→</div>
          <div>
            {new Date(record.rs_end_time).toLocaleDateString("vi-VN")}{" "}
            {new Date(record.rs_end_time).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      fixed: "right",
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/rooms/${record.id}`)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  const now = new Date();
  const start = new Date(contest.start_time);
  const end = new Date(contest.end_time);
  let status = "Sắp diễn ra";
  let statusColor = "blue";

  if (now < start) {
    status = "Sắp diễn ra";
    statusColor = "blue";
  } else if (now > end) {
    status = "Đã kết thúc";
    statusColor = "default";
  } else {
    status = "Đang diễn ra";
    statusColor = "green";
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/contests")}
        >
          Quay lại danh sách cuộc thi
        </Button>
      </div>

      <Card
        title={<h2 style={{ margin: 0 }}>{contest.name}</h2>}
        style={{ marginBottom: 24 }}
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="ID">{contest.id}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={statusColor}>{status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Mô tả" span={2}>
            {contest.description}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian bắt đầu">
            {new Date(contest.start_time).toLocaleString("vi-VN")}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian kết thúc">
            {new Date(contest.end_time).toLocaleString("vi-VN")}
          </Descriptions.Item>
          <Descriptions.Item label="Người tạo">
            {creator?.full_name || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {new Date(contest.created_at).toLocaleString("vi-VN")}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số phòng thi"
              value={contestRooms.length}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng sức chứa"
              value={totalCapacity}
              suffix="người"
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Thí sinh đang thi"
              value={activeAttempts}
              suffix={`/ ${totalAttempts}`}
              prefix={<CheckCircleOutlined />}
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

      <Card
        title="Danh sách Thí sinh được phép tham gia"
        extra={
          <Space>
            <Button
              type="default"
              icon={<DownloadOutlined />}
              onClick={handleExportTemplate}
            >
              Tải file mẫu
            </Button>
            <Button
              type="default"
              icon={<DownloadOutlined />}
              onClick={handleExportStudents}
              disabled={students.length === 0}
            >
              Xuất Excel
            </Button>
            <Button
              type="default"
              icon={<UploadOutlined />}
              onClick={() => setIsImportModalOpen(true)}
            >
              Import Excel
            </Button>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => setIsAddModalOpen(true)}
            >
              Thêm thí sinh
            </Button>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Table
          columns={studentColumns}
          dataSource={students}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 500 }}
        />
      </Card>

      <Card title="Danh sách Phòng thi">
        <Table
          columns={roomColumns}
          dataSource={contestRooms}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1300 }}
        />
      </Card>

      {/* Modal thêm thí sinh thủ công */}
      <Modal
        title="Thêm thí sinh"
        open={isAddModalOpen}
        onOk={handleAddStudent}
        onCancel={() => {
          setIsAddModalOpen(false);
          form.resetFields();
        }}
        okText="Thêm"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item
            name="std"
            label="Mã sinh viên"
            rules={[
              { required: true, message: "Vui lòng nhập mã sinh viên" },
              {
                pattern: /^\d+$/,
                message: "Mã sinh viên phải là số",
              },
            ]}
          >
            <Input placeholder="Ví dụ: 20210001" />
          </Form.Item>
          <Form.Item
            name="full_name"
            label="Họ tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input placeholder="Ví dụ: Nguyễn Văn A" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal import Excel */}
      <Modal
        title="Import danh sách từ Excel"
        open={isImportModalOpen}
        onCancel={() => setIsImportModalOpen(false)}
        footer={null}
      >
        <div style={{ padding: "20px 0" }}>
          <p style={{ marginBottom: 16 }}>
            <strong>Hướng dẫn:</strong>
          </p>
          <ol style={{ marginBottom: 20 }}>
            <li>Tải file mẫu Excel bằng nút "Tải file mẫu"</li>
            <li>
              Điền thông tin thí sinh vào file Excel với 2 cột:
              <ul>
                <li>"Mã sinh viên" - Mã số sinh viên (số)</li>
                <li>"Họ tên" - Họ và tên đầy đủ</li>
              </ul>
            </li>
            <li>Upload file Excel đã điền thông tin</li>
          </ol>
          <Upload.Dragger
            name="file"
            accept=".xlsx,.xls"
            beforeUpload={handleImportExcel}
            showUploadList={false}
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined style={{ fontSize: 48, color: "#1890ff" }} />
            </p>
            <p className="ant-upload-text">
              Click hoặc kéo file Excel vào đây để upload
            </p>
            <p className="ant-upload-hint">Hỗ trợ file .xlsx và .xls</p>
          </Upload.Dragger>
        </div>
      </Modal>
    </div>
  );
};

export default ContestDetail;
