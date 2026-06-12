import { DashboardSidebar } from "@/components/layout/DashboardSidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-canvas">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
