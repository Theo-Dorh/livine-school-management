import React, { useState } from 'react';
import { AnonymousComplaint } from '../../types';
import { StatusBadge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { SchoolStore } from '../../data/storage';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MessageSquare,
  Sparkles,
  FileCheck,
  Building
} from 'lucide-react';

interface ComplaintsInboxProps {
  complaints: AnonymousComplaint[];
}

export const ComplaintsInbox: React.FC<ComplaintsInboxProps> = ({
  complaints
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSender, setFilterSender] = useState<'all' | 'Student' | 'Teacher'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<AnonymousComplaint | null>(null);

  // Review status & notes form
  const [newStatus, setNewStatus] = useState<AnonymousComplaint['status']>('Under Investigation');
  const [adminNotes, setAdminNotes] = useState('');

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.trackingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSender = filterSender === 'all' || c.senderType === filterSender;
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesSender && matchesStatus;
  });

  const handleOpenReview = (complaint: AnonymousComplaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setAdminNotes(complaint.adminNotes || '');
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    SchoolStore.updateComplaintStatus(selectedComplaint.id, newStatus, adminNotes);
    setSelectedComplaint(null);
  };

  const totalOpen = complaints.filter(c => c.status !== 'Resolved' && c.status !== 'Dismissed').length;
  const studentReports = complaints.filter(c => c.senderType === 'Student').length;
  const teacherReports = complaints.filter(c => c.senderType === 'Teacher').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <ShieldAlert size={22} color="#B91C1C" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
              Anonymous Grievance & Whistleblower Central
            </h2>
          </div>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
            Safe, encrypted channel for students and teachers to report bullying, infrastructure concerns, and welfare issues without fear
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span className="badge badge-red" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
            {totalOpen} Pending Action
          </span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="stat-grid">
        <div className="stat-card red">
          <div>
            <div className="stat-label">Active Grievances</div>
            <div className="stat-value">{totalOpen}</div>
            <div className="stat-trend negative">
              <span>Under review by Proprietorship</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#FEE2E2', color: '#B91C1C' }}>
            <AlertTriangle size={22} />
          </div>
        </div>

        <div className="stat-card blue">
          <div>
            <div className="stat-label">Student Reports Logged</div>
            <div className="stat-value">{studentReports}</div>
            <div className="stat-trend" style={{ color: 'var(--brand-blue)' }}>
              <span>Bullying, Canteen & Washrooms</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8' }}>
            <MessageSquare size={22} />
          </div>
        </div>

        <div className="stat-card navy">
          <div>
            <div className="stat-label">Teacher Reports Logged</div>
            <div className="stat-value">{teacherReports}</div>
            <div className="stat-trend" style={{ color: 'var(--brand-gold)' }}>
              <span>TLMs, Lab Reagents & Welfare</span>
            </div>
          </div>
          <div className="stat-icon-wrapper">
            <Building size={22} />
          </div>
        </div>

        <div className="stat-card green">
          <div>
            <div className="stat-label">Resolved Issues</div>
            <div className="stat-value">{complaints.filter(c => c.status === 'Resolved').length}</div>
            <div className="stat-trend positive">
              <span>Remedial actions executed</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#DCFCE7', color: '#15803D' }}>
            <CheckCircle2 size={22} />
          </div>
        </div>
      </div>

      {/* Grievance Table */}
      <div className="card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div className="card-title">
              <ShieldAlert size={18} color="#B91C1C" />
              <span>Whistleblower Grievance Log</span>
            </div>
            <div className="card-subtitle">Showing {filteredComplaints.length} confidential submissions</div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '32px', width: '200px' }}
                placeholder="Search report..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="form-select"
              style={{ width: '150px' }}
              value={filterSender}
              onChange={(e) => setFilterSender(e.target.value as any)}
            >
              <option value="all">All Senders</option>
              <option value="Student">Students Only</option>
              <option value="Teacher">Teachers Only</option>
            </select>

            <select
              className="form-select"
              style={{ width: '160px' }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="New">New</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Resolved">Resolved</option>
              <option value="Dismissed">Dismissed</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Tracking Code</th>
                <th>Sender Type</th>
                <th>Category</th>
                <th>Subject & Snippet</th>
                <th>Severity</th>
                <th>Date Logged</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((cmp) => (
                <tr key={cmp.id}>
                  <td style={{ fontWeight: 800, color: 'var(--brand-primary)', fontSize: '0.8rem' }}>
                    {cmp.trackingCode}
                  </td>
                  <td>
                    <span 
                      className={`badge ${cmp.senderType === 'Student' ? 'badge-blue' : 'badge-gold'}`}
                      style={{ fontWeight: 700 }}
                    >
                      {cmp.senderType}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                    {cmp.targetCategory}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cmp.subject}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', maxWidth: '340px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {cmp.message}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${cmp.severity === 'Critical' || cmp.severity === 'High' ? 'badge-red' : 'badge-gray'}`}>
                      {cmp.severity}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{cmp.createdAt}</td>
                  <td>
                    <StatusBadge status={cmp.status} />
                  </td>
                  <td>
                    <button
                      onClick={() => handleOpenReview(cmp)}
                      className="btn btn-primary btn-sm"
                    >
                      <span>Review</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Complaint Modal */}
      <Modal
        isOpen={!!selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        title="Review Anonymous Grievance"
        subtitle={`Tracking Code: ${selectedComplaint?.trackingCode} • Submitted by Anonymous ${selectedComplaint?.senderType}`}
        size="large"
      >
        {selectedComplaint && (
          <form onSubmit={handleSaveReview}>
            <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="badge badge-gold" style={{ fontSize: '0.8rem' }}>
                  {selectedComplaint.targetCategory}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                  Logged on {selectedComplaint.createdAt}
                </span>
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '0.5rem' }}>
                {selectedComplaint.subject}
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.6, backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                {selectedComplaint.message}
              </p>
              {selectedComplaint.incidentLocation && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
                  <strong>Reported Location:</strong> {selectedComplaint.incidentLocation}
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Update Case Status *</label>
                <select
                  className="form-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                >
                  <option value="New">New</option>
                  <option value="Under Investigation">Under Investigation</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Dismissed">Dismissed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Management Action & Resolution Notes</label>
                <textarea
                  className="form-textarea"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Detail actions taken by the administration to address this grievance..."
                  rows={3}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="btn btn-secondary"
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-gold"
              >
                <FileCheck size={16} />
                <span>Save Action & Update Status</span>
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
