import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { mockContests } from "../../data/mockData";
import type { Contest } from "../../types";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const Contests: React.FC = () => {
  const navigate = useNavigate();
  const [contests, setContests] = useState<Contest[]>(mockContests);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingContest, setEditingContest] = useState<Contest | null>(null);
  const [form] = Form.useForm();

  const columns: ColumnsType<Contest> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Tên cuộc thi",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
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
      render: (date: string) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 130,
      render: (_, record) => {
        const now = new Date();
        const start = new Date(record.start_time);
        const end = new Date(record.end_time);

        if (now < start) {
          return <Tag color="blue">Sắp diễn ra</Tag>;
        } else if (now > end) {
          return <Tag color="default">Đã kết thúc</Tag>;
        } else {
          return <Tag color="green">Đang diễn ra</Tag>;
        }
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            Xem
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingContest(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (contest: Contest) => {
    setEditingContest(contest);
    form.setFieldsValue({
      ...contest,
      time: [dayjs(contest.start_time), dayjs(contest.end_time)],
    });
    setIsModalVisible(true);
  };

  const handleView = (contest: Contest) => {
    navigate(`/contests/${contest.id}`);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa cuộc thi này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        setContests(contests.filter((c) => c.id !== id));
        message.success("Xóa cuộc thi thành công");
      },
    });
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const [startTime, endTime] = values.time;

      if (editingContest) {
        // Update
        setContests(
          contests.map((c) =>
            c.id === editingContest.id
              ? {
                  ...c,
                  name: values.name,
                  description: values.description,
                  start_time: startTime.toISOString(),
                  end_time: endTime.toISOString(),
                  updated_at: new Date().toISOString(),
                }
              : c
          )
        );
        message.success("Cập nhật cuộc thi thành công");
      } else {
        // Create
        const newContest: Contest = {
          id: Math.max(...contests.map((c) => c.id)) + 1,
          name: values.name,
          description: values.description,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          created_by: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setContests([...contests, newContest]);
        message.success("Tạo cuộc thi thành công");
      }

      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Quản lý Cuộc thi</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Tạo cuộc thi mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={contests}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />

      <Modal
        title={editingContest ? "Chỉnh sửa cuộc thi" : "Tạo cuộc thi mới"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
        okText={editingContest ? "Cập nhật" : "Tạo"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item
            name="name"
            label="Tên cuộc thi"
            rules={[{ required: true, message: "Vui lòng nhập tên cuộc thi" }]}
          >
            <Input placeholder="Nhập tên cuộc thi" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <TextArea rows={4} placeholder="Nhập mô tả cuộc thi" />
          </Form.Item>

          <Form.Item
            name="time"
            label="Thời gian"
            rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}
          >
            <RangePicker
              showTime
              format="DD/MM/YYYY HH:mm"
              style={{ width: "100%" }}
              placeholder={["Thời gian bắt đầu", "Thời gian kết thúc"]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Contests;
