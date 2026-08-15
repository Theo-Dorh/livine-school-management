import React from 'react';
import {
  Parent,
  Student,
  MarkEntry,
  FeePayment,
  FeeStructure,
  CourseMaterial,
  AcademicTerm
} from '../../types';
import { formatGHS } from '../../utils/currency';
import {
  GraduationCap,
  CreditCard,
  FileText,
  BookOpen,
  Calendar,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Award,
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

interface ParentDashboardProps {
  parent: Parent;
  wards: Student[];
  selectedWard: Student;
  onSelectWard: (student: Student) => void;
  marks: MarkEntry[];
  feePayments: FeePayment[];
  feeStructures: FeeStructure[];
  courseMaterials: CourseMaterial[];
  activeTerm: AcademicTerm;
  onNavigateTab: (tab: 'terminal_report' | 'fee_payment' | 'curriculum') => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  parent,
  wards,
  selectedWard,
  onSelectWard,
  marks,
  feePayments,
  feeStructures,
  courseMaterials,
  activeTerm,
  onNavigateTab
}) => {
  // Calculate total fee billed and paid for a ward
  const getWardFeeInfo = (ward: Student) => {
    let level: FeeStructure['classLevel'] = 'Upper Primary';
    if (ward.className.includes('Nursery')) level = 'Nursery';
    else if (ward.className.includes('KG')) level = 'KG';
    else if (ward.className.includes('Basic 1') || ward.className.includes('Basic 2') || ward.className.includes('Basic 3')) level = 'Lower Primary';
    else if (ward.className.includes('Basic 4') || ward.className.includes('Basic 5') || ward.className.includes('Basic 6')) level = 'Upper Primary';
    else if (ward.className.includes('JHS')) level = 'JHS';

    const structure = feeStructures.find(f => f.classLevel === level);
    const totalBilled = structure ? structure.totalFee : 3000;
    const paid = feePayments
      .filter(p => p.studentId === ward.id && p.term === activeTerm)
      .reduce((sum, p) => sum + p.amountPaid, 0);

    const arrears = Math.max(0, totalBilled - paid);
    return { totalBilled, paid, arrears };
  };

  // Total arrears owed across all wards
  const totalArrearsAllWards = wards.reduce((sum, ward) => {
    return sum + getWardFeeInfo(ward).arrears;
  }, 0);

  const selectedWardFee = getWardFeeInfo(selectedWard);
  const wardMarks = marks.filter(m => m.studentId === selectedWard.id && m.term === activeTerm);

  const avgScore = wardMarks.length > 0
    ? Math.round((wardMarks.reduce((sum, m) => sum + m.totalScore, 0) / wardMarks.length) * 10) / 10
    : 84.5;

  const totalGrade1s = wardMarks.filter(m => m.beceGrade === 1).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Banner: Total Owed Across All Children */}
      <div 
        style={{ 
          backgroundColor: totalArrearsAllWards > 0 ? '#FEF2F2' : '#F0FDF4', 
          border: totalArrearsAllWards > 0 ? '2px solid #F87171' : '2px solid #86EFAC',
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
              width: '48px', 
              height: '48px', 
              borderRadius: '50%', 
              backgroundColor: totalArrearsAllWards > 0 ? '#FEE2E2' : '#DCFCE7', 
              color: totalArrearsAllWards > 0 ? '#B91C1C' : '#15803D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {totalArrearsAllWards > 0 ? <AlertCircle size={24} /> : <CheckCircle2 size={24} />}
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: totalArrearsAllWards > 0 ? '#991B1B' : '#166534', textTransform: 'uppercase' }}>
              Family School Fees Statement ({activeTerm})
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: totalArrearsAllWards > 0 ? '#B91C1C' : '#15803D' }}>
              {totalArrearsAllWards > 0 ? `Total Outstanding Arrears: ${formatGHS(totalArrearsAllWards)}` : 'All School Fees Fully Cleared! 🎉'}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
              Summary across {wards.length} registered wards ({wards.map(w => w.fullName.split(' ')[0]).join(', ')})
            </div>
          </div>
        </div>

        {totalArrearsAllWards > 0 && (
          <button
            onClick={() => onNavigateTab('fee_payment')}
            className="btn btn-gold"
          >
            <CreditCard size={16} />
            <span>Pay Outstanding Fees (MoMo)</span>
          </button>
        )}
      </div>

      {/* Multi-Ward Switcher */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
          Select Ward to Monitor Performance:
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {wards.map((ward) => {
            const isSelected = ward.id === selectedWard.id;
            const feeInfo = getWardFeeInfo(ward);
            return (
              <div
                key={ward.id}
                onClick={() => onSelectWard(ward)}
                style={{
                  flex: '1 1 280px',
                  backgroundColor: isSelected ? 'var(--brand-primary)' : 'var(--bg-subtle)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: isSelected ? '2px solid var(--brand-gold)' : '1px solid var(--border-medium)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{ward.fullName}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>{ward.className} • ID: {ward.studentId}</div>
                  </div>
                  {ward.promotionDecision === 'Promoted' ? (
                    <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>Promoted</span>
                  ) : ward.promotionDecision === 'Repeated' ? (
                    <span className="badge badge-red" style={{ fontSize: '0.7rem' }}>Repeated</span>
                  ) : (
                    <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>Assessed</span>
                  )}
                </div>

                <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: '0.5rem' }}>
                  <span>Fee Arrears:</span>
                  <strong style={{ color: isSelected ? (feeInfo.arrears > 0 ? '#FCA5A5' : '#86EFAC') : (feeInfo.arrears > 0 ? '#B91C1C' : '#15803D') }}>
                    {formatGHS(feeInfo.arrears)}
                  </strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Ward Academic & Promotion Status Banner */}
      <div className="card" style={{ borderLeft: selectedWard.promotionDecision === 'Repeated' ? '4px solid #B91C1C' : '4px solid #15803D' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {selectedWard.promotionDecision === 'Repeated' ? (
                <RotateCcw size={20} color="#B91C1C" />
              ) : (
                <Award size={20} color="#15803D" />
              )}
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                Academic Placement: {selectedWard.promotionDecision || 'Promoted'} ({selectedWard.promotedToClassName || selectedWard.className})
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {selectedWard.promotionRemark || 'Pupil is making steady progress in all core curriculum areas.'}
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('terminal_report')}
            className="btn btn-primary btn-sm"
          >
            <FileText size={14} />
            <span>View Full Ghanaian Terminal Report Card</span>
          </button>
        </div>
      </div>

      {/* Metrics for Selected Ward */}
      <div className="stat-grid">
        <div className="stat-card gold">
          <div className="stat-label">Trimester Average Score</div>
          <div className="stat-value">{avgScore}%</div>
          <div className="stat-trend positive">
            <span>Stanine Grade 1 Standing</span>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-label">Grade 1 (80-100%) Distinctions</div>
          <div className="stat-value">{totalGrade1s} Subjects</div>
          <div className="stat-trend positive">
            <span>Exceeding Expectations</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Attendance Rate</div>
          <div className="stat-value">98.3%</div>
          <div className="stat-trend">
            <span>{selectedWard.attendanceDaysPresent} of {selectedWard.attendanceDaysTotal} Days</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Ward Arrears Balance</div>
          <div className="stat-value" style={{ color: selectedWardFee.arrears > 0 ? '#B91C1C' : '#15803D' }}>
            {formatGHS(selectedWardFee.arrears)}
          </div>
          <div className="stat-trend">
            <span>{selectedWardFee.arrears === 0 ? 'Fully Paid' : 'Due for Payment'}</span>
          </div>
        </div>
      </div>

      {/* Subject Performance Breakdown Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <GraduationCap size={18} color="var(--brand-primary)" />
            <span>{selectedWard.fullName} — Subject Performance ({activeTerm})</span>
          </div>
          <span className="badge badge-gold">NaCCA SBA + Exam Marks</span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Continuous Assessment (SBA 50%)</th>
                <th>Exam Score (50%)</th>
                <th>Total (100%)</th>
                <th>BECE Grade</th>
                <th>Performance Descriptors</th>
                <th>Teacher Remarks</th>
              </tr>
            </thead>
            <tbody>
              {wardMarks.map((m) => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>{m.subjectName}</td>
                  <td>{m.totalSba} / 50</td>
                  <td>{m.examScore} / 50</td>
                  <td style={{ fontWeight: 800, color: m.totalScore >= 80 ? '#15803D' : '#0F2537' }}>
                    {m.totalScore}%
                  </td>
                  <td>
                    <span className={`badge ${m.beceGrade === 1 ? 'badge-green' : m.beceGrade === 2 ? 'badge-blue' : 'badge-gold'}`}>
                      Grade {m.beceGrade}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem' }}>{m.descriptor}</td>
                  <td style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>{m.teacherRemarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
