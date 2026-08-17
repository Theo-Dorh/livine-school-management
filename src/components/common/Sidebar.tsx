import React from 'react';
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
  Pin,
  X
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
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  activeCategory,
  onNavigate,
  unreadComplaintsCount = 0,
  isHovered,
  setIsHovered,
  isPinned,
  setIsPinned,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const isExpanded = isHovered || isPinned || isMobileOpen;

  const getNavItems = () => {
    switch (currentRole) {
      case 'proprietor':
        return [
          { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
          { id: 'people', label: 'Students & Staff', icon: Users },
          { id: 'academics', label: 'Academics', icon: BookOpen },
          { id: 'finance', label: 'Fees & Accounts', icon: Banknote },
          { id: 'governance', label: 'Suggestions & Reports', icon: ShieldAlert, badge: unreadComplaintsCount }
        ];
      case 'teacher':
        return [
          { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
          { id: 'marks', label: 'Enter Marks', icon: PenTool },
          { id: 'content', label: 'Lesson Notes', icon: BookOpen },
          { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
          { id: 'complaint', label: 'Suggestions Box', icon: MessageSquareWarning }
        ];
      case 'parent':
        return [
          { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
          { id: 'terminal_report', label: 'Report Card', icon: FileSpreadsheet },
          { id: 'fee_payment', label: 'Pay Fees', icon: CreditCard },
          { id: 'curriculum', label: 'Homework & Notes', icon: Layers }
        ];
      case 'student':
        return [
          { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard },
          { id: 'results', label: 'My Grades', icon: GraduationCap },
          { id: 'materials', label: 'Homework & Notes', icon: BookOpen },
          { id: 'complaint', label: 'Suggestions & Help', icon: MessageSquareWarning }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const handleItemClick = (id: string) => {
    onNavigate(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Drawer Semi-transparent Backdrop */}
      {isMobileOpen && (
        <div 
          className="sidebar-mobile-backdrop" 
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`sidebar-rail ${isExpanded ? 'expanded' : 'collapsed'} ${isMobileOpen ? 'mobile-open' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top Brand Anchor */}
        <div className="sidebar-brand-container">
          <div className="school-logo-crest">
            <School size={22} />
          </div>

          {isExpanded && (
            <div className="school-brand-text" style={{ flex: 1 }}>
              <h1 title={SCHOOL_INFO.name}>{SCHOOL_INFO.name}</h1>
              <p>East Legon, Accra</p>
            </div>
          )}

          {/* Close button visible on mobile drawer */}
          {isMobileOpen && onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="sidebar-mobile-close-btn"
              aria-label="Close navigation"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Role / Portal Indicator */}
        {isExpanded && (
          <div className="sidebar-role-indicator">
            <div className="role-subtext">Active Portal</div>
            <div className="role-title">
              {currentRole === 'proprietor' ? 'Admin Portal' : `${currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} Portal`}
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
                onClick={() => handleItemClick(item.id)}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                title={!isExpanded ? item.label : undefined}
              >
                <div className="icon-wrapper">
                  <Icon size={19} />
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

        {/* Sidebar Footer / Pin Toggle (Hidden on mobile) */}
        <div className="sidebar-bottom-action desktop-only">
          <button
            type="button"
            onClick={() => setIsPinned(!isPinned)}
            className={`pin-btn ${isPinned ? 'pinned' : ''}`}
            title={isPinned ? 'Unpin sidebar (Auto-collapse)' : 'Pin sidebar expanded'}
          >
            {isExpanded ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Pin size={14} style={{ transform: isPinned ? 'rotate(45deg)' : 'none' }} />
                <span style={{ fontSize: '0.75rem' }}>{isPinned ? 'Pinned' : 'Auto-collapse'}</span>
              </div>
            ) : (
              <Pin size={14} />
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
