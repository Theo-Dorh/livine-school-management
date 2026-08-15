import React, { useState } from 'react';
import { UserRole } from '../../types';
import { SCHOOL_INFO } from '../../data/mockData';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Banknote,
  MessageSquareWarning,
  PenTool,
  CalendarCheck,
  FileSpreadsheet,
  GraduationCap,
  CreditCard,
  Layers,
  ShieldAlert,
  School,
  ChevronLeft,
  ChevronRight,
  Pin
} from 'lucide-react';

interface SidebarProps {
  currentRole: UserRole;
  activeCategory: string;
  onNavigate: (category: string) => void;
  unreadComplaintsCount?: number;
  isHovered: boolean;
  setIsHovered: (hovered: boolean) => void;
  isPinned: boolean;
  setIsPinned: (pinned: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  activeCategory,
  onNavigate,
  unreadComplaintsCount = 0,
  isHovered,
  setIsHovered,
  isPinned,
  setIsPinned
}) => {
  const isExpanded = isHovered || isPinned;

  const getNavItems = () => {
    switch (currentRole) {
      case 'proprietor':
        return [
          { id: 'dashboard', label: 'Executive Overview', icon: LayoutDashboard },
          { id: 'people', label: 'People & Staffing', icon: Users },
          { id: 'academics', label: 'Academics & Content', icon: BookOpen },
          { id: 'finance', label: 'Finance & Accounts', icon: Banknote },
          { id: 'governance', label: 'Governance & Safety', icon: ShieldAlert, badge: unreadComplaintsCount }
        ];
      case 'teacher':
        return [
          { id: 'dashboard', label: 'Teacher Overview', icon: LayoutDashboard },
          { id: 'marks', label: 'Marks & Assessment', icon: PenTool },
          { id: 'content', label: 'Scheme of Learning', icon: BookOpen },
          { id: 'attendance', label: 'Daily Roll Call', icon: CalendarCheck },
          { id: 'complaint', label: 'Whistleblower Box', icon: MessageSquareWarning }
        ];
      case 'parent':
        return [
          { id: 'dashboard', label: 'Family Overview', icon: LayoutDashboard },
          { id: 'terminal_report', label: 'Terminal Report Card', icon: FileSpreadsheet },
          { id: 'fee_payment', label: 'Fees Statement & MoMo', icon: CreditCard },
          { id: 'curriculum', label: 'Curriculum & Homework', icon: Layers }
        ];
      case 'student':
        return [
          { id: 'dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
          { id: 'results', label: 'My Scores & Grades', icon: GraduationCap },
          { id: 'materials', label: 'Lesson Notes & Tasks', icon: BookOpen },
          { id: 'complaint', label: 'Safe-Report Box', icon: MessageSquareWarning }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside
      className={`sidebar-rail ${isExpanded ? 'expanded' : 'collapsed'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Brand Anchor: Livine International School */}
      <div className="sidebar-brand-container">
        <div className="school-logo-crest">
          <School size={24} />
        </div>

        {isExpanded && (
          <div className="school-brand-text">
            <h1 title={SCHOOL_INFO.name}>{SCHOOL_INFO.name}</h1>
            <p>Accra • NaCCA / GES</p>
          </div>
        )}
      </div>

      {/* Role / Portal Indicator */}
      {isExpanded && (
        <div className="sidebar-role-indicator">
          <div className="role-subtext">Active Navigation Portal</div>
          <div className="role-title">
            {currentRole === 'proprietor' ? 'Proprietor Command' : `${currentRole} Portal`}
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="sidebar-nav-list">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeCategory === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              title={!isExpanded ? item.label : undefined}
            >
              <div className="icon-wrapper">
                <Icon size={20} />
                {item.badge !== undefined && item.badge > 0 && !isExpanded && (
                  <span className="dot-badge" />
                )}
              </div>

              {isExpanded && (
                <span className="item-label">{item.label}</span>
              )}

              {isExpanded && item.badge !== undefined && item.badge > 0 && (
                <span className="count-badge">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer / Pin Toggle */}
      <div className="sidebar-bottom-action">
        <button
          type="button"
          onClick={() => setIsPinned(!isPinned)}
          className={`pin-btn ${isPinned ? 'pinned' : ''}`}
          title={isPinned ? 'Unpin sidebar (Auto-collapse)' : 'Pin sidebar expanded'}
        >
          {isExpanded ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Pin size={15} style={{ transform: isPinned ? 'rotate(45deg)' : 'none' }} />
              <span style={{ fontSize: '0.75rem' }}>{isPinned ? 'Sidebar Pinned' : 'Hover Expand Mode'}</span>
            </div>
          ) : (
            <Pin size={15} />
          )}
        </button>
      </div>
    </aside>
  );
};
