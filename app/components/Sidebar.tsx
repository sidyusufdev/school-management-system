'use client'
// Navigation sidebar with role-based menu items for different user types

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRole } from '@/app/hooks/useRole'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart3,
  Clock,
  FileText,
  Settings,
} from 'lucide-react'

interface MenuItem {
  label: string
  href: string
  icon: React.ReactNode
}

export default function Sidebar() {
  const pathname = usePathname()
  const { userRole, isStudent, isTeacher, isAdmin } = useRole()

  const getMenuItems = (): MenuItem[] => {
    if (isStudent) {
      return [
        { label: 'Dashboard', href: '/dashboard/student', icon: <LayoutDashboard size={20} /> },
        { label: 'Profile', href: '/dashboard/student/profile', icon: <Users size={20} /> },
        { label: 'Attendance', href: '/dashboard/student/attendance', icon: <Clock size={20} /> },
        { label: 'Assignments', href: '/dashboard/student/assignments', icon: <FileText size={20} /> },
        { label: 'Grades', href: '/dashboard/student/grades', icon: <BarChart3 size={20} /> },
        { label: 'Timetable', href: '/dashboard/student/timetable', icon: <BookOpen size={20} /> },
      ]
    }

    if (isTeacher) {
      return [
        { label: 'Dashboard', href: '/dashboard/teacher', icon: <LayoutDashboard size={20} /> },
        { label: 'Profile', href: '/dashboard/teacher/profile', icon: <Users size={20} /> },
        { label: 'Manage Students', href: '/dashboard/teacher/students', icon: <Users size={20} /> },
        { label: 'Attendance', href: '/dashboard/teacher/attendance', icon: <Clock size={20} /> },
        { label: 'Assignments', href: '/dashboard/teacher/assignments', icon: <FileText size={20} /> },
        { label: 'Grades', href: '/dashboard/teacher/grades', icon: <BarChart3 size={20} /> },
        { label: 'Reports', href: '/dashboard/teacher/reports', icon: <BarChart3 size={20} /> },
      ]
    }

    if (isAdmin) {
      return [
        { label: 'Dashboard', href: '/dashboard/admin', icon: <LayoutDashboard size={20} /> },
        { label: 'Manage Users', href: '/dashboard/admin/users', icon: <Users size={20} /> },
        { label: 'Manage Classes', href: '/dashboard/admin/classes', icon: <BookOpen size={20} /> },
        { label: 'Reports', href: '/dashboard/admin/reports', icon: <BarChart3 size={20} /> },
        { label: 'Settings', href: '/dashboard/admin/settings', icon: <Settings size={20} /> },
      ]
    }

    return []
  }

  const menuItems = getMenuItems()
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <aside className="w-64 bg-gray-900 text-white shadow-lg">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold capitalize">{userRole} Portal</h2>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive(item.href)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
