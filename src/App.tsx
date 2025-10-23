import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import MainLayout from "./components/Layout/MainLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Contests from "./pages/Contests/Contests";
import ContestDetail from "./pages/ContestDetail/ContestDetail";
import Rooms from "./pages/Rooms/Rooms";
import RoomDetail from "./pages/RoomDetail/RoomDetail";
import Attempts from "./pages/Attempts/Attempts";
import AttemptDetail from "./pages/AttemptDetail/AttemptDetail";
import Approvals from "./pages/Approvals/Approvals";
import Violations from "./pages/Violations/Violations";
import Messages from "./pages/Messages/Messages";
import Logs from "./pages/Logs/Logs";
import Settings from "./pages/Settings/Settings";
import ProcessMonitor from "./pages/ProcessMonitor/ProcessMonitor";
import ScreenCaptures from "./pages/ScreenCaptures/ScreenCaptures";
import "./App.css";

function App() {
  return (
    <ConfigProvider locale={viVN}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="contests" element={<Contests />} />
            <Route path="contests/:id" element={<ContestDetail />} />
            <Route path="rooms" element={<Rooms />} />
            <Route path="rooms/:id" element={<RoomDetail />} />
            <Route path="attempts" element={<Attempts />} />
            <Route path="attempts/:id" element={<AttemptDetail />} />
            <Route path="approvals" element={<Approvals />} />
            <Route path="violations" element={<Violations />} />
            <Route path="processes" element={<ProcessMonitor />} />
            <Route path="screenshots" element={<ScreenCaptures />} />
            <Route path="messages" element={<Messages />} />
            <Route path="logs" element={<Logs />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
