import React, { useState } from 'react';
import { ExpenseRecord, FeePayment, PayrollRecord } from '../../types';
import { formatGHS } from '../../utils/currency';
import { Modal } from '../common/Modal';
import { SchoolStore } from '../../data/storage';
import {
  Receipt,
  PlusCircle,
  TrendingDown,
  Filter,
  DollarSign,
  PieChart,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface ExpensesManagerProps {
  expenses: ExpenseRecord[];
  feePayments: FeePayment[];
  payroll: PayrollRecord[];
}

export const ExpensesManager: React.FC<ExpensesManagerProps> = ({
  expenses,
  feePayments,
  payroll
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New expense form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseRecord['category']>('Teaching & Learning Materials (TLMs)');
  const [amount, setAmount] = useState<number>(500);
  const [paymentMethod, setPaymentMethod] = useState<ExpenseRecord['paymentMethod']>('Mobile Money');
  const [vendorOrRecipient, setVendorOrRecipient] = useState('');
  const [description, setDescription] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');

  // Financial summary
  const totalOperatingCosts = expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalPayroll = payroll.reduce((acc, p) => acc + p.netSalary, 0);
  const totalExpenditures = totalOperatingCosts + totalPayroll;
  const totalRevenue = feePayments.reduce((acc, p) => acc + p.amountPaid, 0);
  const netSurplus = totalRevenue - totalExpenditures;

  // Filtered expenses
  const filteredExpenses = expenses.filter(e => {
    return selectedCategory === 'all' || e.category === selectedCategory;
  });

  const categories: ExpenseRecord['category'][] = [
    'Teaching & Learning Materials (TLMs)',
    'ECG Electricity & Utilities',
    'Ghana Water GWCL',
    'School Bus Fuel & Maintenance',
    'Canteen & Food Supplies',
    'Campus Repairs & Infrastructure',
    'ICT Lab & Internet',
    'Events, Sports & Co-curricular',
    'Sanitation, Cleaning & Janitorial',
    'Administrative, Printing & Stationery'
  ];

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    const newExpense: ExpenseRecord = {
      id: `exp-${Date.now()}`,
      expenseNo: `EXP-2026-${Math.floor(100 + Math.random() * 900)}`,
      title,
      category,
      amount: Number(amount),
      date: new Date().toISOString().split('T')[0],
      paymentMethod,
      vendorOrRecipient: vendorOrRecipient || 'General Vendor',
      recordedBy: 'Proprietor (Livingstone)',
      description,
      receiptNumber: receiptNumber || `REC-${Date.now()}`
    };

    SchoolStore.addExpense(newExpense);
    setIsAddModalOpen(false);
    // Reset form
    setTitle('');
    setAmount(500);
    setVendorOrRecipient('');
    setDescription('');
    setReceiptNumber('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Title & Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
            Operating Costs & Expenditure Ledger
          </h2>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
            Track campus utility bills (ECG, GWCL), school bus diesel, TLM procurement, and profit/loss balance
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn btn-gold"
        >
          <PlusCircle size={16} />
          <span>Record New Operating Cost</span>
        </button>
      </div>

      {/* P&L Financial Cards */}
      <div className="stat-grid">
        <div className="stat-card blue">
          <div>
            <div className="stat-label">Total Operating Costs</div>
            <div className="stat-value">{formatGHS(totalOperatingCosts)}</div>
            <div className="stat-trend warning">
              <span>{expenses.length} operational line items</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8' }}>
            <Receipt size={22} />
          </div>
        </div>

        <div className="stat-card navy">
          <div>
            <div className="stat-label">Staff Payroll Outflow</div>
            <div className="stat-value">{formatGHS(totalPayroll)}</div>
            <div className="stat-trend" style={{ color: 'var(--text-tertiary)' }}>
              <span>Monthly teaching & admin salaries</span>
            </div>
          </div>
          <div className="stat-icon-wrapper">
            <DollarSign size={22} />
          </div>
        </div>

        <div className="stat-card red">
          <div>
            <div className="stat-label">Total School Outflows</div>
            <div className="stat-value">{formatGHS(totalExpenditures)}</div>
            <div className="stat-trend negative">
              <span>Costs + Staff Payroll</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#FEE2E2', color: '#B91C1C' }}>
            <TrendingDown size={22} />
          </div>
        </div>

        <div className={`stat-card ${netSurplus >= 0 ? 'green' : 'red'}`}>
          <div>
            <div className="stat-label">Net Operational Balance</div>
            <div className="stat-value" style={{ color: netSurplus >= 0 ? '#15803D' : '#B91C1C' }}>
              {formatGHS(netSurplus)}
            </div>
            <div className={`stat-trend ${netSurplus >= 0 ? 'positive' : 'negative'}`}>
              <span>Revenue minus all expenses</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: netSurplus >= 0 ? '#DCFCE7' : '#FEE2E2', color: netSurplus >= 0 ? '#15803D' : '#B91C1C' }}>
            <PieChart size={22} />
          </div>
        </div>
      </div>

      {/* Expense Records List */}
      <div className="card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div className="card-title">
              <Receipt size={18} color="var(--brand-primary)" />
              <span>Campus Expenditure Register</span>
            </div>
            <div className="card-subtitle">Showing {filteredExpenses.length} expense vouchers</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="var(--text-tertiary)" />
            <select
              className="form-select"
              style={{ width: '260px' }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Expense Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Voucher No</th>
                <th>Expense Title</th>
                <th>Category</th>
                <th>Amount (GH₵)</th>
                <th>Date</th>
                <th>Payment Mode</th>
                <th>Vendor / Payee</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((exp) => (
                <tr key={exp.id}>
                  <td style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>{exp.expenseNo}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{exp.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{exp.description}</div>
                  </td>
                  <td>
                    <span className="badge badge-gray" style={{ fontSize: '0.75rem' }}>{exp.category}</span>
                  </td>
                  <td style={{ fontWeight: 800, color: '#B91C1C', fontSize: '0.95rem' }}>
                    {formatGHS(exp.amount)}
                  </td>
                  <td style={{ fontSize: '0.8rem' }}>{exp.date}</td>
                  <td>
                    <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>{exp.paymentMethod}</span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{exp.vendorOrRecipient}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Record Operating Cost / Expenditure"
        subtitle="Livine International School Operational Ledger"
      >
        <form onSubmit={handleAddExpense}>
          <div className="form-group">
            <label className="form-label">Expense Title / Item Name *</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. ECG Electricity Prepaid Recharge"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Amount (GH₵) *</label>
              <input
                type="number"
                step="10"
                className="form-input"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Payment Channel</label>
              <select
                className="form-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
              >
                <option value="Mobile Money">Mobile Money (MTN / Telecel)</option>
                <option value="Bank Transfer">Bank Transfer / Cheque</option>
                <option value="Cash">Cash Voucher</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Vendor / Recipient</label>
              <input
                type="text"
                className="form-input"
                value={vendorOrRecipient}
                onChange={(e) => setVendorOrRecipient(e.target.value)}
                placeholder="e.g. Electricity Company of Ghana"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Invoice / Receipt Ref No</label>
            <input
              type="text"
              className="form-input"
              value={receiptNumber}
              onChange={(e) => setReceiptNumber(e.target.value)}
              placeholder="e.g. INV-ECG-99812"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description / Purpose</label>
            <textarea
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief details regarding this expenditure..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-gold"
            >
              <CheckCircle2 size={16} />
              <span>Save & Record Voucher</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
