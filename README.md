# 🚀 STATS INNOTECH — Technical Training, Internship & Student Platform

> **Next-Generation Technical Training, Computer Science & Civil Engineering Internships, and Student Management Ecosystem.**

![STATS INNOTECH Banner](frontend/public/assets/logo-horizontal.png)

---

## 🏢 Platform Overview

**STATS INNOTECH** is a full-stack production platform combining a public startup showcase, online technical course catalog with interactive batch enrollment, Computer Science & Civil Engineering internships (conducted in technical collaboration with **AN Survey Consultant**), a self-service Student Portal, offer-letter issuance, verifiable QR-coded completion certificates, a help-desk query system, an administrative CRM dashboard, and email automation.

---

## 🛠️ Architecture & Tech Stack

```
STATS INNOTECH Platform
├── Frontend (Vite + React 19 + TypeScript + Tailwind CSS + Framer Motion)
│   ├── Public Portal (Courses, Internships, Projects, Services, Contact, Verification)
│   ├── Student Portal (Dashboard, Enrolled Courses, Applications, Offer Letters, Certificates, Resources, Projects, Support)
│   └── Admin Control Panel (Students CRM, Course Catalog CRUD, Internship Tracks, Applications Review, Document Issuance)
└── Backend (Java 21 / 23 + Spring Boot 3.3 + Spring Security + JWT + OpenPDF)
    ├── REST API Controllers (/api/auth, /api/courses, /api/internships, /api/student, /api/admin, /api/documents, /api/verify)
    ├── Security Layer (Stateless JWT Filter, BCrypt hashing, Role-Based Access Control)
    ├── Document Engine (OpenPDF dynamic vector generation for Offer Letters & Certificates)
    ├── Dual Database Support (H2 Persistent File DB for Zero-Setup Dev, PostgreSQL 16 for Production)
    └── Email Automation Service (Async transactional dispatch for welcome, enrollment, offer letters, and ticket replies)
```

---

## 🌟 Key Features

### 1. Public Startup Portal
- **Hero & Value Proposition**: Dynamic interactive statistics counter, startup vision, and domain offerings.
- **Course Catalog**: Filterable technical courses (Java, Python, C/C++, Data Analytics, Linux, AWS Cloud, Web Dev, Digital Marketing) with batch syllabus previews.
- **Internships Showcase**:
  - **9 CSE Domains**: Full Stack, Data Analytics, Java, Python, AI/ML, Cloud DevOps, Software Testing, DBMS, IoT.
  - **Civil Engineering Track**: Co-branded with **AN Survey Consultant**, featuring hands-on field experience with Total Station (Leica & Trimble), Auto Level, GPS/GNSS surveying, and AutoCAD Civil 3D.
- **Course Enrollment**: Batch selection (Weekend Live vs Weekday Evening), coupon application (`STATS500`, `INNOTECH10`), payment method simulation (UPI, Cards), and instant LMS access.
- **Internship Application**: Resume link submission, portfolio URLs, academic details, and instant reference ID generation.
- **Commercial Web & Software Services** (`/services/web-development`): Custom B2B software, startup MVPs, enterprise portals, and instant project proposal request form.
- **Projects Showcase** (`/projects`): Student capstone projects, civil field survey benchmarks, and live demo links.
- **Certificate & Completion Verification** (`/verify-certificate`): Real-time cryptographic lookup validating issued credentials against the database.

### 2. Student Portal (`/portal`)
- **Dashboard**: Enrolled courses progress bars, internship application status badges, notifications, and quick actions.
- **Offer Letters**: Preview and download signed official offer letters. Civil track includes joint AN Survey Consultant co-branding.
- **Certificates**: View verified credentials with unique ID (e.g., `STATS-2026-CSE-0849`), view print-ready certificates, and copy verification URLs.
- **My Capstone Projects**: Interactive milestone checklist, progress bar, mentor remarks, and GitHub/Demo URL update submission.
- **Learning Resources & Code Kits**: Filterable study handbooks, cheat sheets, starter repositories, and Civil Surveying manuals.
- **Support & Queries**: Submit help-desk inquiries, track status (Open, In Progress, Resolved), and read mentor responses.
- **Profile & Settings**: Manage contact details, college information, and security preferences.

### 3. Admin Management Panel (`/admin`)
- **Executive Analytics**: Real-time stats across students, course enrollments, active applications, issued documents, and unread inquiries.
- **Student CRM**: Search, view, and inspect all registered students.
- **Course Management**: Full CRUD operations — add new courses, edit pricing/syllabus, archive/publish courses.
- **Internship Tracks**: Manage CSE and Civil tracks, update stipend terms, toggle availability.
- **Applications Review**: Accept, reject, or request revisions on submitted student internship applications with feedback notes.
- **Offer Letter Generator**: Instant letterhead preview, template selection (CSE vs STATS × AN Survey Civil), issue and email dispatch.
- **Certificate Issuance**: Issue verifiable completion certificates with auto-generated verification codes and QR links.
- **Support Ticket Resolution**: Help desk dashboard with priority tags, status updates, and email reply dispatch.
- **Industry Partners**: Manage institutional collaborations and MoUs (featuring AN Survey Consultant).

---

## 🔑 Default Credentials

The platform seeds sample administrative and student accounts automatically on startup:

| Role | Email | Password | Access |
|---|---|---|---|
| **Super Admin** | `admin@statsinnotech.in` | `Admin@123` | Full Admin Console (`/admin`) & Student Portal |
| **Student** | `student@statsinnotech.in` | `Student@123` | Student Portal (`/portal`), Courses & Internships |

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+ & npm
- Java JDK 21+
- Apache Maven 3.9+
- *(Optional)* Docker & Docker Compose

### 1. Run the Frontend (Vite + React)
```bash
cd frontend
npm install
npm run dev
```
- Open browser at: **`http://localhost:5173`**
- Test production bundle build: `npm run build`

### 2. Run the Backend (Spring Boot 3)
```bash
cd backend
mvn spring-boot:run
```
- The backend starts on port **`8080`**.
- It uses a persistent local H2 file database (`./data/statsdb`) by default with automatic schema creation and data seeding.
- Embedded H2 Web Console: **`http://localhost:8080/h2-console`**
  - JDBC URL: `jdbc:h2:file:./data/statsdb`
  - User: `sa`
  - Password: `password`

### 3. Run with Docker Compose (PostgreSQL + Backend + Frontend)
```bash
docker compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080`
- PostgreSQL: `localhost:5432`

---

## 📄 License & Attribution
© 2026 STATS INNOTECH Pvt. Ltd. All Rights Reserved.  
Civil Engineering internship and surveying curriculum developed in technical partnership with **AN Survey Consultant**.
