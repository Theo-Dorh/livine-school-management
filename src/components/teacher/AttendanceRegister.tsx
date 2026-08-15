import React, { useState } from 'react';
import { Teacher, ClassRoom, Student } from '../../types';
import { StatusBadge } from '../common/Badge';
import {
  CalendarCheck,
  CheckCircle2,
  Users,
  Calendar,
  Save,
  Clock,
  Sparkles
} from 'lucide-react';

interface AttendanceRegisterProps {
  teacher: Teacher;
  classes: ClassRoom[];
  students: Student[];
}

export const AttendanceRegister: React.FC<AttendanceRegisterProps> = ({
  teacher,
  classes,
  students
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>('cls-jhs-2');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [session, setSession] = useState<'Morning Roll Call' | 'Afternoon Roll Call'>('Morning Roll Call');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const classStudents = students.filter(s => s.classId === selectedClassId);
  const selectedClass = classes.find(c => c.id === selectedClassId);

  // Local attendance map: studentId -> 'Present' | 'Absent' | 'Late' | 'Excused'
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'Present' | 'Absent' | 'Late' | 'Excused'>>({});

  const getStatus = (id: string) => attendanceMap[id] || 'Present';

  const setStatus = (id: string, status: 'Present' | 'Absent' | 'Late' | 'Excused') => {
    setAttendanceMap(prev => ({ ...prev, [id]: status }));
  };

  const handleMarkAllPresent = () => {
    const map: Record<string, any> = {};
    classStudents.forEach(s => {
      map[s.id] = 'Present';
    });
    setAttendanceMap(map);
  };

  const handleSaveAttendance = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Stats
  const presentCount = classStudents.filter(s => getStatus(s.id) === 'Present').length;
  const absentCount = classStudents.filter(s => getStatus(s.id) === 'Absent').length;
  const lateCount = classStudents.filter(s => getStatus(s.id) === 'Late').length;
  const excusedCount = classStudents.filter(s => getStatus(s.id) === 'Excused').length;
  const attendanceRate = classStudents.length > 0 ? Math.round(((presentCount + lateCount) / classStudents.length) * 100) : 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
            Daily Student Attendance Register
          </h2>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
            Mark and track daily student presence, punctuality, and medical excuses for {selectedClass?.name}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleMarkAllPresent}
            className="btn btn-secondary"
          >
            <Sparkles size={16} />
            <span>Mark All Present</span>
          </button>
          <button
            onClick={handleSaveAttendance}
            className="btn btn-gold"
          >
            <Save size={16} />
            <span>Save Attendance Register</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, border: '1px solid #86EFAC' }}>
          <CheckCircle2 size={18} />
          <span>Attendance records successfully committed to Livine International database!</span>
        </div>
      )}

      {/* Control Bar */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <label className="form-label">Select Class *</label>
            <select
              className="form-select"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.level})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Attendance Date *</label>
            <input
              type="date"
              className="form-input"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Session</label>
            <select
              className="form-select"
              value={session}
              onChange={(e) => setSession(e.target.value as any)}
            >
              <option value="Morning Roll Call">Morning Roll Call (08:00 AM)</option>
              <option value="Afternoon Roll Call">Afternoon Roll Call (01:30 PM)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Attendance Summary Strip */}
      <div className="stat-grid">
        <div className="stat-card green">
          <div>
            <div className="stat-label">Present</div>
            <div className="stat-value">{presentCount}</div>
            <div className="stat-trend positive"><span>In classroom</span></div>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#DCFCE7', color: '#15803D' }}>
            <CheckCircle2 size={22} />
          </div>
        </div>

        <div className="stat-card red">
          <div>
            <div className="stat-label">Absent</div>
            <div className="stat-value">{absentCount}</div>
            <div className="stat-trend negative"><span>Unexcused</span></div>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#FEE2E2', color: '#B91C1C' }}>
            <Users size={22} />
          </div>
        </div>

        <div className="stat-card gold">
          <div>
            <div className="stat-label">Late Arrival</div>
            <div className="stat-value">{lateCount}</div>
            <div className="stat-trend warning"><span>Arrived after 08:15 AM</span></div>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#FEF3C7', color: '#B45309' }}>
            <Clock size={22} />
          </div>
        </div>

        <div className="stat-card blue">
          <div>
            <div className="stat-label">Daily Attendance Rate</div>
            <div className="stat-value">{attendanceRate}%</div>
            <div className="stat-trend" style={{ color: 'var(--brand-blue)' }}><span>Of class capacity</span></div>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8' }}>
            <CalendarCheck size={22} />
          </div>
        </div>
      </div>

      {/* Roll Call Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">
              <CalendarCheck size={18} color="var(--brand-primary)" />
              <span>Roll Call: {selectedClass?.name} ({selectedDate})</span>
            </div>
            <div className="card-subtitle">{session} • Form Master: {selectedClass?.formMasterName}</div>
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Full Name</th>
                <th>House</th>
                <th>Term Attendance</th>
                <th>Mark Roll Call Status</th>
              </tr>
            </thead>
            <tbody>
              {classStudents.map((stu) => {
                const currentStatus = getStatus(stu.id);
                return (
                  <tr key={stu.id}>
                    <td style={{ fontWeight: 700, color: 'var(--brand-primary)', fontSize: '0.8rem' }}>
                      {stu.studentId}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{stu.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Parent: {stu.parentPhone}</div>
                    </td>
                    <td>
                      <span className="badge badge-gray">{stu.house} House</span>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      <strong>{stu.attendanceDaysPresent}</strong> / {stu.attendanceDaysTotal} days ({Math.round((stu.attendanceDaysPresent / stu.attendanceDaysTotal) * 100)}%)
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {(['Present', 'Absent', 'Late', 'Excused'] as const).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => setStatus(stu.id, st)}
                            style={{
                              padding: '0.35rem 0.75rem',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.775rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              border: currentStatus === st ? '2px solid transparent' : '1px solid var(--border-medium)',
                              backgroundColor: currentStatus === st 
                                ? (st === 'Present' ? '#15803D' : st === 'Absent' ? '#B91C1C' : st === 'Late' ? '#D97706' : '#2563EB')
                                : '#FFFFFF',
                              color: currentStatus === st ? '#FFFFFF' : 'var(--text-secondary)'
                            }}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
