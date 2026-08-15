import React, { useState } from 'react';
import {
  Student,
  CourseMaterial,
  AcademicTerm
} from '../../types';
import { Modal } from '../common/Modal';
import {
  BookOpen,
  Calendar,
  Layers,
  FileText,
  Download,
  Paperclip,
  CheckCircle2,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface WardCurriculumViewProps {
  student: Student;
  courseMaterials: CourseMaterial[];
  activeTerm: AcademicTerm;
}

export const WardCurriculumView: React.FC<WardCurriculumViewProps> = ({
  student,
  courseMaterials,
  activeTerm
}) => {
  const [selectedMaterial, setSelectedMaterial] = useState<CourseMaterial | null>(null);

  const wardMaterials = courseMaterials.filter(
    c => c.classId === student.classId && c.term === activeTerm
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
            Ward's Trimester Scheme of Learning & Homework
          </h2>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
            NaCCA Curriculum Strands, weekly lesson notes, and home study guides for {student.fullName} ({student.className})
          </p>
        </div>

        <span className="badge badge-gold" style={{ fontSize: '0.85rem' }}>
          {activeTerm} (2025/2026 Academic Year)
        </span>
      </div>

      {/* Materials Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {wardMaterials.map((mat) => (
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
                <strong>Content Standard:</strong> {mat.contentStandard}
              </div>

              {mat.homeworkTask && (
                <div style={{ backgroundColor: '#FEF3C7', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #FCD34D', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.825rem', color: '#92400E' }}>
                    Homework Task: {mat.homeworkTask.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#78350F', marginTop: '0.2rem' }}>
                    {mat.homeworkTask.instructions}
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B45309', marginTop: '0.35rem' }}>
                    Submission Deadline: {mat.homeworkTask.dueDate}
                  </div>
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                <Paperclip size={14} />
                <span>{mat.attachments.length} Resource(s)</span>
              </div>

              <button
                onClick={() => setSelectedMaterial(mat)}
                className="btn btn-primary btn-sm"
              >
                <span>Read Lesson Notes</span>
              </button>
            </div>
          </div>
        ))}

        {wardMaterials.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', gridColumn: '1 / -1' }}>
            <BookOpen size={40} color="var(--brand-gold)" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--brand-primary)' }}>
              Lesson materials for this week are being prepared
            </h3>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              Subject teachers upload schemes of learning at the start of each curriculum cycle.
            </p>
          </div>
        )}
      </div>

      {/* Lesson Details Modal */}
      <Modal
        isOpen={!!selectedMaterial}
        onClose={() => setSelectedMaterial(null)}
        title={selectedMaterial ? `${selectedMaterial.subjectName} — Week ${selectedMaterial.weekNumber}` : ''}
        subtitle={selectedMaterial?.topicTitle}
        size="large"
      >
        {selectedMaterial && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-gold">{selectedMaterial.className}</span>
              <span className="badge badge-blue">{selectedMaterial.term} ({selectedMaterial.academicYear})</span>
              <span className="badge badge-green">Instructor: {selectedMaterial.teacherName}</span>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}>
              <div><strong>Curriculum Strand:</strong> {selectedMaterial.strand}</div>
              <div><strong>Sub-strand:</strong> {selectedMaterial.subStrand}</div>
              <div><strong>Performance Indicator:</strong> {selectedMaterial.performanceIndicator}</div>
            </div>

            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '0.9rem', padding: '1.25rem', backgroundColor: '#FFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              {selectedMaterial.lessonNotes}
            </div>

            {selectedMaterial.attachments.length > 0 && (
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '0.5rem' }}>
                  Downloadable Study Notes & Lab Sheets:
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
    </div>
  );
};
