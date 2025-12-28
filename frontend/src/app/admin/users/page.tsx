"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import {
  Users,
  Lock,
  Unlock,
  Trash2,
  Search,
  Filter,
  UserCheck,
  UserX,
} from "lucide-react";

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: "STUDENT" | "LECTURER" | "ADMIN";
  status: "ACTIVE" | "LOCKED";
  points: number;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, roleFilter, statusFilter, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users");
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      alert("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== "ALL") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleLockUnlock = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "LOCKED" : "ACTIVE";
    const action = newStatus === "LOCKED" ? "khóa" : "mở khóa";

    if (!confirm(`Bạn có chắc muốn ${action} tài khoản này?`)) {
      return;
    }

    try {
      await api.patch(`/users/${userId}/status`, { status: newStatus });
      alert(
        `${
          action.charAt(0).toUpperCase() + action.slice(1)
        } tài khoản thành công!`
      );
      fetchUsers();
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
      alert(`Không thể ${action} tài khoản. Vui lòng thử lại.`);
    }
  };

  const handleChangeRole = async (userId: string, currentRole: string) => {
    const roles = ["STUDENT", "LECTURER", "ADMIN"];
    const newRole = prompt(
      `Chọn vai trò mới (${roles.join(", ")}):`,
      currentRole
    );

    if (!newRole || !roles.includes(newRole.toUpperCase())) {
      return;
    }

    try {
      await api.patch(`/users/${userId}`, { role: newRole.toUpperCase() });
      alert("Thay đổi vai trò thành công!");
      fetchUsers();
    } catch (error) {
      console.error("Failed to change role:", error);
      alert("Không thể thay đổi vai trò. Vui lòng thử lại.");
    }
  };

  const handleDelete = async (userId: string) => {
    if (
      !confirm(
        "Bạn có chắc muốn xóa tài khoản này? Hành động này không thể hoàn tác!"
      )
    ) {
      return;
    }

    try {
      await api.delete(`/users/${userId}`);
      alert("Xóa tài khoản thành công!");
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Không thể xóa tài khoản. Vui lòng thử lại.");
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      STUDENT: "bg-blue-100 text-blue-800",
      LECTURER: "bg-purple-100 text-purple-800",
      ADMIN: "bg-red-100 text-red-800",
    };
    const labels = {
      STUDENT: "Học viên",
      LECTURER: "Giảng viên",
      ADMIN: "Quản trị",
    };
    return {
      color: colors[role as keyof typeof colors],
      label: labels[role as keyof typeof labels],
    };
  };

  const getStatusBadge = (status: string) => {
    return status === "ACTIVE"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quản lý người dùng
        </h1>
        <p className="text-gray-600">
          Quản lý tài khoản, phân quyền và trạng thái người dùng
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo tên, email, username..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Tất cả vai trò</option>
              <option value="STUDENT">Học viên</option>
              <option value="LECTURER">Giảng viên</option>
              <option value="ADMIN">Quản trị</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">Hoạt động</option>
              <option value="LOCKED">Đã khóa</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            <p className="text-sm text-gray-600">Tổng số</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {users.filter((u) => u.role === "STUDENT").length}
            </p>
            <p className="text-sm text-gray-600">Học viên</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {users.filter((u) => u.role === "LECTURER").length}
            </p>
            <p className="text-sm text-gray-600">Giảng viên</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {users.filter((u) => u.status === "ACTIVE").length}
            </p>
            <p className="text-sm text-gray-600">Hoạt động</p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Điểm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Không tìm thấy người dùng</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const roleBadge = getRoleBadge(user.role);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                              {user.fullName.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.fullName}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{user.username}
                            </div>
                            <div className="text-xs text-gray-400">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${roleBadge.color} cursor-pointer hover:opacity-80`}
                          onClick={() => handleChangeRole(user.id, user.role)}
                          title="Click để thay đổi vai trò"
                        >
                          {roleBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                            user.status
                          )}`}
                        >
                          {user.status === "ACTIVE" ? (
                            <>
                              <UserCheck className="w-3 h-3 mr-1" />
                              Hoạt động
                            </>
                          ) : (
                            <>
                              <UserX className="w-3 h-3 mr-1" />
                              Đã khóa
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.points.toLocaleString()} điểm
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              handleLockUnlock(user.id, user.status)
                            }
                            className={`p-2 rounded-lg transition-colors ${
                              user.status === "ACTIVE"
                                ? "text-red-600 hover:bg-red-50"
                                : "text-green-600 hover:bg-green-50"
                            }`}
                            title={
                              user.status === "ACTIVE"
                                ? "Khóa tài khoản"
                                : "Mở khóa tài khoản"
                            }
                          >
                            {user.status === "ACTIVE" ? (
                              <Lock className="w-4 h-4" />
                            ) : (
                              <Unlock className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa tài khoản"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
