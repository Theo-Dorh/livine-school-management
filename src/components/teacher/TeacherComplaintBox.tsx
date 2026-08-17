import React, { useState } from 'react';
import { AnonymousComplaint } from '../../types';
import { SchoolStore } from '../../data/storage';
import { WhistleblowerTracker } from '../common/WhistleblowerTracker';
import { toast } from '../common/Toast';
import {
  MessageSquareWarning,
  ShieldCheck,
  Send,
  CheckCircle2,
  Lock,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const TeacherComplaintBox: React.FC = () => {
  const [targetCategory, setTargetCategory] = useState<AnonymousComplaint['targetCategory']>('Staff Welfare & Working Conditions');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [incidentLocation, setIncidentLocation] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [severity, setSeverity] = useState<AnonymousComplaint['severity']>('Medium');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const complaints = SchoolStore.getComplaints();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;

    const trackingCode = `LIS-SAFE-TCH-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const complaint: AnonymousComplaint = {
      id: `cmp-${Date.now()}`,
      trackingCode,
      ticketNumber: trackingCode,
      senderType: 'Teacher',
      targetCategory,
      subject,
      description: message,
      message,
      incidentLocation: incidentLocation || 'Staff Facility / Campus',
      incidentDate: incidentDate || new Date().toISOString().split('T')[0],
      severity,
      status: 'New',
      createdAt: formattedDate,
      updatedAt: formattedDate
    };

    SchoolStore.addComplaint(complaint);
    setGeneratedCode(trackingCode);
    toast.success(`Anonymous Grievance Lodged. Ticket: ${trackingCode}`, 'Confidential Case Created');

    // Clear form
    setSubject('');
    setMessage('');
    setIncidentLocation('');
    setIncidentDate('');
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Title & Privacy Assurance */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, #0F2537 0%, #17324B 100%)', 
          borderRadius: 'var(--radius-lg)', 
          padding: '1.75rem 2rem', 
          color: '#FFFFFF',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(200, 135, 25, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FDE68A' }}>
            <Lock size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 800, margin: 0 }}>
              Educator & Staff Safe-Reporting Box
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.825rem' }}>
              100% Anonymous • Direct Disciplinary Oversight by the Proprietor
            </p>
          </div>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.9)', backgroundColor: 'rgba(255, 255, 255, 0.08)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginTop: '0.75rem' }}>
          🔒 <strong>Zero Identity Logging:</strong> Your name, staff ID, email, and IP address are never stored. You will receive an encrypted ticket code to track the resolution status.
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
              Grievance Successfully Lodged Anonymously
            </h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#166534', lineHeight: 1.5 }}>
            Please copy your secret Tracking Reference Code below. You will need this code to check the status of management's investigation and response:
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem' }}>
            <div style={{ backgroundColor: '#FFFFFF', padding: '0.65rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '2px dashed #15803D', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '0.05em', color: '#0F2537' }}>
              {generatedCode}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedCode);
                toast.success('Ticket code copied to clipboard!');
              }}
              className="btn btn-primary btn-sm"
            >
              Copy Code
            </button>
          </div>
        </div>
      )}

      {/* Complaint Submission Form */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <MessageSquareWarning size={18} color="var(--brand-gold)" />
            <span>Lodge Confidential Staff Report</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Category of Grievance *</label>
              <select
                className="form-select"
                value={targetCategory}
                onChange={(e) => setTargetCategory(e.target.value as any)}
              >
                <option value="Staff Welfare & Working Conditions">Staff Welfare & Working Conditions</option>
                <option value="Teaching Learning Materials (TLMs)">Lack of Teaching / Lab Materials</option>
                <option value="School Infrastructure & Facilities">School Infrastructure / Washrooms</option>
                <option value="Administrative Policy / Disciplinary">Administrative Fairness</option>
                <option value="Harassment / Unethical Conduct">Harassment / Ethics Violation</option>
                <option value="Other School Operational Concerns">Other Operational Concern</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Urgency / Severity Level *</label>
              <select
                className="form-select"
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
              >
                <option value="Low">Low Priority (Routine Observation)</option>
                <option value="Medium">Medium Priority (Needs Attention)</option>
                <option value="High">High Priority (Urgent Resolution)</option>
                <option value="Critical">Critical (Immediate Proprietor Intervention)</option>
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Subject / Short Summary of Grievance *</label>
              <input
                type="text"
                className="form-input"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Broken science lab microscope or delays in printing trimester exam scripts"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Specific Campus Location (Optional)</label>
              <input
                type="text"
                className="form-input"
                value={incidentLocation}
                onChange={(e) => setIncidentLocation(e.target.value)}
                placeholder="e.g. Science Lab / Block B Staff Room"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date of Occurrence (Optional)</label>
              <input
                type="date"
                className="form-input"
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Detailed Description & Evidence *</label>
              <textarea
                className="form-textarea"
                style={{ minHeight: '120px' }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe the issue in detail. Do NOT include your name or identifying details if you wish to remain 100% anonymous..."
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
              <span>Submit Anonymous Report</span>
            </button>
          </div>
        </form>
      </div>

      {/* Case Tracker Component */}
      <WhistleblowerTracker complaints={complaints} />
    </div>
  );
};
