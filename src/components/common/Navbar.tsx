import React, { useState, useRef, useEffect } from 'react';
import { UserRole, AcademicTerm, Teacher, Parent, Student } from '../../types';
import { 
  Building2, 
  GraduationCap, 
  Users, 
  UserCheck, 
  Calendar,
  MapPin,
  ChevronDown,
  Check,
  LogOut,
  Menu
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
  onToggleMobileMenu?: () => void;
  onNavigateHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeTerm,
  onTermChange,
  currentTeacher,
  currentParent,
  currentStudent,
  onLogout,
  onToggleMobileMenu,
  onNavigateHome
}) => {
  const [isTermDropdownOpen, setIsTermDropdownOpen] = useState(false);
  const termDropdownRef = useRef<HTMLDivElement>(null);

  const roles: { role: UserRole; label: string; icon: React.ReactNode }[] = [
    { role: 'proprietor', label: 'Admin', icon: <Building2 size={14} /> },
    { role: 'teacher', label: 'Teacher', icon: <UserCheck size={14} /> },
    { role: 'parent', label: 'Parent', icon: <Users size={14} /> },
    { role: 'student', label: 'Student', icon: <GraduationCap size={14} /> },
  ];

  const terms: { id: AcademicTerm; label: string; range: string }[] = [
    { id: 'Term 1', label: 'Term 1', range: 'Sept – Dec' },
    { id: 'Term 2', label: 'Term 2 (Active)', range: 'Jan – Apr' },
    { id: 'Term 3', label: 'Term 3', range: 'May – Jul' },
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
    if (currentRole === 'proprietor') return 'Admin';
    if (currentRole === 'teacher') return currentTeacher?.fullName?.split(' ')[0] || 'Teacher';
    if (currentRole === 'parent') return currentParent?.fullName?.split(' ')[0] || 'Parent';
    if (currentRole === 'student') return currentStudent?.fullName?.split(' ')[0] || 'Student';
    return 'User';
  };

  return (
    <header className="top-header no-print">
      {/* Left side: Mobile menu hamburger button & Campus Location */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Mobile Hamburger Toggle Button */}
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="mobile-menu-toggle"
            aria-label="Open Navigation Menu"
          >
            <Menu size={20} />
          </button>
        )}

        <div 
          className="campus-pill"
          onClick={onNavigateHome}
          title="Return to Home Dashboard"
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.45rem', 
            fontSize: '0.775rem', 
            color: '#475569', 
            backgroundColor: '#F8FAFC', 
            padding: '0.4rem 0.85rem', 
            borderRadius: 'var(--radius-full)', 
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
            cursor: onNavigateHome ? 'pointer' : 'default'
          }}
        >
          <MapPin size={13} color="#C88719" />
          <span style={{ fontWeight: 600 }}>Ashale Botwe Lakeside, Accra</span>
        </div>
      </div>

      {/* Right side: Academic Term Selector, Role Switcher & User Profile Logout */}
      <div className="header-right-controls">
        {/* Custom Academic Term Dropdown */}
        <div ref={termDropdownRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setIsTermDropdownOpen(!isTermDropdownOpen)}
            className="term-selector-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: '#FFFFFF',
              padding: '0.38rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid #CBD5E1',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(15, 23, 42, 0.05)',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={11} color="#B45309" />
            </div>
            <span style={{ fontSize: '0.775rem', fontWeight: 800, color: '#0F2537' }}>
              {activeTerm}
            </span>
            <ChevronDown size={13} color="#64748B" style={{ transform: isTermDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
          </button>

          {/* Sleek Dribbble-style Dropdown Menu */}
          {isTermDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                width: '190px',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.08)',
                border: '1px solid #E2E8F0',
                padding: '0.35rem',
                zIndex: 100,
                animation: 'fadeIn 0.15s ease-out'
              }}
            >
              <div style={{ padding: '0.35rem 0.5rem 0.25rem', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.05em' }}>
                Select School Term
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
                      padding: '0.5rem 0.65rem',
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
                      <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{t.label}</div>
                      <div style={{ fontSize: '0.7rem', color: isSelected ? '#3B82F6' : '#64748B' }}>{t.range}</div>
                    </div>
                    {isSelected && <Check size={15} color="#1D4ED8" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Role Switcher Pills (Horizontal scrolling on mobile) */}
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
        <div className="user-profile-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#0F2537', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.725rem', fontWeight: 800, flexShrink: 0 }}>
              {getActiveUserName().slice(0, 2).toUpperCase()}
            </div>
            <span className="user-name-text" style={{ fontSize: '0.775rem', fontWeight: 700, color: '#0F2537' }}>
              {getActiveUserName()}
            </span>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="btn btn-secondary btn-sm logout-btn"
              title="Sign Out"
              style={{ padding: '0.32rem 0.55rem', borderRadius: 'var(--radius-full)' }}
            >
              <LogOut size={13} />
              <span className="logout-text">Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
