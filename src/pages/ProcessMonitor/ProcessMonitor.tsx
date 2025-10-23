import React, { useState } from "react";
import { Card, Table, Tag, Modal, Descriptions, Timeline } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  EyeOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import {
  mockProcesses,
  mockAttempts,
  mockContestLabels,
} from "../../data/mockData";
import type { Process } from "../../types";

const ProcessMonitor: React.FC = () => {
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const getStudentInfo = (attemptId: number) => {
    const attempt = mockAttempts.find((a) => a.id === attemptId);
    if (!attempt) return { std: "N/A", name: "N/A" };
    const label = mockContestLabels.find((l) => l.std === attempt.std);
    return { std: attempt.std, name: label?.full_name || "N/A" };
  };

  const columns: ColumnsType<Process> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
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
      width: 150,
      render: (name: string) => <strong>{name}</strong>,
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
      width: 180,
      render: (_, record) => getStudentInfo(record.attempt_id).name,
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
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      fixed: "right",
      render: (_, record) => (
        <a onClick={() => handleViewDetail(record)}>
          <EyeOutlined /> Chi tiết
        </a>
      ),
    },
  ];

  const handleViewDetail = (process: Process) => {
    setSelectedProcess(process);
    setDetailModalVisible(true);
  };

  const getProcessDuration = (start: string, end: string) => {
    const startTime = new Date(start).getTime();
    const endTime = end ? new Date(end).getTime() : new Date().getTime();
    const duration = Math.floor((endTime - startTime) / 1000);

    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Giám sát Tiến trình</h1>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Tag color="green" icon={<PlayCircleOutlined />}>
            Đang chạy:{" "}
            {mockProcesses.filter((p) => p.status === "running").length}
          </Tag>
          <Tag color="default" icon={<StopOutlined />}>
            Đã dừng:{" "}
            {mockProcesses.filter((p) => p.status === "stopped").length}
          </Tag>
        </div>

        <Table
          columns={columns}
          dataSource={mockProcesses}
          rowKey="id"
          pagination={{ pageSize: 15 }}
          scroll={{ x: 1300 }}
        />
      </Card>

      <Modal
        title="Chi tiết Tiến trình"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedProcess && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="ID">
                {selectedProcess.id}
              </Descriptions.Item>
              <Descriptions.Item label="PID">
                {selectedProcess.pid}
              </Descriptions.Item>
              <Descriptions.Item label="Tên tiến trình" span={2}>
                <strong>{selectedProcess.name}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Parent ID">
                {selectedProcess.parent_id || "Root"}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag
                  color={
                    selectedProcess.status === "running" ? "green" : "default"
                  }
                >
                  {selectedProcess.status === "running"
                    ? "Đang chạy"
                    : "Đã dừng"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Mã sinh viên">
                {getStudentInfo(selectedProcess.attempt_id).std}
              </Descriptions.Item>
              <Descriptions.Item label="Họ tên">
                {getStudentInfo(selectedProcess.attempt_id).name}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian bắt đầu" span={2}>
                {new Date(selectedProcess.start_time).toLocaleString("vi-VN")}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian kết thúc" span={2}>
                {selectedProcess.end_time
                  ? new Date(selectedProcess.end_time).toLocaleString("vi-VN")
                  : "Đang chạy"}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian chạy" span={2}>
                {getProcessDuration(
                  selectedProcess.start_time,
                  selectedProcess.end_time
                )}
              </Descriptions.Item>
            </Descriptions>

            {selectedProcess.data && selectedProcess.data !== "{}" && (
              <Card title="Dữ liệu bổ sung" style={{ marginTop: 16 }}>
                <pre
                  style={{
                    background: "#f5f5f5",
                    padding: 12,
                    borderRadius: 4,
                  }}
                >
                  {JSON.stringify(JSON.parse(selectedProcess.data), null, 2)}
                </pre>
              </Card>
            )}

            <Card title="Timeline" style={{ marginTop: 16 }}>
              <Timeline
                items={[
                  {
                    color: "green",
                    children: (
                      <>
                        <strong>Tiến trình bắt đầu</strong>
                        <br />
                        {new Date(selectedProcess.start_time).toLocaleString(
                          "vi-VN"
                        )}
                      </>
                    ),
                  },
                  selectedProcess.end_time
                    ? {
                        color: "red",
                        children: (
                          <>
                            <strong>Tiến trình kết thúc</strong>
                            <br />
                            {new Date(selectedProcess.end_time).toLocaleString(
                              "vi-VN"
                            )}
                          </>
                        ),
                      }
                    : {
                        color: "blue",
                        children: <strong>Đang chạy...</strong>,
                      },
                ]}
              />
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProcessMonitor;
