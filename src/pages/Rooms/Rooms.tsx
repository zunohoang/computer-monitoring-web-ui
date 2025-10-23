import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Space, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { mockRooms, mockContests, mockAttempts } from "../../data/mockData";
import type { Room } from "../../types";

const Rooms: React.FC = () => {
  const navigate = useNavigate();
  const [rooms] = useState<Room[]>(mockRooms);

  const getContestName = (contestId: number) => {
    const contest = mockContests.find((c) => c.id === contestId);
    return contest?.name || "N/A";
  };

  const getAttemptCount = (roomId: number) => {
    return mockAttempts.filter((a) => a.room_id === roomId).length;
  };

  const columns: ColumnsType<Room> = [
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
      title: "Cuộc thi",
      dataIndex: "contest_id",
      key: "contest",
      width: 200,
      render: (contestId: number) => getContestName(contestId),
      ellipsis: true,
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
      width: 120,
      render: (_, record) => {
        const count = getAttemptCount(record.id);
        const percent = Math.round((count / record.capacity) * 100);
        return (
          <span>
            {count}/{record.capacity} ({percent}%)
          </span>
        );
      },
    },
    {
      title: "Thời gian đăng ký",
      key: "registration_time",
      width: 180,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: 12 }}>
            Từ:{" "}
            {new Date(record.registration_start_time).toLocaleString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div style={{ fontSize: 12 }}>
            Đến:{" "}
            {new Date(record.registration_end_time).toLocaleString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      ),
    },
    {
      title: "Thời gian thi",
      key: "exam_time",
      width: 180,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: 12 }}>
            Từ:{" "}
            {new Date(record.rs_start_time).toLocaleString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div style={{ fontSize: 12 }}>
            Đến:{" "}
            {new Date(record.rs_end_time).toLocaleString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      ),
    },
    {
      title: "Chế độ duyệt",
      dataIndex: "auto_approve",
      key: "auto_approve",
      width: 130,
      render: (autoApprove: boolean) => (
        <Tag color={autoApprove ? "green" : "orange"}>
          {autoApprove ? "Tự động duyệt" : "Duyệt thủ công"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 250,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            Chi tiết
          </Button>
          <Button
            type="link"
            icon={<UserOutlined />}
            onClick={() => handleViewStudents(record)}
          >
            Thí sinh
          </Button>
          <Button type="link" icon={<EditOutlined />}>
            Sửa
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewDetail = (room: Room) => {
    navigate(`/rooms/${room.id}`);
  };

  const handleViewStudents = (room: Room) => {
    navigate(`/rooms/${room.id}`);
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
        <h1>Quản lý Phòng thi</h1>
        <Button type="primary" icon={<PlusOutlined />}>
          Tạo phòng thi mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={rooms}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1500 }}
      />
    </div>
  );
};

export default Rooms;
