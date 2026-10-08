-- =========================================================================
-- STATS INNOTECH — PostgreSQL DDL Schema Script
-- =========================================================================

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    role VARCHAR(30) NOT NULL,
    is_email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
    id BIGSERIAL PRIMARY KEY,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    college VARCHAR(255),
    degree VARCHAR(100),
    branch VARCHAR(100),
    graduation_year INT,
    phone VARCHAR(30),
    resume_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    github_url VARCHAR(500),
    skills TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    short_description VARCHAR(500),
    description TEXT,
    category VARCHAR(100),
    technology VARCHAR(100),
    instructor VARCHAR(100),
    duration VARCHAR(50),
    level VARCHAR(30) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    discount_price NUMERIC(10,2),
    thumbnail VARCHAR(500),
    status VARCHAR(30) DEFAULT 'ACTIVE',
    rating NUMERIC(3,2) DEFAULT 4.8,
    total_students INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS course_enrollments (
    id BIGSERIAL PRIMARY KEY,
    enrollment_id VARCHAR(100) UNIQUE NOT NULL,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    status VARCHAR(30) DEFAULT 'ACTIVE',
    progress INT DEFAULT 0,
    payment_status VARCHAR(30) DEFAULT 'PAID',
    payment_amount NUMERIC(10,2),
    batch_type VARCHAR(50),
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS internships (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    domain VARCHAR(50) NOT NULL,
    technology VARCHAR(255),
    short_description VARCHAR(500),
    description TEXT,
    duration VARCHAR(50),
    mode VARCHAR(30) DEFAULT 'ONLINE',
    stipend_type VARCHAR(50),
    stipend_amount VARCHAR(100),
    partner_name VARCHAR(255),
    status VARCHAR(30) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS internship_applications (
    id BIGSERIAL PRIMARY KEY,
    application_id VARCHAR(100) UNIQUE NOT NULL,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    internship_id BIGINT NOT NULL REFERENCES internships(id) ON DELETE CASCADE,
    preferred_duration VARCHAR(50),
    preferred_mode VARCHAR(50),
    resume_url VARCHAR(500),
    github_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    statement_of_purpose TEXT,
    status VARCHAR(30) DEFAULT 'PENDING',
    review_notes TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS offer_letters (
    id BIGSERIAL PRIMARY KEY,
    reference_number VARCHAR(100) UNIQUE NOT NULL,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    internship_id BIGINT NOT NULL REFERENCES internships(id) ON DELETE CASCADE,
    domain VARCHAR(50) NOT NULL,
    partner_name VARCHAR(255),
    role_title VARCHAR(255),
    stipend_details VARCHAR(255),
    start_date DATE,
    end_date DATE,
    issued_date DATE,
    pdf_path VARCHAR(500),
    status VARCHAR(30) DEFAULT 'ISSUED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS certificates (
    id BIGSERIAL PRIMARY KEY,
    certificate_number VARCHAR(100) UNIQUE NOT NULL,
    verification_code VARCHAR(100) UNIQUE NOT NULL,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    domain VARCHAR(50) NOT NULL,
    partner_name VARCHAR(255),
    grade VARCHAR(100),
    issue_date DATE,
    pdf_path VARCHAR(500),
    status VARCHAR(30) DEFAULT 'VERIFIED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS support_queries (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    priority VARCHAR(30) DEFAULT 'MEDIUM',
    status VARCHAR(30) DEFAULT 'OPEN',
    admin_reply TEXT,
    replied_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS industry_partners (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(255),
    location VARCHAR(255),
    contact_person VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(50),
    mou_valid_till VARCHAR(50),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_internships_slug ON internships(slug);
CREATE INDEX IF NOT EXISTS idx_cert_code ON certificates(verification_code);
CREATE INDEX IF NOT EXISTS idx_cert_num ON certificates(certificate_number);
CREATE INDEX IF NOT EXISTS idx_offer_ref ON offer_letters(reference_number);
