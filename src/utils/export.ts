import { Student, FeePayment, FeeStructure, PayrollRecord, MarkEntry, AcademicTerm } from '../types';
import { formatGHS } from './currency';

/**
 * Universal CSV file download trigger
 */
export const downloadCSV = (filename: string, csvContent: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export Enrolled Pupils Master Registry
 */
export const exportStudentsToCSV = (students: Student[]) => {
  const headers = ['Student ID', 'Full Name', 'Class / Grade', 'Gender', 'Date of Birth', 'Parent / Guardian', 'Parent Phone', 'Residential Address', 'House', 'Admission Date', 'Promotion Decision'];
  const rows = students.map(s => [
    `"${s.studentId}"`,
    `"${s.fullName}"`,
    `"${s.className}"`,
    `"${s.gender}"`,
    `"${s.dob}"`,
    `"${s.parentName}"`,
    `"${s.parentPhone}"`,
    `"${s.residentialAddress}"`,
    `"${s.house}"`,
    `"${s.admissionDate}"`,
    `"${s.promotionDecision || 'Pending'}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  downloadCSV(`Livine_Students_Registry_${new Date().toISOString().split('T')[0]}.csv`, csvContent);
};

/**
 * Export Debtors Arrears & Fee Collection Aging Report
 */
export const exportDebtorsToCSV = (
  students: Student[],
  payments: FeePayment[],
  structures: FeeStructure[],
  activeTerm: AcademicTerm
) => {
  const headers = ['Student ID', 'Pupil Name', 'Class', 'Total Term Tariff (GHS)', 'Amount Paid (GHS)', 'Outstanding Arrears (GHS)', 'Payment Status', 'Parent Phone'];
  
  const rows = students.map(s => {
    let level: FeeStructure['classLevel'] = 'Upper Primary';
    if (s.className.includes('Nursery')) level = 'Nursery';
    else if (s.className.includes('KG')) level = 'KG';
    else if (s.className.includes('Basic 1') || s.className.includes('Basic 2') || s.className.includes('Basic 3')) level = 'Lower Primary';
    else if (s.className.includes('Basic 4') || s.className.includes('Basic 5') || s.className.includes('Basic 6')) level = 'Upper Primary';
    else if (s.className.includes('JHS')) level = 'JHS';

    const structure = structures.find(f => f.classLevel === level);
    const billed = structure ? structure.totalFee : 3000;
    const paid = payments
      .filter(p => p.studentId === s.id && p.term === activeTerm)
      .reduce((sum, p) => sum + p.amountPaid, 0);
    const arrears = Math.max(0, billed - paid);
    const status = arrears === 0 ? 'Fully Cleared' : paid > 0 ? 'Partially Paid' : 'Unpaid (Overdue)';

    return [
      `"${s.studentId}"`,
      `"${s.fullName}"`,
      `"${s.className}"`,
      billed.toFixed(2),
      paid.toFixed(2),
      arrears.toFixed(2),
      `"${status}"`,
      `"${s.parentPhone}"`
    ];
  });

  const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  downloadCSV(`Livine_Fee_Debtors_Report_${activeTerm.replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.csv`, csvContent);
};

/**
 * Export Staff Payroll & Statutory SSNIT / GRA Remittances
 */
export const exportPayrollToCSV = (payrollRecords: PayrollRecord[]) => {
  const headers = ['Staff Name', 'Role Title', 'Month', 'Basic Salary (GHS)', 'Allowances (GHS)', 'Gross Salary (GHS)', '5.5% Employee SSNIT (GHS)', '13.5% Employer SSNIT (GHS)', 'GRA PAYE Tax (GHS)', 'Net Take-Home Pay (GHS)', 'Disbursement Date', 'Bank Name', 'Account Number'];
  
  const rows = payrollRecords.map(p => [
    `"${p.staffName}"`,
    `"${p.roleTitle}"`,
    `"${p.month}"`,
    p.basicSalary.toFixed(2),
    p.allowances.toFixed(2),
    p.grossSalary.toFixed(2),
    p.ssnitEmployee.toFixed(2),
    p.ssnitEmployer.toFixed(2),
    p.graPayeTax.toFixed(2),
    p.netSalary.toFixed(2),
    `"${p.disbursementDate || 'Pending'}"`,
    `"${p.bankAccount.bankName}"`,
    `"${p.bankAccount.accountNumber}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  downloadCSV(`Livine_Payroll_SSNIT_GRA_Report_${new Date().toISOString().split('T')[0]}.csv`, csvContent);
};

/**
 * Export BECE Registration Candidates List (Basic 9 / JHS 3)
 */
export const exportBeceCandidatesToCSV = (students: Student[]) => {
  const jhsCandidates = students.filter(s => s.className.includes('JHS 3') || s.className.includes('Basic 9'));
  const headers = ['Candidate Index No', 'Pupil Full Name', 'Gender', 'Date of Birth', 'Hometown & Region', 'Guardian Name', 'Guardian Phone', 'BECE Stream'];
  
  const rows = jhsCandidates.map((s, idx) => [
    `"0102049${String(idx + 1).padStart(3, '0')}"`,
    `"${s.fullName}"`,
    `"${s.gender}"`,
    `"${s.dob}"`,
    `"${s.hometown}"`,
    `"${s.parentName}"`,
    `"${s.parentPhone}"`,
    `"General Basic Education (BECE 2026)"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  downloadCSV(`Livine_BECE_Candidates_Register_${new Date().getFullYear()}.csv`, csvContent);
};
