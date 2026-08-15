import React from 'react';
import { Teacher, ClassRoom, Subject, CourseMaterial, AcademicTerm } from '../../types';
import {
  FileSpreadsheet,
  BookOpen,
  CalendarCheck,
  MessageSquareWarning,
  GraduationCap,
  Sparkles,
  Clock,
  ArrowRight,
  School,
  CheckCircle2,
  Users,
  PenTool
} from 'lucide-react';

interface TeacherDashboardProps {
  teacher: Teacher;
  classes: ClassRoom[];
  subjects: Subject[];
  courseMaterials: CourseMaterial[];
  activeTerm: AcademicTerm;
  onNavigateTab: (tab: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  teacher,
  classes,
  subjects,
  courseMaterials,
  activeTerm,
  onNavigateTab
}) => {
  const assignedClassesList = classes.filter(c => teacher.assignedClasses.includes(c.id));
  const assignedSubjectsList = subjects.filter(s => teacher.assignedSubjects.includes(s.id));
  const myMaterials = courseMaterials.filter(c => c.teacherId === teacher.id && c.term === activeTerm);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Teacher Profile Banner (Modern Dribbble Aesthetic) */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, #0F2537 0%, #17324B 60%, #1E3E5F 100%)', 
          borderRadius: 'var(--radius-xl)', 
          padding: '2rem 2.25rem', 
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-lg)',
          flexWrap: 'wrap',
          gap: '1.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', position: 'relative', zIndex: 1 }}>
          <div 
            style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '16px', 
              background: 'linear-gradient(135deg, #C88719 0%, #A16807 100%)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#FFF',
              fontWeight: 900,
              fontSize: '1.6rem',
              boxShadow: '0 4px 14px rgba(200, 135, 25, 0.4)',
              border: '2px solid rgba(255, 255, 255, 0.4)'
            }}
          >
            {teacher.fullName.split(' ').map(n => n[0]).slice(0, 2).join('')}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span 
                style={{ 
                  background: 'rgba(200, 135, 25, 0.22)', 
                  color: '#FDE68A', 
                  border: '1px solid rgba(200, 135, 25, 0.45)', 
                  padding: '0.2rem 0.65rem', 
                  borderRadius: 'var(--radius-full)', 
                  fontSize: '0.7rem', 
                  fontWeight: 800, 
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase' 
                }}
              >
                Educator Faculty Portal
              </span>
              <span style={{ fontSize: '0.775rem', color: 'rgba(255, 255, 255, 0.75)' }}>
                Staff ID: {teacher.staffId}
              </span>
            </div>
            <h2 style={{ fontSize: '1.65rem', color: '#FFFFFF', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>
              {teacher.fullName}
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              {teacher.roleTitle} • {teacher.qualification}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          <button 
            onClick={() => onNavigateTab('marks')}
            className="btn btn-gold"
            style={{ borderRadius: 'var(--radius-full)', padding: '0.65rem 1.25rem' }}
          >
            <PenTool size={16} />
            <span>Enter NaCCA Marks</span>
          </button>
          <button 
            onClick={() => onNavigateTab('content')}
            className="btn btn-secondary"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.12)', 
              color: '#FFF', 
              borderColor: 'rgba(255, 255, 255, 0.25)',
              borderRadius: 'var(--radius-full)',
              padding: '0.65rem 1.25rem'
            }}
          >
            <BookOpen size={16} />
            <span>Upload Lesson Plan (SOL)</span>
          </button>
        </div>
      </div>

      {/* Quick Access Tiles */}
      <div className="stat-grid">
        <div 
          className="stat-card gold" 
          style={{ cursor: 'pointer' }}
          onClick={() => onNavigateTab('marks')}
        >
          <div>
            <div className="stat-label">NaCCA SBA & Exams</div>
            <div className="stat-value" style={{ fontSize: '1.4rem' }}>Marks Entry</div>
            <div className="stat-trend warning">
              <span>Continuous Assessment + Exam Marks</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#FEF3C7', color: '#B45309' }}>
            <PenTool size={22} />
          </div>
        </div>

        <div 
          className="stat-card blue"
          style={{ cursor: 'pointer' }}
          onClick={() => onNavigateTab('content')}
        >
          <div>
            <div className="stat-label">Trimester Course Content</div>
            <div className="stat-value" style={{ fontSize: '1.4rem' }}>{myMaterials.length} Uploaded</div>
            <div className="stat-trend" style={{ color: 'var(--brand-blue)' }}>
              <span>Strands, Sub-strands & Homework</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8' }}>
            <BookOpen size={22} />
          </div>
        </div>

        <div 
          className="stat-card green"
          style={{ cursor: 'pointer' }}
          onClick={() => onNavigateTab('attendance')}
        >
          <div>
            <div className="stat-label">Daily Attendance</div>
            <div className="stat-value" style={{ fontSize: '1.4rem' }}>Roll Call</div>
            <div className="stat-trend positive">
              <span>Morning & Afternoon Class Register</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#ECFDF5', color: '#10B981' }}>
            <CalendarCheck size={22} />
          </div>
        </div>

        <div 
          className="stat-card red"
          style={{ cursor: 'pointer' }}
          onClick={() => onNavigateTab('complaint')}
        >
          <div>
            <div className="stat-label">Staff Grievances</div>
            <div className="stat-value" style={{ fontSize: '1.4rem' }}>Whistleblower</div>
            <div className="stat-trend negative">
              <span>Identity-Protected Management Box</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#FEF2F2', color: '#EF4444' }}>
            <MessageSquareWarning size={22} />
          </div>
        </div>
      </div>

      {/* Assigned Classes & Schedule */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <School size={18} color="var(--brand-primary)" />
              <span>My Assigned Classes</span>
            </div>
            <span className="badge badge-gold">{assignedClassesList.length} Classes</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {assignedClassesList.map((cls) => (
              <div 
                key={cls.id}
                style={{ 
                  backgroundColor: 'var(--bg-subtle)', 
                  padding: '1rem', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0F2537' }}>{cls.name}</div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-tertiary)' }}>
                    Stage: {cls.level} • Room: {cls.roomNumber}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button 
                    onClick={() => onNavigateTab('marks')}
                    className="btn btn-secondary btn-sm"
                  >
                    <span>Marks</span>
                  </button>
                  <button 
                    onClick={() => onNavigateTab('attendance')}
                    className="btn btn-primary btn-sm"
                  >
                    <span>Roll Call</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <BookOpen size={18} color="var(--brand-primary)" />
              <span>Teaching Disciplines (NaCCA)</span>
            </div>
            <span className="badge badge-gold">{assignedSubjectsList.length} Subjects</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {assignedSubjectsList.map((sub) => (
              <div 
                key={sub.id}
                style={{ 
                  backgroundColor: 'var(--bg-subtle)', 
                  padding: '1rem', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0F2537' }}>{sub.name}</div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-tertiary)' }}>
                    Code: {sub.code} • Category: {sub.category}
                  </div>
                </div>

                <button 
                  onClick={() => onNavigateTab('content')}
                  className="btn btn-secondary btn-sm"
                >
                  <span>Upload SOL</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
