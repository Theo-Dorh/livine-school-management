import React from 'react';
import { PayrollRecord } from '../../types';
import { SCHOOL_INFO } from '../../data/mockData';
import { formatGHS } from '../../utils/currency';
import { Modal } from '../common/Modal';
import { Printer, School, ShieldCheck } from 'lucide-react';

interface PayslipModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: PayrollRecord | null;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({
  isOpen,
  onClose,
  record,
}) => {
  if (!record) return null;

  const handlePrint = () => {
    window.print();
  };

  const totalDeductions = record.ssnitEmployee + record.graPayeTax + record.otherDeductions;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Staff Monthly Payslip Advice"
      subtitle="Livine International School Payroll & Remittance Division"
      size="large"
    >
      <div className="printable-area" style={{ padding: '1rem', backgroundColor: '#FFFFFF' }}>
        <div
          style={{
            border: '2px solid #0F2537',
            borderRadius: 'var(--radius-md)',
            padding: '2rem',
            backgroundColor: '#FFFFFF',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {/* Header Banner */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '2px solid #0F2537',
              paddingBottom: '1rem',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0F2537 0%, #1A364F 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '1.5rem',
                }}
              >
                <School size={28} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F2537', textTransform: 'uppercase', margin: 0 }}>
                  {SCHOOL_INFO.name}
                </h2>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.15rem' }}>
                  {SCHOOL_INFO.campus} • Digital Address: <strong>{SCHOOL_INFO.digitalAddress}</strong>
                </div>
                <div style={{ fontSize: '0.725rem', color: '#C88719', fontWeight: 700 }}>
                  Ghana Education Service Registered Basic School
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ backgroundColor: '#C88719', color: '#FFFFFF', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 800 }}>
                SALARY PAYSLIP
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F2537', marginTop: '0.35rem' }}>
                Period: {record.month}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                Disbursed: {record.disbursementDate || 'Processed'}
              </div>
            </div>
          </div>

          {/* Staff Details Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.75rem',
              backgroundColor: '#F8FAFC',
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid #E2E8F0',
              marginBottom: '1.5rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.675rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 700 }}>Employee Name</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F2537' }}>{record.staffName}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.675rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 700 }}>Designation</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F2537' }}>{record.roleTitle}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.675rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 700 }}>Bank Account</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F2537' }}>{record.bankAccount.bankName}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{record.bankAccount.accountNumber}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.675rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 700 }}>Status</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#15803D' }}>{record.paymentStatus}</div>
            </div>
          </div>

          {/* Earnings vs Deductions Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {/* Earnings Column */}
            <div style={{ border: '1px solid #E2E8F0', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#0F2537', color: '#FFFFFF', padding: '0.5rem 0.85rem', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                A. Gross Earnings
              </div>
              <div style={{ padding: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px dashed #E2E8F0', fontSize: '0.85rem' }}>
                  <span>Basic Monthly Salary:</span>
                  <span style={{ fontWeight: 700 }}>{formatGHS(record.basicSalary)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px dashed #E2E8F0', fontSize: '0.85rem' }}>
                  <span>Teaching Allowances:</span>
                  <span style={{ fontWeight: 700 }}>{formatGHS(record.allowances)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0 0.2rem', fontWeight: 800, fontSize: '0.95rem', color: '#0F2537' }}>
                  <span>Total Gross Earnings:</span>
                  <span style={{ color: '#15803D' }}>{formatGHS(record.grossSalary)}</span>
                </div>
              </div>
            </div>

            {/* Statutory Deductions Column */}
            <div style={{ border: '1px solid #E2E8F0', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#991B1B', color: '#FFFFFF', padding: '0.5rem 0.85rem', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                B. Statutory Tax & Pension Deductions
              </div>
              <div style={{ padding: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px dashed #E2E8F0', fontSize: '0.85rem' }}>
                  <span>Employee SSNIT (5.5% Tier 1/2):</span>
                  <span style={{ fontWeight: 700, color: '#B91C1C' }}>-{formatGHS(record.ssnitEmployee)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px dashed #E2E8F0', fontSize: '0.85rem' }}>
                  <span>GRA PAYE Income Tax:</span>
                  <span style={{ fontWeight: 700, color: '#B91C1C' }}>-{formatGHS(record.graPayeTax)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0 0.2rem', fontWeight: 800, fontSize: '0.95rem', color: '#991B1B' }}>
                  <span>Total Deductions:</span>
                  <span>-{formatGHS(totalDeductions)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Take-Home Highlight Card */}
          <div
            style={{
              backgroundColor: '#DCFCE7',
              border: '2px solid #86EFAC',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>
                Net Monthly Take-Home Pay (Disbursed)
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#15803D' }}>
                {formatGHS(record.netSalary)}
              </div>
            </div>

            <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#166534' }}>
              <div>Employer SSNIT Remittance (13.5%): <strong>{formatGHS(record.ssnitEmployer)}</strong></div>
              <div>Total Pension Contribution (19.0%): <strong>{formatGHS(record.ssnitEmployee + record.ssnitEmployer)}</strong></div>
            </div>
          </div>

          {/* Footer & Seal */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.725rem', color: '#64748B', maxWidth: '400px' }}>
              This slip confirms salary computation adhering to the Ghanaian Labour Act, National Pensions Regulatory Authority (NPRA), and GRA Income Tax guidelines.
            </div>

            <div style={{ textAlign: 'center' }}>
              <div
                className="official-stamp"
                style={{
                  width: '85px',
                  height: '85px',
                  fontSize: '0.65rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  margin: '0 auto',
                }}
              >
                <span>LIVINE INTL</span>
                <span style={{ fontSize: '0.55rem', fontWeight: 700 }}>PAYROLL</span>
                <span>VERIFIED</span>
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0F2537', marginTop: '0.35rem' }}>
                Bursar Signature & Seal
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }} className="no-print">
        <button type="button" onClick={onClose} className="btn btn-secondary">
          Close
        </button>
        <button type="button" onClick={handlePrint} className="btn btn-gold">
          <Printer size={16} />
          <span>Print Official Payslip</span>
        </button>
      </div>
    </Modal>
  );
};
