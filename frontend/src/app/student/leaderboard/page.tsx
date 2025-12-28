/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import { Trophy, Medal, Award } from "lucide-react";
import { useAuth } from "@/hooks";

interface LeaderboardUser {
  id: string;
  username: string;
  fullName: string;
  avatar?: string;
  points: number;
  streak: number;
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [myRank, setMyRank] = useState<number>(0);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const [leaderboardResponse, statsResponse] = await Promise.all([
        api.get("/gamification/leaderboard?limit=50"),
        api.get("/gamification/my-stats"),
      ]);

      setLeaderboard(leaderboardResponse.data);
      setMyRank(statsResponse.data.rank);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="text-yellow-500" size={24} />;
    if (rank === 2) return <Medal className="text-gray-400" size={24} />;
    if (rank === 3) return <Award className="text-orange-600" size={24} />;
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải bảng xếp hạng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-dark p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mb-4">
            <Trophy className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Bảng Xếp Hạng
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Top học viên xuất sắc nhất
          </p>
        </div>

        {/* My Rank Card */}
        {user && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white mb-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Hạng của bạn</p>
                <p className="text-4xl font-bold">#{myRank}</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90 mb-1">Điểm của bạn</p>
                <p className="text-2xl font-bold">
                  {user.points?.toLocaleString() || "0"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {/* 2nd Place */}
            <div className="flex flex-col items-center pt-8">
              <div className="relative mb-2">
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  {leaderboard[1].avatar ? (
                    <img
                      src={leaderboard[1].avatar}
                      alt={leaderboard[1].fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl">👤</span>
                  )}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
              </div>
              <p className="font-semibold text-gray-900 dark:text-white text-center text-sm truncate w-full">
                {leaderboard[1].fullName}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {leaderboard[1].points.toLocaleString()} điểm
              </p>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center">
              <div className="relative mb-2">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center overflow-hidden ring-4 ring-yellow-300">
                  {leaderboard[0].avatar ? (
                    <img
                      src={leaderboard[0].avatar}
                      alt={leaderboard[0].fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">👑</span>
                  )}
                </div>
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Trophy className="text-yellow-500" size={28} />
                </div>
              </div>
              <p className="font-bold text-gray-900 dark:text-white text-center truncate w-full">
                {leaderboard[0].fullName}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {leaderboard[0].points.toLocaleString()} điểm
              </p>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center pt-8">
              <div className="relative mb-2">
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  {leaderboard[2].avatar ? (
                    <img
                      src={leaderboard[2].avatar}
                      alt={leaderboard[2].fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl">👤</span>
                  )}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
              </div>
              <p className="font-semibold text-gray-900 dark:text-white text-center text-sm truncate w-full">
                {leaderboard[2].fullName}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {leaderboard[2].points.toLocaleString()} điểm
              </p>
            </div>
          </div>
        )}

        {/* Full Leaderboard List */}
        <div className="bg-white dark:bg-navy rounded-lg shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {leaderboard.map((lbUser, index) => {
              const rank = index + 1;
              const isCurrentUser = user?.id === lbUser.id;

              return (
                <div
                  key={lbUser.id}
                  className={`flex items-center gap-4 p-4 transition ${
                    isCurrentUser
                      ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {/* Rank */}
                  <div className="w-12 flex items-center justify-center">
                    {getRankIcon(rank) || (
                      <span className="text-lg font-bold text-gray-600 dark:text-gray-400">
                        {rank}
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {lbUser.avatar ? (
                      <img
                        src={lbUser.avatar}
                        alt={lbUser.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl">👤</span>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                      {lbUser.fullName}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-1 rounded">
                          Bạn
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      @{lbUser.username}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-orange-500 text-lg">
                        local_fire_department
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {lbUser.streak}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-yellow-500 text-lg">
                        monetization_on
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {lbUser.points.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              Chưa có dữ liệu xếp hạng
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
