'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/hooks/useAuth';

export default function StudentAttendance() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!user) return;
      try {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        console.log('Auth User ID:', authUser?.id);

        if (!authUser) return;

        const { data, error } = await supabase
          .from('attendance')
          .select('*, classes(name, subject, section)')
          .eq('student_id', authUser.id)
          .order('date', { ascending: false });

        if (error) {
          console.error('Supabase error:', JSON.stringify(error));
          throw error;
        }

        console.log('Attendance data:', data);
        setAttendance(data || []);

        const uniqueSubjects = Array.from(
          new Map(
            (data || [])
              .filter(a => a.classes)
              .map(a => [a.class_id, a.classes])
          ).entries()
        ).map(([id, cls]) => ({ id, ...cls }));

        setSubjects(uniqueSubjects);
      } catch (error) {
        console.error('Error fetching attendance:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [user]);

  if (loading) return <LoadingSpinner />;

  const filteredAttendance = selectedSubject === 'all'
    ? attendance
    : attendance.filter(a => a.class_id === selectedSubject);

  const stats = {
    present: filteredAttendance.filter(a => a.status === 'present').length,
    absent: filteredAttendance.filter(a => a.status === 'absent').length,
    late: filteredAttendance.filter(a => a.status === 'late').length,
    excused: filteredAttendance.filter(a => a.status === 'excused').length,
  };

  const total = filteredAttendance.length;
  const percentage = total > 0 ? Math.round((stats.present / total) * 100) : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'excused': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600 mt-1">Subject wise attendance record</p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedSubject === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'
            }`}
          >
            All Subjects
          </button>
          {subjects.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubject(sub.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedSubject === sub.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'
              }`}
            >
              {sub.subject || sub.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Attendance %</p>
            <p className={`text-2xl font-bold ${percentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
              {percentage}%
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Present</p>
            <p className="text-2xl font-bold text-green-600">{stats.present}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Absent</p>
            <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Late</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Excused</p>
            <p className="text-2xl font-bold text-blue-600">{stats.excused}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Subject</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.length > 0 ? (
                  filteredAttendance.map((record) => (
                    <tr key={record.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(record.date).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {record.classes?.subject || record.classes?.name || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                      Koi attendance record nahi mila
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}