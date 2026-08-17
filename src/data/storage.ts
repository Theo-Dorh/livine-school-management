import {
  ClassRoom,
  Subject,
  Student,
  Teacher,
  Parent,
  MarkEntry,
  FeeStructure,
  FeePayment,
  PayrollRecord,
  ExpenseRecord,
  AnonymousComplaint,
  CourseMaterial,
  SuperUser,
  AcademicTerm,
  PromotionStatus
} from '../types';
import {
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_PARENTS,
  INITIAL_MARKS,
  INITIAL_FEE_STRUCTURES,
  INITIAL_FEE_PAYMENTS,
  INITIAL_PAYROLL,
  INITIAL_EXPENSES,
  INITIAL_COMPLAINTS,
  INITIAL_COURSE_MATERIALS,
  INITIAL_SUPER_USERS,
  SCHOOL_INFO
} from './mockData';

const STORAGE_KEYS = {
  CLASSES: 'lis_classes_v2',
  SUBJECTS: 'lis_subjects_v2',
  STUDENTS: 'lis_students_v2',
  TEACHERS: 'lis_teachers_v2',
  PARENTS: 'lis_parents_v2',
  MARKS: 'lis_marks_v2',
  FEE_STRUCTURES: 'lis_fee_structures_v2',
  FEE_PAYMENTS: 'lis_fee_payments_v2',
  PAYROLL: 'lis_payroll_v2',
  EXPENSES: 'lis_expenses_v2',
  COMPLAINTS: 'lis_complaints_v2',
  COURSE_MATERIALS: 'lis_course_materials_v2',
  SUPER_USERS: 'lis_super_users_v2',
  ACTIVE_TERM: 'lis_active_term_v2',
  ACTIVE_YEAR: 'lis_active_year_v2'
};

const STORAGE_CHANGE_EVENT = 'lis_storage_change';

function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(item);
  } catch (err) {
    console.error('Storage error loading key', key, err);
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(STORAGE_CHANGE_EVENT, { detail: { key } }));
  } catch (err) {
    console.error('Storage error saving key', key, err);
  }
}

