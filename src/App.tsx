import React, { useState, useEffect } from 'react';
import {
  UserRole,
  AcademicTerm,
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
  SuperUser
} from './types';
import { SchoolStore } from './data/storage';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer, toast } from './components/common/Toast';
import { LoginScreen } from './components/auth/LoginScreen';

// Proprietor Domain Hubs
import { ProprietorDashboard } from './components/proprietor/ProprietorDashboard';
import { PeopleHub } from './components/proprietor/PeopleHub';
import { AcademicsHub } from './components/proprietor/AcademicsHub';
import { FinanceHub } from './components/proprietor/FinanceHub';
import { GovernanceHub } from './components/proprietor/GovernanceHub';

// Teacher Components
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { MarksEntry } from './components/teacher/MarksEntry';
import { CourseContentUpload } from './components/teacher/CourseContentUpload';
import { AttendanceRegister } from './components/teacher/AttendanceRegister';
import { TeacherComplaintBox } from './components/teacher/TeacherComplaintBox';

// Parent Components
import { ParentDashboard } from './components/parent/ParentDashboard';
import { TerminalReportCard } from './components/parent/TerminalReportCard';
import { ParentFeePayment } from './components/parent/ParentFeePayment';
import { WardCurriculumView } from './components/parent/WardCurriculumView';

// Student Components
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentResults } from './components/student/StudentResults';
import { LearningMaterials } from './components/student/LearningMaterials';
import { StudentComplaintBox } from './components/student/StudentComplaintBox';

