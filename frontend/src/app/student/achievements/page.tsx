"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import { Trophy, Lock } from "lucide-react";

interface Achievement {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: string;
  pointsRequired: number;
  createdAt: string;
}

interface UserAchievement {
  id: string;
  achievement: Achievement;
  earnedAt: string;
}

export default function AchievementsPage() {
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>(
    []
  );
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    points: 0,
    streak: 0,
    achievementCount: 0,
    rank: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userAchResponse, allAchResponse, statsResponse] =
        await Promise.all([
          api.get("/gamification/my-achievements"),
          api.get("/gamification/achievements"),
          api.get("/gamification/my-stats"),
        ]);

      setUserAchievements(userAchResponse.data);
      setAllAchievements(allAchResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      console.error("Error fetching achievements:", error);
    } finally {
      setLoading(false);
    }
  };

  const isUnlocked = (achievementId: string) => {
    return userAchievements.some((ua) => ua.achievement.id === achievementId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thành tích...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-dark p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Thành tích & Huy hiệu
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Mở khóa huy hiệu bằng cách hoàn thành thử thách
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-navy rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400">
                  monetization_on
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.points.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Điểm</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-navy rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-orange-600 dark:text-orange-400">
                  local_fire_department
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.streak}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ngày liên tiếp
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-navy rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Trophy
                  className="text-blue-600 dark:text-blue-400"
                  size={24}
                />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.achievementCount}/{allAchievements.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Huy hiệu
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-navy rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-green-600 dark:text-green-400">
                  emoji_events
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  #{stats.rank}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Hạng / {stats.totalUsers}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white dark:bg-navy rounded-lg p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Tiến độ mở khóa
            </h3>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {stats.achievementCount}/{allAchievements.length} huy hiệu
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${
                  (stats.achievementCount / allAchievements.length) * 100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allAchievements.map((achievement) => {
            const unlocked = isUnlocked(achievement.id);
            const userAch = userAchievements.find(
              (ua) => ua.achievement.id === achievement.id
            );

            return (
              <div
                key={achievement.id}
                className={`relative rounded-lg p-6 shadow-sm transition-all ${
                  unlocked
                    ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                    : "bg-white dark:bg-navy border-2 border-dashed border-gray-300 dark:border-gray-700"
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                    unlocked ? "bg-white/20" : "bg-gray-100 dark:bg-gray-800"
                  }`}
                >
                  {unlocked ? (
                    <span className="material-symbols-outlined text-3xl">
                      {achievement.icon}
                    </span>
                  ) : (
                    <Lock className="text-gray-400" size={32} />
                  )}
                </div>

                {/* Content */}
                <h3
                  className={`text-lg font-bold mb-2 ${
                    unlocked ? "text-white" : "text-gray-900 dark:text-white"
                  }`}
                >
                  {achievement.name}
                </h3>
                <p
                  className={`text-sm mb-3 ${
                    unlocked
                      ? "text-white/90"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {achievement.description}
                </p>

                {/* Footer */}
                {unlocked && userAch ? (
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <span className="material-symbols-outlined text-sm">
                      check_circle
                    </span>
                    <span>
                      Đạt được{" "}
                      {new Date(userAch.earnedAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                    <Lock size={14} />
                    <span>Chưa mở khóa</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
