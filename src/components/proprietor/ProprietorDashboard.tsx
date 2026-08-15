import React from 'react';
import {
  Student,
  Teacher,
  FeePayment,
  PayrollRecord,
  ExpenseRecord,
  AnonymousComplaint,
  FeeStructure,
  AcademicTerm
} from '../../types';
import { formatGHS } from '../../utils/currency';
import { StatusBadge } from '../common/Badge';
import {
  CreditCard,
  Banknote,
  Receipt,
  TrendingUp,
  Users,
  ShieldAlert,
  GraduationCap,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sparkles,
  ChevronRight,
  Building,
  School,
  Wallet
} from 'lucide-react';

interface ProprietorDashboardProps {
  students: Student[];
  teachers: Teacher[];
  feePayments: FeePayment[];
  payroll: PayrollRecord[];
  expenses: ExpenseRecord[];
  complaints: AnonymousComplaint[];
  feeStructures: FeeStructure[];
  activeTerm: AcademicTerm;
  onNavigateTab: (tab: string) => void;
}

export const ProprietorDashboard: React.FC<ProprietorDashboardProps> = ({
  students,
  teachers,
  feePayments,
  payroll,
  expenses,
  complaints,
  feeStructures,
  activeTerm,
  onNavigateTab
}) => {
  // Financial calculations
  const totalCollected = feePayments.reduce((acc, p) => acc + p.amountPaid, 0);

  // Total billed based on fee structures per class level
  const totalBilledEstimate = students.reduce((sum, stu) => {
    let level: FeeStructure['classLevel'] = 'Upper Primary';
    if (stu.className.includes('Nursery')) level = 'Nursery';
    else if (stu.className.includes('KG')) level = 'KG';
    else if (stu.className.includes('Basic 1') || stu.className.includes('Basic 2') || stu.className.includes('Basic 3')) level = 'Lower Primary';
    else if (stu.className.includes('Basic 4') || stu.className.includes('Basic 5') || stu.className.includes('Basic 6')) level = 'Upper Primary';
    else if (stu.className.includes('JHS')) level = 'JHS';

    const structure = feeStructures.find(f => f.classLevel === level);
    return sum + (structure ? structure.totalFee : 3000);
  }, 0);

  const totalArrears = Math.max(0, totalBilledEstimate - totalCollected);
  const totalMonthlyPayroll = payroll.reduce((acc, p) => acc + p.netSalary, 0);
  const totalMonthlyExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalOutflows = totalMonthlyPayroll + totalMonthlyExpenses;
  const netOperatingSurplus = totalCollected - totalOutflows;

  // Active complaints
  const openComplaints = complaints.filter(c => c.status !== 'Resolved' && c.status !== 'Dismissed');
  const criticalComplaints = complaints.filter(c => c.severity === 'Critical' || c.severity === 'High');

  // Class enrollment breakdown
  const nurseryCount = students.filter(s => s.className.includes('Nursery')).length;
  const kgCount = students.filter(s => s.className.includes('KG')).length;
  const lowerPrimaryCount = students.filter(s => ['Basic 1', 'Basic 2', 'Basic 3'].some(b => s.className.includes(b))).length;
  const upperPrimaryCount = students.filter(s => ['Basic 4', 'Basic 5', 'Basic 6'].some(b => s.className.includes(b))).length;
  const jhsCount = students.filter(s => s.className.includes('JHS')).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Modern Executive Hero Banner */}
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
        {/* Subtle decorative glow */}
        <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,135,25,0.2) 0%, rgba(200,135,25,0) 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
            <span 
              style={{ 
                background: 'rgba(200, 135, 25, 0.22)', 
                color: '#FDE68A', 
                border: '1px solid rgba(200, 135, 25, 0.45)', 
                padding: '0.25rem 0.75rem', 
                borderRadius: 'var(--radius-full)', 
                fontSize: '0.725rem', 
                fontWeight: 800, 
                letterSpacing: '0.04em',
                textTransform: 'uppercase' 
              }}
            >
              Proprietor Command Center
            </span>
            <span style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.8rem', fontWeight: 600 }}>
              Academic Year 2025/2026 • {activeTerm}
            </span>
          </div>

          <h2 style={{ fontSize: '1.85rem', color: '#FFFFFF', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>
            Executive Operations Overview
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem', marginTop: '0.35rem', maxWidth: '600px' }}>
            Livine International School • Ghanaian Standards-Based Basic Education (NaCCA & GES)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          <button 
            onClick={() => onNavigateTab('fees')}
            className="btn btn-gold"
            style={{ borderRadius: 'var(--radius-full)', padding: '0.65rem 1.25rem' }}
          >
            <CreditCard size={16} />
            <span>Record Fee Payment</span>
          </button>
          <button 
            onClick={() => onNavigateTab('expenses')}
            className="btn btn-secondary"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.12)', 
              color: '#FFF', 
              borderColor: 'rgba(255, 255, 255, 0.25)',
              borderRadius: 'var(--radius-full)',
              padding: '0.65rem 1.25rem'
            }}
          >
            <Receipt size={16} />
            <span>Add Operating Cost</span>
          </button>
        </div>
      </div>

      {/* Primary Financial & Operational Metrics */}
      <div className="stat-grid">
        <div className="stat-card green">
          <div>
            <div className="stat-label">Term Fees Collected</div>
            <div className="stat-value">{formatGHS(totalCollected)}</div>
            <div className="stat-trend positive">
              <TrendingUp size={14} />
              <span>{Math.round((totalCollected / (totalBilledEstimate || 1)) * 100)}% of total expected billing</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#DCFCE7', color: '#15803D' }}>
            <CreditCard size={22} />
          </div>
        </div>

        <div className="stat-card red">
          <div>
            <div className="stat-label">Outstanding Fee Arrears</div>
            <div className="stat-value">{formatGHS(totalArrears)}</div>
            <div className="stat-trend negative">
              <AlertTriangle size={14} />
              <span>{students.filter(s => s.status === 'Active').length} enrolled students</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#FEE2E2', color: '#B91C1C' }}>
            <Receipt size={22} />
          </div>
        </div>

        <div className="stat-card navy">
          <div>
            <div className="stat-label">Monthly Staff Payroll</div>
            <div className="stat-value">{formatGHS(totalMonthlyPayroll)}</div>
            <div className="stat-trend">
              <Users size={14} />
              <span>{teachers.length} teaching & administrative staff</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8' }}>
            <Banknote size={22} />
          </div>
        </div>

        <div className="stat-card gold">
          <div>
            <div className="stat-label">Operating Expenses (Costs)</div>
            <div className="stat-value">{formatGHS(totalMonthlyExpenses)}</div>
            <div className="stat-trend warning">
              <span>ECG, Water, Bus, Canteen & TLMs</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#FEF3C7', color: '#B45309' }}>
            <Wallet size={22} />
          </div>
        </div>
      </div>

      {/* Grid: Financial Position & Whistleblower Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
        {/* Financial Cash Flow Summary */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <TrendingUp size={18} color="var(--brand-gold)" />
                <span>Financial Health & Trimester Cash Flow</span>
              </div>
              <div className="card-subtitle">Summary of Revenue vs Operating Outflows (GH₵)</div>
            </div>
            <button 
              onClick={() => onNavigateTab('fees')}
              className="btn btn-secondary btn-sm"
            >
              <span>View P&L Ledger</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Total Revenue</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803D', marginTop: '0.2rem' }}>
                {formatGHS(totalCollected)}
              </div>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Total Expenditure</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#B91C1C', marginTop: '0.2rem' }}>
                {formatGHS(totalOutflows)}
              </div>
            </div>

            <div style={{ backgroundColor: netOperatingSurplus >= 0 ? '#DCFCE7' : '#FEE2E2', padding: '1rem', borderRadius: 'var(--radius-md)', border: `1px solid ${netOperatingSurplus >= 0 ? '#86EFAC' : '#FCA5A5'}` }}>
              <div style={{ fontSize: '0.725rem', color: netOperatingSurplus >= 0 ? '#166534' : '#991B1B', fontWeight: 700, textTransform: 'uppercase' }}>Net Operational Surplus</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: netOperatingSurplus >= 0 ? '#15803D' : '#B91C1C', marginTop: '0.2rem' }}>
                {formatGHS(netOperatingSurplus)}
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', backgroundColor: '#F1F5F9', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)' }}>
            <strong>Proprietor Note:</strong> Staff SSNIT (5.5% employee, 13.5% employer) and GRA PAYE remittances for March 2026 are fully computed in accordance with Ghanaian statutory law.
          </div>
        </div>

        {/* Whistleblower & Grievance Alert Box */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <ShieldAlert size={18} color="#B91C1C" />
                <span>Whistleblower Inbox</span>
              </div>
              <div className="card-subtitle">Anonymous Student & Teacher reports</div>
            </div>
            <button 
              onClick={() => onNavigateTab('complaints')}
              className="btn btn-secondary btn-sm"
            >
              <span>View All</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {complaints.slice(0, 2).map((c) => (
              <div 
                key={c.id}
                style={{ 
                  backgroundColor: 'var(--bg-subtle)', 
                  padding: '0.85rem 1rem', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.8rem', color: c.senderType === 'Student' ? '#1D4ED8' : '#7C3AED' }}>
                      [{c.senderType}] {c.targetCategory.split(' ')[0]}
                    </span>
                    <span className={`badge ${c.status === 'Resolved' ? 'badge-green' : c.status === 'Under Investigation' ? 'badge-gold' : 'badge-red'}`} style={{ fontSize: '0.7rem' }}>
                      {c.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {c.subject}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.2rem' }}>
                    Logged: {c.createdAt}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enrollment Distribution (Nursery to JHS 3) */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <GraduationCap size={18} color="var(--brand-primary)" />
            <span>Ghana Basic Education Enrollment Distribution</span>
          </div>
          <span className="badge badge-gold">{students.length} Total Enrolled Pupils</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Nursery 1 & 2</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--brand-primary)', margin: '0.25rem 0' }}>{nurseryCount}</div>
            <div style={{ fontSize: '0.75rem', color: '#15803D' }}>Early Childhood</div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>KG 1 & 2</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--brand-primary)', margin: '0.25rem 0' }}>{kgCount}</div>
            <div style={{ fontSize: '0.75rem', color: '#15803D' }}>Kindergarten</div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Lower Primary (B1-B3)</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--brand-primary)', margin: '0.25rem 0' }}>{lowerPrimaryCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--brand-gold-dark)' }}>Primary Foundational</div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Upper Primary (B4-B6)</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--brand-primary)', margin: '0.25rem 0' }}>{upperPrimaryCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--brand-gold-dark)' }}>Primary Intermediate</div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>JHS 1 - 3 (Basic 7-9)</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--brand-primary)', margin: '0.25rem 0' }}>{jhsCount}</div>
            <div style={{ fontSize: '0.75rem', color: '#1D4ED8' }}>BECE Candidates</div>
          </div>
        </div>
      </div>
    </div>
  );
};
