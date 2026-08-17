import React, { useState } from 'react';
import { PayrollRecord, Teacher } from '../../types';
import { formatGHS } from '../../utils/currency';
import { StatusBadge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { PayslipModal } from './PayslipModal';
import { exportPayrollToCSV } from '../../utils/export';
import { toast } from '../common/Toast';
import { SchoolStore } from '../../data/storage';
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
  Clock,
  ShieldCheck
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
  const currentMonthRecords = payroll.filter(p => p.month === selectedMonth || p.monthYear === selectedMonth);

  // Totals for Ghana Payroll
  const totalGross = currentMonthRecords.reduce((sum, p) => sum + p.grossSalary, 0);
  const totalNet = currentMonthRecords.reduce((sum, p) => sum + p.netSalary, 0);
  const totalSsnitEmployee = currentMonthRecords.reduce((sum, p) => sum + p.ssnitEmployee, 0);
  const totalSsnitEmployer = currentMonthRecords.reduce((sum, p) => sum + p.ssnitEmployer, 0);
  const totalGraPaye = currentMonthRecords.reduce((sum, p) => sum + p.graPayeTax, 0);

  const handleOpenEdit = (record: PayrollRecord) => {
    setEditingRecord(record);
    setEditStatus(record.paymentStatus);
    setEditDate(record.disbursementDate || new Date().toISOString().split('T')[0]);
    setEditMethod((record.paymentMethod as any) || 'Bank Transfer');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;

    const updated: PayrollRecord = {
      ...editingRecord,
      paymentStatus: editStatus,
      disbursementDate: editDate,
      paymentDate: editDate,
      paymentMethod: editMethod
    };

    SchoolStore.updatePayroll(updated);
    toast.success(`Disbursement schedule updated for ${editingRecord.staffName}!`);
    setEditingRecord(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Month Filter & Export Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Calendar size={18} color="var(--brand-primary)" />
          <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0F2537' }}>Payroll Month:</span>
          <select
            className="form-select"
            style={{ width: '180px', fontWeight: 700 }}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="January 2026">January 2026</option>
            <option value="February 2026">February 2026</option>
            <option value="March 2026">March 2026</option>
          </select>
        </div>

        <button
          onClick={() => {
            exportPayrollToCSV(currentMonthRecords);
            toast.success(`Payroll Report for ${selectedMonth} downloaded`);
          }}
          className="btn btn-secondary"
        >
          <Download size={15} />
          <span>Export Payroll (CSV)</span>
        </button>
      </div>

      {/* Statutory Breakdown Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748B' }}>Total Gross Salaries</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F2537', marginTop: '0.25rem' }}>{formatGHS(totalGross)}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>Basic + Allowances</div>
        </div>

        <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748B' }}>Employee SSNIT (5.5%)</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#B91C1C', marginTop: '0.25rem' }}>{formatGHS(totalSsnitEmployee)}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>Withheld from staff pay</div>
        </div>

        <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748B' }}>Employer SSNIT (13.5%)</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#C88719', marginTop: '0.25rem' }}>{formatGHS(totalSsnitEmployer)}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>School direct contribution</div>
        </div>

        <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748B' }}>GRA PAYE Income Tax</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#B91C1C', marginTop: '0.25rem' }}>{formatGHS(totalGraPaye)}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>Monthly tax liability</div>
        </div>

        <div style={{ backgroundColor: '#DCFCE7', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #86EFAC' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#166534' }}>Net Salary Disbursed</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#15803D', marginTop: '0.25rem' }}>{formatGHS(totalNet)}</div>
          <div style={{ fontSize: '0.75rem', color: '#166534', marginTop: '0.2rem' }}>Total staff take-home</div>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Banknote size={18} color="var(--brand-primary)" />
            <span>Staff Payroll Schedule & Payslips</span>
          </div>
          <span className="badge badge-gold">{currentMonthRecords.length} Staff Enrolled</span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Role / Designation</th>
                <th>Basic Salary</th>
                <th>Allowances</th>
                <th>Gross Pay</th>
                <th>SSNIT (5.5%)</th>
                <th>GRA Tax</th>
                <th>Net Disbursed</th>
                <th>Status / Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentMonthRecords.map((rec) => (
                <tr key={rec.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0F2537' }}>{rec.staffName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Bank: {rec.bankAccount.bankName}</div>
                  </td>
                  <td><span className="badge badge-blue">{rec.roleTitle}</span></td>
                  <td>{formatGHS(rec.basicSalary)}</td>
                  <td>{formatGHS(rec.allowances)}</td>
                  <td style={{ fontWeight: 700 }}>{formatGHS(rec.grossSalary)}</td>
                  <td style={{ color: '#B91C1C' }}>-{formatGHS(rec.ssnitEmployee)}</td>
                  <td style={{ color: '#B91C1C' }}>-{formatGHS(rec.graPayeTax)}</td>
                  <td style={{ fontWeight: 800, color: '#15803D', fontSize: '0.95rem' }}>{formatGHS(rec.netSalary)}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <span className={`badge ${rec.paymentStatus === 'Paid' ? 'badge-green' : 'badge-gold'}`}>
                        {rec.paymentStatus}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{rec.disbursementDate || 'Pending'}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => handleOpenEdit(rec)}
                        className="btn btn-secondary btn-sm"
                        title="Edit Disbursement Date"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => setActivePayslip(rec)}
                        className="btn btn-primary btn-sm"
                        title="View & Print Official Payslip"
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

      {/* Edit Disbursement Modal */}
      <Modal
        isOpen={Boolean(editingRecord)}
        onClose={() => setEditingRecord(null)}
        title="Update Salary Disbursement Date"
        subtitle={`Staff: ${editingRecord?.staffName}`}
      >
        <form onSubmit={handleSaveEdit}>
          <div className="form-group">
            <label className="form-label">Payment Status</label>
            <select
              className="form-select"
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as any)}
            >
              <option value="Paid">Disbursed (Paid)</option>
              <option value="Pending">Pending Bank Processing</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Disbursement Date</label>
            <input
              type="date"
              className="form-input"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" onClick={() => setEditingRecord(null)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-gold">
              <CheckCircle2 size={16} />
              <span>Save Schedule</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Official Payslip Modal */}
      <PayslipModal
        isOpen={Boolean(activePayslip)}
        onClose={() => setActivePayslip(null)}
        record={activePayslip}
      />
    </div>
  );
};
