import React, { useState } from 'react';
import { UserRole, Teacher, Parent, Student } from '../../types';
import { SCHOOL_INFO } from '../../data/mockData';
import { toast } from '../common/Toast';
import {
  School,
  Building2,
  GraduationCap,
  Users,
  UserCheck,
  Lock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  KeyRound
} from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (role: UserRole, userContext?: { teacher?: Teacher; parent?: Parent; student?: Student }) => void;
  teachers: Teacher[];
  parents: Parent[];
  students: Student[];
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  teachers,
  parents,
  students
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('proprietor');
  const [identifier, setIdentifier] = useState('admin@livine.edu.gh');
  const [password, setPassword] = useState('admin123');

  const handleRoleTabChange = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'proprietor') {
      setIdentifier('admin@livine.edu.gh');
      setPassword('admin123');
    } else if (role === 'teacher') {
      setIdentifier(teachers[0]?.staffId || 'LIS-STF-001');
      setPassword('teacher123');
    } else if (role === 'parent') {
      setIdentifier(parents[0]?.email || 'emmanuel.mensah@gmail.com');
      setPassword('parent123');
    } else if (role === 'student') {
      setIdentifier(students[0]?.studentId || 'LIS-2026-001');
      setPassword('student123');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedRole === 'proprietor') {
      toast.success('Welcome back, Administrator!', 'Authenticated');
      onLoginSuccess('proprietor');
    } else if (selectedRole === 'teacher') {
      const match = teachers.find(
        (t) => t.staffId.toLowerCase() === identifier.trim().toLowerCase() || t.email.toLowerCase() === identifier.trim().toLowerCase()
      ) || teachers[0];
      toast.success(`Welcome, ${match.fullName}`, 'Educator Logged In');
      onLoginSuccess('teacher', { teacher: match });
    } else if (selectedRole === 'parent') {
      const match = parents.find(
        (p) => p.email.toLowerCase() === identifier.trim().toLowerCase() || p.phone.includes(identifier.trim())
      ) || parents[0];
      toast.success(`Welcome, ${match.fullName}`, 'Parent Portal Access');
      onLoginSuccess('parent', { parent: match });
    } else if (selectedRole === 'student') {
      const match = students.find(
        (s) => s.studentId.toLowerCase() === identifier.trim().toLowerCase() || s.fullName.toLowerCase().includes(identifier.trim().toLowerCase())
      ) || students[0];
      toast.success(`Welcome, ${match.fullName}!`, 'Student Portal');
      onLoginSuccess('student', { student: match });
    }
  };

  const handleQuickDemoLogin = (role: UserRole, userObj?: any) => {
    if (role === 'proprietor') {
      toast.success('Logged in as Proprietor / Admin');
      onLoginSuccess('proprietor');
    } else if (role === 'teacher') {
      toast.success(`Logged in as ${userObj?.fullName || 'Teacher'}`);
      onLoginSuccess('teacher', { teacher: userObj || teachers[0] });
    } else if (role === 'parent') {
      toast.success(`Logged in as ${userObj?.fullName || 'Parent'}`);
      onLoginSuccess('parent', { parent: userObj || parents[0] });
    } else if (role === 'student') {
      toast.success(`Logged in as ${userObj?.fullName || 'Student'}`);
      onLoginSuccess('student', { student: userObj || students[0] });
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#0F2537',
        backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(200, 135, 25, 0.15) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(30, 58, 138, 0.3) 0%, transparent 50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div
        style={{
          maxWidth: '520px',
          width: '100%',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Header Branding */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0F2537 0%, #1A364F 100%)',
            padding: '2rem',
            textAlign: 'center',
            color: '#FFFFFF',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #C88719 0%, #A16807 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              margin: '0 auto 0.85rem',
              boxShadow: '0 4px 15px rgba(200, 135, 25, 0.4)',
            }}
          >
            <School size={30} />
          </div>

          <h1 style={{ fontSize: '1.35rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0 }}>
            {SCHOOL_INFO.name}
          </h1>
          <p style={{ fontSize: '0.75rem', color: '#FDE68A', fontWeight: 700, marginTop: '0.2rem' }}>
            NaCCA & GES Standards-Based School Portal
          </p>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.65)', marginTop: '0.15rem' }}>
            {SCHOOL_INFO.campus} • Digital: {SCHOOL_INFO.digitalAddress}
          </div>
        </div>

        {/* Role Selector Tabs */}
        <div style={{ padding: '1.5rem 2rem 0.5rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.35rem',
              backgroundColor: '#F1F5F9',
              padding: '0.3rem',
              borderRadius: 'var(--radius-full)',
              marginBottom: '1.5rem',
            }}
          >
            <button
              type="button"
              onClick={() => handleRoleTabChange('proprietor')}
              className={`role-pill ${selectedRole === 'proprietor' ? 'active' : ''}`}
              style={{ justifyContent: 'center', padding: '0.45rem 0.2rem', fontSize: '0.75rem' }}
            >
              <Building2 size={13} />
              <span>Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleTabChange('teacher')}
              className={`role-pill ${selectedRole === 'teacher' ? 'active' : ''}`}
              style={{ justifyContent: 'center', padding: '0.45rem 0.2rem', fontSize: '0.75rem' }}
            >
              <UserCheck size={13} />
              <span>Teacher</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleTabChange('parent')}
              className={`role-pill ${selectedRole === 'parent' ? 'active' : ''}`}
              style={{ justifyContent: 'center', padding: '0.45rem 0.2rem', fontSize: '0.75rem' }}
            >
              <Users size={13} />
              <span>Parent</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleTabChange('student')}
              className={`role-pill ${selectedRole === 'student' ? 'active' : ''}`}
              style={{ justifyContent: 'center', padding: '0.45rem 0.2rem', fontSize: '0.75rem' }}
            >
              <GraduationCap size={13} />
              <span>Student</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                {selectedRole === 'proprietor' && 'Administrator Email / Username'}
                {selectedRole === 'teacher' && 'Staff ID / Educator Email'}
                {selectedRole === 'parent' && 'Parent Email / Phone Number'}
                {selectedRole === 'student' && 'Student ID (e.g. LIS-2026-001)'}
              </label>
              <input
                type="text"
                className="form-input"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Password / Security PIN</label>
                <span style={{ fontSize: '0.7rem', color: '#C88719', fontWeight: 700, cursor: 'pointer' }}>
                  Forgot PIN?
                </span>
              </div>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-gold btn-lg"
              style={{ width: '100%', marginTop: '1rem', borderRadius: 'var(--radius-md)' }}
            >
              <KeyRound size={16} />
              <span>Access {selectedRole.toUpperCase()} Dashboard</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo One-Click Access Badges */}
          <div style={{ marginTop: '1.75rem', borderTop: '1px solid #E2E8F0', paddingTop: '1.25rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.05em', marginBottom: '0.6rem', textAlign: 'center' }}>
              ⚡ Instant 1-Click Demo Logins
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('proprietor')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', justifyContent: 'flex-start' }}
              >
                <Building2 size={13} color="#C88719" />
                <span>Proprietor (Admin)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('teacher', teachers[0])}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', justifyContent: 'flex-start' }}
              >
                <UserCheck size={13} color="#3B82F6" />
                <span>{teachers[0]?.fullName.split(' ')[0] || 'Teacher'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('parent', parents[0])}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', justifyContent: 'flex-start' }}
              >
                <Users size={13} color="#10B981" />
                <span>{parents[0]?.fullName.split(' ')[0] || 'Parent'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('student', students[0])}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', justifyContent: 'flex-start' }}
              >
                <GraduationCap size={13} color="#8B5CF6" />
                <span>{students[0]?.fullName.split(' ')[0] || 'Student'}</span>
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#F8FAFC',
            padding: '1rem',
            textAlign: 'center',
            fontSize: '0.725rem',
            color: '#64748B',
            borderTop: '1px solid #E2E8F0',
            marginTop: '1.25rem',
          }}
        >
          Protected by AES-256 Cloud Infrastructure • Livine International School © {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
};
