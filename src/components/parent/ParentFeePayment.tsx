import React, { useState } from 'react';
import {
  Student,
  Parent,
  FeePayment,
  FeeStructure,
  AcademicTerm
} from '../../types';
import { formatGHS } from '../../utils/currency';
import { StatusBadge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { SchoolStore } from '../../data/storage';
import { SCHOOL_INFO } from '../../data/mockData';
import {
  CreditCard,
  Phone,
  CheckCircle2,
  Printer,
  ShieldCheck,
  Smartphone,
  Building,
  School,
  Lock,
  ArrowRight
} from 'lucide-react';

interface ParentFeePaymentProps {
  parent: Parent;
  student: Student;
  feePayments: FeePayment[];
  feeStructures: FeeStructure[];
  activeTerm: AcademicTerm;
}

export const ParentFeePayment: React.FC<ParentFeePaymentProps> = ({
  parent,
  student,
  feePayments,
  feeStructures,
  activeTerm
}) => {
  // Determine fee structure for this ward
  let level: FeeStructure['classLevel'] = 'Upper Primary';
  if (student.className.includes('Nursery')) level = 'Nursery';
  else if (student.className.includes('KG')) level = 'KG';
  else if (student.className.includes('Basic 1') || student.className.includes('Basic 2') || student.className.includes('Basic 3')) level = 'Lower Primary';
  else if (student.className.includes('Basic 4') || student.className.includes('Basic 5') || student.className.includes('Basic 6')) level = 'Upper Primary';
  else if (student.className.includes('JHS')) level = 'JHS';

  const structure = feeStructures.find(f => f.classLevel === level) || feeStructures[0];
  const totalBilled = structure ? structure.totalFee : 3000;

  const wardPayments = feePayments.filter(p => p.studentId === student.id && p.term === activeTerm);
  const totalPaid = wardPayments.reduce((sum, p) => sum + p.amountPaid, 0);
  const arrears = Math.max(0, totalBilled - totalPaid);

  // Payment checkout state
  const [isMoMoModalOpen, setIsMoMoModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(arrears > 0 ? arrears : 1000);
  const [momoNetwork, setMomoNetwork] = useState<'MTN Mobile Money' | 'Telecel Cash' | 'AT Money'>('MTN Mobile Money');
  const [momoNumber, setMomoNumber] = useState(parent.phone.replace(/[^0-9+]/g, '') || '0244987654');
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'success'>('form');
  const [recentGeneratedPayment, setRecentGeneratedPayment] = useState<FeePayment | null>(null);

  const handleStartPayment = () => {
    setPayAmount(arrears > 0 ? arrears : 1000);
    setPaymentStep('form');
    setIsMoMoModalOpen(true);
  };

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStep('processing');

    setTimeout(() => {
      const receiptNo = `LIS-REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date();
      const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

      const newPayment: FeePayment = {
        id: `pay-${Date.now()}`,
        receiptNo,
        studentId: student.id,
        studentName: student.fullName,
        classId: student.classId,
        className: student.className,
        term: activeTerm,
        academicYear: '2025/2026',
        amountPaid: Number(payAmount),
        paymentMethod: momoNetwork,
        transactionRef: `MM-TXN-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        date: formattedDate,
        receivedBy: 'Livine Automated MoMo Gateway',
        payerName: parent.fullName,
        payerPhone: momoNumber,
        notes: `Online Parent MoMo Fee Payment for ${student.fullName}`
      };

      SchoolStore.addFeePayment(newPayment);
      setRecentGeneratedPayment(newPayment);
      setPaymentStep('success');
    }, 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
            School Fees & Mobile Money Payment Center
          </h2>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
            Instant tuition clearance via MTN MoMo, Telecel Cash & Bank transfers for {student.fullName} ({student.className})
          </p>
        </div>

        <button
          onClick={handleStartPayment}
          className="btn btn-gold btn-lg"
        >
          <Smartphone size={18} />
          <span>Pay Fees with Mobile Money</span>
        </button>
      </div>

      {/* Financial Overview Cards */}
      <div className="stat-grid">
        <div className="stat-card blue">
          <div>
            <div className="stat-label">Term Fee Structure</div>
            <div className="stat-value">{formatGHS(totalBilled)}</div>
            <div className="stat-trend" style={{ color: 'var(--brand-blue)' }}>
              <span>{structure?.classLevel} Standard Tariff</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8' }}>
            <Building size={22} />
          </div>
        </div>

        <div className="stat-card green">
          <div>
            <div className="stat-label">Total Amount Paid</div>
            <div className="stat-value">{formatGHS(totalPaid)}</div>
            <div className="stat-trend positive">
              <span>{wardPayments.length} verified payment(s)</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#DCFCE7', color: '#15803D' }}>
            <CheckCircle2 size={22} />
          </div>
        </div>

        <div className={`stat-card ${arrears === 0 ? 'green' : 'red'}`}>
          <div>
            <div className="stat-label">Outstanding Balance</div>
            <div className="stat-value" style={{ color: arrears === 0 ? '#15803D' : '#B91C1C' }}>
              {formatGHS(arrears)}
            </div>
            <div className={`stat-trend ${arrears === 0 ? 'positive' : 'negative'}`}>
              <span>{arrears === 0 ? 'Account in good standing' : 'Payment due before exams'}</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: arrears === 0 ? '#DCFCE7' : '#FEE2E2', color: arrears === 0 ? '#15803D' : '#B91C1C' }}>
            <CreditCard size={22} />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Itemized Bill Breakdown & Payment History */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Itemized Fee Breakdown */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Building size={18} color="var(--brand-primary)" />
              <span>Itemized Term Bill ({activeTerm})</span>
            </div>
            <span className="badge badge-gold">{structure?.classLevel}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-light)', fontSize: '0.875rem' }}>
              <span>Tuition & Academic Instruction:</span>
              <strong style={{ color: 'var(--brand-primary)' }}>{formatGHS(structure?.tuitionFee || 1500)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-light)', fontSize: '0.875rem' }}>
              <span>Canteen & Daily Hot Feeding Program:</span>
              <strong style={{ color: 'var(--brand-primary)' }}>{formatGHS(structure?.canteenFeedingFee || 450)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-light)', fontSize: '0.875rem' }}>
              <span>School Bus Transportation Levy:</span>
              <strong style={{ color: 'var(--brand-primary)' }}>{formatGHS(structure?.busTransportFee || 400)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-light)', fontSize: '0.875rem' }}>
              <span>Computer Laboratory & High-Speed ICT:</span>
              <strong style={{ color: 'var(--brand-primary)' }}>{formatGHS(structure?.ictLabFee || 200)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-light)', fontSize: '0.875rem' }}>
              <span>Exam Stationery & Printed Class Worksheets:</span>
              <strong style={{ color: 'var(--brand-primary)' }}>{formatGHS(structure?.examStationeryFee || 150)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-light)', fontSize: '0.875rem' }}>
              <span>Library & Media Center Access:</span>
              <strong style={{ color: 'var(--brand-primary)' }}>{formatGHS(structure?.libraryFee || 100)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-light)', fontSize: '0.875rem' }}>
              <span>PTA Levy & Campus Infrastructure Fund:</span>
              <strong style={{ color: 'var(--brand-primary)' }}>{formatGHS(structure?.ptaLevy || 100)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderTop: '2px solid var(--brand-primary)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
              <span>TOTAL BILL:</span>
              <span style={{ color: '#15803D' }}>{formatGHS(totalBilled)}</span>
            </div>
          </div>
        </div>

        {/* Payment History & Receipts */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <CheckCircle2 size={18} color="#15803D" />
              <span>Official Payment History & Receipts</span>
            </div>
            <span className="badge badge-green">{wardPayments.length} Receipts</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {wardPayments.map((pay) => (
              <div 
                key={pay.id}
                style={{ 
                  padding: '1rem', 
                  backgroundColor: '#F8FAFC', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <strong style={{ color: 'var(--brand-primary)', fontSize: '0.9rem' }}>{pay.receiptNo}</strong>
                    <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>{pay.paymentMethod}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    {pay.date} • Ref: {pay.transactionRef}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    {pay.notes}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#15803D' }}>
                    {formatGHS(pay.amountPaid)}
                  </div>
                  <button
                    onClick={() => {
                      setRecentGeneratedPayment(pay);
                      setIsMoMoModalOpen(true);
                      setPaymentStep('success');
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: '0.35rem' }}
                  >
                    <Printer size={13} />
                    <span>Receipt</span>
                  </button>
                </div>
              </div>
            ))}

            {wardPayments.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>
                <CreditCard size={32} color="var(--brand-gold)" style={{ margin: '0 auto 0.5rem' }} />
                <p style={{ fontSize: '0.85rem' }}>No payments recorded for {activeTerm} yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Money Payment & Receipt Modal */}
      <Modal
        isOpen={isMoMoModalOpen}
        onClose={() => setIsMoMoModalOpen(false)}
        title={paymentStep === 'success' ? 'Official Fee Payment Receipt' : 'Mobile Money Instant Fee Payment'}
        subtitle={`Student: ${student.fullName} (${student.className})`}
        size={paymentStep === 'success' ? 'large' : 'normal'}
      >
        {paymentStep === 'form' && (
          <form onSubmit={handleExecutePayment}>
            <div className="form-group">
              <label className="form-label">Payment Amount (GH₵) *</label>
              <input
                type="number"
                step="10"
                className="form-input"
                value={payAmount}
                onChange={(e) => setPayAmount(Number(e.target.value))}
                min="10"
                required
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                Current outstanding arrears: <strong>{formatGHS(arrears)}</strong>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Select Mobile Money Network *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {(['MTN Mobile Money', 'Telecel Cash', 'AT Money'] as const).map(net => (
                  <button
                    key={net}
                    type="button"
                    onClick={() => setMomoNetwork(net)}
                    style={{
                      padding: '0.65rem 0.5rem',
                      borderRadius: 'var(--radius-md)',
                      border: momoNetwork === net ? '2px solid #C88719' : '1px solid var(--border-medium)',
                      backgroundColor: momoNetwork === net ? '#FEF3C7' : '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      color: momoNetwork === net ? '#92400E' : 'var(--text-primary)',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    {net === 'MTN Mobile Money' ? '🟡 MTN MoMo' : net === 'Telecel Cash' ? '🔴 Telecel Cash' : '🔵 AT Money'}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Money Wallet Number *</label>
              <input
                type="text"
                className="form-input"
                value={momoNumber}
                onChange={(e) => setMomoNumber(e.target.value)}
                placeholder="e.g. 0244 123 456"
                required
              />
            </div>

            <div style={{ backgroundColor: '#F8FAFC', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Lock size={16} color="#15803D" />
              <span>Secured 256-bit encrypted Ghanaian MoMo payment channel. Instant official receipt generated upon approval.</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setIsMoMoModalOpen(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-gold"
              >
                <Smartphone size={16} />
                <span>Authorize {formatGHS(payAmount)} Payment</span>
              </button>
            </div>
          </form>
        )}

        {paymentStep === 'processing' && (
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <div style={{ width: '48px', height: '48px', border: '4px solid #F6BC47', borderTopColor: '#0F2537', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '0.5rem' }}>
              Waiting for Mobile Money Approval...
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
              A prompt has been sent to <strong>{momoNumber}</strong>. Please enter your MoMo PIN to authorize payment of <strong>{formatGHS(payAmount)}</strong>.
            </p>
          </div>
        )}

        {paymentStep === 'success' && recentGeneratedPayment && (
          <div>
            <div className="printable-area" style={{ backgroundColor: '#FFF', padding: '1rem' }}>
              <div style={{ border: '2px solid #0F2537', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', borderBottom: '2px solid #0F2537', paddingBottom: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <School size={28} color="#0F2537" />
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F2537' }}>
                      {SCHOOL_INFO.name}
                    </h2>
                  </div>
                  <p style={{ fontStyle: 'italic', fontSize: '0.8rem', color: '#C88719', fontWeight: 700 }}>
                    "{SCHOOL_INFO.motto}"
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#475569' }}>
                    {SCHOOL_INFO.address} • Tel: {SCHOOL_INFO.phone}
                  </p>
                  <div style={{ marginTop: '0.4rem', display: 'inline-block', backgroundColor: '#0F2537', color: '#FFF', padding: '0.2rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }}>
                    OFFICIAL ELECTRONIC SCHOOL FEES RECEIPT
                  </div>
                </div>

                {/* Details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  <div>
                    <div><strong>Receipt No:</strong> <span style={{ color: '#0F2537', fontWeight: 800 }}>{recentGeneratedPayment.receiptNo}</span></div>
                    <div><strong>Student Name:</strong> {recentGeneratedPayment.studentName}</div>
                    <div><strong>Class:</strong> {recentGeneratedPayment.className}</div>
                  </div>
                  <div>
                    <div><strong>Date:</strong> {recentGeneratedPayment.date}</div>
                    <div><strong>Channel:</strong> {recentGeneratedPayment.paymentMethod}</div>
                    <div><strong>Transaction Ref:</strong> {recentGeneratedPayment.transactionRef}</div>
                  </div>
                </div>

                {/* Amount Paid Box */}
                <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: '#0F2537' }}>AMOUNT RECEIVED:</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#15803D' }}>{formatGHS(recentGeneratedPayment.amountPaid)}</span>
                </div>

                {/* Stamp & Sign */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1.25rem' }}>
                  <div>
                    <div style={{ borderBottom: '1px solid #334155', width: '160px', height: '25px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', fontFamily: 'cursive', fontSize: '1.1rem' }}>
                      Rev. Livingstone
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>
                      Authorized Bursar / Accounts
                    </div>
                  </div>

                  <div className="official-stamp" style={{ width: '85px', height: '85px', fontSize: '0.55rem' }}>
                    LIVINE INT. SCHOOL<br />VERIFIED PAYMENT<br />ACCOUNTS DEPT
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.25rem' }}>
              <button
                onClick={() => window.print()}
                className="btn btn-primary"
              >
                <Printer size={16} />
                <span>Print Official Receipt</span>
              </button>
              <button
                onClick={() => setIsMoMoModalOpen(false)}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
