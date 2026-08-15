import React from 'react';
import { Student, MarkEntry, CourseMaterial, AcademicTerm } from '../../types';
import {
  GraduationCap,
  BookOpen,
  Award,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  TrendingUp,
  RotateCcw,
  Clock,
  ShieldCheck
} from 'lucide-react';

interface StudentDashboardProps {
  student: Student;
  marks: MarkEntry[];
  courseMaterials: CourseMaterial[];
  activeTerm: AcademicTerm;
  onNavigate: (tab: 'results' | 'materials' | 'complaint') => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  marks,
  courseMaterials,
  activeTerm,
  onNavigate
}) => {
  const studentMarks = marks.filter(m => m.studentId === student.id && m.term === activeTerm);
  const totalScoreSum = studentMarks.reduce((sum, m) => sum + m.totalScore, 0);
  const averageScore = studentMarks.length > 0
    ? Math.round((totalScoreSum / studentMarks.length) * 10) / 10
    : 85.5;

  const totalGrade1s = studentMarks.filter(m => m.beceGrade === 1).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Promotion / Repetition Notification Banner */}
      <div
        style={{
          backgroundColor: student.promotionDecision === 'Repeated' ? '#FEF2F2' : '#F0FDF4',
          border: student.promotionDecision === 'Repeated' ? '2px solid #F87171' : '2px solid #86EFAC',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: student.promotionDecision === 'Repeated' ? '#FEE2E2' : '#DCFCE7',
              color: student.promotionDecision === 'Repeated' ? '#B91C1C' : '#15803D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {student.promotionDecision === 'Repeated' ? <RotateCcw size={26} /> : <Award size={26} />}
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: student.promotionDecision === 'Repeated' ? '#991B1B' : '#166534', textTransform: 'uppercase' }}>
              Official Academic Year Advancement Decision
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: student.promotionDecision === 'Repeated' ? '#B91C1C' : '#15803D' }}>
              {student.promotionDecision === 'Promoted'
                ? `🎉 Congratulations! Promoted to ${student.promotedToClassName || 'Next Class'}`
                : student.promotionDecision === 'Repeated'
                ? `Academic Placement: Retained in ${student.className} for Remedial Support`
                : 'Trimester Assessment Under Review'}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.2rem' }}>
              {student.promotionRemark || 'Your continuous assessment and exam performance qualify you for academic advancement.'}
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate('results')}
          className="btn btn-primary"
        >
          <FileText size={16} />
          <span>View Detailed Scores & Grades</span>
        </button>
      </div>

      {/* Student Profile Card */}
      <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #0F2537 0%, #1E3A8A 100%)', color: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--brand-gold)', fontWeight: 800, textTransform: 'uppercase' }}>
              Student Portal • {student.className}
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, marginTop: '0.2rem' }}>
              Welcome back, {student.fullName}!
            </h1>
            <p style={{ opacity: 0.85, fontSize: '0.85rem', marginTop: '0.3rem' }}>
              Student ID: <strong>{student.studentId}</strong> • House: <strong>{student.house}</strong> • {activeTerm} ({studentMarks.length} Subjects Graded)
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span className="badge badge-gold" style={{ padding: '0.4rem 0.8rem' }}>
              Attendance: {student.attendanceDaysPresent}/{student.attendanceDaysTotal} Days
            </span>
          </div>
        </div>
      </div>

      {/* Academic Stats Grid */}
      <div className="stat-grid">
        <div className="stat-card gold">
          <div className="stat-label">Trimester Average Score</div>
          <div className="stat-value">{averageScore}%</div>
          <div className="stat-trend positive">
            <span>Overall Stanine Grade 1</span>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-label">Grade 1 (80-100%) Subjects</div>
          <div className="stat-value">{totalGrade1s} Subjects</div>
          <div className="stat-trend positive">
            <span>Exceeding NaCCA Standards</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Marks Sum</div>
          <div className="stat-value">{totalScoreSum}</div>
          <div className="stat-trend">
            <span>Out of {studentMarks.length * 100} Total</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Class Standing</div>
          <div className="stat-value">2nd</div>
          <div className="stat-trend positive">
            <span>Out of 33 Students</span>
          </div>
        </div>
      </div>

      {/* Quick Access to Homework & Weekly Lesson Notes */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <BookOpen size={18} color="var(--brand-primary)" />
            <span>Active Trimester Lesson Notes & Homework Tasks</span>
          </div>
          <button onClick={() => onNavigate('materials')} className="btn btn-secondary btn-sm">
            <span>View All ({courseMaterials.length})</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {courseMaterials.map((c) => (
            <div
              key={c.id}
              style={{
                backgroundColor: 'var(--bg-subtle)',
                padding: '1.15rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span className="badge badge-blue">Week {c.weekNumber}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-primary)' }}>{c.subjectName}</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F2537', marginBottom: '0.35rem' }}>
                  {c.topicTitle}
                </div>
                <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {c.strand} • {c.subStrand}
                </p>
              </div>

              {c.homeworkTask && (
                <div style={{ marginTop: '0.75rem', backgroundColor: '#FEF3C7', padding: '0.6rem 0.8rem', borderRadius: '4px', border: '1px solid #FDE68A', fontSize: '0.75rem', color: '#92400E' }}>
                  <strong>Homework:</strong> {c.homeworkTask.title} (Due: {c.homeworkTask.dueDate})
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
