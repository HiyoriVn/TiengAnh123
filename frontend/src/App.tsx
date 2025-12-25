import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Courses from "./pages/Courses";
import Lessons from "./pages/Lessons"; // <--- Import mới

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/lessons" element={<Lessons />} />{" "}
      {/* <--- Thay thế dòng h1 cũ */}
    </Routes>
  );
}

export default App;
