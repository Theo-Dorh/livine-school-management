import React, { useState } from 'react';
import { Student, Teacher, ClassRoom, Subject, Parent, MarkEntry, SuperUser } from '../../types';
import { UserManager } from './UserManager';
import { PromotionManager } from './PromotionManager';
import { SuperUserManager } from './SuperUserManager';
import {
  Users,
  GraduationCap,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

interface PeopleHubProps {
  students: Student[];
  teachers: Teacher[];
  classes: ClassRoom[];
  subjects: Subject[];
  parents: Parent[];
  marks: MarkEntry[];
  superUsers: SuperUser[];
  initialSubTab?: 'students' | 'promotions' | 'teachers' | 'superusers';
}

export const PeopleHub: React.FC<PeopleHubProps> = ({
  students,
  teachers,
  classes,
  subjects,
  parents,
  marks,
  superUsers,
  initialSubTab = 'students'
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'promotions' | 'teachers' | 'superusers'>(initialSubTab);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Domain Header */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--brand-primary)', letterSpacing: '-0.02em' }}>
          People & Faculty Administration
        </h2>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
          Manage pupil enrollment, academic promotion decisions, teaching staff appointments, and superuser delegation
        </p>
      </div>

      {/* Domain Tabs Inside Interface */}
      <div 
        style={{ 
          display: 'flex', 
          gap: '0.4rem', 
          backgroundColor: '#FFFFFF', 
          padding: '0.35rem', 
          borderRadius: 'var(--radius-md)', 
          border: '1px solid var(--border-light)',
          flexWrap: 'wrap'
        }}
      >
        <button
          onClick={() => setActiveTab('students')}
          className={`btn ${activeTab === 'students' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ padding: '0.55rem 1.15rem', fontSize: '0.85rem' }}
        >
          <GraduationCap size={16} />
          <span>Students Directory ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('promotions')}
          className={`btn ${activeTab === 'promotions' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ padding: '0.55rem 1.15rem', fontSize: '0.85rem' }}
        >
          <TrendingUp size={16} />
          <span>Academic Promotions & Repetition</span>
        </button>

        <button
          onClick={() => setActiveTab('teachers')}
          className={`btn ${activeTab === 'teachers' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ padding: '0.55rem 1.15rem', fontSize: '0.85rem' }}
        >
          <Users size={16} />
          <span>Teaching Faculty ({teachers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('superusers')}
          className={`btn ${activeTab === 'superusers' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ padding: '0.55rem 1.15rem', fontSize: '0.85rem' }}
        >
          <ShieldCheck size={16} />
          <span>Superuser Delegation ({superUsers.length})</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div>
        {activeTab === 'students' && (
          <UserManager
            students={students}
            teachers={teachers}
            classes={classes}
            subjects={subjects}
            parents={parents}
            mode="students"
          />
        )}

        {activeTab === 'promotions' && (
          <PromotionManager
            students={students}
            classes={classes}
            marks={marks}
          />
        )}

        {activeTab === 'teachers' && (
          <UserManager
            students={students}
            teachers={teachers}
            classes={classes}
            subjects={subjects}
            parents={parents}
            mode="teachers"
          />
        )}

        {activeTab === 'superusers' && (
          <SuperUserManager
            superUsers={superUsers}
          />
        )}
      </div>
    </div>
  );
};
