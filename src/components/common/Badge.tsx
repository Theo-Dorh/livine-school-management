import React from 'react';
import { calculateNaCCAGrade } from '../../utils/grading';

interface GradeBadgeProps {
  score?: number;
  grade?: number;
}

export const GradeBadge: React.FC<GradeBadgeProps> = ({ score, grade }) => {
  let gradeNumber = grade;
  if (gradeNumber === undefined && score !== undefined) {
    gradeNumber = calculateNaCCAGrade(score).grade;
  }
  if (!gradeNumber) return null;

  return (
    <span className={`grade-pill grade-${gradeNumber}`}>
      {gradeNumber}
    </span>
  );
};

interface StatusBadgeProps {
  status: string;
  variant?: 'green' | 'gold' | 'blue' | 'red' | 'gray';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant }) => {
  let v = variant;
  if (!v) {
    const s = status.toLowerCase();
    if (s.includes('paid') || s.includes('resolved') || s.includes('active') || s.includes('present')) {
      v = 'green';
    } else if (s.includes('partial') || s.includes('investigation') || s.includes('pending') || s.includes('late')) {
      v = 'gold';
    } else if (s.includes('new') || s.includes('excused')) {
      v = 'blue';
    } else if (s.includes('default') || s.includes('unpaid') || s.includes('absent') || s.includes('critical') || s.includes('high')) {
      v = 'red';
    } else {
      v = 'gray';
    }
  }

  return (
    <span className={`badge badge-${v}`}>
      {status}
    </span>
  );
};
