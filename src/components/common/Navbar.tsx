import React, { useState, useRef, useEffect } from 'react';
import { UserRole, AcademicTerm, Teacher, Parent, Student } from '../../types';
import { SCHOOL_INFO } from '../../data/mockData';
import { 
  Building2, 
  GraduationCap, 
  Users, 
  UserCheck, 
  Calendar,
  Sparkles,
  MapPin,
  ChevronDown,
  Check,
  LogOut,
  User
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTerm: AcademicTerm;
  onTermChange: (term: AcademicTerm) => void;
  currentTeacher?: Teacher;
  currentParent?: Parent;
  currentStudent?: Student;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeTerm,
  onTermChange,
  currentTeacher,
  currentParent,
  currentStudent,
  onLogout
}) => {
  const [isTermDropdownOpen, setIsTermDropdownOpen] = useState(false);
  const termDropdownRef = useRef<HTMLDivElement>(null);

  const roles: { role: UserRole; label: string; icon: React.ReactNode; shortLabel: string }[] = [
    { role: 'proprietor', label: 'Proprietor / Admin', icon: <Building2 size={15} />, shortLabel: 'Admin' },
    { role: 'teacher', label: 'Teacher Portal', icon: <UserCheck size={15} />, shortLabel: 'Teacher' },
    { role: 'parent', label: 'Parent Portal', icon: <Users size={15} />, shortLabel: 'Parent' },
    { role: 'student', label: 'Student Portal', icon: <GraduationCap size={15} />, shortLabel: 'Student' },
  ];

  const terms: { id: AcademicTerm; label: string; range: string }[] = [
    { id: 'Term 1', label: 'Term 1', range: 'Sept – Dec 2025' },
    { id: 'Term 2', label: 'Term 2 (Active)', range: 'Jan – Apr 2026' },
    { id: 'Term 3', label: 'Term 3', range: 'May – Jul 2026' },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (termDropdownRef.current && !termDropdownRef.current.contains(event.target as Node)) {
        setIsTermDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Display name for active logged-in entity
  const getActiveUserName = () => {
    if (currentRole === 'proprietor') return 'Rev. Dr. E. K. Livine (Proprietor)';
    if (currentRole === 'teacher') return currentTeacher?.fullName || 'Teacher Faculty';
    if (currentRole === 'parent') return currentParent?.fullName || 'Parent Account';
    if (currentRole === 'student') return currentStudent?.fullName || 'Student Account';
    return 'User Account';
  };

  return (
    <header className="top-header no-print">
      {/* Left side: Curriculum & Location Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span 
            className="badge badge-gold" 
            style={{ 
              fontSize: '0.75rem', 
              fontWeight: 800, 
              padding: '0.35rem 0.85rem', 
              borderRadius: 'var(--radius-full)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#FEF3C7',
              color: '#92400E',
              border: '1px solid #FDE68A'
            }}
          >
            <Sparkles size={13} color="#D97706" />
            <span>NaCCA / GES Standards-Based Curriculum</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#64748B', backgroundColor: '#F8FAFC', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)', border: '1px solid #E2E8F0' }}>
          <MapPin size={12} color="#C88719" />
          <span>Accra Campus</span>
          <span style={{ color: '#CBD5E1' }}>•</span>
          <span style={{ color: '#0F2537', fontWeight: 700 }}>GA-492-3810</span>
        </div>
      </div>

      {/* Right side: Academic Term Selector, Role Switcher & User Profile Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
        {/* Custom Academic Term Dropdown */}
        <div ref={termDropdownRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setIsTermDropdownOpen(!isTermDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#FFFFFF',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid #CBD5E1',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(15, 23, 42, 0.05)',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={12} color="#B45309" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1 }}>
                Academic Term
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F2537', lineHeight: 1.2 }}>
                {activeTerm} (2025/2026)
              </span>
            </div>
            <ChevronDown size={14} color="#64748B" style={{ transform: isTermDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', marginLeft: '0.2rem' }} />
          </button>

          {/* Sleek Dribbble-style Dropdown Menu */}
          {isTermDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                width: '230px',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.08)',
                border: '1px solid #E2E8F0',
                padding: '0.4rem',
                zIndex: 100,
                animation: 'fadeIn 0.15s ease-out'
              }}
            >
              <div style={{ padding: '0.4rem 0.6rem 0.3rem', fontSize: '0.675rem', fontWeight: 800, textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.05em' }}>
                Select Trimester Term
              </div>
              {terms.map((t) => {
                const isSelected = activeTerm === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      onTermChange(t.id);
                      setIsTermDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.6rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: 'none',
                      backgroundColor: isSelected ? '#EFF6FF' : 'transparent',
                      color: isSelected ? '#1D4ED8' : '#1E293B',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background-color 0.12s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = '#F8FAFC';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.825rem', fontWeight: 800 }}>{t.label}</div>
                      <div style={{ fontSize: '0.725rem', color: isSelected ? '#3B82F6' : '#64748B' }}>{t.range}</div>
                    </div>
                    {isSelected && <Check size={16} color="#1D4ED8" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Role Switcher Pills */}
        <div className="role-pill-group">
          {roles.map((r) => (
            <button
              key={r.role}
              onClick={() => onRoleChange(r.role)}
              className={`role-pill ${currentRole === r.role ? 'active' : ''}`}
              title={`Switch to ${r.label}`}
            >
              {r.icon}
              <span>{r.label}</span>
            </button>
          ))}
        </div>

        {/* User Session Profile & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderLeft: '1px solid #E2E8F0', paddingLeft: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#0F2537', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
              {getActiveUserName().split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F2537', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {getActiveUserName()}
              </span>
              <span style={{ fontSize: '0.65rem', color: '#15803D', fontWeight: 700 }}>
                ● Online
              </span>
            </div>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="btn btn-secondary btn-sm"
              title="Sign Out / Switch Profile"
              style={{ padding: '0.35rem 0.6rem', borderRadius: 'var(--radius-full)', marginLeft: '0.2rem' }}
            >
              <LogOut size={13} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
