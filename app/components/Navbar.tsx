'use client'
// Main navigation bar with user info and authentication controls
import { useRouter } from 'next/navigation'
import { Bell, LogOut, User } from 'lucide-react'
import { useAuth } from '@/app/context/AuthContext'
import Link from 'next/link'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    router.push('/auth/login')
  }

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-blue-600">School Management</h1>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-gray-600 hover:text-gray-900">
          <Bell size={24} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 border-l pl-6">
          <div className="text-right">
            <p className="font-semibold text-gray-900">
              {profile?.first_name} {profile?.last_name}
            </p>
            <p className="text-sm text-gray-600 capitalize">{profile?.role}</p>
          </div>
          <Link href="/dashboard/profile">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-blue-600">
              <User size={20} />
            </div>
          </Link>
        </div>

        <button
          onClick={handleLogout}
          className="text-gray-600 hover:text-red-600 transition"
        >
          <LogOut size={24} />
        </button>
      </div>
    </nav>
  )
}
