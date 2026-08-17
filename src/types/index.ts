export type UserRole = 'proprietor' | 'teacher' | 'parent' | 'student';

export type AcademicTerm = 'Term 1' | 'Term 2' | 'Term 3';

export type PromotionStatus = 'Promoted' | 'Repeated' | 'Probation' | 'Pending Assessment';

export interface SchoolInfo {
  name: string;
  motto: string;
  address: string;
  campus?: string;
  digitalAddress: string;
  phone: string;
  email: string;
  website: string;
  curriculum: string;
  academicYear: string;
  currentTerm: AcademicTerm;
  termDates: {
    term1: string;
    term2: string;
    term3: string;
  };
  nextTermBegins: string;
  headTeacherName: string;
  proprietorName: string;
}

export interface ClassRoom {
  id: string;
  name: string; // e.g. "Basic 7 (JHS 1)", "Kindergarten 1"
  level: 'Nursery' | 'KG' | 'Lower Primary' | 'Upper Primary' | 'JHS';
  stageNumber: number; // 1 to 9 (Nursery 1=1 to JHS 3=9)
  classTeacherId?: string;
  classTeacherName?: string;
  formMasterId?: string;
  formMasterName?: string;
  roomNumber: string;
  capacity: number;
  enrolledCount?: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  category: 'Core' | 'Elective';
  classLevels?: ('Nursery' | 'KG' | 'Lower Primary' | 'Upper Primary' | 'JHS' | string)[];
  applicableLevels?: string[];
  description?: string;
}

export interface Student {
  id: string;
  studentId: string; // e.g. "LIS-2023-0142"
  fullName: string;
  gender: 'Male' | 'Female';
  dob: string;
  classId: string;
  className: string;
  photoUrl: string;
  parentId: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  residentialAddress: string;
  hometown: string;
  admissionDate: string;
  status: 'Active' | 'Graduated' | 'Suspended' | 'Withdrawn';
  attendanceDaysPresent: number;
  attendanceDaysTotal: number;
  house: 'Kwame Nkrumah' | 'Yaa Asantewaa' | 'Okomfo Anokye' | 'Kwegyir Aggrey';
  promotionDecision?: PromotionStatus;
  promotedToClassId?: string;
  promotedToClassName?: string;
  promotionRemark?: string;
}

export interface Teacher {
  id: string;
  staffId: string; // e.g. "LIS-STF-001"
  fullName: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female';
  qualification: string;
  roleTitle: string; // e.g. "Head of Sciences & JHS 2 Form Master"
  assignedClasses: string[]; // Array of ClassRoom IDs
  assignedSubjects: string[]; // Array of Subject IDs
  basicSalary: number; // In GHS
  allowances: number; // In GHS
  bankAccount: {
    bankName: string;
    accountNumber: string;
    branch: string;
  };
  ssnitNumber: string;
  dateJoined: string;
  photoUrl: string;
}

export interface Parent {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  occupation: string;
  relationship?: string;
  residentialAddress: string;
  wards: string[]; // Array of Student IDs
}

export interface MarkEntry {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  subjectId: string;
  subjectName: string;
  term: AcademicTerm;
  academicYear: string;
  // NaCCA Continuous Assessment / SBA (50 Marks)
  sbaTest1: number; // 0-15
  sbaTest2: number; // 0-15
  sbaProject: number; // 0-10
  sbaHomework: number; // 0-10
  totalSba: number; // 0-50
  // End of Term Examination (50 Marks)
  examScore: number; // 0-50
  // Total Computed (100 Marks)
  totalScore: number;
  beceGrade: number; // 1 to 9 (1=Highest/Grade 1, 9=Lowest)
  descriptor: string; // e.g. "Exceeding Expectations (EE)"
  gradeRemark: string; // e.g. "Excellent", "Very Good", "Credit", "Pass", "Fail"
  classRank?: number;
  subjectPosition?: string; // e.g. "1st", "2nd", "3rd"
  teacherRemarks: string;
  teacherId: string;
  updatedAt: string;
}

export interface TerminalReport {
  studentId: string;
  studentName: string;
  studentIdNumber: string;
  className: string;
  classLevel: string;
  academicYear: string;
  term: AcademicTerm;
  attendancePresent: number;
  attendanceTotal: number;
  promotedTo?: string; // For Term 3
  conductRemark: string;
  attitudeRemark: string;
  interestRemark: string;
  formMasterRemark: string;
  headTeacherRemark: string;
  nextTermBegins: string;
  marks: MarkEntry[];
  totalScoreSum: number;
  averageScore: number;
  overallPosition: string;
  numberOnRoll: number;
}

export interface FeeStructure {
  id: string;
  classLevel: 'Nursery' | 'KG' | 'Lower Primary' | 'Upper Primary' | 'JHS';
  academicYear: string;
  term: AcademicTerm;
  tuitionFee: number;
  facilityLevy?: number;
  tlmMaterialsFee?: number;
  ptaLevy: number;
  ictLabFee: number;
  libraryFee?: number;
  examStationeryFee?: number;
  canteenFeedingFee?: number;
  busTransportFee?: number;
  firstAidFee?: number;
  totalFee: number;
  dueDate: string;
}

