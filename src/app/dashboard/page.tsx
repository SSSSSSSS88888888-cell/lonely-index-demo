"use client";

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
  departments,
  orgTrend,
  orgSummary,
  heatmapData,
} from "@/lib/mock-data";

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100">
      <p className="text-sm text-zinc-400 mb-1">{label}</p>
      <p className="text-3xl font-bold" style={{ color }}>
        {value}
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
    <td className={`text-center py-2 px-3 text-sm font-semibold rounded ${bg}`}>
      {value}
    </td>
  );
}

export default function DashboardPage() {
  const diffScore = orgSummary.avgScore - orgSummary.prevMonthAvg;
  const diffLabel = diffScore < 0 ? `${diffScore} 改善` : `+${diffScore} 悪化`;
  const diffColor = diffScore < 0 ? "#22c55e" : "#ef4444";

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="bg-primary text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Lonely Index Dashboard</h1>
          <p className="text-sm opacity-70">株式会社サンプル</p>
        </div>
        <div className="text-right">
          <p className="text-sm opacity-70">2026年4月</p>
          <p className="text-xs opacity-50">最終更新: 16日 09:00</p>
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
            value={`${orgSummary.highRisk}名`}
            sub={`全${orgSummary.totalEmployees}名中`}
            color="#ef4444"
          />
          <StatCard
            label="注意域"
            value={`${orgSummary.caution}名`}
            sub="スコア50〜69"
            color="#f59e0b"
          />
          <StatCard
            label="正常"
            value={`${orgSummary.normal}名`}
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
                <Bar dataKey="avg" radius={[0, 6, 6, 0]} barSize={24}>
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
              <LineChart data={orgTrend}>
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
                {heatmapData.map((row) => (
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
          <h2 className="text-sm font-semibold text-zinc-500 mb-4">
            直近のアラート
          </h2>
          <div className="space-y-3">
            {[
              {
                id: "EMP-0847",
                dept: "CS部",
                score: 82,
                change: "+15",
                reason: "外出ゼロ7日・通話頻度90%低下",
                time: "2時間前",
                level: "high",
              },
              {
                id: "EMP-0312",
                dept: "開発部",
                score: 74,
                change: "+8",
                reason: "深夜スマホ3h超・移動範囲が自宅のみ",
                time: "5時間前",
                level: "high",
              },
              {
                id: "EMP-0156",
                dept: "営業部",
                score: 68,
                change: "+12",
                reason: "通話相手多様性が低下・SNS滞在4h超",
                time: "1日前",
                level: "caution",
              },
            ].map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-4 border border-zinc-100 rounded-xl px-4 py-3"
              >
                <div
                  className={`mt-1 w-3 h-3 rounded-full shrink-0 ${
                    alert.level === "high" ? "bg-red-500" : "bg-yellow-400"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-zinc-800">
                      {alert.id}
                    </span>
                    <span className="text-xs text-zinc-400">{alert.dept}</span>
                    <span className="text-xs text-zinc-300 ml-auto">
                      {alert.time}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500">{alert.reason}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-lg font-bold text-red-500">
                    {alert.score}
                  </span>
                  <p className="text-xs text-red-400">{alert.change}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
