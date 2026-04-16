"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  Cell,
} from "recharts";
import {
  departmentsBase,
  orgTrendBase,
  orgSummaryBase,
  heatmapDataBase,
  alertTemplates,
  jitter,
  timeAgo,
} from "@/lib/mock-data";

function AnimatedNum({ value, color }: { value: number | string; color?: string }) {
  const [display, setDisplay] = useState(typeof value === "number" ? value : 0);

  useEffect(() => {
    if (typeof value !== "number") return;
    const start = display;
    const diff = value - start;
    if (diff === 0) return;
    const steps = 15;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setDisplay(Math.round(start + (diff * step) / steps));
      if (step >= steps) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [value]);

  return (
    <span className="tabular-nums transition-colors duration-500" style={color ? { color } : undefined}>
      {typeof value === "number" ? display : value}
    </span>
  );
}

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100 transition-all duration-300 hover:shadow-md">
      <p className="text-sm text-zinc-400 mb-1">{label}</p>
      <p className="text-3xl font-bold">
        <AnimatedNum value={value} color={color} />
      </p>
      {sub && <p className="text-xs text-zinc-400 mt-1">{sub}</p>}
    </div>
  );
}

function getBarColor(score: number) {
  if (score >= 70) return "#ef4444";
  if (score >= 50) return "#f59e0b";
  if (score >= 40) return "#fb923c";
  return "#22c55e";
}

function HeatmapCell({ value }: { value: number }) {
  const bg =
    value >= 50
      ? "bg-red-500 text-white"
      : value >= 40
      ? "bg-orange-400 text-white"
      : value >= 30
      ? "bg-yellow-300 text-zinc-800"
      : "bg-green-400 text-white";

  return (
    <td className={`text-center py-2 px-3 text-sm font-semibold rounded transition-all duration-700 ${bg}`}>
      {value}
    </td>
  );
}

interface LiveAlert {
  id: string;
  dept: string;
  score: number;
  change: string;
  reason: string;
  time: string;
  level: "high" | "caution";
  minutesAgo: number;
}

