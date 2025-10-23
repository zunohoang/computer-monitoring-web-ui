import React, { useState } from "react";
import {
  Card,
  Image,
  Row,
  Col,
  Select,
  Button,
  Space,
  Tag,
  Modal,
  Descriptions,
} from "antd";
import {
  EyeOutlined,
  DownloadOutlined,
  DeleteOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { mockImages } from "../../data/mockData";
import type { Image as ImageType } from "../../types";

const ScreenCaptures: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const handleViewDetail = (image: ImageType) => {
    setSelectedImage(image);
    setDetailModalVisible(true);
  };

  const filteredImages = mockImages.filter((img) => {
    if (filterStatus !== "all" && img.status !== filterStatus) return false;
    return true;
  });

  // Mock image placeholder
  const getImagePlaceholder = (id: number) => {
    return `https://via.placeholder.com/400x300/1890ff/ffffff?text=Screenshot+${id}`;
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
        <h1>Ảnh chụp Màn hình</h1>
        <Space>
          <Select
            style={{ width: 200 }}
            placeholder="Lọc theo trạng thái"
            value={filterStatus}
            onChange={setFilterStatus}
          >
            <Select.Option value="all">Tất cả</Select.Option>
            <Select.Option value="active">Đang hoạt động</Select.Option>
            <Select.Option value="deleted">Đã xóa</Select.Option>
          </Select>
        </Space>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Card size="small">
          <Space>
            <Tag color="blue" icon={<PictureOutlined />}>
              Tổng: {mockImages.length}
            </Tag>
            <Tag color="green">
              Hoạt động:{" "}
              {mockImages.filter((i) => i.status === "active").length}
            </Tag>
            <Tag color="red">
              Đã xóa: {mockImages.filter((i) => i.status === "deleted").length}
            </Tag>
          </Space>
        </Card>
      </div>

      <Row gutter={[16, 16]}>
        {filteredImages.map((image) => (
          <Col xs={24} sm={12} md={8} lg={6} key={image.id}>
            <Card
              hoverable
              cover={
                <div style={{ position: "relative" }}>
                  <Image
                    alt={image.text}
                    src={getImagePlaceholder(image.id)}
                    preview={false}
                    style={{ height: 200, objectFit: "cover" }}
                  />
                  <Tag
                    color={image.status === "active" ? "green" : "red"}
                    style={{ position: "absolute", top: 8, right: 8 }}
                  >
                    {image.status === "active" ? "Hoạt động" : "Đã xóa"}
                  </Tag>
                </div>
              }
              actions={[
                <Button
                  type="text"
                  icon={<EyeOutlined />}
                  onClick={() => handleViewDetail(image)}
                >
                  Xem
                </Button>,
                <Button type="text" icon={<DownloadOutlined />}>
                  Tải
                </Button>,
                <Button type="text" danger icon={<DeleteOutlined />}>
                  Xóa
                </Button>,
              ]}
            >
              <Card.Meta
                title={
                  <div
                    style={{
                      fontSize: 12,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {image.text}
                  </div>
                }
                description={
                  <div style={{ fontSize: 12 }}>
                    {new Date(image.created_at).toLocaleString("vi-VN")}
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title="Chi tiết Ảnh chụp"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="download" icon={<DownloadOutlined />}>
            Tải xuống
          </Button>,
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={900}
      >
        {selectedImage && (
          <div>
            <div style={{ marginBottom: 16, textAlign: "center" }}>
              <Image
                src={getImagePlaceholder(selectedImage.id)}
                alt={selectedImage.text}
                style={{ maxWidth: "100%" }}
              />
            </div>

            <Descriptions bordered column={2}>
              <Descriptions.Item label="ID">
                {selectedImage.id}
              </Descriptions.Item>
              <Descriptions.Item label="Tên file">
                {selectedImage.text}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag
                  color={selectedImage.status === "active" ? "green" : "red"}
                >
                  {selectedImage.status === "active" ? "Hoạt động" : "Đã xóa"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian chụp">
                {new Date(selectedImage.created_at).toLocaleString("vi-VN")}
              </Descriptions.Item>
              <Descriptions.Item label="Metadata" span={2}>
                {selectedImage.meta && (
                  <pre
                    style={{
                      background: "#f5f5f5",
                      padding: 8,
                      borderRadius: 4,
                      margin: 0,
                    }}
                  >
                    {JSON.stringify(JSON.parse(selectedImage.meta), null, 2)}
                  </pre>
                )}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ScreenCaptures;
