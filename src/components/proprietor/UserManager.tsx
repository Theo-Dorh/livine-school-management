import React, { useState } from 'react';
import { Student, Teacher, ClassRoom, Subject, Parent } from '../../types';
import { Modal } from '../common/Modal';
import { SchoolStore } from '../../data/storage';
import { formatGHS } from '../../utils/currency';
import { exportStudentsToCSV, exportBeceCandidatesToCSV } from '../../utils/export';
import { toast } from '../common/Toast';
import {
  Users,
  GraduationCap,
  UserPlus,
  Edit2,
  Trash2,
  Search,
  Filter,
  School,
  CheckCircle2,
  Phone,
  Mail,
  Home,
  Download,
  FileSpreadsheet
} from 'lucide-react';

interface UserManagerProps {
  students: Student[];
  teachers: Teacher[];
  classes: ClassRoom[];
  subjects: Subject[];
  parents: Parent[];
  mode?: 'students' | 'teachers';
}

export const UserManager: React.FC<UserManagerProps> = ({
  students,
  teachers,
  classes,
  subjects,
  parents,
  mode = 'students'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');

  // Student Modal States
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [stuFullName, setStuFullName] = useState('');
  const [stuGender, setStuGender] = useState<'Male' | 'Female'>('Male');
  const [stuDob, setStuDob] = useState('2014-05-15');
  const [stuClassId, setStuClassId] = useState(classes[0]?.id || '');
  const [stuParentName, setStuParentName] = useState('');
  const [stuParentPhone, setStuParentPhone] = useState('+233 24 000 0000');
  const [stuParentEmail, setStuParentEmail] = useState('');
  const [stuAddress, setStuAddress] = useState('Ashale Botwe Lakeside, Accra');
  const [stuHometown, setStuHometown] = useState('Kumasi, Ashanti Region');
  const [stuHouse, setStuHouse] = useState<Student['house']>('Kwame Nkrumah');

  // Teacher Modal States
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [tchFullName, setTchFullName] = useState('');
  const [tchEmail, setTchEmail] = useState('');
  const [tchPhone, setTchPhone] = useState('+233 24 111 2233');
  const [tchGender, setTchGender] = useState<'Male' | 'Female'>('Male');
  const [tchQualification, setTchQualification] = useState('B.Ed. Basic Education (UEW)');
  const [tchRoleTitle, setTchRoleTitle] = useState('Subject Teacher & Form Tutor');
  const [tchAssignedClasses, setTchAssignedClasses] = useState<string[]>([classes[0]?.id || '']);
  const [tchAssignedSubjects, setTchAssignedSubjects] = useState<string[]>([subjects[0]?.id || '']);
  const [tchBasicSalary, setTchBasicSalary] = useState<number>(3500);
  const [tchAllowances, setTchAllowances] = useState<number>(500);
  const [tchBankName, setTchBankName] = useState('Ghana Commercial Bank (GCB)');
  const [tchAccountNo, setTchAccountNo] = useState('1091122334455');
  const [tchSsnitNo, setTchSsnitNo] = useState('C019283746501');

  // Open Student Modal (New / Edit)
  const handleOpenStudentModal = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setStuFullName(student.fullName);
      setStuGender(student.gender);
      setStuDob(student.dob);
      setStuClassId(student.classId);
      setStuParentName(student.parentName);
      setStuParentPhone(student.parentPhone);
      setStuParentEmail(student.parentEmail);
      setStuAddress(student.residentialAddress);
      setStuHometown(student.hometown);
      setStuHouse(student.house);
    } else {
      setEditingStudent(null);
      setStuFullName('');
      setStuGender('Male');
      setStuDob('2014-05-15');
      setStuClassId(classes[0]?.id || '');
      setStuParentName('');
      setStuParentPhone('+233 24 000 0000');
      setStuParentEmail('');
      setStuAddress('Ashale Botwe Lakeside, Accra');
      setStuHometown('Accra, Greater Accra');
      setStuHouse('Kwame Nkrumah');
    }
    setIsStudentModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const targetClass = classes.find(c => c.id === stuClassId);

    if (editingStudent) {
      const updated: Student = {
        ...editingStudent,
        fullName: stuFullName,
        gender: stuGender,
        dob: stuDob,
        classId: stuClassId,
        className: targetClass?.name || editingStudent.className,
        parentName: stuParentName,
        parentPhone: stuParentPhone,
        parentEmail: stuParentEmail,
        residentialAddress: stuAddress,
        hometown: stuHometown,
        house: stuHouse
      };
      SchoolStore.updateStudent(updated);
      toast.success(`Pupil ${stuFullName} updated successfully!`);
    } else {
      const studentId = `LIS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newStu: Student = {
        id: `stu-${Date.now()}`,
        studentId,
        fullName: stuFullName,
        gender: stuGender,
        dob: stuDob,
        classId: stuClassId,
        className: targetClass?.name || 'Class',
        photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
        parentId: parents[0]?.id || 'par-01',
        parentName: stuParentName,
        parentPhone: stuParentPhone,
        parentEmail: stuParentEmail,
        residentialAddress: stuAddress,
        hometown: stuHometown,
        admissionDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        attendanceDaysPresent: 58,
        attendanceDaysTotal: 60,
        house: stuHouse,
        promotionDecision: 'Pending Assessment'
      };
      SchoolStore.addStudent(newStu);
      toast.success(`Pupil ${stuFullName} enrolled with ID ${studentId}!`);
    }
    setIsStudentModalOpen(false);
  };

  const handleDeleteStudent = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove student "${name}" from the school database?`)) {
      SchoolStore.deleteStudent(id);
      toast.info(`Pupil ${name} removed from registry.`);
    }
  };

  // Open Teacher Modal (New / Edit)
  const handleOpenTeacherModal = (teacher?: Teacher) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setTchFullName(teacher.fullName);
      setTchEmail(teacher.email);
      setTchPhone(teacher.phone);
      setTchGender(teacher.gender);
      setTchQualification(teacher.qualification);
      setTchRoleTitle(teacher.roleTitle);
      setTchAssignedClasses(teacher.assignedClasses);
      setTchAssignedSubjects(teacher.assignedSubjects);
      setTchBasicSalary(teacher.basicSalary);
      setTchAllowances(teacher.allowances);
      setTchBankName(teacher.bankAccount.bankName);
      setTchAccountNo(teacher.bankAccount.accountNumber);
      setTchSsnitNo(teacher.ssnitNumber);
    } else {
      setEditingTeacher(null);
      setTchFullName('');
      setTchEmail('');
      setTchPhone('+233 24 111 2233');
      setTchGender('Male');
      setTchQualification('B.Ed. Basic Education (UEW)');
      setTchRoleTitle('Subject Teacher');
      setTchAssignedClasses([classes[0]?.id || '']);
      setTchAssignedSubjects([subjects[0]?.id || '']);
      setTchBasicSalary(3500);
      setTchAllowances(500);
      setTchBankName('Ghana Commercial Bank (GCB)');
      setTchAccountNo('1091122334455');
      setTchSsnitNo('C019283746501');
    }
    setIsTeacherModalOpen(true);
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeacher) {
      const updated: Teacher = {
        ...editingTeacher,
        fullName: tchFullName,
        email: tchEmail,
        phone: tchPhone,
        gender: tchGender,
        qualification: tchQualification,
        roleTitle: tchRoleTitle,
        assignedClasses: tchAssignedClasses,
        assignedSubjects: tchAssignedSubjects,
        basicSalary: Number(tchBasicSalary),
        allowances: Number(tchAllowances),
        bankAccount: {
          bankName: tchBankName,
          accountNumber: tchAccountNo,
          branch: 'Main Branch, Accra'
        },
        ssnitNumber: tchSsnitNo
      };
      SchoolStore.updateTeacher(updated);
      toast.success(`Educator ${tchFullName} record updated!`);
    } else {
      const staffId = `LIS-STF-${String(teachers.length + 1).padStart(3, '0')}`;
      const newTch: Teacher = {
        id: `tch-${Date.now()}`,
        staffId,
        fullName: tchFullName,
        email: tchEmail || `${tchFullName.toLowerCase().replace(/\s+/g, '.')}@livineinternationalschool.edu.gh`,
        phone: tchPhone,
        gender: tchGender,
        qualification: tchQualification,
        roleTitle: tchRoleTitle,
        assignedClasses: tchAssignedClasses,
        assignedSubjects: tchAssignedSubjects,
        basicSalary: Number(tchBasicSalary),
        allowances: Number(tchAllowances),
        bankAccount: {
          bankName: tchBankName,
          accountNumber: tchAccountNo,
          branch: 'Main Branch, Accra'
        },
        ssnitNumber: tchSsnitNo,
        dateJoined: new Date().toISOString().split('T')[0],
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
      };
      SchoolStore.addTeacher(newTch);
      toast.success(`Teacher ${tchFullName} appointed with Staff ID ${staffId}!`);
    }
    setIsTeacherModalOpen(false);
  };

  const handleDeleteTeacher = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove teacher "${name}" from the staff roster?`)) {
      SchoolStore.deleteTeacher(id);
      toast.info(`Teacher ${name} removed from faculty.`);
    }
  };

  // Filtered Students
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || s.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClassFilter === 'all' || s.classId === selectedClassFilter;
    return matchesSearch && matchesClass;
  });

  // Filtered Teachers
  const filteredTeachers = teachers.filter(t => {
    return t.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || t.staffId.toLowerCase().includes(searchTerm.toLowerCase()) || t.roleTitle.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // =========================================================================
  // 1. STUDENTS DIRECTORY ONLY VIEW
  // =========================================================================
  if (mode === 'students') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Actions Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
              Enrolled Students Directory
            </h3>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.825rem' }}>
              Full student biodata, class placement, parent contact details, and house assignments
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                exportStudentsToCSV(students);
                toast.success('Pupil Registry CSV downloaded');
              }}
              className="btn btn-secondary"
            >
              <Download size={15} />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => {
                exportBeceCandidatesToCSV(students);
                toast.success('BECE Registration Candidates CSV exported');
              }}
              className="btn btn-secondary"
            >
              <FileSpreadsheet size={15} />
              <span>BECE Candidates</span>
            </button>

            <button
              onClick={() => handleOpenStudentModal()}
              className="btn btn-gold"
            >
              <UserPlus size={16} />
              <span>Enroll New Student</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="card" style={{ padding: '0.85rem 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '32px', width: '280px' }}
                placeholder="Search student by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={16} color="var(--text-tertiary)" />
              <select
                className="form-select"
                style={{ width: '200px' }}
                value={selectedClassFilter}
                onChange={(e) => setSelectedClassFilter(e.target.value)}
              >
                <option value="all">All Classes (Nursery to JHS 3)</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Student Table */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <GraduationCap size={18} color="var(--brand-primary)" />
              <span>Enrolled Students Master List</span>
            </div>
            <span className="badge badge-gold">{filteredStudents.length} Students Shown</span>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Full Name</th>
                  <th>Class / Stage</th>
                  <th>Gender</th>
                  <th>Parent / Guardian</th>
                  <th>Contact Phone</th>
                  <th>House</th>
                  <th>Promotion Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((stu) => (
                  <tr key={stu.id}>
                    <td style={{ fontWeight: 800, color: 'var(--brand-primary)' }}>{stu.studentId}</td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{stu.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{stu.hometown}</div>
                    </td>
                    <td><span className="badge badge-gray">{stu.className}</span></td>
                    <td>{stu.gender}</td>
                    <td>{stu.parentName}</td>
                    <td style={{ fontSize: '0.8rem' }}>{stu.parentPhone}</td>
                    <td><span className="badge badge-blue">{stu.house}</span></td>
                    <td>
                      <span className={`badge ${stu.promotionDecision === 'Promoted' ? 'badge-green' : stu.promotionDecision === 'Repeated' ? 'badge-red' : 'badge-gold'}`}>
                        {stu.promotionDecision || 'Pending'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => handleOpenStudentModal(stu)}
                          className="btn btn-secondary btn-sm"
                          title="Edit Student"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(stu.id, stu.fullName)}
                          className="btn btn-danger btn-sm"
                          title="Remove Student"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Student Modal */}
        <Modal
          isOpen={isStudentModalOpen}
          onClose={() => setIsStudentModalOpen(false)}
          title={editingStudent ? 'Edit Student Details' : 'Enroll New Pupil'}
          subtitle="Livine International School Admission Registry"
          size="large"
        >
          <form onSubmit={handleSaveStudent}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name of Pupil *</label>
                <input
                  type="text"
                  className="form-input"
                  value={stuFullName}
                  onChange={(e) => setStuFullName(e.target.value)}
                  placeholder="e.g. Kwame Boateng"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender *</label>
                <select
                  className="form-select"
                  value={stuGender}
                  onChange={(e) => setStuGender(e.target.value as any)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Date of Birth *</label>
                <input
                  type="date"
                  className="form-input"
                  value={stuDob}
                  onChange={(e) => setStuDob(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Class / Grade Placement *</label>
                <select
                  className="form-select"
                  value={stuClassId}
                  onChange={(e) => setStuClassId(e.target.value)}
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.level})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Parent / Guardian Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={stuParentName}
                  onChange={(e) => setStuParentName(e.target.value)}
                  placeholder="e.g. Mr. Emmanuel Mensah"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Parent Phone Number *</label>
                <input
                  type="text"
                  className="form-input"
                  value={stuParentPhone}
                  onChange={(e) => setStuParentPhone(e.target.value)}
                  placeholder="+233 24 498 7654"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Parent Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={stuParentEmail}
                  onChange={(e) => setStuParentEmail(e.target.value)}
                  placeholder="parent@example.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assigned School House</label>
                <select
                  className="form-select"
                  value={stuHouse}
                  onChange={(e) => setStuHouse(e.target.value as any)}
                >
                  <option value="Kwame Nkrumah">Kwame Nkrumah House</option>
                  <option value="Yaa Asantewaa">Yaa Asantewaa House</option>
                  <option value="Okomfo Anokye">Okomfo Anokye House</option>
                  <option value="Kwegyir Aggrey">Kwegyir Aggrey House</option>
                </select>
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Residential Address</label>
                <input
                  type="text"
                  className="form-input"
                  value={stuAddress}
                  onChange={(e) => setStuAddress(e.target.value)}
                  placeholder="e.g. House No. 12, Lakeside Estate, Ashale Botwe, Accra"
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setIsStudentModalOpen(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-gold"
              >
                <CheckCircle2 size={16} />
                <span>{editingStudent ? 'Update Student Record' : 'Complete Registration'}</span>
              </button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  // =========================================================================
  // 2. TEACHING FACULTY ONLY VIEW
  // =========================================================================
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Actions Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
            Teaching Faculty & Academic Staff
          </h3>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.825rem' }}>
            Faculty appointments, qualifications, assigned NaCCA disciplines, and statutory basic salaries
          </p>
        </div>

        <button
          onClick={() => handleOpenTeacherModal()}
          className="btn btn-gold"
        >
          <UserPlus size={16} />
          <span>Hire / Add Teacher</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ padding: '0.85rem 1.25rem' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '32px' }}
            placeholder="Search teacher by name or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Teacher List */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Users size={18} color="var(--brand-primary)" />
            <span>Teaching Faculty & Form Tutors</span>
          </div>
          <span className="badge badge-gold">{filteredTeachers.length} Educators</span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Staff ID</th>
                <th>Teacher Name</th>
                <th>Role / Designation</th>
                <th>Qualifications</th>
                <th>Basic Salary</th>
                <th>Assigned Classes</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((tch) => (
                <tr key={tch.id}>
                  <td style={{ fontWeight: 800, color: 'var(--brand-primary)' }}>{tch.staffId}</td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{tch.fullName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>SSNIT: {tch.ssnitNumber}</div>
                  </td>
                  <td><span className="badge badge-blue">{tch.roleTitle}</span></td>
                  <td style={{ fontSize: '0.8rem' }}>{tch.qualification}</td>
                  <td style={{ fontWeight: 700, color: '#15803D' }}>{formatGHS(tch.basicSalary)}</td>
                  <td style={{ fontSize: '0.75rem' }}>
                    {classes.filter(c => tch.assignedClasses.includes(c.id)).map(c => c.name).join(', ')}
                  </td>
                  <td style={{ fontSize: '0.8rem' }}>{tch.phone}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => handleOpenTeacherModal(tch)}
                        className="btn btn-secondary btn-sm"
                        title="Edit Teacher"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteTeacher(tch.id, tch.fullName)}
                        className="btn btn-danger btn-sm"
                        title="Remove Teacher"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Teacher Modal */}
      <Modal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        title={editingTeacher ? 'Edit Teacher Credentials' : 'Add New Teacher / Faculty'}
        subtitle="Livine International School Personnel Registry"
        size="large"
      >
        <form onSubmit={handleSaveTeacher}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Teacher Full Name *</label>
              <input
                type="text"
                className="form-input"
                value={tchFullName}
                onChange={(e) => setTchFullName(e.target.value)}
                placeholder="e.g. Sir Peter Owusu-Ansah"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Role / Designation *</label>
              <input
                type="text"
                className="form-input"
                value={tchRoleTitle}
                onChange={(e) => setTchRoleTitle(e.target.value)}
                placeholder="e.g. Head of Mathematics & JHS Form Master"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="text"
                className="form-input"
                value={tchPhone}
                onChange={(e) => setTchPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Academic Qualifications *</label>
              <input
                type="text"
                className="form-input"
                value={tchQualification}
                onChange={(e) => setTchQualification(e.target.value)}
                placeholder="e.g. B.Ed. Science Education (UEW)"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Basic Monthly Salary (GH₵) *</label>
              <input
                type="number"
                className="form-input"
                value={tchBasicSalary}
                onChange={(e) => setTchBasicSalary(Number(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Monthly Allowances (GH₵)</label>
              <input
                type="number"
                className="form-input"
                value={tchAllowances}
                onChange={(e) => setTchAllowances(Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">SSNIT Number *</label>
              <input
                type="text"
                className="form-input"
                value={tchSsnitNo}
                onChange={(e) => setTchSsnitNo(e.target.value)}
                placeholder="e.g. C019827364501"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Disbursing Bank Name</label>
              <input
                type="text"
                className="form-input"
                value={tchBankName}
                onChange={(e) => setTchBankName(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button
              type="button"
              onClick={() => setIsTeacherModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-gold"
            >
              <CheckCircle2 size={16} />
              <span>{editingTeacher ? 'Update Teacher' : 'Add Teacher to Staff'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
