'use client';
// Custom hook to determine user role and access permissions

import { useAuth } from '@/app/context/AuthContext'

export function useRole() {
  const { userRole } = useAuth()
  
  const role = userRole as string | null
  const isStudent = role === 'student'
  const isTeacher = role === 'teacher'
  const isAdmin = role === 'admin'

  return {
    role,
    isStudent,
    isTeacher,
    isAdmin,
  }
}
