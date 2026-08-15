import React, { useState } from 'react';
import { Student, CourseMaterial, AcademicTerm } from '../../types';
import { Modal } from '../common/Modal';
import {
  BookOpen,
  FileText,
  Download,
  Paperclip,
  CheckCircle2,
  Calendar,
  Layers,
  Send,
  Sparkles
} from 'lucide-react';

interface LearningMaterialsProps {
  student: Student;
  courseMaterials: CourseMaterial[];
  activeTerm: AcademicTerm;
}

export const LearningMaterials: React.FC<LearningMaterialsProps> = ({
  student,
  courseMaterials,
  activeTerm
}) => {
  const [selectedMaterial, setSelectedMaterial] = useState<CourseMaterial | null>(null);
  const [submissionModalMaterial, setSubmissionModalMaterial] = useState<CourseMaterial | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submittedTasks, setSubmittedTasks] = useState<Record<string, boolean>>({});

  const classMaterials = courseMaterials.filter(
    c => c.classId === student.classId && c.term === activeTerm
  );

  const handleSubmitHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionModalMaterial) return;

    setSubmittedTasks(prev => ({ ...prev, [submissionModalMaterial.id]: true }));
    setSubmissionModalMaterial(null);
    setSubmissionText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
            Lesson Notes & Homework Submissions
          </h2>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
            Access weekly NaCCA learning strands, study handouts, and submit your homework for {student.className}
          </p>
        </div>

        <span className="badge badge-gold" style={{ fontSize: '0.85rem' }}>
          {activeTerm} (2025/2026 Academic Year)
        </span>
      </div>

      {/* Materials Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {classMaterials.map((mat) => {
          const isSubmitted = !!submittedTasks[mat.id];
          return (
            <div key={mat.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="badge badge-blue" style={{ fontWeight: 700 }}>
                    Week {mat.weekNumber} • {mat.subjectName}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    Tutor: {mat.teacherName}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '0.35rem' }}>
                  {mat.topicTitle}
                </h3>

                <div style={{ fontSize: '0.75rem', color: 'var(--brand-gold-dark)', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {mat.strand} • {mat.subStrand}
                </div>

                <div style={{ fontSize: '0.8rem', backgroundColor: '#F8FAFC', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  <strong>Standard:</strong> {mat.contentStandard}
                </div>

                {mat.homeworkTask && (
                  <div style={{ backgroundColor: isSubmitted ? '#DCFCE7' : '#FEF3C7', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: isSubmitted ? '1px solid #86EFAC' : '1px solid #FCD34D', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.825rem', color: isSubmitted ? '#15803D' : '#92400E' }}>
                        Homework: {mat.homeworkTask.title}
                      </span>
                      {isSubmitted && (
                        <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>Submitted ✓</span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: isSubmitted ? '#166534' : '#78350F', marginTop: '0.2rem' }}>
                      {mat.homeworkTask.instructions}
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isSubmitted ? '#15803D' : '#B45309', marginTop: '0.35rem' }}>
                      Due: {mat.homeworkTask.dueDate} (Max: {mat.homeworkTask.maxPoints} pts)
                    </div>
                  </div>
                )}
              </div>

              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={() => setSelectedMaterial(mat)}
                  className="btn btn-secondary btn-sm"
                >
                  <BookOpen size={14} />
                  <span>Read Lesson</span>
                </button>

                {mat.homeworkTask && !isSubmitted && (
                  <button
                    onClick={() => setSubmissionModalMaterial(mat)}
                    className="btn btn-gold btn-sm"
                  >
                    <Send size={14} />
                    <span>Submit Homework</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lesson View Modal */}
      <Modal
        isOpen={!!selectedMaterial}
        onClose={() => setSelectedMaterial(null)}
        title={selectedMaterial ? `${selectedMaterial.subjectName} — Week ${selectedMaterial.weekNumber}` : ''}
        subtitle={selectedMaterial?.topicTitle}
        size="large"
      >
        {selectedMaterial && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}>
              <div><strong>Strand:</strong> {selectedMaterial.strand}</div>
              <div><strong>Sub-strand:</strong> {selectedMaterial.subStrand}</div>
              <div><strong>Performance Indicator:</strong> {selectedMaterial.performanceIndicator}</div>
            </div>

            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '0.9rem', padding: '1.25rem', backgroundColor: '#FFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              {selectedMaterial.lessonNotes}
            </div>

            {selectedMaterial.attachments.length > 0 && (
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '0.5rem' }}>
                  Downloadable Study Handouts:
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {selectedMaterial.attachments.map((att, idx) => (
                    <div 
                      key={idx}
                      style={{ 
                        padding: '0.65rem 1rem', 
                        backgroundColor: '#F8FAFC', 
                        borderRadius: 'var(--radius-sm)', 
                        border: '1px solid #CBD5E1', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        fontSize: '0.8rem' 
                      }}
                    >
                      <FileText size={16} color="var(--brand-gold)" />
                      <span>{att.fileName} ({att.fileSize})</span>
                      <button 
                        onClick={() => alert(`Downloaded ${att.fileName}`)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.2rem 0.5rem', marginLeft: '0.5rem' }}
                      >
                        <Download size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button
                onClick={() => setSelectedMaterial(null)}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Submit Homework Modal */}
      <Modal
        isOpen={!!submissionModalMaterial}
        onClose={() => setSubmissionModalMaterial(null)}
        title="Submit Homework Assignment"
        subtitle={submissionModalMaterial?.homeworkTask?.title}
      >
        {submissionModalMaterial && (
          <form onSubmit={handleSubmitHomework}>
            <div style={{ backgroundColor: '#F8FAFC', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', marginBottom: '1rem', fontSize: '0.85rem' }}>
              <strong>Instructions:</strong> {submissionModalMaterial.homeworkTask?.instructions}
            </div>

            <div className="form-group">
              <label className="form-label">Type or Paste Your Answers *</label>
              <textarea
                className="form-textarea"
                style={{ minHeight: '120px' }}
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder="Write your homework answers here or summarize your submitted exercise book work..."
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setSubmissionModalMaterial(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-gold"
              >
                <CheckCircle2 size={16} />
                <span>Submit to Subject Tutor</span>
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