export function App() {
  // Authentication & Session State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentRole, setCurrentRole] = useState<UserRole>('proprietor');
  const [activeCategory, setActiveCategory] = useState<string>('dashboard');
  const [activeTerm, setActiveTerm] = useState<AcademicTerm>(SchoolStore.getActiveTerm());

  // Sidebar Collapsible / Hover / Pin & Mobile Drawer State
  const [isSidebarHovered, setIsSidebarHovered] = useState<boolean>(false);
  const [isSidebarPinned, setIsSidebarPinned] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Loaded Data from Store
  const [classes, setClasses] = useState<ClassRoom[]>(SchoolStore.getClasses());
  const [subjects, setSubjects] = useState<Subject[]>(SchoolStore.getSubjects());
  const [students, setStudents] = useState<Student[]>(SchoolStore.getStudents());
  const [teachers, setTeachers] = useState<Teacher[]>(SchoolStore.getTeachers());
  const [parents, setParents] = useState<Parent[]>(SchoolStore.getParents());
  const [marks, setMarks] = useState<MarkEntry[]>(SchoolStore.getMarks());
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>(SchoolStore.getFeeStructures());
  const [feePayments, setFeePayments] = useState<FeePayment[]>(SchoolStore.getFeePayments());
  const [payroll, setPayroll] = useState<PayrollRecord[]>(SchoolStore.getPayroll());
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(SchoolStore.getExpenses());
  const [complaints, setComplaints] = useState<AnonymousComplaint[]>(SchoolStore.getComplaints());
  const [courseMaterials, setCourseMaterials] = useState<CourseMaterial[]>(SchoolStore.getCourseMaterials());
  const [superUsers, setSuperUsers] = useState<SuperUser[]>(SchoolStore.getSuperUsers());

  // Context-specific selections
  const [currentTeacher, setCurrentTeacher] = useState<Teacher>(teachers[0] || {} as Teacher);
  const [currentParent, setCurrentParent] = useState<Parent>(parents[0] || {} as Parent);
  const [currentStudent, setCurrentStudent] = useState<Student>(students[0] || {} as Student);
  const [selectedWard, setSelectedWard] = useState<Student>(students[0] || {} as Student);

  // Sync data whenever LocalStorage updates
  const refreshData = () => {
    setClasses(SchoolStore.getClasses());
    setSubjects(SchoolStore.getSubjects());
    const loadedStudents = SchoolStore.getStudents();
    setStudents(loadedStudents);
    const loadedTeachers = SchoolStore.getTeachers();
    setTeachers(loadedTeachers);
    const loadedParents = SchoolStore.getParents();
    setParents(loadedParents);
    setMarks(SchoolStore.getMarks());
    setFeeStructures(SchoolStore.getFeeStructures());
    setFeePayments(SchoolStore.getFeePayments());
    setPayroll(SchoolStore.getPayroll());
    setExpenses(SchoolStore.getExpenses());
    setComplaints(SchoolStore.getComplaints());
    setCourseMaterials(SchoolStore.getCourseMaterials());
    setSuperUsers(SchoolStore.getSuperUsers());
    setActiveTerm(SchoolStore.getActiveTerm());

    if (loadedTeachers.length > 0) setCurrentTeacher(prev => loadedTeachers.find(t => t.id === prev.id) || loadedTeachers[0]);
    if (loadedParents.length > 0) setCurrentParent(prev => loadedParents.find(p => p.id === prev.id) || loadedParents[0]);
    if (loadedStudents.length > 0) {
      setCurrentStudent(prev => loadedStudents.find(s => s.id === prev.id) || loadedStudents[0]);
      setSelectedWard(prev => loadedStudents.find(s => s.id === prev.id) || loadedStudents[0]);
    }
  };

  useEffect(() => {
    const unsubscribe = SchoolStore.subscribe(() => {
      refreshData();
    });
    return () => unsubscribe();
  }, []);

  // Handle Login
  const handleLoginSuccess = (role: UserRole, userContext?: { teacher?: Teacher; parent?: Parent; student?: Student }) => {
    setIsAuthenticated(true);
    setCurrentRole(role);
    setActiveCategory('dashboard');
    if (userContext?.teacher) setCurrentTeacher(userContext.teacher);
    if (userContext?.parent) {
      setCurrentParent(userContext.parent);
      const firstWard = students.find(s => userContext.parent?.wards?.includes(s.id)) || students[0];
      if (firstWard) setSelectedWard(firstWard);
    }
    if (userContext?.student) setCurrentStudent(userContext.student);
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    toast.info('You have safely signed out of Livine International School portal.');
  };

  // Handle Role Switch
  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    setActiveCategory('dashboard');
    toast.info(`Switched active view to ${role.toUpperCase()} portal`);
  };

  // Handle Navigation
  const handleNavigate = (category: string) => {
    setActiveCategory(category);
  };

  // Handle Term Switch
  const handleTermChange = (term: AcademicTerm) => {
    setActiveTerm(term);
    SchoolStore.setActiveTerm(term);
    toast.success(`Active academic period set to ${term}`);
  };

  // Count unread complaints for badge
  const unreadComplaintsCount = complaints.filter(c => c.status === 'New').length;

  // Wards of current logged in parent
  const parentWards = students.filter(s => currentParent.wards?.includes(s.id)) || [students[0]];

  // If not authenticated, render the login portal
  if (!isAuthenticated) {
    return (
      <>
        <ToastContainer />
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          teachers={teachers}
          parents={parents}
          students={students}
        />
      </>
    );
  }

  return (
    <div className="app-shell">
      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Collapsible & Hover-Expandable Sidebar with Mobile Drawer Support */}
      <Sidebar
        currentRole={currentRole}
        activeCategory={activeCategory}
        onNavigate={handleNavigate}
        unreadComplaintsCount={unreadComplaintsCount}
        isHovered={isSidebarHovered}
        setIsHovered={setIsSidebarHovered}
        isPinned={isSidebarPinned}
        setIsPinned={setIsSidebarPinned}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        {/* Top Navbar */}
        <Navbar
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          activeTerm={activeTerm}
          onTermChange={handleTermChange}
          currentTeacher={currentTeacher}
          currentParent={currentParent}
          currentStudent={currentStudent}
          onLogout={handleLogout}
          onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
        />

        {/* Dynamic Content Workspace */}
        <main className="content-area">
          {/* ========================================================================= */}
          {/* 1. PROPRIETOR / ADMINISTRATIVE DOMAIN HUBS                                 */}
          {/* ========================================================================= */}
          {currentRole === 'proprietor' && (
            <>
              {/* Executive Overview */}
              {activeCategory === 'dashboard' && (
                <ProprietorDashboard
                  classes={classes}
                  students={students}
                  teachers={teachers}
                  feePayments={feePayments}
                  feeStructures={feeStructures}
                  payroll={payroll}
                  expenses={expenses}
                  complaints={complaints}
                  activeTerm={activeTerm}
                  onNavigateTab={(tab) => {
                    if (tab === 'fees' || tab === 'payroll' || tab === 'expenses') handleNavigate('finance');
                    else if (tab === 'complaints') handleNavigate('governance');
                    else if (tab === 'users' || tab === 'promotions') handleNavigate('people');
                    else handleNavigate(tab);
                  }}
                />
              )}

              {/* People & Staffing Hub (Students Directory, Promotions, Faculty, Superusers) */}
              {activeCategory === 'people' && (
                <PeopleHub
                  students={students}
                  teachers={teachers}
                  classes={classes}
                  subjects={subjects}
                  parents={parents}
                  marks={marks}
                  superUsers={superUsers}
                />
              )}

              {/* Academics & Curriculum Hub (Subjects, Schemes of Learning & Materials) */}
              {activeCategory === 'academics' && (
                <AcademicsHub
                  subjects={subjects}
                  courseMaterials={courseMaterials}
                  classes={classes}
                  teachers={teachers}
                />
              )}

              {/* Finance & Accounts Hub (GAAP Accounting, Receivables, Payroll, Vouchers, P&L) */}
              {activeCategory === 'finance' && (
                <FinanceHub
                  students={students}
                  classes={classes}
                  teachers={teachers}
                  feePayments={feePayments}
                  feeStructures={feeStructures}
                  payroll={payroll}
                  expenses={expenses}
                  activeTerm={activeTerm}
                />
              )}

              {/* Governance & Whistleblower Hub */}
              {activeCategory === 'governance' && (
                <GovernanceHub
                  complaints={complaints}
                />
              )}
            </>
          )}

          {/* ========================================================================= */}
          {/* 2. TEACHER PORTAL                                                         */}
          {/* ========================================================================= */}
          {currentRole === 'teacher' && (
            <>
              {activeCategory === 'dashboard' && (
                <TeacherDashboard
                  teacher={currentTeacher}
                  classes={classes}
                  subjects={subjects}
                  courseMaterials={courseMaterials}
                  activeTerm={activeTerm}
                  onNavigateTab={(tab) => setActiveCategory(tab)}
                />
              )}

              {activeCategory === 'marks' && (
                <MarksEntry
                  teacher={currentTeacher}
                  classes={classes}
                  subjects={subjects}
                  students={students}
                  marks={marks}
                  activeTerm={activeTerm}
                />
              )}

              {activeCategory === 'content' && (
                <CourseContentUpload
                  teacher={currentTeacher}
                  classes={classes}
                  subjects={subjects}
                  courseMaterials={courseMaterials}
                  activeTerm={activeTerm}
                />
              )}

              {activeCategory === 'attendance' && (
                <AttendanceRegister
                  teacher={currentTeacher}
                  classes={classes}
                  students={students}
                />
              )}

              {activeCategory === 'complaint' && (
                <TeacherComplaintBox />
              )}
            </>
          )}

          {/* ========================================================================= */}
          {/* 3. PARENT PORTAL                                                          */}
          {/* ========================================================================= */}
          {currentRole === 'parent' && (
            <>
              {activeCategory === 'dashboard' && (
                <ParentDashboard
                  parent={currentParent}
                  wards={parentWards}
                  selectedWard={selectedWard}
                  onSelectWard={setSelectedWard}
                  marks={marks}
                  feePayments={feePayments}
                  feeStructures={feeStructures}
                  courseMaterials={courseMaterials}
                  activeTerm={activeTerm}
                  onNavigateTab={(tab) => setActiveCategory(tab)}
                />
              )}

              {activeCategory === 'terminal_report' && (
                <TerminalReportCard
                  student={selectedWard}
                  marks={marks}
                  activeTerm={activeTerm}
                />
              )}

              {activeCategory === 'fee_payment' && (
                <ParentFeePayment
                  parent={currentParent}
                  student={selectedWard}
                  feePayments={feePayments}
                  feeStructures={feeStructures}
                  activeTerm={activeTerm}
                />
              )}

              {activeCategory === 'curriculum' && (
                <WardCurriculumView
                  student={selectedWard}
                  courseMaterials={courseMaterials}
                  activeTerm={activeTerm}
                />
              )}
            </>
          )}

          {/* ========================================================================= */}
          {/* 4. STUDENT PORTAL                                                         */}
          {/* ========================================================================= */}
          {currentRole === 'student' && (
            <>
              {activeCategory === 'dashboard' && (
                <StudentDashboard
                  student={currentStudent}
                  marks={marks}
                  courseMaterials={courseMaterials}
                  activeTerm={activeTerm}
                  onNavigate={(tab) => setActiveCategory(tab)}
                />
              )}

              {activeCategory === 'results' && (
                <StudentResults
                  student={currentStudent}
                  marks={marks}
                  activeTerm={activeTerm}
                />
              )}

              {activeCategory === 'materials' && (
                <LearningMaterials
                  student={currentStudent}
                  courseMaterials={courseMaterials}
                  activeTerm={activeTerm}
                />
              )}

              {activeCategory === 'complaint' && (
                <StudentComplaintBox />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
