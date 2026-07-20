// Define user roles in the system
export type UserRole = 'student' | 'teacher' | 'admin'

// User profile interface with all user details
export interface Profile {
  id: string
  email: string
  first_name: string
  last_name: string
  role: UserRole
  phone: string | null
  address: string | null
  date_of_birth: string | null
  profile_picture_url: string | null
  created_at: string
  updated_at: string
}

export interface Class {
  id: string
  name: string
  section: string | null
  grade_level: number | null
  capacity: number | null
  teacher_id: string | null
  created_at: string
  updated_at: string
}

export interface Student {
  id: string
  admission_number: string | null
  roll_number: string | null
  parent_email: string | null
  parent_phone: string | null
  emergency_contact: string | null
  created_at: string
  updated_at: string
}

export interface StudentClass {
  id: string
  student_id: string
  class_id: string
  enrollment_date: string
  created_at: string
}

export interface Attendance {
  id: string
  student_id: string
  class_id: string
  date: string
  status: 'present' | 'absent' | 'late' | 'excused'
  remarks: string | null
  marked_by: string | null
  created_at: string
  updated_at: string
}

export interface Assignment {
  id: string
  class_id: string
  title: string
  description: string | null
  due_date: string
  created_by: string
  file_url: string | null
  created_at: string
  updated_at: string
}

export interface Grade {
  id: string
  student_id: string
  class_id: string
  subject: string
  term: string
  marks_obtained: number | null
  total_marks: number
  grade: string | null
  comments: string | null
  entered_by: string | null
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'alert' | 'info' | 'success' | 'warning'
  read: boolean
  related_entity_type: string | null
  related_entity_id: string | null
  created_at: string
}

export interface Timetable {
  id: string
  class_id: string
  day_of_week: string
  start_time: string
  end_time: string
  subject: string
  teacher_id: string | null
  created_at: string
  updated_at: string
}
