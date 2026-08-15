import React, { useState } from 'react';
import { Student, ClassRoom, MarkEntry, PromotionStatus } from '../../types';
import { Modal } from '../common/Modal';
import { SchoolStore } from '../../data/storage';
import {
  Award,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Filter,
  Search,
  School,
  ArrowRight,
  GraduationCap
} from 'lucide-react';

interface PromotionManagerProps {
  students: Student[];
  classes: ClassRoom[];
  marks: MarkEntry[];
}

export const PromotionManager: React.FC<PromotionManagerProps> = ({
  students,
  classes,
  marks
}) => {
  const [selectedClassId, setSelectedClassId] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentForAction, setSelectedStudentForAction] = useState<Student | null>(null);
  const [promotionDecision, setPromotionDecision] = useState<PromotionStatus>('Promoted');
  const [targetClassId, setTargetClassId] = useState<string>('');
  const [promotionRemark, setPromotionRemark] = useState('');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Helper to calculate student's overall average score
  const getStudentAverage = (studentId: string) => {
    const stuMarks = marks.filter(m => m.studentId === studentId);
    if (stuMarks.length === 0) return 75; // Default estimate
    const sum = stuMarks.reduce((acc, m) => acc + m.totalScore, 0);
    return Math.round((sum / stuMarks.length) * 10) / 10;
  };

  // Helper to determine the next natural class in the Ghanaian curriculum sequence
  const getSuggestedNextClass = (currentClassId: string) => {
    const current = classes.find(c => c.id === currentClassId);
    if (!current) return classes[0];

    const currentStage = current.stageNumber;
    const nextClass = classes.find(c => c.stageNumber === currentStage + 1);
    return nextClass || current;
  };

  const handleOpenActionModal = (student: Student) => {
    setSelectedStudentForAction(student);
    const avg = getStudentAverage(student.id);
    const suggested = getSuggestedNextClass(student.classId);

    if (avg >= 50) {
      setPromotionDecision('Promoted');
      setTargetClassId(suggested.id);
      setPromotionRemark(`Promoted to ${suggested.name} with commendable academic progress.`);
    } else {
      setPromotionDecision('Repeated');
      setTargetClassId(student.classId);
      setPromotionRemark(`Retained in ${student.className} for remedial strengthening in core strands.`);
    }
  };

  const handleSavePromotion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForAction) return;

    const targetClass = classes.find(c => c.id === targetClassId);

    SchoolStore.promoteStudent(
      selectedStudentForAction.id,
      promotionDecision,
      targetClassId,
      targetClass?.name || selectedStudentForAction.className,
      promotionRemark
    );

    setSuccessNotice(`Updated academic decision for ${selectedStudentForAction.fullName}: ${promotionDecision}`);
    setSelectedStudentForAction(null);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || s.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClassId === 'all' || s.classId === selectedClassId;
    return matchesSearch && matchesClass;
  });

  const promotedCount = students.filter(s => s.promotionDecision === 'Promoted').length;
  const repeatedCount = students.filter(s => s.promotionDecision === 'Repeated').length;
  const pendingCount = students.filter(s => s.promotionDecision === 'Pending Assessment' || !s.promotionDecision).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Title & Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
            Student Promotion & Repetition Decision Center
          </h2>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
            Evaluate terminal performance, promote advancing pupils to the next stage, or assign repetition for underperforming students
          </p>
        </div>
      </div>

      {successNotice && (
        <div style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, border: '1px solid #86EFAC' }}>
          <CheckCircle2 size={18} />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Summary Metrics */}
      <div className="stat-grid">
        <div className="stat-card green">
          <div>
            <div className="stat-label">Promoted to Next Stage</div>
            <div className="stat-value">{promotedCount}</div>
            <div className="stat-trend positive">
              <span>Passed terminal assessments</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#DCFCE7', color: '#15803D' }}>
            <TrendingUp size={22} />
          </div>
        </div>

        <div className="stat-card red">
          <div>
            <div className="stat-label">Repeated in Same Level</div>
            <div className="stat-value">{repeatedCount}</div>
            <div className="stat-trend negative">
              <span>Underperformed / Remedial need</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#FEE2E2', color: '#B91C1C' }}>
            <RotateCcw size={22} />
          </div>
        </div>

        <div className="stat-card gold">
          <div>
            <div className="stat-label">Pending Decision</div>
            <div className="stat-value">{pendingCount}</div>
            <div className="stat-trend warning">
              <span>Awaiting academic review</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#FEF3C7', color: '#B45309' }}>
            <Award size={22} />
          </div>
        </div>
      </div>

      {/* Student Promotion Registry */}
      <div className="card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div className="card-title">
              <GraduationCap size={18} color="var(--brand-primary)" />
              <span>Pupil Academic Promotion & Repetition Registry</span>
            </div>
            <div className="card-subtitle">Showing {filteredStudents.length} students</div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '32px', width: '220px' }}
                placeholder="Search student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="form-select"
              style={{ width: '180px' }}
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              <option value="all">All Classes</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Current Class</th>
                <th>Trimester Average</th>
                <th>Promotion Decision</th>
                <th>Next Class / Placement</th>
                <th>Official Remark</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((stu) => {
                const avg = getStudentAverage(stu.id);
                return (
                  <tr key={stu.id}>
                    <td style={{ fontWeight: 800, color: 'var(--brand-primary)' }}>{stu.studentId}</td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{stu.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Parent: {stu.parentName}</div>
                    </td>
                    <td><span className="badge badge-gray">{stu.className}</span></td>
                    <td style={{ fontWeight: 800, color: avg >= 60 ? '#15803D' : avg >= 50 ? '#0F2537' : '#B91C1C', fontSize: '0.95rem' }}>
                      {avg}%
                    </td>
                    <td>
                      <span className={`badge ${stu.promotionDecision === 'Promoted' ? 'badge-green' : stu.promotionDecision === 'Repeated' ? 'badge-red' : 'badge-gold'}`}>
                        {stu.promotionDecision || 'Pending'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {stu.promotedToClassName || stu.className}
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: '240px' }}>
                      {stu.promotionRemark || 'Pending review by Academic Head.'}
                    </td>
                    <td>
                      <button
                        onClick={() => handleOpenActionModal(stu)}
                        className="btn btn-primary btn-sm"
                      >
                        <span>Decide / Edit</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Promotion / Repetition Modal */}
      <Modal
        isOpen={!!selectedStudentForAction}
        onClose={() => setSelectedStudentForAction(null)}
        title="Promote or Repeat Student"
        subtitle={`Student: ${selectedStudentForAction?.fullName} (${selectedStudentForAction?.className})`}
      >
        {selectedStudentForAction && (
          <form onSubmit={handleSavePromotion}>
            <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>CURRENT STANDING:</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F2537' }}>{selectedStudentForAction.className}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>TRIMESTER AVERAGE:</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: getStudentAverage(selectedStudentForAction.id) >= 50 ? '#15803D' : '#B91C1C' }}>
                    {getStudentAverage(selectedStudentForAction.id)}%
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Promotion Decision *</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setPromotionDecision('Promoted');
                    const sug = getSuggestedNextClass(selectedStudentForAction.classId);
                    setTargetClassId(sug.id);
                    setPromotionRemark(`Promoted to ${sug.name} with good performance.`);
                  }}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: promotionDecision === 'Promoted' ? '2px solid #15803D' : '1px solid var(--border-medium)',
                    backgroundColor: promotionDecision === 'Promoted' ? '#DCFCE7' : '#FFFFFF',
                    color: promotionDecision === 'Promoted' ? '#14532D' : 'var(--text-primary)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <TrendingUp size={16} />
                  <span>Promote to Next Class</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPromotionDecision('Repeated');
                    setTargetClassId(selectedStudentForAction.classId);
                    setPromotionRemark(`Repeated in ${selectedStudentForAction.className} for remedial improvement.`);
                  }}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: promotionDecision === 'Repeated' ? '2px solid #B91C1C' : '1px solid var(--border-medium)',
                    backgroundColor: promotionDecision === 'Repeated' ? '#FEE2E2' : '#FFFFFF',
                    color: promotionDecision === 'Repeated' ? '#7F1D1D' : 'var(--text-primary)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <RotateCcw size={16} />
                  <span>Repeat Same Level</span>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Next Academic Year Placement Class *</label>
              <select
                className="form-select"
                value={targetClassId}
                onChange={(e) => setTargetClassId(e.target.value)}
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.level})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Official Academic Remark / Directive *</label>
              <textarea
                className="form-textarea"
                value={promotionRemark}
                onChange={(e) => setPromotionRemark(e.target.value)}
                placeholder="e.g. Promoted to JHS 3 Triumph with academic distinction."
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setSelectedStudentForAction(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-gold"
              >
                <CheckCircle2 size={16} />
                <span>Confirm Academic Placement</span>
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
