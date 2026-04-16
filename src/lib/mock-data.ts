// ユーザー個人のスコア推移（過去30日）ベースライン
export const userScoreHistoryBase = [
  { date: "3/18", score: 35 },
  { date: "3/20", score: 38 },
  { date: "3/22", score: 32 },
  { date: "3/24", score: 40 },
  { date: "3/26", score: 42 },
  { date: "3/28", score: 45 },
  { date: "3/30", score: 48 },
  { date: "4/1", score: 44 },
  { date: "4/3", score: 50 },
  { date: "4/5", score: 55 },
  { date: "4/7", score: 58 },
  { date: "4/9", score: 60 },
  { date: "4/11", score: 65 },
  { date: "4/13", score: 68 },
  { date: "4/15", score: 72 },
];

export const baseScore = 72;
export const previousScore = 60;

export const factorsBase = [
  { label: "外出頻度", value: -40, unit: "%", severity: "danger" as const },
  { label: "通話ゼロ継続", value: 5, unit: "日", severity: "danger" as const },
  { label: "深夜スマホ", value: 2.3, unit: "h増", severity: "warning" as const },
  { label: "SNS滞在時間", value: 1.5, unit: "h増", severity: "warning" as const },
  { label: "歩数", value: -55, unit: "%", severity: "danger" as const },
];

// 企業ダッシュボード用ベースライン
export const departmentsBase = [
  { name: "営業部", avg: 38, high: 3, caution: 5, normal: 22, total: 30 },
  { name: "開発部", avg: 45, high: 2, caution: 8, normal: 30, total: 40 },
  { name: "マーケ部", avg: 33, high: 0, caution: 3, normal: 12, total: 15 },
  { name: "人事部", avg: 29, high: 0, caution: 1, normal: 9, total: 10 },
  { name: "経理部", avg: 42, high: 1, caution: 4, normal: 7, total: 12 },
  { name: "カスタマーサポート", avg: 52, high: 4, caution: 7, normal: 14, total: 25 },
];

export const orgTrendBase = [
  { month: "10月", score: 36 },
  { month: "11月", score: 35 },
  { month: "12月", score: 40 },
  { month: "1月", score: 42 },
  { month: "2月", score: 39 },
  { month: "3月", score: 38 },
];

export const orgSummaryBase = {
  totalEmployees: 132,
  avgScore: 41,
  highRisk: 10,
  caution: 28,
  normal: 94,
  prevMonthAvg: 43,
};

// ヒートマップ用（部署×週）
export const heatmapDataBase = [
  { dept: "営業部", w1: 35, w2: 37, w3: 40, w4: 38 },
  { dept: "開発部", w1: 42, w2: 44, w3: 48, w4: 45 },
  { dept: "マーケ部", w1: 30, w2: 32, w3: 35, w4: 33 },
  { dept: "人事部", w1: 28, w2: 27, w3: 30, w4: 29 },
  { dept: "経理部", w1: 40, w2: 43, w3: 45, w4: 42 },
  { dept: "CS部", w1: 48, w2: 50, w3: 55, w4: 52 },
];

// アラートテンプレート
export const alertTemplates = [
  { id: "EMP-0847", dept: "CS部", baseScore: 82, reason: "外出ゼロ7日・通話頻度90%低下", level: "high" as const },
  { id: "EMP-0312", dept: "開発部", baseScore: 74, reason: "深夜スマホ3h超・移動範囲が自宅のみ", level: "high" as const },
  { id: "EMP-0156", dept: "営業部", baseScore: 68, reason: "通話相手多様性が低下・SNS滞在4h超", level: "caution" as const },
  { id: "EMP-0923", dept: "経理部", baseScore: 71, reason: "休日外出ゼロ3週連続・歩数80%減", level: "high" as const },
  { id: "EMP-0411", dept: "開発部", baseScore: 66, reason: "チャット返信遅延増加・会議カメラOFF率上昇", level: "caution" as const },
  { id: "EMP-0588", dept: "CS部", baseScore: 77, reason: "通話ゼロ10日・アプリ使用パターンが深夜偏重", level: "high" as const },
  { id: "EMP-0204", dept: "営業部", baseScore: 63, reason: "移動範囲が縮小・ランチ時間帯の孤食パターン検知", level: "caution" as const },
  { id: "EMP-0731", dept: "マーケ部", baseScore: 70, reason: "SNS閲覧急増・対人通話が週1回未満に低下", level: "high" as const },
];

// ユーティリティ: ランダム変動を加える
export function jitter(base: number, range: number): number {
  return Math.round(Math.max(0, Math.min(100, base + (Math.random() - 0.5) * 2 * range)));
}

export function timeAgo(minutesAgo: number): string {
  if (minutesAgo < 60) return `${minutesAgo}分前`;
  if (minutesAgo < 1440) return `${Math.floor(minutesAgo / 60)}時間前`;
  return `${Math.floor(minutesAgo / 1440)}日前`;
}