export interface FeePayment {
  id: string;
  receiptNo?: string;
  receiptNumber?: string;
  studentId: string;
  studentName: string;
  classId?: string;
  className: string;
  term: AcademicTerm;
  academicYear: string;
  amountPaid: number;
  paymentMethod: 'MTN Mobile Money' | 'Telecel Cash' | 'AT Money' | 'Bank Deposit / Transfer' | 'Cash';
  momoTransactionId?: string;
  transactionRef?: string;
  date?: string;
  paymentDate?: string;
  receivedBy?: string;
  recordedBy?: string;
  payerName: string;
  payerPhone: string;
  status?: 'Completed' | 'Pending' | 'Voided';
  notes?: string;
}

export interface PayrollRecord {
  id: string;
  monthYear?: string;
  month?: string;
  staffId: string;
  staffName: string;
  roleTitle: string;
  basicSalary: number;
  allowances?: number;
  responsibilityAllowance?: number;
  transportAllowance?: number;
  housingAllowance?: number;
  grossSalary: number;
  // Statutory deductions in Ghana
  ssnitEmployee: number; // 5.5%
  ssnitEmployer: number; // 13.5%
  graPayeTax: number;
  staffWelfare?: number;
  otherDeductions?: number;
  totalDeductions?: number;
  netSalary: number;
  paymentStatus: 'Paid' | 'Pending';
  paymentDate?: string;
  disbursementDate?: string;
  paymentMethod: 'Bank Transfer' | 'MTN MoMo' | 'Cheque';
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    branch?: string;
  };
  ssnitNumber?: string;
}

export interface ExpenseRecord {
  id: string;
  expenseNo?: string;
  voucherNumber?: string;
  title: string;
  category: 
    | 'Teaching & Learning Materials (TLMs)'
    | 'ECG Electricity & Utilities'
    | 'Ghana Water GWCL'
    | 'School Bus Fuel & Maintenance'
    | 'Canteen & Food Supplies'
    | 'Campus Repairs & Infrastructure'
    | 'ICT Lab & Internet'
    | 'Events, Sports & Co-curricular'
    | 'Sanitation, Cleaning & Janitorial'
    | 'Administrative, Printing & Stationery';
  amount: number;
  date: string;
  paymentMethod: 'Bank Transfer' | 'Cash' | 'Mobile Money' | 'Cheque';
  vendorOrRecipient?: string;
  vendorRecipient?: string;
  recordedBy?: string;
  approvedBy?: string;
  description: string;
  receiptNumber?: string;
}

export interface AnonymousComplaint {
  id: string;
  trackingCode?: string;
  ticketNumber?: string;
  senderType: 'Student' | 'Teacher';
  targetCategory:
    | 'Bullying & Peer Harassment'
    | 'Teacher / Staff Conduct'
    | 'Academic & Classroom Concerns'
    | 'Canteen Food Hygiene & Quality'
    | 'Infrastructure, Washrooms & Safety'
    | 'School Bus & Transportation'
    | 'Staff Welfare & Working Conditions'
    | 'General Improvement Suggestion'
    | string;
  subject: string;
  message?: string;
  description?: string;
  incidentLocation?: string;
  incidentDate?: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'New' | 'Under Investigation' | 'Under Review' | 'Resolved' | 'Dismissed';
  adminNotes?: string;
  investigationNotes?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
}

export interface CourseMaterial {
  id: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  term: AcademicTerm;
  academicYear: string;
  weekNumber: number;
  strand: string;
  subStrand: string;
  contentStandard?: string;
  performanceIndicator?: string;
  topicTitle: string;
  lessonNotes: string;
  learningObjectives?: string[];
  learningOutcomes?: string[];
  homeworkTask?: {
    title: string;
    instructions: string;
    dueDate: string;
    maxPoints: number;
  };
  attachments?: {
    fileName: string;
    fileSize: string;
    fileType: string;
  }[];
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  classId: string;
  studentId: string;
  studentName: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  remarks?: string;
  markedByTeacherId: string;
}

export interface SuperUser {
  id: string;
  fullName: string;
  email: string;
  roleTitle: string;
  permissions?: {
    canManageFees: boolean;
    canManagePayroll: boolean;
    canManageUsers: boolean;
    canManageSubjects: boolean;
    canManageCourseContent: boolean;
    canPromoteStudents: boolean;
  };
  canUpdateFees?: boolean;
  canUpdateCourseContent?: boolean;
  canManageUsers?: boolean;
  canManagePromotions?: boolean;
  canViewFinance?: boolean;
  dateCreated?: string;
  createdAt?: string;
  status: 'Active' | 'Inactive' | 'Suspended';
}
