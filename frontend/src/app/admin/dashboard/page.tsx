"use client";

// Mock Data
const users = [
  {
    id: 1,
    name: "Lê Văn C",
    email: "levan@gmail.com",
    role: "STUDENT",
    status: "Active",
  },
  {
    id: 2,
    name: "Ms. Thu Hà",
    email: "thuha@tienganh123.com",
    role: "TEACHER",
    status: "Active",
  },
];

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-background-dark font-display text-white">
      {/* SIDEBAR */}
      <aside className="w-64 bg-surface-dark border-r border-white/5 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-2 border-b border-white/5">
          <span className="material-symbols-outlined text-accent text-3xl">
            admin_panel_settings
          </span>
          <span className="text-xl font-bold tracking-tight">AdminCP</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <div className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-lg text-accent font-medium cursor-pointer">
            <span className="material-symbols-outlined">dashboard</span> Tổng
            quan
          </div>
          <div className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
            <span className="material-symbols-outlined">people</span> Người dùng
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Dashboard Tổng quan</h1>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="font-bold text-sm">Admin</p>
              <p className="text-xs text-gray-400">System Manager</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-accent text-background-dark flex items-center justify-center font-bold">
              AD
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-surface-dark p-6 rounded-xl border border-white/5">
            <h3 className="text-3xl font-bold text-white">5,230</h3>
            <p className="text-gray-400 text-sm">Tổng người dùng</p>
          </div>
          <div className="bg-surface-dark p-6 rounded-xl border border-white/5">
            <h3 className="text-3xl font-bold text-white">120</h3>
            <p className="text-gray-400 text-sm">Khóa học</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-surface-dark rounded-xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h3 className="font-bold">Người dùng mới</h3>
          </div>
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-white/5 text-gray-200 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Tên</th>
                <th className="px-6 py-3">Vai trò</th>
                <th className="px-6 py-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="px-6 py-4 text-white">{user.name}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4 text-green-400">{user.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
