import React, { useState } from 'react';
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
import { WhatsAppReminderModal } from '../common/WhatsAppReminderModal';
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
  Wallet,
  MessageCircle
} from 'lucide-react';

interface ProprietorDashboardProps {
  classes?: ClassRoom[];
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
  const [isWhatsAppBroadcastOpen, setIsWhatsAppBroadcastOpen] = useState(false);

  // Financial Calculations for Active Term
  const termPayments = feePayments.filter(p => p.term === activeTerm);
  const totalRevenueCollected = termPayments.reduce((acc, p) => acc + p.amountPaid, 0);

  // Expected Revenue based on approved tariff per class level
  const totalExpectedRevenue = students.reduce((acc, stu) => {
    let level: FeeStructure['classLevel'] = 'Upper Primary';
    if (stu.className.includes('Nursery')) level = 'Nursery';
    else if (stu.className.includes('KG')) level = 'KG';
    else if (stu.className.includes('Basic 1') || stu.className.includes('Basic 2') || stu.className.includes('Basic 3')) level = 'Lower Primary';
    else if (stu.className.includes('Basic 4') || stu.className.includes('Basic 5') || stu.className.includes('Basic 6')) level = 'Upper Primary';
    else if (stu.className.includes('JHS')) level = 'JHS';

    const structure = feeStructures.find(f => f.classLevel === level);
    return acc + (structure ? structure.totalFee : 3000);
  }, 0);

  const totalOutstandingArrears = Math.max(0, totalExpectedRevenue - totalRevenueCollected);
  const collectionRate = totalExpectedRevenue > 0
    ? Math.round((totalRevenueCollected / totalExpectedRevenue) * 100)
    : 0;

  // Monthly Payroll (March 2026)
  const currentMonthPayroll = payroll.filter(p => p.month === 'March 2026' || p.monthYear === 'March 2026');
  const totalMonthlyPayroll = currentMonthPayroll.reduce((acc, p) => acc + p.netSalary, 0);
  const totalSsnitRemittance = currentMonthPayroll.reduce((acc, p) => acc + p.ssnitEmployee + p.ssnitEmployer, 0);
  const totalGraTax = currentMonthPayroll.reduce((acc, p) => acc + p.graPayeTax, 0);

