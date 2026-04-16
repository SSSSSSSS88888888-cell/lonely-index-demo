"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";
import {
  userScoreHistory,
  currentScore,
  previousScore,
  factors,
} from "@/lib/mock-data";

function ScoreRing({ score }: { score: number }) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color =
    score >= 70 ? "#ef4444" : score >= 50 ? "#f59e0b" : "#22c55e";
  const label = score >= 70 ? "注意域" : score >= 50 ? "やや注意" : "正常";

  return (
    <div className="relative flex items-center justify-center">
      <svg width="200" height="200" className="-rotate-90">
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="12"
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-5xl font-bold" style={{ color }}>
          {score}
        </span>
        <span className="text-sm text-zinc-400">/100</span>
        <span
          className="mt-1 text-sm font-semibold px-3 py-0.5 rounded-full"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

function SeverityDot({ severity }: { severity: "danger" | "warning" }) {
  const color = severity === "danger" ? "bg-danger" : "bg-warning";
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${color}`} />;
}

export default function UserPage() {
  const diff = currentScore - previousScore;
  const diffSign = diff > 0 ? "+" : "";

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 min-h-screen">
      {/* Phone-like container */}
      <div className="w-full max-w-sm mx-auto bg-white min-h-screen shadow-xl">
        {/* Header */}
        <div className="bg-primary px-5 pt-12 pb-6 text-white rounded-b-3xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold">Lonely Index</h1>
            <span className="text-sm opacity-70">4月16日</span>
          </div>
          <div className="flex justify-center">
            <ScoreRing score={currentScore} />
          </div>
          <div className="flex justify-center mt-3">
            <span className="text-accent font-semibold text-lg">
              {diffSign}{diff} <span className="text-sm opacity-70">先週比</span>
            </span>
          </div>
        </div>

        {/* Trend */}
        <div className="px-5 py-5">
          <h2 className="text-sm font-semibold text-zinc-500 mb-3">
            スコア推移（30日間）
          </h2>
          <div className="bg-zinc-50 rounded-2xl p-3">
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={userScoreHistory}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  width={30}
                />
                <ReferenceLine
                  y={70}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  label={{
                    value: "注意域",
                    position: "right",
                    fontSize: 10,
                    fill: "#ef4444",
                  }}
                />
                <ReferenceLine
                  y={50}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  label={{
                    value: "やや注意",
                    position: "right",
                    fontSize: 10,
                    fill: "#f59e0b",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#f97316"
                  strokeWidth={2.5}
                  fill="url(#scoreGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#f97316" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Factors */}
        <div className="px-5 pb-5">
          <h2 className="text-sm font-semibold text-zinc-500 mb-3">
            主な要因
          </h2>
          <div className="space-y-3">
            {factors.map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-3 bg-zinc-50 rounded-xl px-4 py-3"
              >
                <SeverityDot severity={f.severity} />
                <span className="flex-1 text-sm font-medium text-zinc-700">
                  {f.label}
                </span>
                <span
                  className={`text-sm font-bold ${
                    f.severity === "danger" ? "text-danger" : "text-warning"
                  }`}
                >
                  {f.value > 0 ? "+" : ""}
                  {f.value}
                  {f.unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action button */}
        <div className="px-5 pb-8">
          <button className="w-full bg-primary text-white rounded-2xl py-4 font-semibold text-base transition-transform hover:scale-[1.02] active:scale-[0.98]">
            改善アクションを見る
          </button>
        </div>
      </div>
    </div>
  );
}
