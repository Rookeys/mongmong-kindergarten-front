export const formatCardDate = (iso: string) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(new Date(iso)).replaceAll("-", ".")

export function LevelBadge({ level }: { level: number }) {
  return (
    <span className="text-caption-md text-text-brand rounded-full bg-[rgb(41_5_255/0.1)] px-2 py-0.5">Lv.{level}</span>
  )
}
