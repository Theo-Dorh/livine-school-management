import React, { useState } from 'react';
import { AnonymousComplaint } from '../../types';
import { SchoolStore } from '../../data/storage';
import { WhistleblowerTracker } from '../common/WhistleblowerTracker';
import { toast } from '../common/Toast';
import {
  ShieldAlert,
  ShieldCheck,
  Send,
  CheckCircle2,
  Lock,
  Search,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

export const StudentComplaintBox: React.FC = () => {
  // Lodge complaint form
  const [targetCategory, setTargetCategory] = useState<AnonymousComplaint['targetCategory']>('Bullying & Peer Harassment');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [incidentLocation, setIncidentLocation] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [severity, setSeverity] = useState<AnonymousComplaint['severity']>('High');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const complaints = SchoolStore.getComplaints();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;

    const trackingCode = `LIS-SAFE-STU-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const complaint: AnonymousComplaint = {
      id: `cmp-${Date.now()}`,
      trackingCode,
      ticketNumber: trackingCode,
      senderType: 'Student',
      targetCategory,
      subject,
      description: message,
      message,
      incidentLocation: incidentLocation || 'School Compound / Classroom',
      incidentDate: incidentDate || new Date().toISOString().split('T')[0],
      severity,
      status: 'New',
      createdAt: formattedDate,
      updatedAt: formattedDate
    };

    SchoolStore.addComplaint(complaint);
    setGeneratedCode(trackingCode);
    toast.success(`Anonymous Safe-Report Submitted! Ticket: ${trackingCode}`, 'Case Logged');

    // Clear form
    setSubject('');
    setMessage('');
    setIncidentLocation('');
    setIncidentDate('');
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Safe-Space Header */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, #0F2537 0%, #1E3A8A 100%)', 
          borderRadius: 'var(--radius-lg)', 
          padding: '1.75rem 2rem', 
          color: '#FFFFFF',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(200, 135, 25, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FDE68A' }}>
            <Lock size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 800, margin: 0 }}>
              Pupil Confidential Safe-Report Box
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.825rem' }}>
              Report bullying, unfair treatment, or safety concerns safely and anonymously
            </p>
          </div>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.9)', backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginTop: '0.75rem' }}>
          🛡️ <strong>Your identity is 100% confidential.</strong> Neither your teachers nor other pupils will know you reported this. The School Proprietor and Headmaster review every case directly.
        </div>
      </div>

      {/* Success Notification with Ticket Code */}
      {generatedCode && (
        <div 
          style={{ 
            backgroundColor: '#DCFCE7', 
            border: '2px solid #86EFAC', 
            borderRadius: 'var(--radius-md)', 
            padding: '1.25rem 1.5rem',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <CheckCircle2 size={24} color="#15803D" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#166534', margin: 0 }}>
              Report Received Safely
            </h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#166534', lineHeight: 1.5 }}>
            Copy your secret Case Code below. You can paste it into the Case Tracker below anytime to check what action the school has taken:
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem' }}>
            <div style={{ backgroundColor: '#FFFFFF', padding: '0.65rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '2px dashed #15803D', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '0.05em', color: '#0F2537' }}>
              {generatedCode}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedCode);
                toast.success('Case code copied to clipboard!');
              }}
              className="btn btn-primary btn-sm"
            >
              Copy Code
            </button>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <ShieldAlert size={18} color="var(--brand-red)" />
            <span>Submit Confidential Report</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">What is the issue about? *</label>
              <select
                className="form-select"
                value={targetCategory}
                onChange={(e) => setTargetCategory(e.target.value as any)}
              >
                <option value="Bullying & Peer Harassment">Bullying / Intimidation by Seniors</option>
                <option value="Academic Grievance / Unfair Marks">Unfair Grading / Academic Issue</option>
                <option value="School Infrastructure & Facilities">Broken Tap / Washroom / Canteen Issue</option>
                <option value="Teacher Conduct / Unfair Punishment">Excessive Punishment / Unfair Treatment</option>
                <option value="Other School Operational Concerns">General Security / Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">How urgent is this? *</label>
              <select
                className="form-select"
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
              >
                <option value="Medium">Medium (Needs attention soon)</option>
                <option value="High">High (I feel unsafe or uncomfortable)</option>
                <option value="Critical">Critical (Immediate danger / urgent)</option>
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">What happened? (Subject) *</label>
              <input
                type="text"
                className="form-input"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Someone took my lunch money near the basketball court"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Where did it happen? (Location)</label>
              <input
                type="text"
                className="form-input"
                value={incidentLocation}
                onChange={(e) => setIncidentLocation(e.target.value)}
                placeholder="e.g. Behind JHS Block / Canteen area"
              />
            </div>

            <div className="form-group">
              <label className="form-label">When did it happen?</label>
              <input
                type="date"
                className="form-input"
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Tell us everything that happened *</label>
              <textarea
                className="form-textarea"
                style={{ minHeight: '120px' }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write the details here. Remember: your identity is protected..."
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
            <button
              type="submit"
              className="btn btn-gold btn-lg"
            >
              <Send size={16} />
              <span>Send Safe-Report</span>
            </button>
          </div>
        </form>
      </div>

      {/* Case Tracker Component */}
      <WhistleblowerTracker complaints={complaints} />
    </div>
  );
};
