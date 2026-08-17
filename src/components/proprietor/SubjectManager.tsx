import React, { useState } from 'react';
import { Subject, CourseMaterial, ClassRoom, Teacher } from '../../types';
import { Modal } from '../common/Modal';
import { SchoolStore } from '../../data/storage';
import {
  BookOpen,
  PlusCircle,
  Edit2,
  Trash2,
  Search,
  Layers,
  FileText,
  Clock,
  Calendar,
  CheckCircle2,
  FolderOpen
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
  const [activeTab, setActiveTab] = useState<'subjects' | 'schemes'>('subjects');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'Core' | 'Elective'>('all');

  // Modal State for New/Edit Subject
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
      setSubjLevels((subject.classLevels || subject.applicableLevels || ['Lower Primary', 'Upper Primary', 'JHS']) as any);
      setSubjDescription(subject.description || '');
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
        classLevels: subjLevels,
        applicableLevels: subjLevels,
        description: subjDescription
      };
      SchoolStore.updateSubject(updated);
    } else {
      const newSubject: Subject = {
        id: `sub-${subjCode.toLowerCase()}`,
        code: subjCode.toUpperCase(),
        name: subjName,
        category: subjCategory,
        classLevels: subjLevels,
        applicableLevels: subjLevels,
        description: subjDescription
      };
      SchoolStore.addSubject(newSubject);
    }
    setIsSubjectModalOpen(false);
  };

  const handleDeleteSubject = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove the subject "${name}" from the NaCCA curriculum?`)) {
      SchoolStore.deleteSubject(id);
    }
  };

  const toggleLevel = (level: 'Nursery' | 'KG' | 'Lower Primary' | 'Upper Primary' | 'JHS') => {
    if (subjLevels.includes(level)) {
      setSubjLevels(subjLevels.filter(l => l !== level));
    } else {
      setSubjLevels([...subjLevels, level]);
    }
  };

  // Filtered Subjects
  const filteredSubjects = subjects.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Sub Navigation Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--bg-subtle)', padding: '0.3rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-light)' }}>
          <button
            onClick={() => setActiveTab('subjects')}
            className={`btn btn-sm ${activeTab === 'subjects' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            <BookOpen size={14} />
            <span>NaCCA Subject Disciplines ({subjects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('schemes')}
            className={`btn btn-sm ${activeTab === 'schemes' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            <FolderOpen size={14} />
            <span>Curriculum Schemes of Learning ({courseMaterials.length})</span>
          </button>
        </div>

        {activeTab === 'subjects' && (
          <button
            onClick={() => handleOpenSubjectModal()}
            className="btn btn-gold"
          >
            <PlusCircle size={16} />
            <span>Add New Subject</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SUBJECT MASTER LIST                                                */}
      {/* ========================================================================= */}
      {activeTab === 'subjects' && (
        <>
          <div className="card" style={{ padding: '0.85rem 1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '32px', width: '280px' }}
                  placeholder="Search by subject name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`btn btn-sm ${selectedCategory === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  All Categories
                </button>
                <button
                  onClick={() => setSelectedCategory('Core')}
                  className={`btn btn-sm ${selectedCategory === 'Core' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  Core Subjects
                </button>
                <button
                  onClick={() => setSelectedCategory('Elective')}
                  className={`btn btn-sm ${selectedCategory === 'Elective' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  Elective Subjects
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Subject Name</th>
                    <th>Category</th>
                    <th>Curriculum Strands & Description</th>
                    <th>Applicable Stages / Levels</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubjects.map((s) => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 800, color: 'var(--brand-primary)' }}>{s.code}</td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{s.name}</div>
                      </td>
                      <td>
                        <span className={`badge ${s.category === 'Core' ? 'badge-gold' : 'badge-blue'}`}>
                          {s.category}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '300px' }}>
                        {s.description || 'Standard NaCCA Basic Education Scope'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                          {(s.classLevels || s.applicableLevels || []).map((lvl, idx) => (
                            <span key={idx} className="badge badge-gray" style={{ fontSize: '0.7rem' }}>
                              {lvl}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => handleOpenSubjectModal(s)}
                            className="btn btn-secondary btn-sm"
                            title="Edit Subject"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteSubject(s.id, s.name)}
                            className="btn btn-danger btn-sm"
                            title="Delete Subject"
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
        </>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CURRICULUM SCHEMES OF LEARNING (WEEKLY PLANS)                      */}
      {/* ========================================================================= */}
      {activeTab === 'schemes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Layers size={18} color="var(--brand-primary)" />
                <span>NaCCA Approved Weekly Schemes of Learning Repository</span>
              </div>
              <span className="badge badge-gold">{courseMaterials.length} Modules Uploaded</span>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Week</th>
                    <th>Class / Stage</th>
                    <th>Subject</th>
                    <th>Strand & Sub-Strand</th>
                    <th>Topic / Lesson Focus</th>
                    <th>Instructor</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courseMaterials.map((mat) => (
                    <tr key={mat.id}>
                      <td style={{ fontWeight: 800 }}>Week {mat.weekNumber}</td>
                      <td><span className="badge badge-gray">{mat.className}</span></td>
                      <td style={{ fontWeight: 700 }}>{mat.subjectName}</td>
                      <td style={{ fontSize: '0.8rem' }}>
                        <div style={{ fontWeight: 600 }}>{mat.strand}</div>
                        <div style={{ color: 'var(--text-tertiary)', fontSize: '0.725rem' }}>{mat.subStrand}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{mat.topicTitle}</div>
                      </td>
                      <td style={{ fontSize: '0.8rem' }}>{mat.teacherName}</td>
                      <td>
                        <button
                          onClick={() => setPreviewMaterial(mat)}
                          className="btn btn-secondary btn-sm"
                        >
                          <FileText size={13} />
                          <span>View Lesson Notes</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Subject Modal */}
      <Modal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        title={editingSubject ? 'Edit Subject Discipline' : 'Add Subject to Curriculum'}
        subtitle="Ghana Basic Education Curriculum Registry"
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
                placeholder="e.g. SCI"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Full Subject Name *</label>
              <input
                type="text"
                className="form-input"
                value={subjName}
                onChange={(e) => setSubjName(e.target.value)}
                placeholder="e.g. Integrated Science"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-select"
                value={subjCategory}
                onChange={(e) => setSubjCategory(e.target.value as any)}
              >
                <option value="Core">Core Subject</option>
                <option value="Elective">Elective Subject</option>
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Applicable Class Levels *</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                {(['Nursery', 'KG', 'Lower Primary', 'Upper Primary', 'JHS'] as const).map(lvl => {
                  const isSelected = subjLevels.includes(lvl);
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => toggleLevel(lvl)}
                      style={{
                        padding: '0.4rem 0.75rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        border: isSelected ? '1px solid var(--brand-primary)' : '1px solid var(--border-medium)',
                        backgroundColor: isSelected ? 'var(--brand-primary)' : 'var(--bg-subtle)',
                        color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                        cursor: 'pointer'
                      }}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Curriculum Strands & Scope</label>
              <textarea
                className="form-textarea"
                value={subjDescription}
                onChange={(e) => setSubjDescription(e.target.value)}
                placeholder="Key topics and strands covered..."
                rows={3}
              />
            </div>
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
              <span>{editingSubject ? 'Update Subject' : 'Save Subject'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Lesson Notes Preview Modal */}
      <Modal
        isOpen={Boolean(previewMaterial)}
        onClose={() => setPreviewMaterial(null)}
        title={previewMaterial ? `${previewMaterial.subjectName} — Week ${previewMaterial.weekNumber} Lesson Plan` : ''}
        subtitle={previewMaterial ? `${previewMaterial.className} • Instructor: ${previewMaterial.teacherName}` : ''}
        size="large"
      >
        {previewMaterial && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 800 }}>NaCCA Strand</span>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{previewMaterial.strand}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 800 }}>Sub-Strand</span>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{previewMaterial.subStrand}</div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '0.4rem' }}>
                Topic / Concept: {previewMaterial.topicTitle}
              </div>
              <div style={{ padding: '1rem', backgroundColor: '#FFFFFF', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {previewMaterial.lessonNotes}
              </div>
            </div>

            {previewMaterial.homeworkTask && (
              <div style={{ padding: '1rem', backgroundColor: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#92400E', marginBottom: '0.3rem' }}>
                  📝 Assigned Homework Task: {previewMaterial.homeworkTask.title}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#B45309' }}>
                  {previewMaterial.homeworkTask.instructions}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400E', marginTop: '0.5rem' }}>
                  Due Date: {previewMaterial.homeworkTask.dueDate} • Max Score: {previewMaterial.homeworkTask.maxPoints} Marks
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
