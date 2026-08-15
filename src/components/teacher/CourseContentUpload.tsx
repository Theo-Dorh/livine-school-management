import React, { useState } from 'react';
import {
  Teacher,
  ClassRoom,
  Subject,
  CourseMaterial,
  AcademicTerm
} from '../../types';
import { Modal } from '../common/Modal';
import { SchoolStore } from '../../data/storage';
import {
  BookOpen,
  PlusCircle,
  FileText,
  Download,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  Paperclip
} from 'lucide-react';

interface CourseContentUploadProps {
  teacher: Teacher;
  classes: ClassRoom[];
  subjects: Subject[];
  courseMaterials: CourseMaterial[];
  activeTerm: AcademicTerm;
}

export const CourseContentUpload: React.FC<CourseContentUploadProps> = ({
  teacher,
  classes,
  subjects,
  courseMaterials,
  activeTerm
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewMaterial, setPreviewMaterial] = useState<CourseMaterial | null>(null);

  // Form states
  const [formClassId, setFormClassId] = useState(classes[11]?.id || classes[0].id); // JHS 2 Pioneer default
  const [formSubjectId, setFormSubjectId] = useState(subjects[2]?.id || subjects[0].id); // Integrated Science
  const [weekNumber, setWeekNumber] = useState<number>(9);
  const [strand, setStrand] = useState('Strand 3: Systems');
  const [subStrand, setSubStrand] = useState('Sub-strand 1: The Human Digestive & Excretory System');
  const [contentStandard, setContentStandard] = useState('B8.3.1.1: Show understanding of the structure and function of the human digestive system.');
  const [performanceIndicator, setPerformanceIndicator] = useState('B8.3.1.1.1: Identify the organs of the alimentary canal and their specific enzyme actions.');
  const [topicTitle, setTopicTitle] = useState('Human Digestive System & Enzyme Action in Digestion');
  const [lessonNotes, setLessonNotes] = useState(`### Key Learning Points:
1. **Alimentary Canal Organs**: Mouth, Oesophagus, Stomach, Duodenum, Small Intestine (Ileum), Large Intestine (Colon), Rectum and Anus.
2. **Digestive Enzymes**:
   - Salivary Amylase (Ptyalin) in mouth converts Starch to Maltose.
   - Pepsin in stomach breaks down Proteins to Peptides in acidic pH ($HCl$).
   - Pancreatic Lipase breaks down Lipids into Fatty Acids and Glycerol.
3. **Absorption**: Takes place in the villi of the small intestine.`);
  const [homeworkTitle, setHomeworkTitle] = useState('Alimentary Canal Diagram & Enzyme Table');
  const [homeworkInstructions, setHomeworkInstructions] = useState('Draw and label the human digestive system. Tabulate 4 digestive enzymes, their source gland, substrate, and end products.');
  const [homeworkDueDate, setHomeworkDueDate] = useState('2026-04-20');

  // Filter materials
  const myMaterials = courseMaterials.filter(c => {
    const isTeacher = c.teacherId === teacher.id;
    const isClass = selectedClassId === 'all' || c.classId === selectedClassId;
    return isTeacher && isClass;
  });

  const handleSaveMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    const targetClass = classes.find(c => c.id === formClassId);
    const targetSubject = subjects.find(s => s.id === formSubjectId);

    const newMaterial: CourseMaterial = {
      id: `crs-${Date.now()}`,
      classId: formClassId,
      className: targetClass?.name || 'Class',
      subjectId: formSubjectId,
      subjectName: targetSubject?.name || 'Subject',
      teacherId: teacher.id,
      teacherName: teacher.fullName,
      term: activeTerm,
      academicYear: '2025/2026',
      weekNumber: Number(weekNumber),
      strand,
      subStrand,
      contentStandard,
      performanceIndicator,
      topicTitle,
      lessonNotes,
      learningObjectives: [
        'Identify all main organs comprising the human digestive tract.',
        'Explain biochemical digestion and enzyme specificity.',
        'Apply healthy dietary habits in daily Ghanaian living.'
      ],
      homeworkTask: {
        title: homeworkTitle,
        instructions: homeworkInstructions,
        dueDate: homeworkDueDate,
        maxPoints: 10
      },
      attachments: [
        { fileName: `${targetSubject?.code}_Week${weekNumber}_Lesson_Notes.pdf`, fileSize: '1.9 MB', fileType: 'PDF Document' }
      ],
      createdAt: new Date().toISOString().split('T')[0]
    };

    SchoolStore.addCourseMaterial(newMaterial);
    setIsUploadModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Title & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
            Trimester Scheme of Learning & Lesson Notes (NaCCA)
          </h2>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
            Publish weekly learning strands, content standards, performance indicators, downloadable notes and homework for {activeTerm}
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="btn btn-gold"
        >
          <PlusCircle size={16} />
          <span>Upload Week's Scheme & Notes</span>
        </button>
      </div>

      {/* Filter by class */}
      <div className="card" style={{ padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-primary)' }}>Filter by Class:</span>
            <select
              className="form-select"
              style={{ width: '220px' }}
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              <option value="all">All My Assigned Classes</option>
              {classes.filter(c => teacher.assignedClasses.includes(c.id)).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <span className="badge badge-gold">
            {myMaterials.length} Modules Published This Trimester
          </span>
        </div>
      </div>

      {/* Grid of Course Materials */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {myMaterials.map((mat) => (
          <div key={mat.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="badge badge-blue" style={{ fontWeight: 700 }}>
                  Week {mat.weekNumber} • {mat.subjectName}
                </span>
                <span className="badge badge-gray">{mat.className}</span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '0.35rem' }}>
                {mat.topicTitle}
              </h3>

              <div style={{ fontSize: '0.75rem', color: 'var(--brand-gold-dark)', fontWeight: 700, marginBottom: '0.5rem' }}>
                {mat.strand} • {mat.subStrand}
              </div>

              <div style={{ fontSize: '0.8rem', backgroundColor: '#F8FAFC', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                <strong>NaCCA Standard:</strong> {mat.contentStandard}
              </div>

              {mat.homeworkTask && (
                <div style={{ fontSize: '0.8rem', backgroundColor: '#FEF3C7', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid #FCD34D', color: '#92400E', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 700 }}>Homework: {mat.homeworkTask.title}</div>
                  <div style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>Due: {mat.homeworkTask.dueDate} (Max: {mat.homeworkTask.maxPoints} pts)</div>
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                <Paperclip size={14} />
                <span>{mat.attachments.length} Downloadable File(s)</span>
              </div>

              <button
                onClick={() => setPreviewMaterial(mat)}
                className="btn btn-secondary btn-sm"
              >
                <span>View Full Lesson Notes</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Trimester Scheme of Learning & Notes"
        subtitle="National Council for Curriculum & Assessment (NaCCA) Standards-Based Curriculum"
        size="large"
      >
        <form onSubmit={handleSaveMaterial}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Select Class *</label>
              <select
                className="form-select"
                value={formClassId}
                onChange={(e) => setFormClassId(e.target.value)}
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Subject *</label>
              <select
                className="form-select"
                value={formSubjectId}
                onChange={(e) => setFormSubjectId(e.target.value)}
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Trimester Week Number *</label>
              <input
                type="number"
                min="1"
                max="14"
                className="form-input"
                value={weekNumber}
                onChange={(e) => setWeekNumber(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Curriculum Strand *</label>
              <input
                type="text"
                className="form-input"
                value={strand}
                onChange={(e) => setStrand(e.target.value)}
                placeholder="e.g. Strand 2: Cycles"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Sub-strand *</label>
              <input
                type="text"
                className="form-input"
                value={subStrand}
                onChange={(e) => setSubStrand(e.target.value)}
                placeholder="e.g. Sub-strand 1: Earth Science & Nitrogen Cycle"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Content Standard Code & Description *</label>
            <input
              type="text"
              className="form-input"
              value={contentStandard}
              onChange={(e) => setContentStandard(e.target.value)}
              placeholder="e.g. B8.2.1.1: Demonstrate an understanding of the nitrogen cycle..."
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Performance Indicator Code & Description *</label>
            <input
              type="text"
              className="form-input"
              value={performanceIndicator}
              onChange={(e) => setPerformanceIndicator(e.target.value)}
              placeholder="e.g. B8.2.1.1.1: Trace the processes involved in the nitrogen cycle..."
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Weekly Lesson Topic Title *</label>
            <input
              type="text"
              className="form-input"
              value={topicTitle}
              onChange={(e) => setTopicTitle(e.target.value)}
              placeholder="e.g. Nitrogen Cycle & Soil Fertility"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Comprehensive Lesson Summary & Notes *</label>
            <textarea
              className="form-textarea"
              style={{ minHeight: '120px' }}
              value={lessonNotes}
              onChange={(e) => setLessonNotes(e.target.value)}
              required
            />
          </div>

          {/* Homework sub-section */}
          <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #CBD5E1', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '0.5rem' }}>
              HOMEWORK ASSIGNMENT SPECIFICATIONS:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                value={homeworkTitle}
                onChange={(e) => setHomeworkTitle(e.target.value)}
                placeholder="Homework Title"
              />
              <input
                type="date"
                className="form-input"
                value={homeworkDueDate}
                onChange={(e) => setHomeworkDueDate(e.target.value)}
              />
            </div>
            <textarea
              className="form-textarea"
              value={homeworkInstructions}
              onChange={(e) => setHomeworkInstructions(e.target.value)}
              placeholder="Detailed homework tasks and instructions..."
              rows={2}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-gold"
            >
              <CheckCircle2 size={16} />
              <span>Publish for Students & Parents</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Preview Material Modal */}
      <Modal
        isOpen={!!previewMaterial}
        onClose={() => setPreviewMaterial(null)}
        title={previewMaterial ? `${previewMaterial.subjectName} — Week ${previewMaterial.weekNumber}` : ''}
        subtitle={previewMaterial?.topicTitle}
        size="large"
      >
        {previewMaterial && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-gold">{previewMaterial.className}</span>
              <span className="badge badge-blue">{previewMaterial.term} ({previewMaterial.academicYear})</span>
              <span className="badge badge-green">Instructor: {previewMaterial.teacherName}</span>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}>
              <div><strong>Strand:</strong> {previewMaterial.strand}</div>
              <div><strong>Sub-strand:</strong> {previewMaterial.subStrand}</div>
              <div><strong>Content Standard:</strong> {previewMaterial.contentStandard}</div>
              <div><strong>Performance Indicator:</strong> {previewMaterial.performanceIndicator}</div>
            </div>

            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '0.9rem', padding: '1rem', backgroundColor: '#FFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              {previewMaterial.lessonNotes}
            </div>

            {previewMaterial.homeworkTask && (
              <div style={{ backgroundColor: '#FEF3C7', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #FCD34D' }}>
                <h4 style={{ color: '#92400E', fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                  Homework Task: {previewMaterial.homeworkTask.title}
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#78350F' }}>
                  {previewMaterial.homeworkTask.instructions}
                </p>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B45309', marginTop: '0.5rem' }}>
                  Submission Deadline: {previewMaterial.homeworkTask.dueDate} • Maximum Points: {previewMaterial.homeworkTask.maxPoints} marks
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
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
