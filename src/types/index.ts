export type UserRole = 'proprietor' | 'teacher' | 'parent' | 'student';

export type AcademicTerm = 'Term 1' | 'Term 2' | 'Term 3';

export type PromotionStatus = 'Promoted' | 'Repeated' | 'Probation' | 'Pending Assessment';

export interface SuperUser {
  id: string;
  fullName: string;
  email: string;
  roleTitle: string; // e.g. "Vice Principal", "Bursar", "Academic Coordinator"
  avatarUrl?: string;
  permissions: {
    canManageFees: boolean;
    canManagePayroll: boolean;
    canManageUsers: boolean; // Add / remove students and teachers
    canManageSubjects: boolean; // Add / remove subjects
    canManageCourseContent: boolean; // Add / remove course content
    canPromoteStudents: boolean; // Promote or repeat students
  };
  dateCreated: string;
  status: 'Active' | 'Suspended';
}

export interface ClassRoom {
  id: string;
  name: string; // e.g. "JHS 2 Pioneer", "Basic 4 Excellence", "KG 2 Diamond"
  level: 'Nursery' | 'KG' | 'Lower Primary' | 'Upper Primary' | 'JHS';
  stageNumber: number; // 1-9 (1=B1, 9=JHS3, -2=Nursery, -1=KG1, 0=KG2)
  formMasterId: string;
  formMasterName: string;
  capacity: number;
  enrolledCount: number;
  roomNumber: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  category: 'Core' | 'Elective';
  applicableLevels: ('Nursery' | 'KG' | 'Lower Primary' | 'Upper Primary' | 'JHS')[];
  description: string;
}

export interface Student {
  id: string;
  studentId: string; // e.g. "LIS-2025-042"
  fullName: string;
  gender: 'Male' | 'Female';
  dob: string;
  classId: string;
  className: string;
  photoUrl: string;
  parentId: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  residentialAddress: string;
  hometown: string;
  admissionDate: string;
  status: 'Active' | 'Graduated' | 'Transferred';
  attendanceDaysPresent: number;
  attendanceDaysTotal: number;
  house: 'Kwame Nkrumah' | 'Yaa Asantewaa' | 'Okomfo Anokye' | 'Kwegyir Aggrey';
  
  // Promotion & Repetition Tracking
  promotionDecision: PromotionStatus;
  promotedToClassId?: string;
  promotedToClassName?: string;
  promotionRemark?: string;
  academicYearPromoted?: string;
}

export interface Teacher {
  id: string;
  staffId: string; // "LIS-STF-012"
  fullName: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female';
  qualification: string;
  roleTitle: string;
  assignedClasses: string[]; // Class IDs
  assignedSubjects: string[]; // Subject IDs
  basicSalary: number;
  allowances: number;
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
  ptaLevy: number;
  ictLabFee: number;
  libraryFee: number;
  examStationeryFee: number;
  canteenFeedingFee: number;
  busTransportFee: number;
  firstAidFee: number;
  totalFee: number;
  dueDate: string;
}

export interface FeePayment {
  id: string;
  receiptNo: string; // "LIS-REC-2025-0089"
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  term: AcademicTerm;
  academicYear: string;
  amountPaid: number;
  paymentMethod: 'MTN Mobile Money' | 'Telecel Cash' | 'AT Money' | 'Bank Deposit / Transfer' | 'Cash';
  transactionRef: string;
  date: string;
  receivedBy: string;
  payerName: string;
  payerPhone: string;
  notes?: string;
}

export interface PayrollRecord {
  id: string;
  monthYear: string; // "October 2025"
  staffId: string;
  staffName: string;
  roleTitle: string;
  basicSalary: number;
  responsibilityAllowance: number;
  transportAllowance: number;
  housingAllowance: number;
  grossSalary: number;
  // Statutory deductions in Ghana
  ssnitEmployee: number; // 5.5%
  ssnitEmployer: number; // 13.5%
  graPayeTax: number;
  staffWelfare: number;
  totalDeductions: number;
  netSalary: number;
  paymentStatus: 'Paid' | 'Pending';
  paymentDate?: string;
  paymentMethod: 'Bank Transfer' | 'MTN MoMo' | 'Cheque';
}

export interface ExpenseRecord {
  id: string;
  expenseNo: string; // "EXP-2025-045"
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
  vendorOrRecipient: string;
  recordedBy: string;
  description: string;
  receiptNumber?: string;
}

export interface AnonymousComplaint {
  id: string;
  trackingCode: string; // e.g. "LIS-SAFE-4821"
  senderType: 'Student' | 'Teacher';
  targetCategory:
    | 'Bullying & Peer Harassment'
    | 'Teacher / Staff Conduct'
    | 'Academic & Classroom Concerns'
    | 'Canteen Food Hygiene & Quality'
    | 'Infrastructure, Washrooms & Safety'
    | 'School Bus & Transportation'
    | 'Staff Welfare & Working Conditions'
    | 'General Improvement Suggestion';
  subject: string;
  message: string;
  incidentLocation?: string;
  incidentDate?: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'New' | 'Under Investigation' | 'Resolved' | 'Dismissed';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
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
  strand: string; // NaCCA Curriculum Strand (e.g. "Strand 1: Diversity of Matter")
  subStrand: string; // Sub-strand (e.g. "Sub-strand 1: Living and Non-living things")
  contentStandard: string; // e.g. "B7.1.1.1: Demonstrate understanding of..."
  performanceIndicator: string; // e.g. "B7.1.1.1.1: Classify organisms into kingdoms..."
  topicTitle: string;
  lessonNotes: string;
  learningObjectives: string[];
  homeworkTask?: {
    title: string;
    instructions: string;
    dueDate: string;
    maxPoints: number;
  };
  attachments: {
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
