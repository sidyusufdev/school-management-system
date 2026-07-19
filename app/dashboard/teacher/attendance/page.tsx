'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/hooks/useAuth';

export default function TeacherAttendance() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const today = new Date().toLocaleDateString('en-IN', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  useEffect(() => {
    const fetchClasses = async () => {
      if (!user) return;
      try {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) return;

        const { data: classesData } = await supabase
          .from('classes')
          .select('*')
          .eq('teacher_id', authUser.id)
          .order('subject');

        setClasses(classesData || []);
        if (classesData && classesData.length > 0) {
          setSelectedClass(classesData[0].id);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [user]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass) return;
      try {
        const supabase = createClient();
        const { data: enrollmentsData } = await supabase
          .from('students_classes')
          .select('student_id')
          .eq('class_id', selectedClass);

        const studentIds = enrollmentsData?.map((e) => e.student_id) || [];
        if (studentIds.length === 0) {
          setStudents([]);
          return;
        }

        const { data: profilesData } = await supabase
          .from('profiles')
          .select('*')
          .in('id', studentIds)
          .order('first_name');

        setStudents(profilesData || []);
        setAttendance({});
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchStudents();
  }, [selectedClass]);

  const handleAttendanceChange = (studentId: string, status: string) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const markAll = (status: string) => {
    const allMarked: Record<string, string> = {};
    students.forEach((s) => { allMarked[s.id] = status; });
    setAttendance(allMarked);
  };

  const handleSubmit = async () => {
    if (Object.keys(attendance).length === 0) {
      alert('Pehle attendance mark karo!');
      return;
    }
    setSubmitting(true);
    try {
      const supabase = createClient();
      const todayDate = new Date().toISOString().split('T')[0];

      const attendanceRecords = Object.entries(attendance).map(([studentId, status]) => ({
        student_id: studentId,
        class_id: selectedClass,
        date: todayDate,
        status,
      }));

      const { error } = await supabase
        .from('attendance')
        .upsert(attendanceRecords, { 
          onConflict: 'student_id,class_id,date' 
        });

      if (error) throw error;
      alert('Attendance successfully mark ho gayi!');
      setAttendance({});
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Error aaya — dobara try karo');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedSubject = classes.find(c => c.id === selectedClass);
  const markedCount = Object.keys(attendance).length;

  if (loading) return <LoadingSpinner />;

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mark Attendance</h1>
          <p className="text-gray-600 mt-1">{today}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {/* Subject Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject Select Karo
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {classes.map((cls) => (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClass(cls.id)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition ${
                    selectedClass === cls.id
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-200 hover:border-blue-300 text-gray-700'
                  }`}
                >
                  {cls.subject || cls.name}
                </button>
              ))}
            </div>
          </div>

          {selectedSubject && (
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {selectedSubject.subject || selectedSubject.name} — Section {selectedSubject.section}
              </h2>
              <span className="text-sm text-gray-500">
                {markedCount}/{students.length} marked
              </span>
            </div>
          )}

          {students.length > 0 ? (
            <>
              {/* Mark All Buttons */}
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => markAll('present')}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200"
                >
                  ✅ Sab Present
                </button>
                <button
                  onClick={() => markAll('absent')}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200"
                >
                  ❌ Sab Absent
                </button>
              </div>

              <div className="overflow-x-auto mb-6">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">#</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Student Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr key={student.id} className={`border-t border-gray-200 ${
                        attendance[student.id] === 'present' ? 'bg-green-50' :
                        attendance[student.id] === 'absent' ? 'bg-red-50' :
                        attendance[student.id] === 'late' ? 'bg-yellow-50' : ''
                      }`}>
                        <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {student.first_name} {student.last_name}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <select
                            value={attendance[student.id] || ''}
                            onChange={(e) => handleAttendanceChange(student.id, e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">-- Select --</option>
                            <option value="present">✅ Present</option>
                            <option value="absent">❌ Absent</option>
                            <option value="late">⏰ Late</option>
                            <option value="excused">📝 Excused</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting || markedCount === 0}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Saving...' : `Submit Attendance (${markedCount}/${students.length})`}
              </button>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Is subject mein koi student nahi hai
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}