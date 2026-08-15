import React, { useState } from 'react';
import { AnonymousComplaint } from '../../types';
import { SchoolStore } from '../../data/storage';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;

    const trackingCode = `LIS-SAFE-TCH-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const complaint: AnonymousComplaint = {
      id: `cmp-${Date.now()}`,
      trackingCode,
      senderType: 'Teacher',
      targetCategory,
      subject,
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

    // Clear form
    setSubject('');
    setMessage('');
    setIncidentLocation('');
    setIncidentDate('');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Title & Privacy Assurance */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, #0F2537 0%, #1A364F 100%)', 
          borderRadius: 'var(--radius-lg)', 
          padding: '1.75rem 2rem', 
          color: '#FFFFFF',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
          <ShieldCheck size={24} color="#F6BC47" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF' }}>
            Anonymous Educator Whistleblower Channel
          </h2>
        </div>
        <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.875rem', lineHeight: 1.5 }}>
          Your identity is 100% confidential and never attached to this report. Submissions are delivered directly to the Proprietor & Board of Governors for impartial investigation.
        </p>
      </div>

      {generatedCode ? (
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', backgroundColor: '#F8FAFC', border: '2px solid #86EFAC' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#DCFCE7', color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <CheckCircle2 size={36} />
          </div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#15803D', marginBottom: '0.5rem' }}>
            Confidential Grievance Lodged Successfully!
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
            Your anonymous complaint has been transmitted to the Proprietor. Please save your private tracking code below to follow up if needed:
          </p>

          <div style={{ display: 'inline-block', backgroundColor: '#0F2537', color: '#F6BC47', padding: '0.75rem 2rem', borderRadius: 'var(--radius-md)', fontSize: '1.4rem', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
            {generatedCode}
          </div>

          <div>
            <button
              onClick={() => setGeneratedCode(null)}
              className="btn btn-secondary"
            >
              <span>Submit Another Grievance</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Lock size={18} color="var(--brand-gold)" />
              <span>Submit Identity-Protected Teacher Grievance</span>
            </div>
            <span className="badge badge-gold">Encrypted & Confidential</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Grievance Category *</label>
                <select
                  className="form-select"
                  value={targetCategory}
                  onChange={(e) => setTargetCategory(e.target.value as any)}
                  required
                >
                  <option value="Staff Welfare & Working Conditions">Staff Welfare & Working Conditions</option>
                  <option value="Academic & Classroom Concerns">Teaching Materials & Laboratory Reagents</option>
                  <option value="Infrastructure, Washrooms & Safety">Infrastructure, Safety & Washrooms</option>
                  <option value="Teacher / Staff Conduct">Administrative / Leadership Feedback</option>
                  <option value="General Improvement Suggestion">General School Improvement Suggestion</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Urgency / Severity Level *</label>
                <select
                  className="form-select"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  required
                >
                  <option value="Low">Low — Routine suggestion or inquiry</option>
                  <option value="Medium">Medium — Affects teaching efficiency</option>
                  <option value="High">High — Urgent attention required</option>
                  <option value="Critical">Critical — Immediate safety/ethical hazard</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Subject / Brief Headline *</label>
              <input
                type="text"
                className="form-input"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Science laboratory lacks essential reagents for Trimester 2 practicals"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Location / Department</label>
                <input
                  type="text"
                  className="form-input"
                  value={incidentLocation}
                  onChange={(e) => setIncidentLocation(e.target.value)}
                  placeholder="e.g. Science Laboratory / Staff Common Room"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Approximate Date of Incident</label>
                <input
                  type="date"
                  className="form-input"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Description of Grievance *</label>
              <textarea
                className="form-textarea"
                style={{ minHeight: '140px' }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Provide objective, specific details regarding this matter. Remember not to write your own name if you wish to remain anonymous."
                required
              />
            </div>

            <div style={{ backgroundColor: '#F8FAFC', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
              <Lock size={16} color="var(--brand-gold)" />
              <span>This system does NOT record IP addresses, email accounts, or browser cookies with your grievance.</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
      )}
    </div>
  );
};
