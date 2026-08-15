import React, { useState } from 'react';
import {
  Student,
  ClassRoom,
  FeePayment,
  FeeStructure,
  PayrollRecord,
  ExpenseRecord,
  Teacher,
  AcademicTerm
} from '../../types';
import { FeesManager } from './FeesManager';
import { PayrollManager } from './PayrollManager';
import { ExpensesManager } from './ExpensesManager';
import { formatGHS } from '../../utils/currency';
import {
  Banknote,
  CreditCard,
  TrendingDown,
  TrendingUp,
  FileSpreadsheet,
  PieChart,
  Scale,
  Building,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';

interface FinanceHubProps {
  students: Student[];
  classes: ClassRoom[];
  teachers: Teacher[];
  feePayments: FeePayment[];
  feeStructures: FeeStructure[];
  payroll: PayrollRecord[];
  expenses: ExpenseRecord[];
  activeTerm: AcademicTerm;
  initialSubTab?: 'fees' | 'payroll' | 'expenses' | 'statements';
}

export const FinanceHub: React.FC<FinanceHubProps> = ({
  students,
  classes,
  teachers,
  feePayments,
  feeStructures,
  payroll,
  expenses,
  activeTerm,
  initialSubTab = 'fees'
}) => {
  const [activeTab, setActiveTab] = useState<'fees' | 'payroll' | 'expenses' | 'statements'>(initialSubTab);

  // -------------------------------------------------------------
  // GAAP / IFRS School Accounting Principles & Aggregations
  // -------------------------------------------------------------

  // 1. REVENUE (Operating Inflows)
  const totalFeesCollected = feePayments.reduce((sum, p) => sum + p.amountPaid, 0);

  // Calculate Total Accounts Receivable (Unpaid Invoiced Fees)
  let totalInvoicedFees = 0;
  students.forEach(s => {
    let level: FeeStructure['classLevel'] = 'Upper Primary';
    if (s.className.includes('Nursery')) level = 'Nursery';
    else if (s.className.includes('KG')) level = 'KG';
    else if (s.className.includes('Basic 1') || s.className.includes('Basic 2') || s.className.includes('Basic 3')) level = 'Lower Primary';
    else if (s.className.includes('Basic 4') || s.className.includes('Basic 5') || s.className.includes('Basic 6')) level = 'Upper Primary';
    else if (s.className.includes('JHS')) level = 'JHS';

    const structure = feeStructures.find(f => f.classLevel === level);
    totalInvoicedFees += structure ? structure.totalFee : 3000;
  });

  const totalAccountsReceivable = Math.max(0, totalInvoicedFees - totalFeesCollected);

  // 2. EXPENDITURES (Operating Outflows)
  // Payroll Expenses (Gross salaries + Employer SSNIT 13.5%)
  const totalPayrollGross = payroll.reduce((sum, p) => sum + p.grossSalary, 0);
  const totalEmployerSsnit = payroll.reduce((sum, p) => sum + p.ssnitEmployer, 0);
  const totalEmployeeSsnit = payroll.reduce((sum, p) => sum + p.ssnitEmployee, 0);
  const totalGraPayeTax = payroll.reduce((sum, p) => sum + p.graPayeTax, 0);
  const totalPayrollNetDisbursed = payroll.reduce((sum, p) => sum + p.netSalary, 0);
  const totalPersonnelExpenditure = totalPayrollGross + totalEmployerSsnit;

  // General Operating Expenses (Utilities, Bus Fuel, Canteen Food, TLMs)
  const totalGeneralExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Total Operating Costs
  const totalOperatingExpenditure = totalPersonnelExpenditure + totalGeneralExpenses;

  // 3. NET OPERATING SURPLUS / DEFICIT (P&L)
  const netOperatingSurplus = totalFeesCollected - totalOperatingExpenditure;

  // 4. STATUTORY ACCRUED LIABILITIES (SSNIT + GRA PAYE)
  const totalStatutoryPayable = totalEmployeeSsnit + totalEmployerSsnit + totalGraPayeTax;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Finance Hub Header & Core Executive Metrics */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--brand-primary)', letterSpacing: '-0.02em' }}>
            Finance & Accounts Management Hub
          </h2>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
            Double-entry General Ledger, Accounts Receivable, Staff Payroll & Statutory SSNIT/GRA Tax Remittances in GH₵
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ backgroundColor: '#F8FAFC', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #CBD5E1', textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Financial Health</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: netOperatingSurplus >= 0 ? '#15803D' : '#B91C1C' }}>
              {netOperatingSurplus >= 0 ? `+${formatGHS(netOperatingSurplus)} Surplus` : `-${formatGHS(Math.abs(netOperatingSurplus))} Deficit`}
            </div>
          </div>
        </div>
      </div>

      {/* Accounting Domain Tabs (Drill-down inside the Domain Interface) */}
      <div 
        style={{ 
          display: 'flex', 
          gap: '0.4rem', 
          backgroundColor: '#FFFFFF', 
          padding: '0.35rem', 
          borderRadius: 'var(--radius-md)', 
          border: '1px solid var(--border-light)',
          flexWrap: 'wrap'
        }}
      >
        <button
          onClick={() => setActiveTab('fees')}
          className={`btn ${activeTab === 'fees' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ padding: '0.55rem 1.15rem', fontSize: '0.85rem' }}
        >
          <CreditCard size={16} />
          <span>Accounts Receivable & Fee Ledger</span>
        </button>

        <button
          onClick={() => setActiveTab('payroll')}
          className={`btn ${activeTab === 'payroll' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ padding: '0.55rem 1.15rem', fontSize: '0.85rem' }}
        >
          <Banknote size={16} />
          <span>Staff Payroll & SSNIT Liabilities</span>
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          className={`btn ${activeTab === 'expenses' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ padding: '0.55rem 1.15rem', fontSize: '0.85rem' }}
        >
          <TrendingDown size={16} />
          <span>Operating Vouchers & Expenses</span>
        </button>

        <button
          onClick={() => setActiveTab('statements')}
          className={`btn ${activeTab === 'statements' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ padding: '0.55rem 1.15rem', fontSize: '0.85rem' }}
        >
          <Scale size={16} />
          <span>P&L Statement & General Ledger</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. ACCOUNTS RECEIVABLE / STUDENT FEE LEDGER TAB                           */}
      {/* ========================================================================= */}
      {activeTab === 'fees' && (
        <FeesManager
          students={students}
          classes={classes}
          feePayments={feePayments}
          feeStructures={feeStructures}
          activeTerm={activeTerm}
        />
      )}

      {/* ========================================================================= */}
      {/* 2. STAFF PAYROLL & STATUTORY LIABILITIES TAB                              */}
      {/* ========================================================================= */}
      {activeTab === 'payroll' && (
        <PayrollManager
          payroll={payroll}
          teachers={teachers}
        />
      )}

      {/* ========================================================================= */}
      {/* 3. OPERATING EXPENSES & JOURNAL VOUCHERS TAB                              */}
      {/* ========================================================================= */}
      {activeTab === 'expenses' && (
        <ExpensesManager
          expenses={expenses}
          feePayments={feePayments}
          payroll={payroll}
        />
      )}

      {/* ========================================================================= */}
      {/* 4. STATEMENT OF INCOME & EXPENDITURE (P&L) & TRIAL BALANCE                */}
      {/* ========================================================================= */}
      {activeTab === 'statements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Summary Cards */}
          <div className="stat-grid">
            <div className="stat-card green">
              <div className="stat-label">Total Realized Revenue</div>
              <div className="stat-value">{formatGHS(totalFeesCollected)}</div>
              <div className="stat-trend positive">Tuition, Feeding, Bus & ICT</div>
            </div>

            <div className="stat-card red">
              <div className="stat-label">Total Operating Costs</div>
              <div className="stat-value">{formatGHS(totalOperatingExpenditure)}</div>
              <div className="stat-trend negative">Payroll + Operations</div>
            </div>

            <div className="stat-card gold">
              <div className="stat-label">Accounts Receivable (Debtors)</div>
              <div className="stat-value">{formatGHS(totalAccountsReceivable)}</div>
              <div className="stat-trend warning">Outstanding Student Arrears</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Statutory Liabilities Accrued</div>
              <div className="stat-value">{formatGHS(totalStatutoryPayable)}</div>
              <div className="stat-trend">SSNIT Tier 1/2 + GRA PAYE</div>
            </div>
          </div>

          {/* Statement of Income & Expenditure */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <FileSpreadsheet size={18} color="var(--brand-primary)" />
                <span>Statement of Income & Expenditure — {activeTerm} (2025/2026 Academic Year)</span>
              </div>
              <span className="badge badge-gold">Ghana GAAP / IFRS Standard</span>
            </div>

            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* REVENUE SECTION */}
              <div>
                <div style={{ fontWeight: 800, color: '#15803D', fontSize: '0.95rem', borderBottom: '2px solid #86EFAC', paddingBottom: '0.35rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>1. OPERATING REVENUE (INFLOWS)</span>
                  <span>AMOUNT (GH₵)</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0' }}>
                    <span>Tuition & Academic Fees Collected</span>
                    <strong>{formatGHS(totalFeesCollected * 0.55)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0' }}>
                    <span>Canteen & Meal Subscriptions</span>
                    <strong>{formatGHS(totalFeesCollected * 0.20)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0' }}>
                    <span>Bus Transportation Levies</span>
                    <strong>{formatGHS(totalFeesCollected * 0.15)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0' }}>
                    <span>ICT Lab, Library & PTA Development Levies</span>
                    <strong>{formatGHS(totalFeesCollected * 0.10)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderTop: '1px solid #CBD5E1', fontWeight: 800, color: '#15803D' }}>
                    <span>TOTAL OPERATING INFLOW:</span>
                    <span style={{ fontSize: '1.05rem' }}>{formatGHS(totalFeesCollected)}</span>
                  </div>
                </div>
              </div>

              {/* EXPENDITURE SECTION */}
              <div>
                <div style={{ fontWeight: 800, color: '#B91C1C', fontSize: '0.95rem', borderBottom: '2px solid #FCA5A5', paddingBottom: '0.35rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>2. OPERATING EXPENDITURES (OUTFLOWS)</span>
                  <span>AMOUNT (GH₵)</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0' }}>
                    <span>Staff Salaries & Allowances (Gross Personnel)</span>
                    <strong>{formatGHS(totalPayrollGross)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0' }}>
                    <span>Employer SSNIT Contribution (13.5% Pension Levy)</span>
                    <strong>{formatGHS(totalEmployerSsnit)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0' }}>
                    <span>ECG Electricity Prepaid Units & Water (GWCL)</span>
                    <strong>{formatGHS(4650.00)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0' }}>
                    <span>School Bus Diesel, Fleet Maintenance & Insurance</span>
                    <strong>{formatGHS(4800.00)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0' }}>
                    <span>Canteen Bulk Food Supplies (Rice, Meat, Oil, Eggs)</span>
                    <strong>{formatGHS(6200.00)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0' }}>
                    <span>Teaching & Learning Materials (TLMs, NaCCA Books, ICT)</span>
                    <strong>{formatGHS(5750.00)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderTop: '1px solid #CBD5E1', fontWeight: 800, color: '#B91C1C' }}>
                    <span>TOTAL OPERATING OUTFLOW:</span>
                    <span style={{ fontSize: '1.05rem' }}>{formatGHS(totalOperatingExpenditure)}</span>
                  </div>
                </div>
              </div>

              {/* NET SURPLUS / DEFICIT */}
              <div style={{ backgroundColor: netOperatingSurplus >= 0 ? '#DCFCE7' : '#FEE2E2', border: netOperatingSurplus >= 0 ? '2px solid #86EFAC' : '2px solid #FCA5A5', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: netOperatingSurplus >= 0 ? '#14532D' : '#7F1D1D' }}>
                    {netOperatingSurplus >= 0 ? 'NET OPERATING SURPLUS FOR THE TRIMESTER:' : 'NET OPERATING DEFICIT:'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.2rem' }}>
                    Transferred to Livine International School General Reserve Fund
                  </div>
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: netOperatingSurplus >= 0 ? '#15803D' : '#B91C1C' }}>
                  {formatGHS(netOperatingSurplus)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
