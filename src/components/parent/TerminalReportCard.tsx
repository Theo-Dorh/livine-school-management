import React from 'react';
import { Student, MarkEntry, AcademicTerm } from '../../types';
import { SCHOOL_INFO } from '../../data/mockData';
import {
  Printer,
  FileSpreadsheet,
  School
} from 'lucide-react';

interface TerminalReportCardProps {
  student: Student;
  marks: MarkEntry[];
  activeTerm: AcademicTerm;
}

export const TerminalReportCard: React.FC<TerminalReportCardProps> = ({
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }} className="no-print">
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
            Official Ghanaian Basic School Terminal Report
          </h2>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
            NaCCA & GES Continuous Assessment (50%) + Trimester Examination (50%) Standard Form
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="btn btn-primary"
        >
          <Printer size={16} />
          <span>Print / Export PDF Report Card</span>
        </button>
      </div>

      {/* Printable Report Card Container */}
      <div className="printable-area" style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '2px solid #0F2537' }}>
        {/* School Header */}
        <div style={{ textAlign: 'center', borderBottom: '3px double #0F2537', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <School size={32} color="#0F2537" />
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F2537', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {SCHOOL_INFO.name}
            </h1>
          </div>
          <div style={{ fontStyle: 'italic', fontWeight: 700, color: '#C88719', fontSize: '0.9rem' }}>
            "{SCHOOL_INFO.motto}"
          </div>
          <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.2rem' }}>
            {SCHOOL_INFO.address} • Digital Address: {SCHOOL_INFO.digitalAddress} • Tel: {SCHOOL_INFO.phone}
          </div>
          <div style={{ display: 'inline-block', backgroundColor: '#0F2537', color: '#FFFFFF', padding: '0.25rem 1.25rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 800, marginTop: '0.6rem', letterSpacing: '0.5px' }}>
            TERMINAL ASSESSMENT REPORT — {activeTerm.toUpperCase()} ({SCHOOL_INFO.academicYear})
          </div>
        </div>

        {/* Student Biodata */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', backgroundColor: '#F8FAFC', padding: '0.85rem 1rem', borderRadius: '4px', border: '1px solid #CBD5E1', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
          <div><strong>Student Name:</strong> {student.fullName}</div>
          <div><strong>Student ID:</strong> {student.studentId}</div>
          <div><strong>Class / Stage:</strong> {student.className}</div>
          <div><strong>Gender:</strong> {student.gender}</div>
          <div><strong>House:</strong> {student.house} House</div>
          <div><strong>Attendance:</strong> {student.attendanceDaysPresent} / {student.attendanceDaysTotal} Days</div>
        </div>

        {/* Marks Table */}
        <table className="custom-table" style={{ border: '1px solid #0F2537', marginBottom: '1.25rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#0F2537', color: '#FFFFFF' }}>
              <th style={{ color: '#FFFFFF' }}>SUBJECT</th>
              <th style={{ color: '#FFFFFF' }}>CLASS SBA (50%)</th>
              <th style={{ color: '#FFFFFF' }}>EXAM (50%)</th>
              <th style={{ color: '#FFFFFF' }}>TOTAL (100%)</th>
              <th style={{ color: '#FFFFFF' }}>GRADE (1-9)</th>
              <th style={{ color: '#FFFFFF' }}>POSITION</th>
              <th style={{ color: '#FFFFFF' }}>PERFORMANCE DESCRIPTORS</th>
              <th style={{ color: '#FFFFFF' }}>TEACHER REMARKS</th>
            </tr>
          </thead>
          <tbody>
            {studentMarks.map((m) => (
              <tr key={m.id}>
                <td style={{ fontWeight: 800, color: '#0F2537' }}>{m.subjectName}</td>
                <td>{m.totalSba}</td>
                <td>{m.examScore}</td>
                <td style={{ fontWeight: 800 }}>{m.totalScore}</td>
                <td style={{ fontWeight: 800, color: m.beceGrade === 1 ? '#15803D' : '#0F2537' }}>
                  {m.beceGrade} ({m.gradeRemark})
                </td>
                <td>{m.subjectPosition || '1st'}</td>
                <td style={{ fontSize: '0.75rem' }}>{m.descriptor}</td>
                <td style={{ fontSize: '0.75rem' }}>{m.teacherRemarks}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Terminal Summary & Academic Placement */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
          <div style={{ border: '1px solid #CBD5E1', padding: '0.75rem', borderRadius: '4px' }}>
            <div><strong>Total Marks Obtained:</strong> {totalScoreSum} / {studentMarks.length * 100}</div>
            <div><strong>Trimester Average Score:</strong> {averageScore}%</div>
            <div><strong>Overall Class Position:</strong> 2nd out of 34 pupils</div>
            <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed #CBD5E1' }}>
              <strong>Academic Placement Decision:</strong>{' '}
              <span style={{ fontWeight: 800, color: student.promotionDecision === 'Repeated' ? '#B91C1C' : '#15803D' }}>
                {student.promotionDecision || 'Promoted'} ({student.promotedToClassName || student.className})
              </span>
            </div>
          </div>

          <div style={{ border: '1px solid #CBD5E1', padding: '0.75rem', borderRadius: '4px' }}>
            <div><strong>Conduct:</strong> Courteous, respectful and obedient.</div>
            <div><strong>Attitude to Learning:</strong> Very attentive, enthusiastic and proactive.</div>
            <div><strong>Interest:</strong> Science practicals, ICT algorithms and Reading club.</div>
            <div><strong>Next Trimester Resumes:</strong> {SCHOOL_INFO.nextTermBegins}</div>
          </div>
        </div>

        {/* Remarks & Authorization Signatures */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', borderTop: '1px solid #0F2537', paddingTop: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>FORM MASTER'S REMARK:</div>
            <div style={{ fontSize: '0.85rem', fontStyle: 'italic', margin: '0.25rem 0 0.75rem 0' }}>
              "An outstanding trimester performance with remarkable analytical acumen. Keep up the high standard."
            </div>
            <div style={{ borderBottom: '1px solid #334155', width: '160px', height: '24px', fontFamily: 'cursive', fontSize: '1rem' }}>
              Sir Emmanuel M.
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Form Master Signature</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>HEADTEACHER'S APPRAISAL:</div>
              <div style={{ fontSize: '0.85rem', fontStyle: 'italic', margin: '0.25rem 0 0.75rem 0' }}>
                {student.promotionRemark || "Promoted to JHS 3 Triumph with distinction. Commendable diligence."}
              </div>
              <div style={{ borderBottom: '1px solid #334155', width: '160px', height: '24px', fontFamily: 'cursive', fontSize: '1rem' }}>
                Dr. J. Adom-Kwarteng
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Headteacher Signature</div>
            </div>

            <div className="official-stamp" style={{ width: '95px', height: '95px', fontSize: '0.6rem' }}>
              LIVINE INT. SCHOOL<br />OFFICIAL TERMINAL<br />SEAL • ACCRA
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