export default function DashboardPage() {
  const [departments, setDepartments] = useState(departmentsBase);
  const [orgSummary, setOrgSummary] = useState(orgSummaryBase);
  const [heatmap, setHeatmap] = useState(heatmapDataBase);
  const [alerts, setAlerts] = useState<LiveAlert[]>([]);
  const [alertIndex, setAlertIndex] = useState(0);
  const [isLive, setIsLive] = useState(true);

  // 初期アラート
  useEffect(() => {
    setAlerts(
      alertTemplates.slice(0, 3).map((a, i) => ({
        ...a,
        score: a.baseScore,
        change: `+${Math.floor(Math.random() * 15) + 5}`,
        time: timeAgo((i + 1) * 60),
        minutesAgo: (i + 1) * 60,
      }))
    );
    setAlertIndex(3);
  }, []);

  const tick = useCallback(() => {
    // 部署スコア変動
    setDepartments(
      departmentsBase.map((d) => ({
        ...d,
        avg: jitter(d.avg, 3),
        high: Math.max(0, d.high + Math.round((Math.random() - 0.4) * 1)),
        caution: Math.max(0, d.caution + Math.round((Math.random() - 0.5) * 1)),
      }))
    );

    // 組織サマリー変動
    setOrgSummary((prev) => {
      const newAvg = jitter(orgSummaryBase.avgScore, 2);
      const newHigh = Math.max(0, jitter(orgSummaryBase.highRisk, 2));
      const newCaution = Math.max(0, jitter(orgSummaryBase.caution, 3));
      return {
        ...prev,
        avgScore: newAvg,
        highRisk: newHigh,
        caution: newCaution,
        normal: prev.totalEmployees - newHigh - newCaution,
      };
    });

    // ヒートマップ変動
    setHeatmap(
      heatmapDataBase.map((row) => ({
        ...row,
        w1: jitter(row.w1, 3),
        w2: jitter(row.w2, 3),
        w3: jitter(row.w3, 3),
        w4: jitter(row.w4, 3),
      }))
    );

    // アラートのスコア変動
    setAlerts((prev) =>
      prev.map((a) => ({
        ...a,
        score: jitter(a.score, 2),
      }))
    );
  }, []);

  // 新しいアラートを追加
  const addAlert = useCallback(() => {
    setAlertIndex((prevIdx) => {
      const template = alertTemplates[prevIdx % alertTemplates.length];
      const newAlert: LiveAlert = {
        ...template,
        id: `${template.id}-${Date.now()}`,
        score: jitter(template.baseScore, 3),
        change: `+${Math.floor(Math.random() * 15) + 5}`,
        time: "たった今",
        minutesAgo: 0,
      };
      setAlerts((prev) => [newAlert, ...prev].slice(0, 8));
      return prevIdx + 1;
    });
  }, []);

  useEffect(() => {
    if (!isLive) return;
    const dataInterval = setInterval(tick, 4000);
    const alertInterval = setInterval(addAlert, 12000);
    return () => {
      clearInterval(dataInterval);
      clearInterval(alertInterval);
    };
  }, [tick, addAlert, isLive]);

  const diffScore = orgSummary.avgScore - orgSummary.prevMonthAvg;
  const diffLabel = diffScore < 0 ? `${diffScore} 改善` : `+${diffScore} 悪化`;

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="bg-primary text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">ひとりじゃないよ Dashboard</h1>
          <p className="text-sm opacity-70">株式会社サンプル</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              isLive
                ? "bg-green-500/20 text-green-300"
                : "bg-zinc-500/20 text-zinc-400"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLive ? "bg-green-400 animate-pulse" : "bg-zinc-500"}`} />
            {isLive ? "LIVE" : "PAUSED"}
          </button>
          <div className="text-right">
            <p className="text-sm opacity-70">2026年4月</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="組織平均スコア"
            value={orgSummary.avgScore}
            sub={`前月比 ${diffLabel}`}
            color={orgSummary.avgScore >= 50 ? "#f59e0b" : "#1e3a5f"}
          />
          <StatCard
            label="高リスク"
            value={orgSummary.highRisk}
            sub={`全${orgSummary.totalEmployees}名中`}
            color="#ef4444"
          />
          <StatCard
            label="注意域"
            value={orgSummary.caution}
            sub="スコア50〜69"
            color="#f59e0b"
          />
          <StatCard
            label="正常"
            value={orgSummary.normal}
            sub="スコア49以下"
            color="#22c55e"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Bar Chart */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100">
            <h2 className="text-sm font-semibold text-zinc-500 mb-4">
              部署別 平均孤独スコア
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={departments}
                layout="vertical"
                margin={{ left: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  width={100}
                />
                <Tooltip
                  formatter={(value) => [`${value}/100`, "平均スコア"]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                  }}
                />
                <Bar
                  dataKey="avg"
                  radius={[0, 6, 6, 0]}
                  barSize={24}
                  isAnimationActive={true}
                  animationDuration={600}
                >
                  {departments.map((d, i) => (
                    <Cell key={i} fill={getBarColor(d.avg)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Org Trend */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100">
            <h2 className="text-sm font-semibold text-zinc-500 mb-4">
              組織スコア推移（6ヶ月）
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={orgTrendBase}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                />
                <Tooltip
                  formatter={(value) => [
                    `${value}/100`,
                    "組織平均スコア",
                  ]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#1e3a5f"
                  strokeWidth={3}
                  dot={{ fill: "#1e3a5f", r: 5 }}
                  activeDot={{ r: 7, fill: "#f97316" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Heatmap */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100">
          <h2 className="text-sm font-semibold text-zinc-500 mb-4">
            部署 x 週次ヒートマップ（4月）
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-1">
              <thead>
                <tr>
                  <th className="text-left text-sm text-zinc-400 px-3 py-2">
                    部署
                  </th>
                  <th className="text-center text-sm text-zinc-400 px-3 py-2">
                    第1週
                  </th>
                  <th className="text-center text-sm text-zinc-400 px-3 py-2">
                    第2週
                  </th>
                  <th className="text-center text-sm text-zinc-400 px-3 py-2">
                    第3週
                  </th>
                  <th className="text-center text-sm text-zinc-400 px-3 py-2">
                    第4週
                  </th>
                </tr>
              </thead>
              <tbody>
                {heatmap.map((row) => (
                  <tr key={row.dept}>
                    <td className="text-sm font-medium text-zinc-700 px-3 py-2">
                      {row.dept}
                    </td>
                    <HeatmapCell value={row.w1} />
                    <HeatmapCell value={row.w2} />
                    <HeatmapCell value={row.w3} />
                    <HeatmapCell value={row.w4} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-green-400" /> 0-29 正常
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-yellow-300" /> 30-39 低リスク
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-orange-400" /> 40-49 注意
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-red-500" /> 50+ 高リスク
            </span>
          </div>
        </div>

        {/* Alert List */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-zinc-500">
              リアルタイムアラート
            </h2>
            <span className="flex items-center gap-1.5 text-xs text-green-500">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              ストリーミング中
            </span>
          </div>
          <div className="space-y-3">
            {alerts.map((alert, i) => (
              <div
                key={alert.id}
                className={`flex items-start gap-4 border border-zinc-100 rounded-xl px-4 py-3 transition-all duration-500 ${
                  i === 0 ? "bg-red-50/50 border-red-100" : ""
                }`}
                style={{
                  animation: i === 0 ? "fadeSlideIn 0.5s ease-out" : undefined,
                }}
              >
                <div
                  className={`mt-1 w-3 h-3 rounded-full shrink-0 ${
                    alert.level === "high" ? "bg-red-500 animate-pulse" : "bg-yellow-400"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-zinc-800">
                      {alert.id.split("-").slice(0, 2).join("-")}
                    </span>
                    <span className="text-xs text-zinc-400">{alert.dept}</span>
                    <span className="text-xs text-zinc-300 ml-auto">
                      {alert.time}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500">{alert.reason}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-lg font-bold ${alert.score >= 70 ? "text-red-500" : "text-yellow-500"}`}>
                    {alert.score}
                  </span>
                  <p className="text-xs text-red-400">{alert.change}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
