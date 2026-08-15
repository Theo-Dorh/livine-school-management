import React, { useState, useEffect } from 'react';
import {
  Student,
  ClassRoom,
  Subject,
  MarkEntry,
  AcademicTerm,
  Teacher
} from '../../types';
import { calculateNaCCAGrade, formatOrdinal, getSubjectAutoRemark } from '../../utils/grading';
import { GradeBadge } from '../common/Badge';
import { SchoolStore } from '../../data/storage';
import {
  FileSpreadsheet,
  Save,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Award
} from 'lucide-react';

interface MarksEntryProps {
  teacher: Teacher;
  classes: ClassRoom[];
  subjects: Subject[];
  students: Student[];
  marks: MarkEntry[];
  activeTerm: AcademicTerm;
}

export const MarksEntry: React.FC<MarksEntryProps> = ({
  teacher,
  classes,
  subjects,
  students,
  marks,
  activeTerm
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>('cls-jhs-2');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('sub-sci');
  const [activeYear] = useState('2025/2026');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Local state for mark inputs: Map studentId -> Partial<MarkEntry>
  const [localScores, setLocalScores] = useState<Record<string, {
    sbaTest1: number;
    sbaTest2: number;
    sbaProject: number;
    sbaHomework: number;
    examScore: number;
    teacherRemarks: string;
  }>>({});

  // Filter students in selected class
  const classStudents = students.filter(s => s.classId === selectedClassId);
  const selectedClass = classes.find(c => c.id === selectedClassId);
  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

  // Sync existing marks when class or subject changes
  useEffect(() => {
    const newLocal: Record<string, any> = {};
    classStudents.forEach(stu => {
      const existing = marks.find(
        m => m.studentId === stu.id && 
             m.subjectId === selectedSubjectId && 
             m.term === activeTerm && 
             m.academicYear === activeYear
      );

      if (existing) {
        newLocal[stu.id] = {
          sbaTest1: existing.sbaTest1,
          sbaTest2: existing.sbaTest2,
          sbaProject: existing.sbaProject,
          sbaHomework: existing.sbaHomework,
          examScore: existing.examScore,
          teacherRemarks: existing.teacherRemarks
        };
      } else {
        newLocal[stu.id] = {
          sbaTest1: 12,
          sbaTest2: 12,
          sbaProject: 8,
          sbaHomework: 8,
          examScore: 38,
          teacherRemarks: ''
        };
      }
    });
    setLocalScores(newLocal);
  }, [selectedClassId, selectedSubjectId, activeTerm, marks]);

  const handleScoreChange = (
    studentId: string, 
    field: 'sbaTest1' | 'sbaTest2' | 'sbaProject' | 'sbaHomework' | 'examScore' | 'teacherRemarks', 
    value: string | number
  ) => {
    let numVal = typeof value === 'number' ? value : Number(value);
    
    // Bounds enforcement
    if (field === 'sbaTest1' || field === 'sbaTest2') numVal = Math.min(15, Math.max(0, numVal || 0));
    if (field === 'sbaProject' || field === 'sbaHomework') numVal = Math.min(10, Math.max(0, numVal || 0));
    if (field === 'examScore') numVal = Math.min(50, Math.max(0, numVal || 0));

    setLocalScores(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: field === 'teacherRemarks' ? value : numVal
      }
    }));
  };

  // Compute computed rows with rankings
  const computedList = classStudents.map((stu) => {
    const item = localScores[stu.id] || {
      sbaTest1: 0,
      sbaTest2: 0,
      sbaProject: 0,
      sbaHomework: 0,
      examScore: 0,
      teacherRemarks: ''
    };

    const totalSba = (item.sbaTest1 || 0) + (item.sbaTest2 || 0) + (item.sbaProject || 0) + (item.sbaHomework || 0);
    const exam = item.examScore || 0;
    const totalScore = totalSba + exam;
    const gradeInfo = calculateNaCCAGrade(totalScore);
    const remarks = item.teacherRemarks || getSubjectAutoRemark(totalScore);

    return {
      student: stu,
      totalSba,
      examScore: exam,
      totalScore,
      gradeInfo,
      remarks,
      raw: item
    };
  });

  // Calculate subject rankings
  const sorted = [...computedList].sort((a, b) => b.totalScore - a.totalScore);
  const rankMap = new Map<string, string>();
  sorted.forEach((item, index) => {
    rankMap.set(item.student.id, formatOrdinal(index + 1));
  });

  const handleSaveMarks = () => {
    const marksToSave: MarkEntry[] = computedList.map((item, index) => {
      const position = rankMap.get(item.student.id) || '1st';
      return {
        id: `mrk-${item.student.id}-${selectedSubjectId}-${activeTerm}`,
        studentId: item.student.id,
        studentName: item.student.fullName,
        classId: selectedClassId,
        subjectId: selectedSubjectId,
        subjectName: selectedSubject?.name || 'Subject',
        term: activeTerm,
        academicYear: activeYear,
        sbaTest1: item.raw.sbaTest1,
        sbaTest2: item.raw.sbaTest2,
        sbaProject: item.raw.sbaProject,
        sbaHomework: item.raw.sbaHomework,
        totalSba: item.totalSba,
        examScore: item.examScore,
        totalScore: item.totalScore,
        beceGrade: item.gradeInfo.grade,
        descriptor: item.gradeInfo.descriptor,
        gradeRemark: item.gradeInfo.gradeRemark,
        classRank: index + 1,
        subjectPosition: position,
        teacherRemarks: item.remarks,
        teacherId: teacher.id,
        updatedAt: new Date().toISOString().split('T')[0]
      };
    });

    SchoolStore.saveMarks(marksToSave);
    setSaveSuccessMessage(`Successfully saved marks for ${selectedSubject?.name} (${selectedClass?.name})!`);
    setTimeout(() => setSaveSuccessMessage(null), 4000);
  };

  const handleAutoFill = () => {
    const filled: Record<string, any> = {};
    classStudents.forEach((stu, idx) => {
      const baseExam = 35 + (idx % 4) * 3;
      const t1 = 11 + (idx % 3);
      const t2 = 12 + (idx % 3);
      const prj = 8 + (idx % 2);
      const hw = 8 + (idx % 2);
      const total = t1 + t2 + prj + hw + baseExam;
      filled[stu.id] = {
        sbaTest1: t1,
        sbaTest2: t2,
        sbaProject: prj,
        sbaHomework: hw,
        examScore: baseExam,
        teacherRemarks: getSubjectAutoRemark(total)
      };
    });
    setLocalScores(filled);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Title & Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
            Ghanaian NaCCA Marks & Assessment Sheet
          </h2>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
            Continuous Assessment (SBA 50% = Test 1 + Test 2 + Project + Homework) + End of Term Exam (50%) = Total (100%)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleAutoFill}
            className="btn btn-secondary"
            title="Auto-fill sample realistic grades"
          >
            <Sparkles size={16} />
            <span>Auto-fill Sample Marks</span>
          </button>
          <button
            onClick={handleSaveMarks}
            className="btn btn-gold"
          >
            <Save size={16} />
            <span>Save All Class Marks</span>
          </button>
        </div>
      </div>

      {saveSuccessMessage && (
        <div style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, border: '1px solid #86EFAC' }}>
          <CheckCircle2 size={18} />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Class & Subject Selector Controls */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          <div>
            <label className="form-label">Select Basic School Class Level *</label>
            <select
              className="form-select"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.level})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Select NaCCA Subject *</label>
            <select
              className="form-select"
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Active Trimester & Academic Year</label>
            <div style={{ padding: '0.6rem 0.85rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', fontWeight: 700, color: 'var(--brand-primary)', fontSize: '0.875rem', border: '1px solid var(--border-light)' }}>
              {activeTerm} ({activeYear})
            </div>
          </div>
        </div>
      </div>

      {/* NaCCA Assessment Mark Sheet Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">
              <FileSpreadsheet size={18} color="var(--brand-gold)" />
              <span>Assessment Mark Sheet: {selectedSubject?.name} — {selectedClass?.name}</span>
            </div>
            <div className="card-subtitle">
              Stanine 9-Grade Scale (1=Highest to 9=Lowest) • NaCCA Performance Standards
            </div>
          </div>
          <span className="badge badge-gold">{classStudents.length} Students on Roll</span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '180px' }}>Student Details</th>
                <th title="Class Test 1 (Max 15)">Test 1 <br /><span style={{ fontSize: '0.65rem' }}>/15</span></th>
                <th title="Class Test 2 (Max 15)">Test 2 <br /><span style={{ fontSize: '0.65rem' }}>/15</span></th>
                <th title="Project Work (Max 10)">Project <br /><span style={{ fontSize: '0.65rem' }}>/10</span></th>
                <th title="Class Task / HW (Max 10)">HW <br /><span style={{ fontSize: '0.65rem' }}>/10</span></th>
                <th style={{ backgroundColor: '#E2E8F0', color: '#0F2537' }}>SBA Total <br /><span style={{ fontSize: '0.65rem' }}>/50</span></th>
                <th title="End of Trimester Exam (Max 50)">Exam <br /><span style={{ fontSize: '0.65rem' }}>/50</span></th>
                <th style={{ backgroundColor: '#0F2537', color: '#FFF' }}>Total <br /><span style={{ fontSize: '0.65rem' }}>/100</span></th>
                <th>Grade</th>
                <th>Rank</th>
                <th>Teacher's Subject Remarks</th>
              </tr>
            </thead>
            <tbody>
              {computedList.map((item) => {
                const stuId = item.student.id;
                const raw = item.raw;
                const pos = rankMap.get(stuId) || '1st';

                return (
                  <tr key={stuId}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>{item.student.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{item.student.studentId}</div>
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="15"
                        style={{ width: '55px', padding: '0.3rem', textAlign: 'center', borderRadius: '4px', border: '1px solid var(--border-medium)', fontWeight: 600 }}
                        value={raw.sbaTest1}
                        onChange={(e) => handleScoreChange(stuId, 'sbaTest1', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="15"
                        style={{ width: '55px', padding: '0.3rem', textAlign: 'center', borderRadius: '4px', border: '1px solid var(--border-medium)', fontWeight: 600 }}
                        value={raw.sbaTest2}
                        onChange={(e) => handleScoreChange(stuId, 'sbaTest2', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        style={{ width: '50px', padding: '0.3rem', textAlign: 'center', borderRadius: '4px', border: '1px solid var(--border-medium)', fontWeight: 600 }}
                        value={raw.sbaProject}
                        onChange={(e) => handleScoreChange(stuId, 'sbaProject', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        style={{ width: '50px', padding: '0.3rem', textAlign: 'center', borderRadius: '4px', border: '1px solid var(--border-medium)', fontWeight: 600 }}
                        value={raw.sbaHomework}
                        onChange={(e) => handleScoreChange(stuId, 'sbaHomework', e.target.value)}
                      />
                    </td>
                    <td style={{ fontWeight: 800, textAlign: 'center', backgroundColor: '#F1F5F9' }}>
                      {item.totalSba}
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        style={{ width: '60px', padding: '0.3rem', textAlign: 'center', borderRadius: '4px', border: '1px solid var(--border-medium)', fontWeight: 700, color: 'var(--brand-primary)' }}
                        value={raw.examScore}
                        onChange={(e) => handleScoreChange(stuId, 'examScore', e.target.value)}
                      />
                    </td>
                    <td style={{ fontWeight: 800, textAlign: 'center', fontSize: '1.05rem', color: item.totalScore >= 70 ? '#15803D' : item.totalScore >= 50 ? '#0F2537' : '#B91C1C' }}>
                      {item.totalScore}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <GradeBadge grade={item.gradeInfo.grade} />
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--brand-primary)' }}>
                      {pos}
                    </td>
                    <td>
                      <input
                        type="text"
                        style={{ width: '100%', minWidth: '200px', padding: '0.35rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-light)', fontSize: '0.8rem' }}
                        value={raw.teacherRemarks || item.remarks}
                        onChange={(e) => handleScoreChange(stuId, 'teacherRemarks', e.target.value)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
