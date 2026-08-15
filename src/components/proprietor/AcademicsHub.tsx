import React, { useState } from 'react';
import { Subject, CourseMaterial, ClassRoom, Teacher } from '../../types';
import { SubjectManager } from './SubjectManager';
import {
  BookOpen,
  Layers
} from 'lucide-react';

interface AcademicsHubProps {
  subjects: Subject[];
  courseMaterials: CourseMaterial[];
  classes: ClassRoom[];
  teachers: Teacher[];
  initialSubTab?: 'subjects' | 'content';
}

export const AcademicsHub: React.FC<AcademicsHubProps> = ({
  subjects,
  courseMaterials,
  classes,
  teachers,
  initialSubTab = 'subjects'
}) => {
  const [activeTab, setActiveTab] = useState<'subjects' | 'content'>(initialSubTab);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--brand-primary)', letterSpacing: '-0.02em' }}>
          Academics & Curriculum Management
        </h2>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
          Ghanaian Basic School Curriculum (NaCCA / GES), Core & Elective Disciplines, Trimester Schemes of Learning & Notes
        </p>
      </div>

      {/* Tabs Inside Domain Interface */}
      <div 
        style={{ 
          display: 'flex', 
          gap: '0.4rem', 
          backgroundColor: '#FFFFFF', 
          padding: '0.35rem', 
          borderRadius: 'var(--radius-md)', 
          border: '1px solid var(--border-light)',
          width: 'fit-content'
        }}
      >
        <button
          onClick={() => setActiveTab('subjects')}
          className={`btn ${activeTab === 'subjects' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ padding: '0.55rem 1.15rem', fontSize: '0.85rem' }}
        >
          <BookOpen size={16} />
          <span>Curriculum Subjects ({subjects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('content')}
          className={`btn ${activeTab === 'content' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ padding: '0.55rem 1.15rem', fontSize: '0.85rem' }}
        >
          <Layers size={16} />
          <span>Trimester Schemes & Lesson Notes ({courseMaterials.length})</span>
        </button>
      </div>

      {/* Render Subject Manager */}
      <SubjectManager
        subjects={subjects}
        courseMaterials={courseMaterials}
        classes={classes}
        teachers={teachers}
      />
    </div>
  );
};
