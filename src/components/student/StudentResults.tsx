import React from 'react';
import { Student, MarkEntry, AcademicTerm } from '../../types';
import {
  Award,
  BookOpen,
  Printer,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';

interface StudentResultsProps {
  student: Student;
  marks: MarkEntry[];
  activeTerm: AcademicTerm;
}

export const StudentResults: React.FC<StudentResultsProps> = ({
  student,
  marks,
  activeTerm
}) => {
  const studentMarks = marks.filter(m => m.studentId === student.id && m.term === activeTerm);
  const totalScoreSum = studentMarks.reduce((sum, m) => sum + m.totalScore, 0);
  const averageScore = studentMarks.length > 0
    ? Math.round((totalScoreSum / studentMarks.length) * 10) / 10
    : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }} className="no-print">
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
            Academic Performance & BECE Stanine Matrix
          </h2>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
            Trimester 2 Continuous Assessment (50%) + Exam Scores (50%) with official descriptors
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="btn btn-primary"
        >
          <Printer size={16} />
          <span>Print Marks Matrix</span>
        </button>
      </div>

      {/* Promotion & Academic Standing Card */}
      <div className="card" style={{ borderLeft: student.promotionDecision === 'Repeated' ? '4px solid #B91C1C' : '4px solid #15803D' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {student.promotionDecision === 'Repeated' ? <RotateCcw size={20} color="#B91C1C" /> : <Award size={20} color="#15803D" />}
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                Academic Placement: {student.promotionDecision || 'Promoted'} ({student.promotedToClassName || student.className})
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {student.promotionRemark || 'Pupil satisfies all prerequisite competencies for standard advancement.'}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>TOTAL MARKS OBTAINED:</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F2537' }}>
              {totalScoreSum} / {studentMarks.length * 100}
            </div>
          </div>
        </div>
      </div>

      {/* Subject Score Breakdown */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Award size={18} color="var(--brand-primary)" />
            <span>Official Subject Scorecard ({activeTerm})</span>
          </div>
          <span className="badge badge-gold">Average: {averageScore}%</span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Discipline / Subject</th>
                <th>SBA Class Tests (30)</th>
                <th>SBA Project & Homework (20)</th>
                <th>Total SBA (50%)</th>
                <th>Exam Score (50%)</th>
                <th>Total (100%)</th>
                <th>BECE Grade</th>
                <th>Performance Level</th>
                <th>Teacher Remark</th>
              </tr>
            </thead>
            <tbody>
              {studentMarks.map((m) => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 800, color: 'var(--brand-primary)' }}>{m.subjectName}</td>
                  <td>{m.sbaTest1 + m.sbaTest2} / 30</td>
                  <td>{m.sbaProject + m.sbaHomework} / 20</td>
                  <td style={{ fontWeight: 700 }}>{m.totalSba}</td>
                  <td style={{ fontWeight: 700 }}>{m.examScore}</td>
                  <td style={{ fontWeight: 800, color: m.totalScore >= 80 ? '#15803D' : '#0F2537' }}>
                    {m.totalScore}%
                  </td>
                  <td>
                    <span className={`badge ${m.beceGrade === 1 ? 'badge-green' : m.beceGrade === 2 ? 'badge-blue' : 'badge-gold'}`}>
                      Grade {m.beceGrade} ({m.gradeRemark})
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem' }}>{m.descriptor}</td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{m.teacherRemarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
