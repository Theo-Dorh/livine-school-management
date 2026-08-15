import React, { useState } from 'react';
import { SuperUser } from '../../types';
import { Modal } from '../common/Modal';
import { SchoolStore } from '../../data/storage';
import {
  ShieldCheck,
  UserPlus,
  Edit2,
  Trash2,
  Lock,
  CheckCircle2,
  Sparkles,
  KeyRound,
  Users
} from 'lucide-react';

interface SuperUserManagerProps {
  superUsers: SuperUser[];
}

export const SuperUserManager: React.FC<SuperUserManagerProps> = ({
  superUsers
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SuperUser | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [roleTitle, setRoleTitle] = useState('Bursar / Accounts Officer');
  const [status, setStatus] = useState<'Active' | 'Suspended'>('Active');

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
      setStatus(user.status);
      setCanManageFees(user.permissions.canManageFees);
      setCanManagePayroll(user.permissions.canManagePayroll);
      setCanManageUsers(user.permissions.canManageUsers);
      setCanManageSubjects(user.permissions.canManageSubjects);
      setCanManageCourseContent(user.permissions.canManageCourseContent);
      setCanPromoteStudents(user.permissions.canPromoteStudents);
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
      setCanManageCourseContent(true);
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <ShieldCheck size={22} color="var(--brand-gold)" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
              Superuser & Delegated Access Management
            </h2>
          </div>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
            Create administrative accounts and assign granular permissions (fee updating, course content management, promotions)
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="btn btn-gold"
        >
          <UserPlus size={16} />
          <span>Create Delegated Superuser</span>
        </button>
      </div>

      {/* Superusers List */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <KeyRound size={18} color="var(--brand-primary)" />
            <span>Delegated Administrative Officers</span>
          </div>
          <span className="badge badge-gold">{superUsers.length} Superusers</span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Superuser Name</th>
                <th>Role / Title</th>
                <th>Granted Administrative Permissions</th>
                <th>Status</th>
                <th>Date Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {superUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>{user.fullName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{user.email}</div>
                  </td>
                  <td>
                    <span className="badge badge-blue">{user.roleTitle}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', maxWidth: '380px' }}>
                      {user.permissions.canManageFees && <span className="badge badge-green">Fees Control</span>}
                      {user.permissions.canManagePayroll && <span className="badge badge-green">Payroll</span>}
                      {user.permissions.canManageUsers && <span className="badge badge-gold">Students & Teachers</span>}
                      {user.permissions.canManageSubjects && <span className="badge badge-blue">Subjects</span>}
                      {user.permissions.canManageCourseContent && <span className="badge badge-blue">Course Content</span>}
                      {user.permissions.canPromoteStudents && <span className="badge badge-gold">Promotions</span>}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${user.status === 'Active' ? 'badge-green' : 'badge-gray'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{user.dateCreated}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => handleOpenModal(user)}
                        className="btn btn-secondary btn-sm"
                        title="Edit Permissions"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id, user.fullName)}
                        className="btn btn-danger btn-sm"
                        title="Revoke Access"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Superuser Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Edit Superuser Rights' : 'Create Delegated Superuser'}
        subtitle="Livine International School Role-Based Access Control"
        size="large"
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
                placeholder="e.g. Mr. George Osei"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. g.osei@livineinternationalschool.edu.gh"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Role Title / Designation *</label>
              <input
                type="text"
                className="form-input"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="e.g. Bursar & Financial Controller"
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
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #CBD5E1', marginTop: '0.5rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '0.75rem' }}>
              DELEGATED PERMISSIONS & CAPABILITIES:
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={canManageFees}
                  onChange={(e) => setCanManageFees(e.target.checked)}
                  style={{ width: '16px', height: '16px' }}
                />
                <span><strong>Manage & Update Fees</strong> (Payments, Arrears)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={canManagePayroll}
                  onChange={(e) => setCanManagePayroll(e.target.checked)}
                  style={{ width: '16px', height: '16px' }}
                />
                <span><strong>Manage Staff Payroll</strong> (SSNIT, Disbursement)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={canManageUsers}
                  onChange={(e) => setCanManageUsers(e.target.checked)}
                  style={{ width: '16px', height: '16px' }}
                />
                <span><strong>Add / Remove Students & Teachers</strong></span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={canManageSubjects}
                  onChange={(e) => setCanManageSubjects(e.target.checked)}
                  style={{ width: '16px', height: '16px' }}
                />
                <span><strong>Add / Remove Curriculum Subjects</strong></span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={canManageCourseContent}
                  onChange={(e) => setCanManageCourseContent(e.target.checked)}
                  style={{ width: '16px', height: '16px' }}
                />
                <span><strong>Upload & Delete Course Content</strong></span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={canPromoteStudents}
                  onChange={(e) => setCanPromoteStudents(e.target.checked)}
                  style={{ width: '16px', height: '16px' }}
                />
                <span><strong>Promote or Repeat Students</strong></span>
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
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
              <span>{editingUser ? 'Save Superuser Permissions' : 'Create Superuser'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
