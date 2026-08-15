import React, { useState } from 'react';
import { AnonymousComplaint } from '../../types';
import { SchoolStore } from '../../data/storage';
import { StatusBadge } from '../common/Badge';
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

interface StudentComplaintBoxProps {
  complaints: AnonymousComplaint[];
}

export const StudentComplaintBox: React.FC<StudentComplaintBoxProps> = ({
  complaints
}) => {
  const [activeTab, setActiveTab] = useState<'lodge' | 'track'>('lodge');

  // Lodge complaint form
  const [targetCategory, setTargetCategory] = useState<AnonymousComplaint['targetCategory']>('Bullying & Peer Harassment');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [incidentLocation, setIncidentLocation] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [severity, setSeverity] = useState<AnonymousComplaint['severity']>('High');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  // Track complaint
  const [trackCodeInput, setTrackCodeInput] = useState('');
  const [trackedResult, setTrackedResult] = useState<AnonymousComplaint | null>(null);
  const [trackSearched, setTrackSearched] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;

    const trackingCode = `LIS-SAFE-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const complaint: AnonymousComplaint = {
      id: `cmp-${Date.now()}`,
      trackingCode,
      senderType: 'Student',
      targetCategory,
      subject,
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

    // Reset fields
    setSubject('');
    setMessage('');
    setIncidentLocation('');
    setIncidentDate('');
  };

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackSearched(true);
    const found = complaints.find(c => c.trackingCode.trim().toUpperCase() === trackCodeInput.trim().toUpperCase());
    setTrackedResult(found || null);
  };

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Privacy Shield Banner */}
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
            Student Safe-Report & Anti-Bullying Anonymous Channel
          </h2>
        </div>
        <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.875rem', lineHeight: 1.5 }}>
          Your safety, dignity, and wellbeing are our highest priority. Reports submitted here are completely anonymous. No teacher or student will ever know who sent it.
        </p>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
          <button
            onClick={() => setActiveTab('lodge')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-full)',
              border: activeTab === 'lodge' ? '2px solid #F6BC47' : '1px solid rgba(255, 255, 255, 0.25)',
              backgroundColor: activeTab === 'lodge' ? '#F6BC47' : 'transparent',
              color: activeTab === 'lodge' ? '#0F2537' : '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.825rem',
              cursor: 'pointer'
            }}
          >
            Lodge Anonymous Report
          </button>
          <button
            onClick={() => setActiveTab('track')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-full)',
              border: activeTab === 'track' ? '2px solid #F6BC47' : '1px solid rgba(255, 255, 255, 0.25)',
              backgroundColor: activeTab === 'track' ? '#F6BC47' : 'transparent',
              color: activeTab === 'track' ? '#0F2537' : '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.825rem',
              cursor: 'pointer'
            }}
          >
            Track My Past Report
          </button>
        </div>
      </div>

      {activeTab === 'lodge' && (
        <>
          {generatedCode ? (
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', backgroundColor: '#F8FAFC', border: '2px solid #86EFAC' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#DCFCE7', color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#15803D', marginBottom: '0.5rem' }}>
                Report Received Safely by the Headteacher!
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
                Thank you for speaking up. Your report is being reviewed. Keep this private tracking code to check if actions have been taken:
              </p>

              <div style={{ display: 'inline-block', backgroundColor: '#0F2537', color: '#F6BC47', padding: '0.75rem 2rem', borderRadius: 'var(--radius-md)', fontSize: '1.4rem', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
                {generatedCode}
              </div>

              <div>
                <button
                  onClick={() => setGeneratedCode(null)}
                  className="btn btn-secondary"
                >
                  <span>Submit Another Concern</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <Lock size={18} color="var(--brand-gold)" />
                  <span>Confidential Safe-Report Box</span>
                </div>
                <span className="badge badge-gold">100% Anonymous</span>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">What is this report about? *</label>
                    <select
                      className="form-select"
                      value={targetCategory}
                      onChange={(e) => setTargetCategory(e.target.value as any)}
                      required
                    >
                      <option value="Bullying & Peer Harassment">Bullying, Intimidation or Fighting</option>
                      <option value="Teacher / Staff Conduct">Teacher or Staff Conduct</option>
                      <option value="Canteen Food Hygiene & Quality">Canteen Food Quality & Hygiene</option>
                      <option value="Infrastructure, Washrooms & Safety">Washrooms, Water & Classroom Safety</option>
                      <option value="Academic & Classroom Concerns">Classroom Learning & Homework Issues</option>
                      <option value="School Bus & Transportation">School Bus & Transport Issues</option>
                      <option value="General Improvement Suggestion">Suggestion for School Improvement</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Severity / How serious is it? *</label>
                    <select
                      className="form-select"
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value as any)}
                      required
                    >
                      <option value="Low">Low — Just a suggestion or small issue</option>
                      <option value="Medium">Medium — Happens sometimes</option>
                      <option value="High">High — Very upsetting or dangerous</option>
                      <option value="Critical">Critical — Urgent safety emergency</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Headline / Subject *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Seniors pushing younger students at the canteen queue"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Where did it happen?</label>
                    <input
                      type="text"
                      className="form-input"
                      value={incidentLocation}
                      onChange={(e) => setIncidentLocation(e.target.value)}
                      placeholder="e.g. Near the Basketball Court / 2nd Floor Washroom"
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
                </div>

                <div className="form-group">
                  <label className="form-label">Describe what happened in detail *</label>
                  <textarea
                    className="form-textarea"
                    style={{ minHeight: '130px' }}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Explain clearly what took place. Do not include your own name if you wish to remain anonymous."
                    required
                  />
                </div>

                <div style={{ backgroundColor: '#F8FAFC', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                  <Lock size={16} color="var(--brand-gold)" />
                  <span>No student name or ID is saved with this submission. You are completely safe.</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="submit"
                    className="btn btn-gold btn-lg"
                  >
                    <Send size={16} />
                    <span>Send Confidential Report</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}

      {activeTab === 'track' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Search size={18} color="var(--brand-primary)" />
              <span>Track Resolution of Anonymous Report</span>
            </div>
            <div className="card-subtitle">Enter your secret tracking code (e.g. LIS-SAFE-9102)</div>
          </div>

          <form onSubmit={handleTrackSearch} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <input
              type="text"
              className="form-input"
              value={trackCodeInput}
              onChange={(e) => setTrackCodeInput(e.target.value)}
              placeholder="e.g. LIS-SAFE-9102"
              required
            />
            <button type="submit" className="btn btn-gold">
              <Search size={16} />
              <span>Search</span>
            </button>
          </form>

          {trackSearched && trackedResult && (
            <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="badge badge-gold">{trackedResult.targetCategory}</span>
                <StatusBadge status={trackedResult.status} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '0.35rem' }}>
                {trackedResult.subject}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                {trackedResult.message}
              </p>

              {trackedResult.adminNotes ? (
                <div style={{ backgroundColor: '#DCFCE7', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #86EFAC', color: '#14532D', fontSize: '0.85rem' }}>
                  <strong>Management Action Taken:</strong> {trackedResult.adminNotes}
                </div>
              ) : (
                <div style={{ backgroundColor: '#FEF3C7', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #FCD34D', color: '#78350F', fontSize: '0.85rem' }}>
                  <strong>Status Update:</strong> Your report is currently being investigated by the Headteacher and Senior House Master.
                </div>
              )}
            </div>
          )}

          {trackSearched && !trackedResult && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>
              <AlertTriangle size={32} color="#B91C1C" style={{ margin: '0 auto 0.5rem' }} />
              <p style={{ fontSize: '0.9rem', color: '#B91C1C', fontWeight: 600 }}>No report found with tracking code "{trackCodeInput}".</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Please verify the code and try again.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
