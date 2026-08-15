export interface GradeResult {
  grade: number; // 1 to 9
  gradeRemark: string;
  descriptor: string;
  colorClass: string;
  badgeBg: string;
  badgeText: string;
}

/**
 * Ghanaian NaCCA & GES BECE 9-Point Grading Scale & Performance Descriptors
 */
export function calculateNaCCAGrade(totalScore: number): GradeResult {
  const score = Math.round(totalScore);

  if (score >= 80) {
    return {
      grade: 1,
      gradeRemark: 'Excellent',
      descriptor: 'Exceeding Expectations (EE)',
      colorClass: 'grade-1',
      badgeBg: '#DCFCE7',
      badgeText: '#15803D'
    };
  } else if (score >= 70) {
    return {
      grade: 2,
      gradeRemark: 'Very Good',
      descriptor: 'Meeting Expectations (ME)',
      colorClass: 'grade-2',
      badgeBg: '#DBEAFE',
      badgeText: '#1E40AF'
    };
  } else if (score >= 60) {
    return {
      grade: 3,
      gradeRemark: 'Good',
      descriptor: 'Meeting Expectations (ME)',
      colorClass: 'grade-3',
      badgeBg: '#E0E7FF',
      badgeText: '#3730A3'
    };
  } else if (score >= 55) {
    return {
      grade: 4,
      gradeRemark: 'Credit',
      descriptor: 'Meeting Expectations (ME)',
      colorClass: 'grade-4',
      badgeBg: '#FEF3C7',
      badgeText: '#B45309'
    };
  } else if (score >= 50) {
    return {
      grade: 5,
      gradeRemark: 'Credit',
      descriptor: 'Approaching Expectations (AE)',
      colorClass: 'grade-5',
      badgeBg: '#FEF9C3',
      badgeText: '#854D0E'
    };
  } else if (score >= 45) {
    return {
      grade: 6,
      gradeRemark: 'Pass',
      descriptor: 'Approaching Expectations (AE)',
      colorClass: 'grade-6',
      badgeBg: '#FFEDD5',
      badgeText: '#9A3412'
    };
  } else if (score >= 40) {
    return {
      grade: 7,
      gradeRemark: 'Pass',
      descriptor: 'Developing / Emerging (BE)',
      colorClass: 'grade-7',
      badgeBg: '#FEE2E2',
      badgeText: '#991B1B'
    };
  } else if (score >= 35) {
    return {
      grade: 8,
      gradeRemark: 'Weak Pass',
      descriptor: 'Developing / Emerging (BE)',
      colorClass: 'grade-8',
      badgeBg: '#FEE2E2',
      badgeText: '#991B1B'
    };
  } else {
    return {
      grade: 9,
      gradeRemark: 'Fail',
      descriptor: 'Beginning / Emerging (BE)',
      colorClass: 'grade-9',
      badgeBg: '#F3F4F6',
      badgeText: '#4B5563'
    };
  }
}

/**
 * Format numerical rank to ordinal (1st, 2nd, 3rd, etc.)
 */
export function formatOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Generate standard Ghanaian teacher remark
 */
export function getSubjectAutoRemark(score: number): string {
  if (score >= 80) return 'An outstanding academic performance. Keep up the high standard.';
  if (score >= 70) return 'Very commendable effort. Shows strong grasp of concepts.';
  if (score >= 60) return 'Good progress shown. Has potential to reach the top tier.';
  if (score >= 50) return 'Satisfactory work. Needs more consistent study habits at home.';
  if (score >= 40) return 'Fair performance. Requires dedicated remedial support in difficult strands.';
  return 'Below expected standard. Urgent parental intervention and extra tuition required.';
}

export function getGeneralFormMasterRemark(average: number): string {
  if (average >= 80) return 'An exceptional student with exemplary character and academic diligence. High achiever.';
  if (average >= 70) return 'A hardworking and disciplined student who participates enthusiastically in all school tasks.';
  if (average >= 60) return 'A capable learner with steady progress. Encouraged to read wider and practice consistently.';
  if (average >= 50) return 'Demonstrates good conduct but needs to focus more during class assessments and exams.';
  return 'Needs intense guidance and encouragement. Parents should monitor homework strictly.';
}

export function getHeadTeacherRemark(average: number): string {
  if (average >= 80) return 'Outstanding terminal result! Promising candidate for national distinction.';
  if (average >= 70) return 'Very good performance. Maintain this positive trajectory next trimester.';
  if (average >= 60) return 'Good effort. With extra determination, higher marks are achievable.';
  if (average >= 50) return 'Promoted on probation / Average result. More effort required next term.';
  return 'Disappointing result. Parent-Teacher conference is urgently requested.';
}
