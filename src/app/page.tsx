import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">Lonely Index</h1>
        <p className="text-lg text-zinc-500">
          スマホが孤独を数値化し、手遅れになる前に社会が動く
        </p>
      </div>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link
          href="/user"
          className="flex h-14 items-center justify-center rounded-2xl bg-primary text-white text-lg font-semibold transition-transform hover:scale-105"
        >
          ユーザー画面
        </Link>
        <Link
          href="/dashboard"
          className="flex h-14 items-center justify-center rounded-2xl border-2 border-primary text-primary text-lg font-semibold transition-transform hover:scale-105"
        >
          企業ダッシュボード
        </Link>
      </div>
    </div>
  );
}
