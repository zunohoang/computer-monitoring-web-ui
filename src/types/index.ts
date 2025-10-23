// Types dựa trên database schema
export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: "admin" | "examiner";
  full_name: string;
  pass_change: number;
}

export interface Contest {
  id: number;
  name: string;
  description: string;
  start_time: string;
  end_time: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: number;
  contest_id: number;
  access_code: string;
  rs_start_time: string; // Thời gian bắt đầu thi
  rs_end_time: string; // Thời gian kết thúc thi
  registration_start_time: string; // Thời gian bắt đầu đăng ký
  registration_end_time: string; // Thời gian kết thúc đăng ký
  capacity: number;
  auto_approve: boolean; // true: tự động duyệt, false: cần duyệt thủ công
}

export interface Attempt {
  id: number;
  content_id: number;
  std: number;
  rs_ct: string;
  room_id: number;
  location: string;
  status: "active" | "completed" | "pending";
  approval_status: "pending" | "approved" | "rejected"; // Trạng thái duyệt
  started_at: string;
  ended_at: string;
}

export interface Process {
  id: number;
  pid: number;
  name: string;
  parent_id: number;
  start_time: string;
  end_time: string;
  data: string;
  attempt_id: number;
  status: "running" | "stopped";
}

export interface Image {
  id: number;
  text: string;
  created_at: string;
  meta: string;
  status: "active" | "deleted";
}

export interface AuditLog {
  id: number;
  type: "login" | "logout" | "action";
  attempt_id: number;
  process_id: number;
  image_id: number;
  alert_id: number;
  created_at: string;
  details: string;
}

export interface Alert {
  id: number;
  code: "warning" | "critical";
  name: string;
  description: string;
  severity: "low" | "medium" | "high";
  updated_at: string;
}

export interface Violation {
  id: number;
  severity: "low" | "medium" | "high";
  text: string;
  handled: boolean;
  handled_at: string;
  handled_by: number;
  attempt_id: number;
  alert_id: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  log_start_time: string;
  log_end_time: string;
}

export interface Message {
  id: number;
  type: "info" | "warning" | "error";
  content: string;
  created_at: string;
  created_by: number;
  room_id: number;
  attempt_id: number;
  context_id: number;
  title: string;
}

export interface ProcessBlacklist {
  id: number;
  name: string;
  description: string;
}

export interface ContestProcessBlacklist {
  id: number;
  process_id: number;
  contest_id: number;
}

export interface ContestLabel {
  id: number;
  std: number;
  full_name: string;
  contest_id: number;
  user_id: number;
}
