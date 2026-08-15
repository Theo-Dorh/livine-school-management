import React, { useState } from 'react';
import { Subject, CourseMaterial, ClassRoom, Teacher } from '../../types';
import { Modal } from '../common/Modal';
import { SchoolStore } from '../../data/storage';
import {
  BookOpen,
  PlusCircle,
  Edit2,
  Trash2,
  Layers,
  Search,
  CheckCircle2,
  FileText,
  Sparkles,
  Paperclip
} from 'lucide-react';

interface SubjectManagerProps {
  subjects: Subject[];
  courseMaterials: CourseMaterial[];
  classes: ClassRoom[];
  teachers: Teacher[];
}

export const SubjectManager: React.FC<SubjectManagerProps> = ({
  subjects,
  courseMaterials,
  classes,
  teachers
}) => {
  const [activeTab, setActiveTab] = useState<'subjects' | 'content'>('subjects');
  const [searchTerm, setSearchTerm] = useState('');

  // Subject Modal States
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [subjCode, setSubjCode] = useState('');
  const [subjName, setSubjName] = useState('');
  const [subjCategory, setSubjCategory] = useState<'Core' | 'Elective'>('Core');
  const [subjLevels, setSubjLevels] = useState<('Nursery' | 'KG' | 'Lower Primary' | 'Upper Primary' | 'JHS')[]>(['Lower Primary', 'Upper Primary', 'JHS']);
  const [subjDescription, setSubjDescription] = useState('');

  // Course Material View Modal
  const [previewMaterial, setPreviewMaterial] = useState<CourseMaterial | null>(null);

  const handleOpenSubjectModal = (subject?: Subject) => {
    if (subject) {
      setEditingSubject(subject);
      setSubjCode(subject.code);
      setSubjName(subject.name);
      setSubjCategory(subject.category);
      setSubjLevels(subject.applicableLevels);
      setSubjDescription(subject.description);
    } else {
      setEditingSubject(null);
      setSubjCode('ARB');
      setSubjName('Arabic Language');
      setSubjCategory('Elective');
      setSubjLevels(['Lower Primary', 'Upper Primary', 'JHS']);
      setSubjDescription('Arabic script reading, grammar and oral communication.');
    }
    setIsSubjectModalOpen(true);
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSubject) {
      const updated: Subject = {
        ...editingSubject,
        code: subjCode.toUpperCase(),
        name: subjName,
        category: subjCategory,
        applicableLevels: subjLevels,
        description: subjDescription
      };
      SchoolStore.updateSubject(updated);
    } else {
      const newSubject: Subject = {
        id: `sub-${subjCode.toLowerCase()}-${Date.now()}`,
        code: subjCode.toUpperCase(),
        name: subjName,
        category: subjCategory,
        applicableLevels: subjLevels,
        description: subjDescription
      };
      SchoolStore.addSubject(newSubject);
    }
    setIsSubjectModalOpen(false);
  };

  const handleDeleteSubject = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove curriculum subject "${name}"?`)) {
      SchoolStore.deleteSubject(id);
    }
  };

  const handleDeleteMaterial = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete course material "${title}"?`)) {
      SchoolStore.deleteCourseMaterial(id);
    }
  };

  const toggleLevel = (lvl: 'Nursery' | 'KG' | 'Lower Primary' | 'Upper Primary' | 'JHS') => {
    if (subjLevels.includes(lvl)) {
      setSubjLevels(subjLevels.filter(l => l !== lvl));
    } else {
      setSubjLevels([...subjLevels, lvl]);
    }
  };

  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMaterials = courseMaterials.filter(c =>
    c.topicTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
            NaCCA Curriculum & Course Content Management
          </h2>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
            Configure basic education subjects, assign curriculum strands, and moderate teacher-uploaded learning materials
          </p>
        </div>

        <button
          onClick={() => handleOpenSubjectModal()}
          className="btn btn-gold"
        >
          <PlusCircle size={16} />
          <span>Add New Curriculum Subject</span>
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('subjects')}
          className={`btn ${activeTab === 'subjects' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <BookOpen size={16} />
          <span>Curriculum Subjects ({subjects.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`btn ${activeTab === 'content' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Layers size={16} />
          <span>All Uploaded Course Content ({courseMaterials.length})</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ padding: '1rem 1.5rem' }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '32px' }}
            placeholder={activeTab === 'subjects' ? 'Search subjects...' : 'Search lesson materials...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Subjects View */}
      {activeTab === 'subjects' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <BookOpen size={18} color="var(--brand-primary)" />
              <span>NaCCA Approved Basic Education Subjects</span>
            </div>
            <span className="badge badge-gold">{filteredSubjects.length} Disciplines</span>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Subject Name</th>
                  <th>Category</th>
                  <th>Applicable Basic Levels</th>
                  <th>Curriculum Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubjects.map((sub) => (
                  <tr key={sub.id}>
                    <td style={{ fontWeight: 800, color: 'var(--brand-primary)' }}>{sub.code}</td>
                    <td style={{ fontWeight: 700 }}>{sub.name}</td>
                    <td>
                      <span className={`badge ${sub.category === 'Core' ? 'badge-blue' : 'badge-gold'}`}>
                        {sub.category}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>
                      {sub.applicableLevels.join(', ')}
                    </td>
                    <td style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', maxWidth: '300px' }}>
                      {sub.description}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => handleOpenSubjectModal(sub)}
                          className="btn btn-secondary btn-sm"
                          title="Edit Subject"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteSubject(sub.id, sub.name)}
                          className="btn btn-danger btn-sm"
                          title="Remove Subject"
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
      )}

      {/* Course Materials Moderation View */}
      {activeTab === 'content' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Layers size={18} color="var(--brand-primary)" />
              <span>Trimester Course Materials & Schemes of Learning</span>
            </div>
            <span className="badge badge-gold">{filteredMaterials.length} Items</span>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Week</th>
                  <th>Class</th>
                  <th>Subject</th>
                  <th>Topic Title & Strand</th>
                  <th>Instructor</th>
                  <th>Homework</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaterials.map((mat) => (
                  <tr key={mat.id}>
                    <td style={{ fontWeight: 800, color: 'var(--brand-primary)' }}>Wk {mat.weekNumber}</td>
                    <td><span className="badge badge-gray">{mat.className}</span></td>
                    <td style={{ fontWeight: 700 }}>{mat.subjectName}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{mat.topicTitle}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--brand-gold-dark)' }}>{mat.strand}</div>
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>{mat.teacherName}</td>
                    <td>
                      {mat.homeworkTask ? (
                        <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>Assigned</span>
                      ) : (
                        <span className="badge badge-gray" style={{ fontSize: '0.7rem' }}>None</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => setPreviewMaterial(mat)}
                          className="btn btn-secondary btn-sm"
                          title="View Full Lesson Notes"
                        >
                          <FileText size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteMaterial(mat.id, mat.topicTitle)}
                          className="btn btn-danger btn-sm"
                          title="Remove Material"
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
      )}

      {/* Add / Edit Subject Modal */}
      <Modal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        title={editingSubject ? 'Edit Curriculum Subject' : 'Add New Subject (NaCCA / GES)'}
        subtitle="Livine International School Academic Department"
      >
        <form onSubmit={handleSaveSubject}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Subject Code *</label>
              <input
                type="text"
                className="form-input"
                value={subjCode}
                onChange={(e) => setSubjCode(e.target.value)}
                placeholder="e.g. ARB / FRE / CAD"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subject Title / Name *</label>
              <input
                type="text"
                className="form-input"
                value={subjName}
                onChange={(e) => setSubjName(e.target.value)}
                placeholder="e.g. Arabic Language"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              className="form-select"
              value={subjCategory}
              onChange={(e) => setSubjCategory(e.target.value as any)}
            >
              <option value="Core">Core Curriculum Discipline</option>
              <option value="Elective">Elective Discipline</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Applicable Basic School Stages *</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {(['Nursery', 'KG', 'Lower Primary', 'Upper Primary', 'JHS'] as const).map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => toggleLevel(lvl)}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: subjLevels.includes(lvl) ? '2px solid #C88719' : '1px solid var(--border-medium)',
                    backgroundColor: subjLevels.includes(lvl) ? '#FEF3C7' : '#FFFFFF',
                    color: subjLevels.includes(lvl) ? '#92400E' : 'var(--text-primary)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Curriculum Description & Strands</label>
            <textarea
              className="form-textarea"
              value={subjDescription}
              onChange={(e) => setSubjDescription(e.target.value)}
              placeholder="Brief outline of syllabus goals..."
              rows={3}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button
              type="button"
              onClick={() => setIsSubjectModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-gold"
            >
              <CheckCircle2 size={16} />
              <span>{editingSubject ? 'Update Subject' : 'Add Subject to Curriculum'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Preview Material Modal */}
      <Modal
        isOpen={!!previewMaterial}
        onClose={() => setPreviewMaterial(null)}
        title={previewMaterial ? `${previewMaterial.subjectName} (Week ${previewMaterial.weekNumber})` : ''}
        subtitle={previewMaterial?.topicTitle}
        size="large"
      >
        {previewMaterial && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}>
              <div><strong>Strand:</strong> {previewMaterial.strand}</div>
              <div><strong>Sub-strand:</strong> {previewMaterial.subStrand}</div>
              <div><strong>Content Standard:</strong> {previewMaterial.contentStandard}</div>
            </div>

            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '0.9rem', padding: '1rem', backgroundColor: '#FFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              {previewMaterial.lessonNotes}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setPreviewMaterial(null)}
                className="btn btn-secondary"
              >
                Close View
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
