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
  KeyRound,
  Phone,
  MessageCircle
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
  const [selectedRole, setSelectedRole] = useState<UserRole>('parent');
  const [identifier, setIdentifier] = useState('0244987654');
  const [password, setPassword] = useState('parent123');

  // Phone Normalizer helper (strips spaces, symbols, +233 / 0)
  const normalizePhone = (phone: string) => {
    return phone.replace(/[\s\-\(\)\+]/g, '').replace(/^233/, '0');
  };

  const handleRoleTabChange = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'proprietor') {
      setIdentifier('admin@livine.edu.gh');
      setPassword('admin123');
    } else if (role === 'teacher') {
      setIdentifier(teachers[0]?.staffId || 'LIS-STF-001');
      setPassword('teacher123');
    } else if (role === 'parent') {
      setIdentifier('0244987654');
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
        (t) => t.staffId.toLowerCase() === identifier.trim().toLowerCase() ||
               t.email.toLowerCase() === identifier.trim().toLowerCase() ||
               normalizePhone(t.phone) === normalizePhone(identifier.trim())
      ) || teachers[0];
      toast.success(`Welcome, ${match.fullName}`, 'Educator Logged In');
      onLoginSuccess('teacher', { teacher: match });
    } else if (selectedRole === 'parent') {
      const cleanInput = identifier.trim();
      const match = parents.find((p) => {
        const phoneMatch = normalizePhone(p.phone) === normalizePhone(cleanInput) ||
                           (p.alternatePhone && normalizePhone(p.alternatePhone) === normalizePhone(cleanInput));
        const emailMatch = p.email && p.email.toLowerCase() === cleanInput.toLowerCase();
        return phoneMatch || emailMatch;
      }) || parents[0];

      toast.success(`Welcome, ${match.fullName}!`, 'Parent / WhatsApp Verified');
      onLoginSuccess('parent', { parent: match });
    } else if (selectedRole === 'student') {
      const match = students.find(
        (s) => s.studentId.toLowerCase() === identifier.trim().toLowerCase() ||
               s.fullName.toLowerCase().includes(identifier.trim().toLowerCase())
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
      toast.success(`Logged in via Phone (${userObj?.phone || '0244 498 7654'})`);
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

          <h1 style={{ fontSize: '1.35rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.01em', margin: 0 }}>
            {SCHOOL_INFO.name}
          </h1>
          <p style={{ fontSize: '0.75rem', color: '#FDE68A', fontWeight: 700, marginTop: '0.2rem' }}>
            School Management Portal
          </p>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.65)', marginTop: '0.15rem' }}>
            {SCHOOL_INFO.campus} • Digital: {SCHOOL_INFO.digitalAddress}
          </div>
        </div>

        {/* Role Selector Tabs */}
        <div style={{ padding: '1.25rem 1.25rem 0.5rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.25rem',
              backgroundColor: '#F1F5F9',
              padding: '0.25rem',
              borderRadius: 'var(--radius-full)',
              marginBottom: '1.25rem',
            }}
          >
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
                {selectedRole === 'parent' && 'Parent Phone / WhatsApp (or Email) *'}
                {selectedRole === 'proprietor' && 'Administrator Email / Username *'}
                {selectedRole === 'teacher' && 'Staff ID / Educator Email *'}
                {selectedRole === 'student' && 'Student ID *'}
              </label>
              <input
                type="text"
                className="form-input"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={selectedRole === 'parent' ? 'e.g. 0244987654 or +233 24 498 7654' : ''}
                required
              />
              {selectedRole === 'parent' && (
                <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Sparkles size={11} color="#10B981" />
                  <span>No email needed! Ghanaian mobile format: 024..., +233 24...</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-gold btn-lg"
              style={{ width: '100%', marginTop: '0.75rem', borderRadius: 'var(--radius-md)' }}
            >
              <KeyRound size={16} />
              <span>Sign In</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo One-Click Access Badges */}
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid #E2E8F0', paddingTop: '1.15rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.05em', marginBottom: '0.6rem', textAlign: 'center' }}>
              ⚡ Instant 1-Click Demo Logins
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.45rem' }}>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('parent', parents[0])}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.725rem', justifyContent: 'flex-start' }}
              >
                <Phone size={12} color="#10B981" />
                <span>Parent (0244 498 7654)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('proprietor')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.725rem', justifyContent: 'flex-start' }}
              >
                <Building2 size={12} color="#C88719" />
                <span>Proprietor (Admin)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('teacher', teachers[0])}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.725rem', justifyContent: 'flex-start' }}
              >
                <UserCheck size={12} color="#3B82F6" />
                <span>{teachers[0]?.fullName.split(' ')[0] || 'Teacher'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('student', students[0])}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.725rem', justifyContent: 'flex-start' }}
              >
                <GraduationCap size={12} color="#8B5CF6" />
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
