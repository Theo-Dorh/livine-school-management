-- ============================================================================
-- LIVINE INTERNATIONAL SCHOOL - SUPABASE POSTGRESQL MASTER SCHEMA & SEED DATA
-- Ghanaian Basic Education Curriculum (NaCCA Standards-Based: Nursery 1 to JHS 3)
-- East Legon Campus, Accra • Digital Address: GA-492-3810
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Classes & Stages (Nursery 1 to JHS 3)
CREATE TABLE IF NOT EXISTS classes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  level TEXT NOT NULL,
  stage_number INTEGER NOT NULL,
  class_teacher_id TEXT,
  capacity INTEGER DEFAULT 35,
  room_number TEXT
);

-- 2. Subjects (NaCCA Basic Curriculum)
CREATE TABLE IF NOT EXISTS subjects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  category TEXT NOT NULL,
  class_levels TEXT[] DEFAULT '{}'
);

-- 3. Students Master Table
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  student_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  gender TEXT NOT NULL,
  dob DATE NOT NULL,
  class_id TEXT REFERENCES classes(id),
  class_name TEXT NOT NULL,
  photo_url TEXT,
  parent_id TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  parent_email TEXT,
  residential_address TEXT,
  hometown TEXT,
  admission_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'Active',
  attendance_days_present INTEGER DEFAULT 0,
  attendance_days_total INTEGER DEFAULT 60,
  house TEXT DEFAULT 'Kwame Nkrumah',
  promotion_decision TEXT DEFAULT 'Pending Assessment',
  promoted_to_class_id TEXT,
  promoted_to_class_name TEXT,
  promotion_remark TEXT
);

-- 4. Teaching Faculty
CREATE TABLE IF NOT EXISTS teachers (
  id TEXT PRIMARY KEY,
  staff_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  gender TEXT NOT NULL,
  qualification TEXT NOT NULL,
  role_title TEXT NOT NULL,
  assigned_classes TEXT[] DEFAULT '{}',
  assigned_subjects TEXT[] DEFAULT '{}',
  basic_salary NUMERIC(10, 2) NOT NULL,
  allowances NUMERIC(10, 2) DEFAULT 0,
  bank_name TEXT,
  account_number TEXT,
  branch TEXT,
  ssnit_number TEXT NOT NULL,
  date_joined DATE DEFAULT CURRENT_DATE,
  photo_url TEXT
);

-- 5. Parents Master Table
CREATE TABLE IF NOT EXISTS parents (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  occupation TEXT,
  relationship TEXT DEFAULT 'Parent',
  residential_address TEXT,
  wards TEXT[] DEFAULT '{}'
);

-- 6. Fee Structures (Class Level Tariffs)
CREATE TABLE IF NOT EXISTS fee_structures (
  id TEXT PRIMARY KEY,
  class_level TEXT NOT NULL,
  tuition_fee NUMERIC(10, 2) NOT NULL,
  facility_levy NUMERIC(10, 2) NOT NULL,
  tlm_materials_fee NUMERIC(10, 2) NOT NULL,
  pta_levy NUMERIC(10, 2) NOT NULL,
  ict_lab_fee NUMERIC(10, 2) NOT NULL,
  total_fee NUMERIC(10, 2) NOT NULL
);

