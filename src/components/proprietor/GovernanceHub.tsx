import React from 'react';
import { AnonymousComplaint } from '../../types';
import { ComplaintsInbox } from './ComplaintsInbox';
import {
  ShieldAlert,
  ChevronRight,
  MessageSquareWarning
} from 'lucide-react';

interface GovernanceHubProps {
  complaints: AnonymousComplaint[];
}

export const GovernanceHub: React.FC<GovernanceHubProps> = ({
  complaints
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--brand-primary)', fontWeight: 700 }}>
          <ShieldAlert size={16} />
          <span>Governance & Whistleblower Hub</span>
        </div>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--brand-gold-dark)', fontWeight: 800 }}>Anonymous Grievances & Safe-Reports</span>
      </div>

      <ComplaintsInbox complaints={complaints} />
    </div>
  );
};
