import React, { useState } from "react";
import { Table, Button, Card, Tag, Modal, Input, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { SendOutlined, EyeOutlined } from "@ant-design/icons";
import {
  mockMessages,
  mockRooms,
  mockContests,
  mockUsers,
} from "../../data/mockData";
import type { Message } from "../../types";

const { TextArea } = Input;

const Messages: React.FC = () => {
  const [messages] = useState<Message[]>(mockMessages);
  const [sendModalVisible, setSendModalVisible] = useState(false);

  const getRoomName = (roomId: number) => {
    if (roomId === 0) return "Tất cả";
    const room = mockRooms.find((r) => r.id === roomId);
    return room?.access_code || "N/A";
  };

  const getContestName = (contextId: number) => {
    const contest = mockContests.find((c) => c.id === contextId);
    return contest?.name || "N/A";
  };

  const getSenderName = (userId: number) => {
    const user = mockUsers.find((u) => u.id === userId);
    return user?.full_name || "Hệ thống";
  };

  const columns: ColumnsType<Message> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      width: 250,
      ellipsis: true,
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 120,
      render: (type: string) => {
        const config = {
          info: { color: "blue", text: "Thông tin" },
          warning: { color: "orange", text: "Cảnh báo" },
          error: { color: "red", text: "Lỗi" },
        };
        const { color, text } = config[type as keyof typeof config];
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Phòng",
      dataIndex: "room_id",
      key: "room",
      width: 100,
      render: (roomId: number) => getRoomName(roomId),
    },
    {
      title: "Cuộc thi",
      dataIndex: "context_id",
      key: "contest",
      width: 180,
      render: (contextId: number) => getContestName(contextId),
      ellipsis: true,
    },
    {
      title: "Người gửi",
      dataIndex: "created_by",
      key: "sender",
      width: 150,
      render: (userId: number) => getSenderName(userId),
    },
    {
      title: "Thời gian",
      dataIndex: "created_at",
      key: "created_at",
      width: 180,
      render: (date: string) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleView(record)}
        >
          Xem
        </Button>
      ),
    },
  ];

  const handleView = (message: Message) => {
    Modal.info({
      title: message.title,
      width: 600,
      content: (
        <div>
          <p>
            <strong>Loại:</strong>{" "}
            {message.type === "info"
              ? "Thông tin"
              : message.type === "warning"
              ? "Cảnh báo"
              : "Lỗi"}
          </p>
          <p>
            <strong>Nội dung:</strong>
          </p>
          <p>{message.content}</p>
          <p>
            <strong>Phòng:</strong> {getRoomName(message.room_id)}
          </p>
          <p>
            <strong>Người gửi:</strong> {getSenderName(message.created_by)}
          </p>
          <p>
            <strong>Thời gian:</strong>{" "}
            {new Date(message.created_at).toLocaleString("vi-VN")}
          </p>
        </div>
      ),
    });
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
        <h1>Quản lý Tin nhắn</h1>
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={() => setSendModalVisible(true)}
        >
          Gửi tin nhắn mới
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={messages}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title="Gửi tin nhắn mới"
        open={sendModalVisible}
        onCancel={() => setSendModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setSendModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="send" type="primary" icon={<SendOutlined />}>
            Gửi
          </Button>,
        ]}
        width={600}
      >
        <div style={{ marginTop: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8 }}>Tiêu đề</label>
            <Input placeholder="Nhập tiêu đề tin nhắn" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8 }}>Loại</label>
            <Select style={{ width: "100%" }} placeholder="Chọn loại tin nhắn">
              <Select.Option value="info">Thông tin</Select.Option>
              <Select.Option value="warning">Cảnh báo</Select.Option>
              <Select.Option value="error">Lỗi</Select.Option>
            </Select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8 }}>
              Phòng thi
            </label>
            <Select style={{ width: "100%" }} placeholder="Chọn phòng thi">
              <Select.Option value={0}>Tất cả phòng</Select.Option>
              {mockRooms.map((room) => (
                <Select.Option key={room.id} value={room.id}>
                  {room.access_code}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8 }}>
              Nội dung
            </label>
            <TextArea rows={4} placeholder="Nhập nội dung tin nhắn" />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Messages;