-- 7. Fee Payments (Accounts Receivable & Debtors Ledger)
CREATE TABLE IF NOT EXISTS fee_payments (
  id TEXT PRIMARY KEY,
  receipt_number TEXT UNIQUE NOT NULL,
  student_id TEXT REFERENCES students(id),
  student_name TEXT NOT NULL,
  class_name TEXT NOT NULL,
  amount_paid NUMERIC(10, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  momo_transaction_id TEXT,
  term TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  payment_date DATE DEFAULT CURRENT_DATE,
  recorded_by TEXT NOT NULL,
  status TEXT DEFAULT 'Completed'
);

-- 8. Staff Payroll & Statutory Liabilities (SSNIT & GRA PAYE)
CREATE TABLE IF NOT EXISTS payroll_records (
  id TEXT PRIMARY KEY,
  staff_id TEXT REFERENCES teachers(id),
  staff_name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  month TEXT NOT NULL,
  basic_salary NUMERIC(10, 2) NOT NULL,
  allowances NUMERIC(10, 2) DEFAULT 0,
  gross_salary NUMERIC(10, 2) NOT NULL,
  ssnit_employee NUMERIC(10, 2) NOT NULL,
  ssnit_employer NUMERIC(10, 2) NOT NULL,
  gra_paye_tax NUMERIC(10, 2) NOT NULL,
  other_deductions NUMERIC(10, 2) DEFAULT 0,
  net_salary NUMERIC(10, 2) NOT NULL,
  disbursement_date DATE,
  payment_status TEXT DEFAULT 'Paid',
  bank_name TEXT,
  account_number TEXT
);

-- 9. General Journal Operating Expenses
CREATE TABLE IF NOT EXISTS expense_records (
  id TEXT PRIMARY KEY,
  voucher_number TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  approved_by TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  vendor_recipient TEXT NOT NULL,
  debit_account TEXT NOT NULL,
  credit_account TEXT NOT NULL
);

-- 10. NaCCA Marks & Continuous Assessment (SBA 50% + Exam 50%)
CREATE TABLE IF NOT EXISTS mark_entries (
  id TEXT PRIMARY KEY,
  student_id TEXT REFERENCES students(id),
  student_name TEXT NOT NULL,
  class_id TEXT REFERENCES classes(id),
  subject_id TEXT REFERENCES subjects(id),
  subject_name TEXT NOT NULL,
  class_score NUMERIC(5, 2) NOT NULL,
  exam_score NUMERIC(5, 2) NOT NULL,
  total_score NUMERIC(5, 2) NOT NULL,
  bece_grade INTEGER NOT NULL,
  nacca_descriptor TEXT NOT NULL,
  teacher_remarks TEXT,
  term TEXT NOT NULL,
  academic_year TEXT NOT NULL
);

-- 11. Schemes of Learning (Course Materials)
CREATE TABLE IF NOT EXISTS course_materials (
  id TEXT PRIMARY KEY,
  subject_id TEXT REFERENCES subjects(id),
  subject_name TEXT NOT NULL,
  class_id TEXT REFERENCES classes(id),
  class_name TEXT NOT NULL,
  teacher_id TEXT REFERENCES teachers(id),
  teacher_name TEXT NOT NULL,
  week_number INTEGER NOT NULL,
  strand TEXT NOT NULL,
  sub_strand TEXT NOT NULL,
  topic_title TEXT NOT NULL,
  lesson_notes TEXT NOT NULL,
  learning_outcomes TEXT[] DEFAULT '{}',
  homework_task JSONB,
  term TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Anonymous Whistleblower Safe-Reports
CREATE TABLE IF NOT EXISTS anonymous_complaints (
  id TEXT PRIMARY KEY,
  ticket_number TEXT UNIQUE NOT NULL,
  sender_type TEXT NOT NULL,
  target_category TEXT NOT NULL,
  severity TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'New',
  investigation_notes TEXT,
  assigned_to TEXT
);

-- 13. Super Users & Delegation
CREATE TABLE IF NOT EXISTS super_users (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role_title TEXT NOT NULL,
  can_update_fees BOOLEAN DEFAULT FALSE,
  can_update_course_content BOOLEAN DEFAULT FALSE,
  can_manage_users BOOLEAN DEFAULT FALSE,
  can_manage_promotions BOOLEAN DEFAULT FALSE,
  can_view_finance BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'Active',
  created_at DATE DEFAULT CURRENT_DATE
);

-- ============================================================================
-- SEED DATA (Ghanaian Basic School Reference)
-- ============================================================================

INSERT INTO classes (id, name, level, stage_number, class_teacher_id, capacity, room_number) VALUES
('cls-01', 'Nursery 1', 'Nursery', 1, 'tch-01', 25, 'Block A - Room 1'),
('cls-02', 'Nursery 2', 'Nursery', 2, 'tch-01', 25, 'Block A - Room 2'),
('cls-03', 'Kindergarten 1 (KG 1)', 'KG', 3, 'tch-02', 30, 'Block A - Room 3'),
('cls-04', 'Kindergarten 2 (KG 2)', 'KG', 4, 'tch-02', 30, 'Block A - Room 4'),
('cls-05', 'Basic 1 (Class 1)', 'Lower Primary', 5, 'tch-03', 35, 'Block B - Room 101'),
('cls-06', 'Basic 2 (Class 2)', 'Lower Primary', 6, 'tch-03', 35, 'Block B - Room 102'),
('cls-07', 'Basic 3 (Class 3)', 'Lower Primary', 7, 'tch-04', 35, 'Block B - Room 103'),
('cls-08', 'Basic 4 (Class 4)', 'Upper Primary', 8, 'tch-04', 35, 'Block B - Room 201'),
('cls-09', 'Basic 5 (Class 5)', 'Upper Primary', 9, 'tch-05', 35, 'Block B - Room 202'),
('cls-10', 'Basic 6 (Class 6)', 'Upper Primary', 10, 'tch-05', 35, 'Block B - Room 203'),
('cls-11', 'JHS 1 (Basic 7)', 'JHS', 11, 'tch-06', 40, 'Block C - Room 301'),
('cls-12', 'JHS 2 (Basic 8)', 'JHS', 12, 'tch-06', 40, 'Block C - Room 302'),
('cls-13', 'JHS 3 (Basic 9 / BECE)', 'JHS', 13, 'tch-06', 40, 'Block C - Room 303')
ON CONFLICT (id) DO NOTHING;

INSERT INTO fee_structures (id, class_level, tuition_fee, facility_levy, tlm_materials_fee, pta_levy, ict_lab_fee, total_fee) VALUES
('fee-01', 'Nursery', 1800, 300, 250, 100, 150, 2600),
('fee-02', 'KG', 2000, 350, 300, 100, 200, 2950),
('fee-03', 'Lower Primary', 2200, 400, 350, 100, 250, 3300),
('fee-04', 'Upper Primary', 2400, 450, 400, 100, 300, 3650),
('fee-05', 'JHS', 2800, 500, 450, 150, 400, 4300)
ON CONFLICT (id) DO NOTHING;
