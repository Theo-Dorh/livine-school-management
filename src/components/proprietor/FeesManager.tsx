import React, { useState } from 'react';
import {
  Student,
  ClassRoom,
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
  Search,
  PlusCircle,
  Printer,
  CheckCircle2,
  FileCheck,
  Building,
  School,
  Edit2,
  Trash2
} from 'lucide-react';

interface FeesManagerProps {
  students: Student[];
  classes: ClassRoom[];
  feePayments: FeePayment[];
  feeStructures: FeeStructure[];
  activeTerm: AcademicTerm;
}

export const FeesManager: React.FC<FeesManagerProps> = ({
  students,
  classes,
  feePayments,
  feeStructures,
  activeTerm
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedStudentForPayment, setSelectedStudentForPayment] = useState<Student | null>(null);

  // New or Edit payment form state
  const [editingPayment, setEditingPayment] = useState<FeePayment | null>(null);
  const [payAmount, setPayAmount] = useState<number>(1000);
  const [payMethod, setPayMethod] = useState<FeePayment['paymentMethod']>('MTN Mobile Money');
  const [payerName, setPayerName] = useState('');
  const [payerPhone, setPayerPhone] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [notes, setNotes] = useState('');

  // Printable Receipt Modal State
  const [activeReceipt, setActiveReceipt] = useState<FeePayment | null>(null);

  // Helper to determine fee for student
  const getStudentFeeDetails = (student: Student) => {
    let level: FeeStructure['classLevel'] = 'Upper Primary';
    if (student.className.includes('Nursery')) level = 'Nursery';
    else if (student.className.includes('KG')) level = 'KG';
    else if (student.className.includes('Basic 1') || student.className.includes('Basic 2') || student.className.includes('Basic 3')) level = 'Lower Primary';
    else if (student.className.includes('Basic 4') || student.className.includes('Basic 5') || student.className.includes('Basic 6')) level = 'Upper Primary';
    else if (student.className.includes('JHS')) level = 'JHS';

    const structure = feeStructures.find(f => f.classLevel === level) || feeStructures[0];
    const totalBilled = structure ? structure.totalFee : 3000;

    const studentPayments = feePayments.filter(p => p.studentId === student.id && p.term === activeTerm);
    const totalPaid = studentPayments.reduce((sum, p) => sum + p.amountPaid, 0);
    const arrears = Math.max(0, totalBilled - totalPaid);

    let status = 'Unpaid';
    if (totalPaid >= totalBilled) status = 'Paid';
    else if (totalPaid > 0) status = 'Partial';

    return { totalBilled, totalPaid, arrears, status, payments: studentPayments, structure };
  };

  // Filter students
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || s.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || s.classId === selectedClass;
    return matchesSearch && matchesClass;
  });

  const handleOpenPayment = (student: Student, paymentToEdit?: FeePayment) => {
    setSelectedStudentForPayment(student);
    if (paymentToEdit) {
      setEditingPayment(paymentToEdit);
      setPayAmount(paymentToEdit.amountPaid);
      setPayMethod(paymentToEdit.paymentMethod);
      setPayerName(paymentToEdit.payerName);
      setPayerPhone(paymentToEdit.payerPhone);
      setTransactionRef(paymentToEdit.transactionRef);
      setNotes(paymentToEdit.notes || '');
    } else {
      setEditingPayment(null);
      const feeInfo = getStudentFeeDetails(student);
      setPayAmount(feeInfo.arrears > 0 ? feeInfo.arrears : 1000);
      setPayerName(student.parentName || '');
      setPayerPhone(student.parentPhone || '');
      setTransactionRef(`MM-TXN-${Math.floor(100000000 + Math.random() * 900000000)}`);
      setNotes(`Fees payment for ${activeTerm}`);
    }
    setIsPaymentModalOpen(true);
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForPayment) return;

    if (editingPayment) {
      const updated: FeePayment = {
        ...editingPayment,
        amountPaid: Number(payAmount),
        paymentMethod: payMethod,
        transactionRef: transactionRef || editingPayment.transactionRef,
        payerName: payerName || editingPayment.payerName,
        payerPhone: payerPhone || editingPayment.payerPhone,
        notes
      };
      SchoolStore.updateFeePayment(updated);
      setIsPaymentModalOpen(false);
      setActiveReceipt(updated);
    } else {
      const receiptNo = `LIS-REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date();
      const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

      const newPayment: FeePayment = {
        id: `pay-${Date.now()}`,
        receiptNo,
        studentId: selectedStudentForPayment.id,
        studentName: selectedStudentForPayment.fullName,
        classId: selectedStudentForPayment.classId,
        className: selectedStudentForPayment.className,
        term: activeTerm,
        academicYear: '2025/2026',
        amountPaid: Number(payAmount),
        paymentMethod: payMethod,
        transactionRef: transactionRef || `REF-${Date.now()}`,
        date: formattedDate,
        receivedBy: 'Admin Accounts',
        payerName: payerName || selectedStudentForPayment.parentName,
        payerPhone: payerPhone || selectedStudentForPayment.parentPhone,
        notes
      };

      SchoolStore.addFeePayment(newPayment);
      setIsPaymentModalOpen(false);
      setActiveReceipt(newPayment);
    }
  };

  const handleDeletePayment = (paymentId: string) => {
    if (window.confirm('Are you sure you want to remove this payment record? The student arrears balance will be recalculated.')) {
      SchoolStore.deleteFeePayment(paymentId);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Title & Fee Structures Summary */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
            School Fees & Arrears Management
          </h2>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
            Track fee billing, update recorded payments, resolve arrears balances, and generate official receipts in GH₵
          </p>
        </div>
      </div>

      {/* Trimester Fee Schedules (Ghanaian Basic Breakdown) */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <CreditCard size={18} color="var(--brand-gold)" />
            <span>Approved Trimester Fee Structures ({activeTerm})</span>
          </div>
          <span className="badge badge-gold">NaCCA Standard Level Tariffs</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
          {feeStructures.map((f) => (
            <div 
              key={f.id}
              style={{ 
                backgroundColor: 'var(--bg-subtle)', 
                padding: '1.15rem', 
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)'
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
                {f.classLevel}
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#15803D', margin: '0.25rem 0' }}>
                {formatGHS(f.totalFee)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.5rem', borderTop: '1px dashed var(--border-medium)', paddingTop: '0.5rem' }}>
                <div>• Tuition: {formatGHS(f.tuitionFee)}</div>
                <div>• Feeding/Canteen: {formatGHS(f.canteenFeedingFee)}</div>
                <div>• ICT & Lab: {formatGHS(f.ictLabFee)}</div>
                <div>• Bus & PTA: {formatGHS(f.busTransportFee + f.ptaLevy)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Fee Ledger */}
      <div className="card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div className="card-title">
              <Building size={18} color="var(--brand-primary)" />
              <span>Student Fee Ledger & Payment Register</span>
            </div>
            <div className="card-subtitle">Showing {filteredStudents.length} students enrolled</div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '32px', width: '220px' }}
                placeholder="Search student or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="form-select"
              style={{ width: '180px' }}
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="all">All Classes</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Class</th>
                <th>Total Billed</th>
                <th>Amount Paid</th>
                <th>Arrears Balance</th>
                <th>Payment Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((stu) => {
                const fee = getStudentFeeDetails(stu);
                return (
                  <tr key={stu.id}>
                    <td style={{ fontWeight: 700, color: 'var(--brand-primary)', fontSize: '0.8rem' }}>
                      {stu.studentId}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{stu.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Parent: {stu.parentName}</div>
                    </td>
                    <td>
                      <span className="badge badge-gray">{stu.className}</span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{formatGHS(fee.totalBilled)}</td>
                    <td style={{ fontWeight: 700, color: '#15803D' }}>{formatGHS(fee.totalPaid)}</td>
                    <td style={{ fontWeight: 800, color: fee.arrears > 0 ? '#B91C1C' : '#15803D' }}>
                      {formatGHS(fee.arrears)}
                    </td>
                    <td>
                      <StatusBadge status={fee.status} />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleOpenPayment(stu)}
                          className="btn btn-primary btn-sm"
                          title="Record / Add Payment"
                        >
                          <PlusCircle size={14} />
                          <span>Pay</span>
                        </button>
                        {fee.payments.length > 0 && (
                          <>
                            <button
                              onClick={() => handleOpenPayment(stu, fee.payments[0])}
                              className="btn btn-secondary btn-sm"
                              title="Edit / Update Recorded Payment"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => setActiveReceipt(fee.payments[0])}
                              className="btn btn-secondary btn-sm"
                              title="View Last Receipt"
                            >
                              <FileCheck size={13} />
                            </button>
                            <button
                              onClick={() => handleDeletePayment(fee.payments[0].id)}
                              className="btn btn-danger btn-sm"
                              title="Delete Payment Entry"
                            >
                              <Trash2 size={13} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record / Update Fee Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title={editingPayment ? 'Update / Adjust Recorded Fee Payment' : 'Record School Fee Payment'}
        subtitle={`Student: ${selectedStudentForPayment?.fullName} (${selectedStudentForPayment?.className})`}
      >
        <form onSubmit={handleSavePayment}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Payment Amount (GH₵) *</label>
              <input
                type="number"
                step="10"
                className="form-input"
                value={payAmount}
                onChange={(e) => setPayAmount(Number(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Payment Channel *</label>
              <select
                className="form-select"
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value as any)}
              >
                <option value="MTN Mobile Money">MTN Mobile Money (MoMo)</option>
                <option value="Telecel Cash">Telecel Cash</option>
                <option value="AT Money">AT Money</option>
                <option value="Bank Deposit / Transfer">Bank Deposit / Transfer (GCB/Ecobank)</option>
                <option value="Cash">Cash at School Bursary</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Payer Name</label>
              <input
                type="text"
                className="form-input"
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                placeholder="Parent / Guardian Name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Payer Phone Number</label>
              <input
                type="text"
                className="form-input"
                value={payerPhone}
                onChange={(e) => setPayerPhone(e.target.value)}
                placeholder="+233 24 498 7654"
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">MoMo Transaction ID / Bank Reference</label>
              <input
                type="text"
                className="form-input"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="e.g. MM-TXN-98421098"
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Payment Remarks / Breakdown</label>
              <input
                type="text"
                className="form-input"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Term 2 Part Payment (Tuition & Feeding)"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-gold"
            >
              <CheckCircle2 size={16} />
              <span>{editingPayment ? 'Save Payment Adjustment' : 'Confirm & Issue Official Receipt'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Official Printable Fee Receipt Modal */}
      <Modal
        isOpen={!!activeReceipt}
        onClose={() => setActiveReceipt(null)}
        title="Official School Fee Payment Receipt"
        subtitle="Livine International School Bursary & Accounts Department"
        size="large"
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
              Authorized by Livine Accounts Office • Accra, Ghana
            </span>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => window.print()}
                className="btn btn-primary"
              >
                <Printer size={16} />
                <span>Print Official Receipt</span>
              </button>
              <button
                onClick={() => setActiveReceipt(null)}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        }
      >
        {activeReceipt && (
          <div className="printable-area" style={{ padding: '1rem', backgroundColor: '#FFF' }}>
            <div style={{ border: '2px solid #0F2537', padding: '1.5rem', borderRadius: 'var(--radius-md)', position: 'relative' }}>
              <div style={{ textAlign: 'center', borderBottom: '2px solid #0F2537', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <School size={28} color="#0F2537" />
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F2537', textTransform: 'uppercase' }}>
                    {SCHOOL_INFO.name}
                  </h2>
                </div>
                <p style={{ fontStyle: 'italic', fontSize: '0.8rem', color: '#C88719', fontWeight: 700 }}>
                  "{SCHOOL_INFO.motto}"
                </p>
                <p style={{ fontSize: '0.75rem', color: '#475569' }}>
                  {SCHOOL_INFO.address} • Digital: {SCHOOL_INFO.digitalAddress} • Tel: {SCHOOL_INFO.phone}
                </p>
                <div style={{ marginTop: '0.5rem', display: 'inline-block', backgroundColor: '#0F2537', color: '#FFF', padding: '0.2rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }}>
                  OFFICIAL SCHOOL FEES RECEIPT
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
                <div>
                  <div><strong style={{ color: '#64748B' }}>Receipt Number:</strong> <span style={{ color: '#0F2537', fontWeight: 800 }}>{activeReceipt.receiptNo}</span></div>
                  <div><strong style={{ color: '#64748B' }}>Student Name:</strong> <span style={{ fontWeight: 700 }}>{activeReceipt.studentName}</span></div>
                  <div><strong style={{ color: '#64748B' }}>Class:</strong> {activeReceipt.className}</div>
                  <div><strong style={{ color: '#64748B' }}>Academic Term:</strong> {activeReceipt.term} ({activeReceipt.academicYear})</div>
                </div>
                <div>
                  <div><strong style={{ color: '#64748B' }}>Date & Time:</strong> {activeReceipt.date}</div>
                  <div><strong style={{ color: '#64748B' }}>Payment Method:</strong> {activeReceipt.paymentMethod}</div>
                  <div><strong style={{ color: '#64748B' }}>Transaction Ref:</strong> {activeReceipt.transactionRef}</div>
                  <div><strong style={{ color: '#64748B' }}>Payer:</strong> {activeReceipt.payerName} ({activeReceipt.payerPhone})</div>
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: '#0F2537' }}>AMOUNT RECEIVED (GHANA CEDIS):</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#15803D' }}>{formatGHS(activeReceipt.amountPaid)}</span>
                </div>
                {activeReceipt.notes && (
                  <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.35rem' }}>
                    Note: {activeReceipt.notes}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1.5rem', paddingTop: '1rem' }}>
                <div>
                  <div style={{ borderBottom: '1px solid #334155', width: '180px', height: '30px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', fontFamily: 'cursive', fontSize: '1.1rem' }}>
                    Rev. Livingstone
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginTop: '0.2rem' }}>
                    Authorized Bursar / Cashier
                  </div>
                </div>

                <div className="official-stamp" style={{ width: '90px', height: '90px', fontSize: '0.6rem' }}>
                  LIVINE INT. SCHOOL<br />PAID & VERIFIED<br />ACCOUNTS
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
