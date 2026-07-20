'use client'
// Main dashboard layout wrapper with navigation and sidebar for all dashboard pages

import { useAuth } from '@/app/context/AuthContext'
import Navbar from '@/app/components/Navbar'
import Sidebar from '@/app/components/Sidebar'
import LoadingSpinner from '@/app/components/LoadingSpinner'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { loading, profile } = useAuth()

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
