import React, { useState } from 'react';
import { AnonymousComplaint } from '../../types';
import { SchoolStore } from '../../data/storage';
import { toast } from './Toast';
import { ShieldCheck, Search, CheckCircle2, Clock, AlertTriangle, MessageSquare, Send } from 'lucide-react';

interface WhistleblowerTrackerProps {
  complaints: AnonymousComplaint[];
}

export const WhistleblowerTracker: React.FC<WhistleblowerTrackerProps> = ({ complaints }) => {
  const [ticketInput, setTicketInput] = useState('');
  const [foundComplaint, setFoundComplaint] = useState<AnonymousComplaint | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [followUpText, setFollowUpText] = useState('');

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTicket = ticketInput.trim().toUpperCase();
    const match = complaints.find(
      (c) => c.ticketNumber.toUpperCase() === cleanTicket || c.id.toUpperCase() === cleanTicket
    );

    setFoundComplaint(match || null);
    setHasSearched(true);

    if (!match) {
      toast.error(`No grievance report found for Ticket Reference: ${cleanTicket}`);
    } else {
      toast.success('Investigation case record loaded anonymously');
    }
  };

  const handleAddFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundComplaint || !followUpText.trim()) return;

    const updatedNotes = `${foundComplaint.investigationNotes || ''}\n[Anonymous Reporter Follow-Up ${new Date().toISOString().split('T')[0]}]: ${followUpText}`;
    SchoolStore.updateComplaintStatus(foundComplaint.id, foundComplaint.status, updatedNotes);
    setFoundComplaint({ ...foundComplaint, investigationNotes: updatedNotes });
    setFollowUpText('');
    toast.success('Your anonymous follow-up note has been submitted to the Proprietor');
  };

  return (
    <div className="card" style={{ marginTop: '1.5rem', border: '1px solid var(--border-medium)' }}>
      <div className="card-header">
        <div className="card-title">
          <ShieldCheck size={20} color="#15803D" />
          <span>Anonymous Whistleblower Case Tracker</span>
        </div>
        <span className="badge badge-green">End-to-End Encrypted Identity</span>
      </div>

      <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
        Enter your confidential Ticket Reference Number (e.g. <code>LIS-SAFE-4892</code>) to check the current investigation progress, findings, and disciplinary actions taken by School Management without revealing who you are.
      </p>

      {/* Ticket Lookup Form */}
      <form onSubmit={handleLookup} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px', textTransform: 'uppercase', fontWeight: 700 }}
            placeholder="Enter your Ticket Code (e.g. LIS-SAFE-4892)..."
            value={ticketInput}
            onChange={(e) => setTicketInput(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          <span>Lookup Case</span>
        </button>
      </form>

      {/* Lookup Result Card */}
      {hasSearched && foundComplaint && (
        <div
          style={{
            backgroundColor: '#F8FAFC',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #CBD5E1',
            padding: '1.5rem',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className="badge badge-blue">Case Ref: {foundComplaint.ticketNumber}</span>
                <span className="badge badge-gold">Category: {foundComplaint.targetCategory}</span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F2537' }}>
                {foundComplaint.subject}
              </h3>
              <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>
                Logged on: {foundComplaint.createdAt} • Priority: <strong style={{ color: '#B91C1C' }}>{foundComplaint.severity}</strong>
              </div>
            </div>

            <div>
              <span
                className={`badge ${
                  foundComplaint.status === 'Resolved'
                    ? 'badge-green'
                    : foundComplaint.status === 'Under Investigation'
                    ? 'badge-gold'
                    : 'badge-red'
                }`}
                style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}
              >
                {foundComplaint.status === 'Resolved' && <CheckCircle2 size={14} />}
                {foundComplaint.status === 'Under Investigation' && <Clock size={14} />}
                {foundComplaint.status === 'New' && <AlertTriangle size={14} />}
                <span>Status: {foundComplaint.status}</span>
              </span>
            </div>
          </div>

          {/* Investigation Findings & Response */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#0F2537', marginBottom: '0.4rem' }}>
              Management Investigation Notes & Remedial Actions Taken:
            </div>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid #E2E8F0',
                fontSize: '0.85rem',
                color: '#334155',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.5,
              }}
            >
              {foundComplaint.investigationNotes || 'Your report has been received by the Proprietor and Disciplinary Board. Investigation is actively in progress under strict confidentiality.'}
            </div>
          </div>

          {/* Anonymous Follow-Up Box */}
          <form onSubmit={handleAddFollowUp}>
            <div className="form-group" style={{ marginBottom: '0.6rem' }}>
              <label className="form-label">Add Additional Confidential Evidence or Notes</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="Provide further details to the investigating team (identity remains 100% hidden)..."
                value={followUpText}
                onChange={(e) => setFollowUpText(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-secondary btn-sm" disabled={!followUpText.trim()}>
              <Send size={13} />
              <span>Submit Anonymous Follow-Up</span>
            </button>
          </form>
        </div>
      )}

      {hasSearched && !foundComplaint && (
        <div style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: '#FEF2F2', borderRadius: 'var(--radius-md)', color: '#991B1B', border: '1px solid #FECACA' }}>
          <AlertTriangle size={28} style={{ margin: '0 auto 0.5rem' }} />
          <div style={{ fontWeight: 800 }}>Invalid or Unrecognized Ticket Reference Code</div>
          <div style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>
            Please check the code provided when you submitted your anonymous complaint and try again.
          </div>
        </div>
      )}
    </div>
  );
};