export const SchoolStore = {
  // Getters
  getClasses: (): ClassRoom[] => getStored(STORAGE_KEYS.CLASSES, INITIAL_CLASSES),
  getSubjects: (): Subject[] => getStored(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS),
  getStudents: (): Student[] => getStored(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS),
  getTeachers: (): Teacher[] => getStored(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS),
  getParents: (): Parent[] => getStored(STORAGE_KEYS.PARENTS, INITIAL_PARENTS),
  getMarks: (): MarkEntry[] => getStored(STORAGE_KEYS.MARKS, INITIAL_MARKS),
  getFeeStructures: (): FeeStructure[] => getStored(STORAGE_KEYS.FEE_STRUCTURES, INITIAL_FEE_STRUCTURES),
  getFeePayments: (): FeePayment[] => getStored(STORAGE_KEYS.FEE_PAYMENTS, INITIAL_FEE_PAYMENTS),
  getPayroll: (): PayrollRecord[] => getStored(STORAGE_KEYS.PAYROLL, INITIAL_PAYROLL),
  getExpenses: (): ExpenseRecord[] => getStored(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES),
  getComplaints: (): AnonymousComplaint[] => getStored(STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS),
  getCourseMaterials: (): CourseMaterial[] => getStored(STORAGE_KEYS.COURSE_MATERIALS, INITIAL_COURSE_MATERIALS),
  getSuperUsers: (): SuperUser[] => getStored(STORAGE_KEYS.SUPER_USERS, INITIAL_SUPER_USERS),
  getActiveTerm: (): AcademicTerm => getStored(STORAGE_KEYS.ACTIVE_TERM, SCHOOL_INFO.currentTerm),
  getActiveYear: (): string => getStored(STORAGE_KEYS.ACTIVE_YEAR, SCHOOL_INFO.academicYear),

  // Modifiers
  setActiveTerm: (term: AcademicTerm) => setStored(STORAGE_KEYS.ACTIVE_TERM, term),
  setActiveYear: (year: string) => setStored(STORAGE_KEYS.ACTIVE_YEAR, year),

  // -------------------------------------------------------------
  // STUDENTS CRUD & PROMOTIONS
  // -------------------------------------------------------------
  addStudent: (student: Student) => {
    const list = SchoolStore.getStudents();
    const updated = [student, ...list];
    setStored(STORAGE_KEYS.STUDENTS, updated);
    return updated;
  },
  updateStudent: (student: Student) => {
    const list = SchoolStore.getStudents();
    const updated = list.map(s => s.id === student.id ? student : s);
    setStored(STORAGE_KEYS.STUDENTS, updated);
    return updated;
  },
  deleteStudent: (studentId: string) => {
    const list = SchoolStore.getStudents();
    const updated = list.filter(s => s.id !== studentId);
    setStored(STORAGE_KEYS.STUDENTS, updated);
    return updated;
  },
  promoteStudent: (
    studentId: string, 
    decision: PromotionStatus, 
    targetClassId?: string, 
    targetClassName?: string, 
    remark?: string
  ) => {
    const list = SchoolStore.getStudents();
    const updated = list.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          promotionDecision: decision,
          promotedToClassId: targetClassId || s.classId,
          promotedToClassName: targetClassName || s.className,
          promotionRemark: remark || (decision === 'Promoted' ? `Promoted to ${targetClassName}` : `Repeated in ${s.className}`),
          academicYearPromoted: '2026/2027',
          // If promoted to new class, update classId / className
          classId: decision === 'Promoted' && targetClassId ? targetClassId : s.classId,
          className: decision === 'Promoted' && targetClassName ? targetClassName : s.className
        };
      }
      return s;
    });
    setStored(STORAGE_KEYS.STUDENTS, updated);
    return updated;
  },

  // -------------------------------------------------------------
  // TEACHERS CRUD
  // -------------------------------------------------------------
  addTeacher: (teacher: Teacher) => {
    const list = SchoolStore.getTeachers();
    const updated = [teacher, ...list];
    setStored(STORAGE_KEYS.TEACHERS, updated);
    return updated;
  },
  updateTeacher: (teacher: Teacher) => {
    const list = SchoolStore.getTeachers();
    const updated = list.map(t => t.id === teacher.id ? teacher : t);
    setStored(STORAGE_KEYS.TEACHERS, updated);
    return updated;
  },
  deleteTeacher: (teacherId: string) => {
    const list = SchoolStore.getTeachers();
    const updated = list.filter(t => t.id !== teacherId);
    setStored(STORAGE_KEYS.TEACHERS, updated);
    return updated;
  },

  // -------------------------------------------------------------
  // SUBJECTS CRUD
  // -------------------------------------------------------------
  addSubject: (subject: Subject) => {
    const list = SchoolStore.getSubjects();
    const updated = [...list, subject];
    setStored(STORAGE_KEYS.SUBJECTS, updated);
    return updated;
  },
  updateSubject: (subject: Subject) => {
    const list = SchoolStore.getSubjects();
    const updated = list.map(s => s.id === subject.id ? subject : s);
    setStored(STORAGE_KEYS.SUBJECTS, updated);
    return updated;
  },
  deleteSubject: (subjectId: string) => {
    const list = SchoolStore.getSubjects();
    const updated = list.filter(s => s.id !== subjectId);
    setStored(STORAGE_KEYS.SUBJECTS, updated);
    return updated;
  },

  // -------------------------------------------------------------
  // COURSE MATERIALS CRUD
  // -------------------------------------------------------------
  addCourseMaterial: (material: CourseMaterial) => {
    const list = SchoolStore.getCourseMaterials();
    const updated = [material, ...list];
    setStored(STORAGE_KEYS.COURSE_MATERIALS, updated);
    return updated;
  },
  updateCourseMaterial: (material: CourseMaterial) => {
    const list = SchoolStore.getCourseMaterials();
    const updated = list.map(c => c.id === material.id ? material : c);
    setStored(STORAGE_KEYS.COURSE_MATERIALS, updated);
    return updated;
  },
  deleteCourseMaterial: (materialId: string) => {
    const list = SchoolStore.getCourseMaterials();
    const updated = list.filter(c => c.id !== materialId);
    setStored(STORAGE_KEYS.COURSE_MATERIALS, updated);
    return updated;
  },

  // -------------------------------------------------------------
  // FEES & PAYMENTS UPDATE / DELETE
  // -------------------------------------------------------------
  addFeePayment: (payment: FeePayment) => {
    const list = SchoolStore.getFeePayments();
    const updated = [payment, ...list];
    setStored(STORAGE_KEYS.FEE_PAYMENTS, updated);
    return updated;
  },
  updateFeePayment: (payment: FeePayment) => {
    const list = SchoolStore.getFeePayments();
    const updated = list.map(p => p.id === payment.id ? payment : p);
    setStored(STORAGE_KEYS.FEE_PAYMENTS, updated);
    return updated;
  },
  deleteFeePayment: (paymentId: string) => {
    const list = SchoolStore.getFeePayments();
    const updated = list.filter(p => p.id !== paymentId);
    setStored(STORAGE_KEYS.FEE_PAYMENTS, updated);
    return updated;
  },

  // -------------------------------------------------------------
  // PAYROLL RECORDS & DISBURSEMENTS
  // -------------------------------------------------------------
  addPayroll: (record: PayrollRecord) => {
    const list = SchoolStore.getPayroll();
    const updated = [record, ...list];
    setStored(STORAGE_KEYS.PAYROLL, updated);
    return updated;
  },
  updatePayrollRecord: (record: PayrollRecord) => {
    const list = SchoolStore.getPayroll();
    const updated = list.map(p => p.id === record.id ? record : p);
    setStored(STORAGE_KEYS.PAYROLL, updated);
    return updated;
  },
  updatePayroll: (record: PayrollRecord) => {
    const list = SchoolStore.getPayroll();
    const updated = list.map(p => p.id === record.id ? record : p);
    setStored(STORAGE_KEYS.PAYROLL, updated);
    return updated;
  },
  updatePayrollStatus: (id: string, status: 'Paid' | 'Pending', paymentDate?: string) => {
    const list = SchoolStore.getPayroll();
    const updated = list.map(item => item.id === id ? { ...item, paymentStatus: status, paymentDate: paymentDate || new Date().toISOString().split('T')[0] } : item);
    setStored(STORAGE_KEYS.PAYROLL, updated);
    return updated;
  },

  // -------------------------------------------------------------
  // SUPERUSERS & ACCESS CONTROL
  // -------------------------------------------------------------
  addSuperUser: (user: SuperUser) => {
    const list = SchoolStore.getSuperUsers();
    const updated = [user, ...list];
    setStored(STORAGE_KEYS.SUPER_USERS, updated);
    return updated;
  },
  updateSuperUser: (user: SuperUser) => {
    const list = SchoolStore.getSuperUsers();
    const updated = list.map(u => u.id === user.id ? user : u);
    setStored(STORAGE_KEYS.SUPER_USERS, updated);
    return updated;
  },
  deleteSuperUser: (userId: string) => {
    const list = SchoolStore.getSuperUsers();
    const updated = list.filter(u => u.id !== userId);
    setStored(STORAGE_KEYS.SUPER_USERS, updated);
    return updated;
  },

  // -------------------------------------------------------------
  // EXPENSES, MARKS & COMPLAINTS
  // -------------------------------------------------------------
  addExpense: (expense: ExpenseRecord) => {
    const list = SchoolStore.getExpenses();
    const updated = [expense, ...list];
    setStored(STORAGE_KEYS.EXPENSES, updated);
    return updated;
  },
  saveMarks: (marksToSave: MarkEntry[]) => {
    const existing = SchoolStore.getMarks();
    const map = new Map(existing.map(m => [`${m.studentId}_${m.subjectId}_${m.term}_${m.academicYear}`, m]));

    marksToSave.forEach(m => {
      map.set(`${m.studentId}_${m.subjectId}_${m.term}_${m.academicYear}`, m);
    });

    const updated = Array.from(map.values());
    setStored(STORAGE_KEYS.MARKS, updated);
    return updated;
  },
  addComplaint: (complaint: AnonymousComplaint) => {
    const list = SchoolStore.getComplaints();
    const updated = [complaint, ...list];
    setStored(STORAGE_KEYS.COMPLAINTS, updated);
    return updated;
  },
  updateComplaintStatus: (id: string, status: AnonymousComplaint['status'], adminNotes?: string) => {
    const list = SchoolStore.getComplaints();
    const now = new Date().toLocaleString();
    const updated = list.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status,
          adminNotes: adminNotes !== undefined ? adminNotes : c.adminNotes,
          updatedAt: now,
          resolvedAt: status === 'Resolved' ? now : c.resolvedAt
        };
      }
      return c;
    });
    setStored(STORAGE_KEYS.COMPLAINTS, updated);
    return updated;
  },

  // Reset demo data
  resetAll: () => {
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(INITIAL_CLASSES));
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(INITIAL_SUBJECTS));
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(INITIAL_TEACHERS));
    localStorage.setItem(STORAGE_KEYS.PARENTS, JSON.stringify(INITIAL_PARENTS));
    localStorage.setItem(STORAGE_KEYS.MARKS, JSON.stringify(INITIAL_MARKS));
    localStorage.setItem(STORAGE_KEYS.FEE_STRUCTURES, JSON.stringify(INITIAL_FEE_STRUCTURES));
    localStorage.setItem(STORAGE_KEYS.FEE_PAYMENTS, JSON.stringify(INITIAL_FEE_PAYMENTS));
    localStorage.setItem(STORAGE_KEYS.PAYROLL, JSON.stringify(INITIAL_PAYROLL));
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(INITIAL_COMPLAINTS));
    localStorage.setItem(STORAGE_KEYS.COURSE_MATERIALS, JSON.stringify(INITIAL_COURSE_MATERIALS));
    localStorage.setItem(STORAGE_KEYS.SUPER_USERS, JSON.stringify(INITIAL_SUPER_USERS));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TERM, JSON.stringify(SCHOOL_INFO.currentTerm));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_YEAR, JSON.stringify(SCHOOL_INFO.academicYear));
    window.dispatchEvent(new CustomEvent(STORAGE_CHANGE_EVENT, { detail: { key: 'ALL' } }));
  },

  subscribe: (callback: () => void) => {
    const handler = () => callback();
    window.addEventListener(STORAGE_CHANGE_EVENT, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(STORAGE_CHANGE_EVENT, handler);
      window.removeEventListener('storage', handler);
    };
  }
};
