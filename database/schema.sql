-- ====================================================================
-- HMC GROUP - WORK MONITORING CENTER
-- Production PostgreSQL Relational Database Schema (v1.0)
-- Target RDBMS: PostgreSQL 14+ / PostgreSQL 16
-- ====================================================================

-- 1. DROP TABLES IF EXIST (For clean initial migration)
DROP TABLE IF EXISTS task_escalations CASCADE;
DROP TABLE IF EXISTS task_reminders CASCADE;
DROP TABLE IF EXISTS task_timeline CASCADE;
DROP TABLE IF EXISTS task_comments CASCADE;
DROP TABLE IF EXISTS task_submissions CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS branches CASCADE;
DROP TABLE IF EXISTS regionals CASCADE;
DROP TABLE IF EXISTS holdings CASCADE;

-- 2. CREATE ENUM TYPES
CREATE TYPE priority_type AS ENUM ('HIGH', 'MEDIUM', 'LOW');
CREATE TYPE status_type AS ENUM ('BELUM DIKERJAKAN', 'SEDANG DIKERJAKAN', 'MENUNGGU VERIFIKASI', 'TERLAMBAT', 'SELESAI', 'REVISI');
CREATE TYPE assignment_type AS ENUM ('Pribadi', 'Tim', 'Divisi', 'Unit');

-- 3. HOLDINGS TABLE
CREATE TABLE holdings (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. REGIONALS TABLE
CREATE TABLE regionals (
    id VARCHAR(50) PRIMARY KEY,
    holding_id VARCHAR(50) REFERENCES holdings(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    head_quarter VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. BRANCHES (13 HMC BRANCHES) TABLE
CREATE TABLE branches (
    id VARCHAR(50) PRIMARY KEY,
    regional_id VARCHAR(50) REFERENCES regionals(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    manager_name VARCHAR(255),
    compliance_score INT DEFAULT 100 CHECK (compliance_score BETWEEN 0 AND 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. DEPARTMENTS TABLE
CREATE TABLE departments (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. ROLES TABLE
CREATE TABLE roles (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    permissions JSONB DEFAULT '[]'::jsonb
);

-- 8. EMPLOYEES / USERS TABLE
CREATE TABLE employees (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL DEFAULT 'pbkdf2_sha256$default_hash',
    phone VARCHAR(50),
    role_id VARCHAR(50) REFERENCES roles(id) ON DELETE RESTRICT,
    branch_id VARCHAR(50) REFERENCES branches(id) ON DELETE SET NULL,
    department_id VARCHAR(50) REFERENCES departments(id) ON DELETE SET NULL,
    position VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. TASKS (PERINTAH PEKERJAAN) TABLE
CREATE TABLE tasks (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    period VARCHAR(50) DEFAULT 'Sekali',
    priority priority_type DEFAULT 'MEDIUM',
    assignment_type assignment_type DEFAULT 'Unit',
    issuer_name VARCHAR(255) NOT NULL,
    regional_id VARCHAR(50) REFERENCES regionals(id) ON DELETE CASCADE,
    branch_id VARCHAR(50) REFERENCES branches(id) ON DELETE CASCADE,
    department_id VARCHAR(50) REFERENCES departments(id) ON DELETE CASCADE,
    pic_id VARCHAR(50) REFERENCES employees(id) ON DELETE RESTRICT,
    verifier_title VARCHAR(255) DEFAULT 'Kepala Cabang HMC',
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    status status_type DEFAULT 'BELUM DIKERJAKAN',
    format_requirement VARCHAR(255),
    is_doc_upload_required BOOLEAN DEFAULT TRUE,
    required_docs JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. TASK SUBMISSIONS (SUBMIT BUKTI PIC) TABLE
CREATE TABLE task_submissions (
    id SERIAL PRIMARY KEY,
    task_id VARCHAR(50) UNIQUE REFERENCES tasks(id) ON DELETE CASCADE,
    submitted_by VARCHAR(255) NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    attachments JSONB DEFAULT '[]'::jsonb,
    form_data JSONB DEFAULT '{}'::jsonb
);

-- 11. TASK COMMENTS / THREADED DISCUSSION TABLE
CREATE TABLE task_comments (
    id SERIAL PRIMARY KEY,
    task_id VARCHAR(50) REFERENCES tasks(id) ON DELETE CASCADE,
    user_name VARCHAR(255) NOT NULL,
    user_role VARCHAR(100),
    comment_text TEXT NOT NULL,
    mentioned_users JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. TASK TIMELINE / AUDIT LOG TABLE
CREATE TABLE task_timeline (
    id SERIAL PRIMARY KEY,
    task_id VARCHAR(50) REFERENCES tasks(id) ON DELETE CASCADE,
    user_name VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    status_at_time status_type,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. TASK REMINDERS LOG TABLE
CREATE TABLE task_reminders (
    id SERIAL PRIMARY KEY,
    task_id VARCHAR(50) REFERENCES tasks(id) ON DELETE CASCADE,
    reminder_type VARCHAR(100) NOT NULL,
    channel VARCHAR(50) DEFAULT 'WEB_NOTIFICATION',
    recipient VARCHAR(255) NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. TASK ESCALATIONS TABLE
CREATE TABLE task_escalations (
    id SERIAL PRIMARY KEY,
    task_id VARCHAR(50) REFERENCES tasks(id) ON DELETE CASCADE,
    escalation_level INT NOT NULL CHECK (escalation_level BETWEEN 1 AND 3),
    target_role VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'TRIGGERED',
    triggered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- PERFORMANCE INDEXES FOR FAST QUERYING
-- ====================================================================
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_branch ON tasks(branch_id);
CREATE INDEX idx_tasks_pic ON tasks(pic_id);
CREATE INDEX idx_tasks_deadline ON tasks(deadline);
CREATE INDEX idx_employees_branch ON employees(branch_id);
CREATE INDEX idx_submissions_task ON task_submissions(task_id);
CREATE INDEX idx_comments_task ON task_comments(task_id);

-- ====================================================================
-- TRIGGER FUNCTION FOR AUTO UPDATED_AT
-- ====================================================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_update_tasks_modtime
BEFORE UPDATE ON tasks
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
