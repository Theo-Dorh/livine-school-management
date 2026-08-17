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
import { FeeReceiptModal } from './FeeReceiptModal';
import { WhatsAppReminderModal } from '../common/WhatsAppReminderModal';
import { exportDebtorsToCSV } from '../../utils/export';
import { toast } from '../common/Toast';
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
  Trash2,
  Download,
  MessageCircle,
  Send
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

  // WhatsApp Reminder Modal State
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [whatsAppTargetStudent, setWhatsAppTargetStudent] = useState<Student | null>(null);
  const [whatsAppFeeDetails, setWhatsAppFeeDetails] = useState<{ totalBilled: number; totalPaid: number; arrears: number } | null>(null);
  const [whatsAppBroadcastMode, setWhatsAppBroadcastMode] = useState<'single' | 'broadcast'>('single');

  // Helper to determine fee for student
  const getStudentFeeDetails = (student: Student) => {
    let level: FeeStructure['classLevel'] = 'Upper Primary';
    if (student.className.includes('Nursery')) level = 'Nursery';
    else if (student.className.includes('KG')) level = 'KG';
    else if (student.className.includes('Basic 1') || student.className.includes('Basic 2') || student.className.includes('Basic 3')) level = 'Lower Primary';
    else if (student.className.includes('Basic 4') || student.className.includes('Basic 5') || student.className.includes('Basic 6')) level = 'Upper Primary';
    else if (student.className.includes('JHS')) level = 'JHS';

    const structure = feeStructures.find(f => f.classLevel === level);
    const totalBilled = structure ? structure.totalFee : 3000;

    const studentPayments = feePayments.filter(
      p => p.studentId === student.id && p.term === activeTerm
    );
    const totalPaid = studentPayments.reduce((acc, p) => acc + p.amountPaid, 0);
    const arrears = Math.max(0, totalBilled - totalPaid);

    let status: 'Paid' | 'Partial' | 'Pending' | 'Overdue' = 'Pending';
    if (arrears === 0) status = 'Paid';
    else if (totalPaid > 0) status = 'Partial';
    else status = 'Overdue';

    return {
      structure,
      totalBilled,
      totalPaid,
      arrears,
      status,
      payments: studentPayments
    };
  };

  const handleOpenPayment = (student: Student, paymentToEdit?: FeePayment) => {
    setSelectedStudentForPayment(student);
    if (paymentToEdit) {
      setEditingPayment(paymentToEdit);
      setPayAmount(paymentToEdit.amountPaid);
      setPayMethod(paymentToEdit.paymentMethod);
      setPayerName(paymentToEdit.payerName || student.parentName);
      setPayerPhone(paymentToEdit.payerPhone || student.parentPhone);
      setTransactionRef(paymentToEdit.momoTransactionId || '');
      setNotes(paymentToEdit.notes || '');
    } else {
      setEditingPayment(null);
      const details = getStudentFeeDetails(student);
      setPayAmount(details.arrears > 0 ? details.arrears : 500);
      setPayMethod('MTN Mobile Money');
      setPayerName(student.parentName);
      setPayerPhone(student.parentPhone);
      setTransactionRef(`MM-${Math.floor(100000000 + Math.random() * 900000000)}`);
      setNotes('');
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
        payerName,
        payerPhone,
        momoTransactionId: transactionRef,
        notes
      };
      SchoolStore.updateFeePayment(updated);
      toast.success(`Payment voucher updated for ${selectedStudentForPayment.fullName}`);
    } else {
      const receiptNo = `LIS-REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newPayment: FeePayment = {
        id: `pay-${Date.now()}`,
        receiptNumber: receiptNo,
        studentId: selectedStudentForPayment.id,
        studentName: selectedStudentForPayment.fullName,
        className: selectedStudentForPayment.className,
        amountPaid: Number(payAmount),
        paymentMethod: payMethod,
        momoTransactionId: transactionRef,
        payerName,
        payerPhone,
        term: activeTerm,
        academicYear: '2025/2026',
        paymentDate: new Date().toISOString().split('T')[0],
        recordedBy: 'Accounts Officer (Mrs. Joyce Frimpong)',
        status: 'Completed',
        notes
      };
      SchoolStore.addFeePayment(newPayment);
      toast.success(`Official Receipt ${receiptNo} issued!`, 'Payment Recorded');
      setActiveReceipt(newPayment);
    }

    setIsPaymentModalOpen(false);
  };

  const handleDeletePayment = (paymentId: string) => {
    if (window.confirm('Are you sure you want to void and delete this payment record from the Accounts Ledger?')) {
      SchoolStore.deleteFeePayment(paymentId);
      toast.info('Payment record voided from ledger');
    }
  };

  const handleOpenWhatsAppForStudent = (student: Student) => {
    const details = getStudentFeeDetails(student);
    setWhatsAppTargetStudent(student);
    setWhatsAppFeeDetails({
      totalBilled: details.totalBilled,
      totalPaid: details.totalPaid,
      arrears: details.arrears
    });
    setWhatsAppBroadcastMode('single');
    setIsWhatsAppModalOpen(true);
  };

  const handleOpenWhatsAppBroadcast = () => {
    setWhatsAppTargetStudent(null);
    setWhatsAppBroadcastMode('broadcast');
    setIsWhatsAppModalOpen(true);
  };

  const filteredStudents = students.filter(stu => {
    const matchesSearch = stu.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          stu.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || stu.classId === selectedClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Official Tariff Schedule Cards */}
      <div className="card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div className="card-title">
              <CreditCard size={18} color="var(--brand-primary)" />
              <span>Approved Ghanaian Basic Education Fee Tariffs ({activeTerm})</span>
            </div>
            <div className="card-subtitle">
              Mandatory Breakdown: Tuition, Canteen/Feeding, Facility Levy, TLMs & PTA Dues (GH₵)
            </div>
          </div>

          <button
            onClick={handleOpenWhatsAppBroadcast}
            className="btn btn-sm"
            style={{ backgroundColor: '#10B981', color: '#FFFFFF', fontWeight: 800 }}
          >
            <MessageCircle size={15} />
            <span>Broadcast WhatsApp Reminders</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {feeStructures.map((f) => (
            <div
              key={f.id}
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                border: '1px solid var(--border-light)'
              }}
            >
              <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--brand-primary)' }}>
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
              <span>Student Fee Ledger & Debtors Aging</span>
            </div>
            <div className="card-subtitle">Showing {filteredStudents.length} students enrolled</div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={() => {
                exportDebtorsToCSV(students, feePayments, feeStructures, activeTerm);
                toast.success('Debtors Aging Report CSV exported');
              }}
              className="btn btn-secondary"
            >
              <Download size={15} />
              <span>Export Debtors (CSV)</span>
            </button>

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
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        📱 {stu.parentPhone} • {stu.parentName}
                      </div>
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
                          className="btn btn-gold btn-sm"
                          title="Record / Add Fee Payment"
                        >
                          <PlusCircle size={13} />
                          <span>Record Fee</span>
                        </button>

                        {/* WhatsApp Direct Reminder Button */}
                        {fee.arrears > 0 && (
                          <button
                            onClick={() => handleOpenWhatsAppForStudent(stu)}
                            className="btn btn-sm"
                            style={{ backgroundColor: '#10B981', color: '#FFFFFF' }}
                            title={`Send WhatsApp Fee Reminder to ${stu.parentPhone}`}
                          >
                            <MessageCircle size={13} />
                            <span>WhatsApp</span>
                          </button>
                        )}

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
                              title="View Official Receipt"
                            >
                              <FileCheck size={13} />
                              <span>Receipt</span>
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
                placeholder="e.g. 192837465012 or GCB-DEP-883"
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Bursar Notes / Audit Comments</label>
              <input
                type="text"
                className="form-input"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes..."
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
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
              <span>{editingPayment ? 'Save Adjustment' : 'Issue Official Receipt'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Printable Receipt Modal */}
      <FeeReceiptModal
        isOpen={Boolean(activeReceipt)}
        onClose={() => setActiveReceipt(null)}
        payment={activeReceipt}
      />

      {/* WhatsApp Reminder & Broadcast Modal */}
      <WhatsAppReminderModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        student={whatsAppTargetStudent}
        feeDetails={whatsAppFeeDetails}
        activeTerm={activeTerm}
        allStudents={students}
        allFeePayments={feePayments}
        allFeeStructures={feeStructures}
        mode={whatsAppBroadcastMode}
      />
    </div>
  );
};
