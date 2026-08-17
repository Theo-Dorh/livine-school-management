import React, { useState } from 'react';
import { SuperUser } from '../../types';
import { Modal } from '../common/Modal';
import { SchoolStore } from '../../data/storage';
import {
  UserCog,
  UserPlus,
  Edit2,
  Trash2,
  Shield,
  CheckCircle2,
  Lock,
  Key,
  Sliders,
  Sparkles,
  Phone,
  Mail
} from 'lucide-react';

interface SuperUserManagerProps {
  superUsers: SuperUser[];
}

export const SuperUserManager: React.FC<SuperUserManagerProps> = ({
  superUsers
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SuperUser | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [roleTitle, setRoleTitle] = useState('Bursar / Accounts Officer');
  const [status, setStatus] = useState<'Active' | 'Suspended' | 'Inactive'>('Active');

  // Permission checkboxes
  const [canManageFees, setCanManageFees] = useState(true);
  const [canManagePayroll, setCanManagePayroll] = useState(false);
  const [canManageUsers, setCanManageUsers] = useState(false);
  const [canManageSubjects, setCanManageSubjects] = useState(false);
  const [canManageCourseContent, setCanManageCourseContent] = useState(false);
  const [canPromoteStudents, setCanPromoteStudents] = useState(false);

  const handleOpenModal = (user?: SuperUser) => {
    if (user) {
      setEditingUser(user);
      setFullName(user.fullName);
      setEmail(user.email);
      setRoleTitle(user.roleTitle);
      setStatus(user.status || 'Active');
      setCanManageFees(user.permissions?.canManageFees ?? true);
      setCanManagePayroll(user.permissions?.canManagePayroll ?? false);
      setCanManageUsers(user.permissions?.canManageUsers ?? false);
      setCanManageSubjects(user.permissions?.canManageSubjects ?? false);
      setCanManageCourseContent(user.permissions?.canManageCourseContent ?? false);
      setCanPromoteStudents(user.permissions?.canPromoteStudents ?? false);
    } else {
      setEditingUser(null);
      setFullName('');
      setEmail('');
      setRoleTitle('Administrative Officer');
      setStatus('Active');
      setCanManageFees(true);
      setCanManagePayroll(false);
      setCanManageUsers(false);
      setCanManageSubjects(false);
      setCanManageCourseContent(false);
      setCanPromoteStudents(false);
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const permissions = {
      canManageFees,
      canManagePayroll,
      canManageUsers,
      canManageSubjects,
      canManageCourseContent,
      canPromoteStudents
    };

    if (editingUser) {
      const updated: SuperUser = {
        ...editingUser,
        fullName,
        email,
        roleTitle,
        status,
        permissions
      };
      SchoolStore.updateSuperUser(updated);
    } else {
      const newUser: SuperUser = {
        id: `su-${Date.now()}`,
        fullName,
        email: email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@livineinternationalschool.edu.gh`,
        roleTitle,
        status,
        permissions,
        dateCreated: new Date().toISOString().split('T')[0]
      };
      SchoolStore.addSuperUser(newUser);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to revoke superuser access for "${name}"?`)) {
      SchoolStore.deleteSuperUser(id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header & New Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
            Superuser Access & Role-Based Permissions
          </h3>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.825rem' }}>
            Delegate administrative access (Principal, Bursar, Form Masters, Exam Officers) with granular security rights
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="btn btn-gold"
        >
          <UserPlus size={16} />
          <span>Appoint Superuser</span>
        </button>
      </div>

      {/* Superuser Cards */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <UserCog size={18} color="var(--brand-primary)" />
            <span>Authorized Administrative Delegations</span>
          </div>
          <span className="badge badge-gold">{superUsers.length} Superusers</span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Administrator</th>
                <th>Designation / Role</th>
                <th>Granted Authority</th>
                <th>Status</th>
                <th>Date Appointed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {superUsers.map((u) => {
                const perms = u.permissions || {
                  canManageFees: u.canUpdateFees,
                  canManagePayroll: u.canViewFinance,
                  canManageUsers: u.canManageUsers,
                  canManageSubjects: u.canUpdateCourseContent,
                  canManageCourseContent: u.canUpdateCourseContent,
                  canPromoteStudents: u.canManagePromotions
                };
                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0F2537' }}>{u.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{u.email}</div>
                    </td>
                    <td>
                      <span className="badge badge-blue">{u.roleTitle}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', maxWidth: '350px' }}>
                        {perms.canManageFees && <span className="badge badge-gold">Fee Tariffs</span>}
                        {perms.canManagePayroll && <span className="badge badge-green">Payroll & P&L</span>}
                        {perms.canManageUsers && <span className="badge badge-purple">Admissions</span>}
                        {perms.canManageSubjects && <span className="badge badge-gray">Subjects</span>}
                        {perms.canManageCourseContent && <span className="badge badge-blue">Lesson Schemes</span>}
                        {perms.canPromoteStudents && <span className="badge badge-emerald">Promotions</span>}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${u.status === 'Active' ? 'badge-green' : 'badge-red'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                      {u.dateCreated || u.createdAt || '2025-09-01'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => handleOpenModal(u)}
                          className="btn btn-secondary btn-sm"
                          title="Edit Permissions"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(u.id, u.fullName)}
                          className="btn btn-danger btn-sm"
                          title="Revoke Delegation"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Edit Superuser Delegations' : 'Delegate Superuser Access'}
        subtitle="Role-Based Security & Authorization Matrix"
      >
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Mr. George Osei-Bonsu"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Official Email Address *</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@livineinternationalschool.edu.gh"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Administrative Title *</label>
              <input
                type="text"
                className="form-input"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="e.g. Headteacher / Vice Principal"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Account Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
              >
                <option value="Active">Active Account</option>
                <option value="Suspended">Suspended / Inactive</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
            <div style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '0.5rem' }}>
              Granular Permission Capabilities:
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={canManageFees}
                  onChange={(e) => setCanManageFees(e.target.checked)}
                />
                <span>Manage Fee Tariffs & Record Payments</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={canManagePayroll}
                  onChange={(e) => setCanManagePayroll(e.target.checked)}
                />
                <span>Manage Staff Payroll & Expenses</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={canManageUsers}
                  onChange={(e) => setCanManageUsers(e.target.checked)}
                />
                <span>Enroll & Remove Students / Teachers</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={canManageSubjects}
                  onChange={(e) => setCanManageSubjects(e.target.checked)}
                />
                <span>Configure Subjects & Disciplines</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={canManageCourseContent}
                  onChange={(e) => setCanManageCourseContent(e.target.checked)}
                />
                <span>Approve Schemes of Learning</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={canPromoteStudents}
                  onChange={(e) => setCanPromoteStudents(e.target.checked)}
                />
                <span>Execute Annual Pupil Promotions</span>
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-gold"
            >
              <CheckCircle2 size={16} />
              <span>{editingUser ? 'Update Delegations' : 'Grant Superuser Role'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
