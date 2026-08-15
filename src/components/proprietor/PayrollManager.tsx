import React, { useState } from 'react';
import { PayrollRecord, Teacher } from '../../types';
import { formatGHS, calculateGhanaPayroll } from '../../utils/currency';
import { StatusBadge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { SchoolStore } from '../../data/storage';
import { SCHOOL_INFO } from '../../data/mockData';
import {
  Banknote,
  Calendar,
  Download,
  Printer,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Building,
  Edit2,
  Clock
} from 'lucide-react';

interface PayrollManagerProps {
  payroll: PayrollRecord[];
  teachers: Teacher[];
}

export const PayrollManager: React.FC<PayrollManagerProps> = ({
  payroll,
  teachers
}) => {
  const [selectedMonth, setSelectedMonth] = useState('March 2026');
  const [activePayslip, setActivePayslip] = useState<PayrollRecord | null>(null);

  // Edit payment date / disbursement modal
  const [editingRecord, setEditingRecord] = useState<PayrollRecord | null>(null);
  const [editStatus, setEditStatus] = useState<'Paid' | 'Pending'>('Paid');
  const [editDate, setEditDate] = useState('2026-03-27');
  const [editMethod, setEditMethod] = useState<'Bank Transfer' | 'MTN MoMo' | 'Cheque'>('Bank Transfer');

  // Filter records
  const currentMonthRecords = payroll.filter(p => p.monthYear === selectedMonth);

  // Totals for Ghana Payroll
  const totalGross = currentMonthRecords.reduce((sum, p) => sum + p.grossSalary, 0);
  const totalNet = currentMonthRecords.reduce((sum, p) => sum + p.netSalary, 0);
  const totalSsnitEmployee = currentMonthRecords.reduce((sum, p) => sum + p.ssnitEmployee, 0);
  const totalSsnitEmployer = currentMonthRecords.reduce((sum, p) => sum + p.ssnitEmployer, 0);
  const totalGraPaye = currentMonthRecords.reduce((sum, p) => sum + p.graPayeTax, 0);
  const totalWelfare = currentMonthRecords.reduce((sum, p) => sum + p.staffWelfare, 0);

  const handleOpenEdit = (record: PayrollRecord) => {
    setEditingRecord(record);
    setEditStatus(record.paymentStatus);
    setEditDate(record.paymentDate || new Date().toISOString().split('T')[0]);
    setEditMethod(record.paymentMethod);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;

    const updated: PayrollRecord = {
      ...editingRecord,
      paymentStatus: editStatus,
      paymentDate: editStatus === 'Paid' ? editDate : undefined,
      paymentMethod: editMethod
    };

    SchoolStore.updatePayrollRecord(updated);
    setEditingRecord(null);
  };

  const handleQuickDisburseAll = () => {
    if (window.confirm('Confirm salary disbursement for all staff for this cycle? Payment dates will be updated to today.')) {
      const today = new Date().toISOString().split('T')[0];
      currentMonthRecords.forEach(r => {
        SchoolStore.updatePayrollStatus(r.id, 'Paid', today);
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
            Staff Payroll & Statutory Remittances
          </h2>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
            Ghanaian Statutory Deductions: SSNIT Tier 1 & 2 (5.5% / 13.5%), GRA PAYE Income Tax & Staff Welfare
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <select
            className="form-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ width: '160px' }}
          >
            <option value="March 2026">March 2026</option>
            <option value="February 2026">February 2026</option>
            <option value="January 2026">January 2026</option>
          </select>

          <button
            onClick={handleQuickDisburseAll}
            className="btn btn-gold"
          >
            <CheckCircle2 size={16} />
            <span>Disburse All Salaries</span>
          </button>
        </div>
      </div>

      {/* Statutory Deductions Summary Cards */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="stat-card">
          <div className="stat-label">Total Gross Salary</div>
          <div className="stat-value" style={{ fontSize: '1.4rem' }}>{formatGHS(totalGross)}</div>
          <div className="stat-trend">Basic + Allowances</div>
        </div>

        <div className="stat-card green">
          <div className="stat-label">Total Net Pay Disbursed</div>
          <div className="stat-value" style={{ fontSize: '1.4rem' }}>{formatGHS(totalNet)}</div>
          <div className="stat-trend positive">Take-home earnings</div>
        </div>

        <div className="stat-card gold">
          <div className="stat-label">SSNIT Total (19.0%)</div>
          <div className="stat-value" style={{ fontSize: '1.4rem' }}>{formatGHS(totalSsnitEmployee + totalSsnitEmployer)}</div>
          <div className="stat-trend warning">5.5% Staff + 13.5% School</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">GRA PAYE Income Tax</div>
          <div className="stat-value" style={{ fontSize: '1.4rem' }}>{formatGHS(totalGraPaye)}</div>
          <div className="stat-trend">Monthly tax remittance</div>
        </div>
      </div>

      {/* Staff Salary Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Banknote size={18} color="var(--brand-primary)" />
            <span>Faculty & Staff Salary Register ({selectedMonth})</span>
          </div>
          <span className="badge badge-gold">{currentMonthRecords.length} Staff on Roster</span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Staff Name & Role</th>
                <th>Basic Salary</th>
                <th>Allowances</th>
                <th>Gross Salary</th>
                <th>SSNIT (5.5%)</th>
                <th>GRA PAYE</th>
                <th>Net Salary</th>
                <th>Payment Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentMonthRecords.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{r.staffName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{r.roleTitle}</div>
                  </td>
                  <td>{formatGHS(r.basicSalary)}</td>
                  <td style={{ fontSize: '0.8rem' }}>
                    {formatGHS(r.responsibilityAllowance + r.transportAllowance + r.housingAllowance)}
                  </td>
                  <td style={{ fontWeight: 700 }}>{formatGHS(r.grossSalary)}</td>
                  <td style={{ color: '#B45309', fontSize: '0.8rem' }}>{formatGHS(r.ssnitEmployee)}</td>
                  <td style={{ color: '#B91C1C', fontSize: '0.8rem' }}>{formatGHS(r.graPayeTax)}</td>
                  <td style={{ fontWeight: 800, color: '#15803D' }}>{formatGHS(r.netSalary)}</td>
                  <td style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                    {r.paymentDate || 'Pending'}
                  </td>
                  <td>
                    <StatusBadge status={r.paymentStatus} />
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => handleOpenEdit(r)}
                        className="btn btn-secondary btn-sm"
                        title="Update Payment Date & Method"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => setActivePayslip(r)}
                        className="btn btn-primary btn-sm"
                        title="Generate Payslip"
                      >
                        <Printer size={13} />
                        <span>Payslip</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Payment Date Modal */}
      <Modal
        isOpen={!!editingRecord}
        onClose={() => setEditingRecord(null)}
        title="Update Staff Payment Schedule"
        subtitle={editingRecord ? `${editingRecord.staffName} (${editingRecord.monthYear})` : ''}
      >
        {editingRecord && (
          <form onSubmit={handleSaveEdit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Disbursement Status *</label>
                <select
                  className="form-select"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                >
                  <option value="Paid">Paid (Disbursed)</option>
                  <option value="Pending">Pending (Unpaid)</option>
                </select>
              </div>

              {editStatus === 'Paid' && (
                <div className="form-group">
                  <label className="form-label">Payment Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Payment Method *</label>
                <select
                  className="form-select"
                  value={editMethod}
                  onChange={(e) => setEditMethod(e.target.value as any)}
                >
                  <option value="Bank Transfer">Bank Transfer (GCB / Ecobank)</option>
                  <option value="MTN MoMo">MTN Mobile Money</option>
                  <option value="Cheque">School Cheque</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-gold"
                >
                  <CheckCircle2 size={16} />
                  <span>Update Payment Record</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </Modal>

      {/* Official Printable Staff Payslip */}
      <Modal
        isOpen={!!activePayslip}
        onClose={() => setActivePayslip(null)}
        title="Ghanaian Staff Salary Advice / Payslip"
        subtitle="Confidential Salary Statement"
        size="large"
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
              Complies with Ghana Labour Act & SSNIT Pension Regulations
            </span>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => window.print()} className="btn btn-primary">
                <Printer size={16} />
                <span>Print Official Payslip</span>
              </button>
              <button onClick={() => setActivePayslip(null)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        }
      >
        {activePayslip && (
          <div className="printable-area" style={{ padding: '1rem', backgroundColor: '#FFF' }}>
            <div style={{ border: '2px solid #0F2537', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ textAlign: 'center', borderBottom: '2px solid #0F2537', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F2537', textTransform: 'uppercase' }}>
                  {SCHOOL_INFO.name}
                </h2>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#C88719' }}>
                  STAFF SALARY ADVICE / PAYSLIP — {activePayslip.monthYear.toUpperCase()}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  {SCHOOL_INFO.address} • Digital: {SCHOOL_INFO.digitalAddress}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                <div>
                  <div><strong>Staff Name:</strong> {activePayslip.staffName}</div>
                  <div><strong>Designation:</strong> {activePayslip.roleTitle}</div>
                  <div><strong>Staff ID:</strong> {activePayslip.staffId}</div>
                </div>
                <div>
                  <div><strong>Payment Date:</strong> {activePayslip.paymentDate || 'Pending'}</div>
                  <div><strong>Payment Method:</strong> {activePayslip.paymentMethod}</div>
                  <div><strong>Status:</strong> <span style={{ color: '#15803D', fontWeight: 700 }}>{activePayslip.paymentStatus}</span></div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.25rem' }}>
                {/* Earnings */}
                <div style={{ border: '1px solid #CBD5E1', borderRadius: '4px', padding: '0.75rem' }}>
                  <div style={{ fontWeight: 800, borderBottom: '1px solid #CBD5E1', paddingBottom: '0.35rem', marginBottom: '0.5rem', color: '#0F2537' }}>
                    EARNINGS & ALLOWANCES
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <span>Basic Salary:</span>
                    <span>{formatGHS(activePayslip.basicSalary)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <span>Responsibility Allowance:</span>
                    <span>{formatGHS(activePayslip.responsibilityAllowance)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <span>Transport Allowance:</span>
                    <span>{formatGHS(activePayslip.transportAllowance)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <span>Housing Allowance:</span>
                    <span>{formatGHS(activePayslip.housingAllowance)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 800, borderTop: '1px dashed #CBD5E1', paddingTop: '0.4rem', marginTop: '0.4rem' }}>
                    <span>GROSS SALARY:</span>
                    <span>{formatGHS(activePayslip.grossSalary)}</span>
                  </div>
                </div>

                {/* Deductions */}
                <div style={{ border: '1px solid #CBD5E1', borderRadius: '4px', padding: '0.75rem' }}>
                  <div style={{ fontWeight: 800, borderBottom: '1px solid #CBD5E1', paddingBottom: '0.35rem', marginBottom: '0.5rem', color: '#B91C1C' }}>
                    STATUTORY DEDUCTIONS
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <span>SSNIT Tier 1 & 2 (5.5%):</span>
                    <span>{formatGHS(activePayslip.ssnitEmployee)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <span>GRA PAYE Income Tax:</span>
                    <span>{formatGHS(activePayslip.graPayeTax)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <span>Staff Welfare Levy:</span>
                    <span>{formatGHS(activePayslip.staffWelfare)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748B', marginBottom: '0.3rem' }}>
                    <span>(SSNIT 13.5% Employer Paid):</span>
                    <span>({formatGHS(activePayslip.ssnitEmployer)})</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 800, borderTop: '1px dashed #CBD5E1', paddingTop: '0.4rem', marginTop: '0.4rem', color: '#B91C1C' }}>
                    <span>TOTAL DEDUCTIONS:</span>
                    <span>{formatGHS(activePayslip.totalDeductions)}</span>
                  </div>
                </div>
              </div>

              {/* Net Pay */}
              <div style={{ backgroundColor: '#DCFCE7', border: '2px solid #86EFAC', padding: '1rem', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#14532D' }}>NET TAKE-HOME SALARY:</span>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#15803D' }}>{formatGHS(activePayslip.netSalary)}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
