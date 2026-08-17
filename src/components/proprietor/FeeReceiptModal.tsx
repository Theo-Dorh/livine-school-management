import React from 'react';
import { FeePayment, Student } from '../../types';
import { SCHOOL_INFO } from '../../data/mockData';
import { formatGHS } from '../../utils/currency';
import { Modal } from '../common/Modal';
import { Printer, CheckCircle2, Building, School } from 'lucide-react';

interface FeeReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: FeePayment | null;
  student?: Student;
}

export const FeeReceiptModal: React.FC<FeeReceiptModalProps> = ({
  isOpen,
  onClose,
  payment,
  student,
}) => {
  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official School Fee Receipt"
      subtitle="Livine International School Accounts Department"
      size="large"
    >
      <div className="printable-area" style={{ padding: '1rem', backgroundColor: '#FFFFFF' }}>
        {/* Receipt Container */}
        <div
          style={{
            border: '2px solid #0F2537',
            borderRadius: 'var(--radius-md)',
            padding: '2rem',
            backgroundColor: '#FFFFFF',
            position: 'relative',
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
                  background: 'linear-gradient(135deg, #C88719 0%, #A16807 100%)',
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
                  {SCHOOL_INFO.curriculum} • Tel: {SCHOOL_INFO.phone}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ backgroundColor: '#0F2537', color: '#FFFFFF', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 800 }}>
                OFFICIAL RECEIPT
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#C88719', marginTop: '0.35rem' }}>
                {payment.receiptNumber}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                Date: {payment.paymentDate}
              </div>
            </div>
          </div>

          {/* Student & Billing Meta Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              backgroundColor: '#F8FAFC',
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid #E2E8F0',
              marginBottom: '1.25rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 700 }}>Student Name</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F2537' }}>{payment.studentName}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 700 }}>Class / Grade</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F2537' }}>{payment.className}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 700 }}>Academic Term</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F2537' }}>{payment.term} ({payment.academicYear})</div>
            </div>
          </div>

          {/* Transaction Summary Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#0F2537', color: '#FFFFFF' }}>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase' }}>Description / Item</th>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'center', fontSize: '0.75rem', textTransform: 'uppercase' }}>Payment Mode</th>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'center', fontSize: '0.75rem', textTransform: 'uppercase' }}>Transaction Ref</th>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right', fontSize: '0.75rem', textTransform: 'uppercase' }}>Amount Paid (GH₵)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: '0.85rem', fontWeight: 700, color: '#0F2537' }}>
                  Tuition, Facility Maintenance, TLMs & PTA Dues
                </td>
                <td style={{ padding: '0.85rem', textAlign: 'center' }}>
                  <span className="badge badge-blue">{payment.paymentMethod}</span>
                </td>
                <td style={{ padding: '0.85rem', textAlign: 'center', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {payment.momoTransactionId || 'OFFLINE-CASH'}
                </td>
                <td style={{ padding: '0.85rem', textAlign: 'right', fontWeight: 800, fontSize: '1.1rem', color: '#15803D' }}>
                  {formatGHS(payment.amountPaid)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Total & Stamp Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Recorded by: <strong>{payment.recordedBy}</strong></div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.1rem' }}>Status: <strong style={{ color: '#15803D' }}>{payment.status}</strong></div>
              <div style={{ marginTop: '0.85rem', fontSize: '0.7rem', color: '#94A3B8' }}>
                * This computer-generated receipt is a valid proof of payment to Livine International School.
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div
                className="official-stamp"
                style={{
                  width: '90px',
                  height: '90px',
                  fontSize: '0.65rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  margin: '0 auto',
                }}
              >
                <span>LIVINE INTL</span>
                <span style={{ fontSize: '0.55rem', fontWeight: 700 }}>PAID</span>
                <span>{payment.paymentDate}</span>
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0F2537', marginTop: '0.4rem' }}>
                Accounts Officer Seal
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
          <span>Print Official Receipt</span>
        </button>
      </div>
    </Modal>
  );
};
