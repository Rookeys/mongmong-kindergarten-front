import MainTabBar from "@/components/MainTabBar"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex flex-1 flex-col">{children}</div>
      <MainTabBar />
    </div>
  )
}