  // Operating Expenses
  const totalOperatingExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);

  // Unresolved Anonymous Complaints
  const pendingComplaints = complaints.filter(c => c.status === 'New' || c.status === 'Under Review');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Executive Hero Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #0F2537 0%, #15324A 50%, #1D4163 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.75rem 2rem',
          color: '#FFFFFF',
          boxShadow: '0 10px 25px -5px rgba(15, 37, 55, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span 
              style={{ 
                background: 'rgba(200, 135, 25, 0.22)', 
                color: '#FDE68A', 
                border: '1px solid rgba(200, 135, 25, 0.45)', 
                padding: '0.2rem 0.65rem', 
                borderRadius: 'var(--radius-full)', 
                fontSize: '0.725rem', 
                fontWeight: 700, 
                letterSpacing: '0.03em',
                textTransform: 'uppercase' 
              }}
            >
              School Administration
            </span>
            <span style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.8rem', fontWeight: 600 }}>
              {activeTerm} (2025/2026)
            </span>
          </div>

          <h2 style={{ fontSize: '1.65rem', color: '#FFFFFF', fontWeight: 800, letterSpacing: '-0.01em', margin: 0 }}>
            School Overview
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.85rem', marginTop: '0.25rem', maxWidth: '550px' }}>
            Proprietors: Mr. Philip Dorh & Mrs. Doris Dorh • Ashale Botwe Lakeside Campus
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          <button 
            onClick={() => setIsWhatsAppBroadcastOpen(true)}
            className="btn btn-sm"
            style={{ 
              backgroundColor: '#10B981', 
              color: '#FFFFFF', 
              borderRadius: 'var(--radius-full)', 
              padding: '0.55rem 1.1rem',
              fontWeight: 700
            }}
          >
            <MessageCircle size={15} />
            <span>Send WhatsApp Reminder</span>
          </button>

          <button 
            onClick={() => onNavigateTab('fees')}
            className="btn btn-gold btn-sm"
            style={{ borderRadius: 'var(--radius-full)', padding: '0.55rem 1.1rem' }}
          >
            <CreditCard size={15} />
            <span>Record Fee Payment</span>
          </button>
          
          <button 
            onClick={() => onNavigateTab('expenses')}
            className="btn btn-secondary btn-sm"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.12)', 
              color: '#FFF', 
              borderColor: 'rgba(255, 255, 255, 0.25)',
              borderRadius: 'var(--radius-full)',
              padding: '0.55rem 1.1rem'
            }}
          >
            <Receipt size={15} />
            <span>Record Expense</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metric Cards (Dribbble Layout) */}
      <div className="stat-grid">
        {/* Total Fee Revenue */}
        <div className="stat-card">
          <div className="stat-icon-wrapper gold">
            <CreditCard size={20} color="var(--brand-gold)" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Fees Collected ({activeTerm})</span>
            <div className="stat-value">{formatGHS(totalRevenueCollected)}</div>
            <div className="stat-trend positive">
              <TrendingUp size={12} />
              <span>{collectionRate}% Collected of {formatGHS(totalExpectedRevenue)}</span>
            </div>
          </div>
        </div>

        {/* Outstanding Arrears */}
        <div className="stat-card">
          <div className="stat-icon-wrapper red">
            <Wallet size={20} color="var(--brand-red)" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Unpaid Fees (Arrears)</span>
            <div className="stat-value" style={{ color: '#B91C1C' }}>
              {formatGHS(totalOutstandingArrears)}
            </div>
            <div className="stat-trend negative">
              <AlertTriangle size={12} />
              <span>Outstanding balance</span>
            </div>
          </div>
        </div>

        {/* Total Enrolled Students */}
        <div className="stat-card">
          <div className="stat-icon-wrapper navy">
            <GraduationCap size={20} color="var(--brand-primary)" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Students</span>
            <div className="stat-value">{students.length} Students</div>
            <div className="stat-trend neutral">
              <span>Nursery 1 to JHS 3</span>
            </div>
          </div>
        </div>

        {/* Teaching Faculty & Staff */}
        <div className="stat-card">
          <div className="stat-icon-wrapper emerald">
            <Users size={20} color="var(--brand-emerald)" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Teachers & Staff</span>
            <div className="stat-value">{teachers.length} Teachers</div>
            <div className="stat-trend positive">
              <CheckCircle2 size={12} />
              <span>All Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Highlights & Statutory Compliance Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Statutory Payroll & Remittances Summary */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Banknote size={18} color="var(--brand-primary)" />
              <span>March 2026 Payroll & Statutory Remittances</span>
            </div>
            <button 
              onClick={() => onNavigateTab('payroll')}
              className="btn btn-secondary btn-sm"
            >
              <span>Manage Payroll</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Net Salary Paid to Faculty</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-primary)' }}>{formatGHS(totalMonthlyPayroll)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-green">Disbursed via GCB / Bank</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>SSNIT Tier 1 & 2 (18.5%)</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                  {formatGHS(totalSsnitRemittance)}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--brand-emerald)', marginTop: '0.1rem' }}>Employer + Employee</div>
              </div>

              <div style={{ padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>GRA PAYE Withholding</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                  {formatGHS(totalGraTax)}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginTop: '0.1rem' }}>Monthly Tax Return</div>
              </div>
            </div>
          </div>
        </div>

        {/* Whistleblower & Safe-School Governance */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <ShieldAlert size={18} color="var(--brand-red)" />
              <span>Safe-School Whistleblower Grievance Desk</span>
            </div>
            <button 
              onClick={() => onNavigateTab('complaints')}
              className="btn btn-secondary btn-sm"
            >
              <span>View All Cases</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Confidential Reports Requiring Proprietor Oversight:
              </span>
              <span className={`badge ${pendingComplaints.length > 0 ? 'badge-red' : 'badge-green'}`}>
                {pendingComplaints.length} Pending Actions
              </span>
            </div>

            {pendingComplaints.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
                <CheckCircle2 size={32} color="var(--brand-emerald)" style={{ margin: '0 auto 0.5rem' }} />
                <div>All grievance reports have been investigated and resolved!</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {pendingComplaints.slice(0, 3).map(c => (
                  <div 
                    key={c.id}
                    style={{ 
                      padding: '0.75rem', 
                      backgroundColor: '#FEF2F2', 
                      borderRadius: 'var(--radius-md)', 
                      border: '1px solid #FEE2E2',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#991B1B' }}>{c.subject}</div>
                      <div style={{ fontSize: '0.75rem', color: '#B91C1C' }}>
                        Ref: {c.trackingCode || c.ticketNumber} • {c.targetCategory}
                      </div>
                    </div>
                    <StatusBadge status={c.severity} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Fee Transactions Feed */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Receipt size={18} color="var(--brand-primary)" />
            <span>Recent Official Fee Payments & MoMo Deposits</span>
          </div>
          <button 
            onClick={() => onNavigateTab('fees')}
            className="btn btn-secondary btn-sm"
          >
            <span>Full Fee Ledger</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Receipt No</th>
                <th>Student</th>
                <th>Class</th>
                <th>Channel / Method</th>
                <th>Amount Paid</th>
                <th>Date & Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {termPayments.slice(0, 5).map((pay) => (
                <tr key={pay.id}>
                  <td style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>
                    {pay.receiptNumber || pay.receiptNo}
                  </td>
                  <td style={{ fontWeight: 600 }}>{pay.studentName}</td>
                  <td><span className="badge badge-gray">{pay.className}</span></td>
                  <td>{pay.paymentMethod}</td>
                  <td style={{ fontWeight: 700, color: 'var(--brand-emerald)' }}>
                    {formatGHS(pay.amountPaid)}
                  </td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    {pay.paymentDate || pay.date}
                  </td>
                  <td><StatusBadge status={pay.status || 'Completed'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* WhatsApp Broadcast Modal */}
      <WhatsAppReminderModal
        isOpen={isWhatsAppBroadcastOpen}
        onClose={() => setIsWhatsAppBroadcastOpen(false)}
        activeTerm={activeTerm}
        allStudents={students}
        allFeePayments={feePayments}
        allFeeStructures={feeStructures}
        mode="broadcast"
      />
    </div>
  );
};
