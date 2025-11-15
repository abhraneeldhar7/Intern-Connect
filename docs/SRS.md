# Software Requirements Specification (SRS)
## InternConnect - Internship Platform

**Version:** 1.0  
**Date:** 2024  
**Prepared by:** Development Team

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) document provides a comprehensive description of the InternConnect platform, an online internship management system designed to connect students with internship opportunities and enable companies to manage their internship programs efficiently.

### 1.2 Scope
InternConnect is a web-based platform that facilitates:
- Student registration and profile management
- Internship posting and management by administrators
- Application submission and tracking
- Application review and status management
- Bookmarking and recommendation features
- Dashboard analytics for both applicants and administrators

### 1.3 Definitions, Acronyms, and Abbreviations
- **SRS**: Software Requirements Specification
- **API**: Application Programming Interface
- **CRUD**: Create, Read, Update, Delete
- **JWT**: JSON Web Token
- **MVC**: Model-View-Controller
- **REST**: Representational State Transfer
- **UI/UX**: User Interface/User Experience
- **DBMS**: Database Management System

### 1.4 References
- Next.js 14 Documentation
- MongoDB Documentation
- NextAuth.js Documentation
- IEEE 830-1998 Standard for SRS

### 1.5 Overview
This document is organized into sections covering functional requirements, non-functional requirements, system models, and constraints.

---

## 2. Overall Description

### 2.1 Product Perspective
InternConnect is a standalone web application built using modern web technologies. It integrates with:
- MongoDB Atlas (Cloud Database)
- UploadThing (File Storage Service)
- NextAuth.js (Authentication Service)

### 2.2 Product Functions
The system provides the following major functions:
1. **User Management**: Registration, authentication, profile management
2. **Internship Management**: Create, update, delete, and browse internships
3. **Application Management**: Submit, withdraw, and track applications
4. **Dashboard Analytics**: Statistics and insights for users and admins
5. **Search and Filter**: Advanced filtering of internships
6. **Bookmarking**: Save favorite internships
7. **File Upload**: Resume upload functionality

### 2.3 User Characteristics
- **Applicants**: Students seeking internships, basic computer literacy
- **Administrators**: Company representatives, advanced computer literacy
- **System Administrators**: Technical staff managing the platform

### 2.4 Constraints
- Must be accessible via modern web browsers
- Requires internet connection
- Database hosted on MongoDB Atlas
- File uploads limited to 4MB (PDF format)
- Responsive design for mobile, tablet, and desktop

### 2.5 Assumptions and Dependencies
- Users have access to modern web browsers
- Internet connectivity is available
- MongoDB Atlas service is operational
- UploadThing service is operational
- Users have valid email addresses

---

## 3. Specific Requirements

### 3.1 Functional Requirements

#### 3.1.1 User Authentication (FR1)
- **FR1.1**: System shall allow users to register with name, email, and password
- **FR1.2**: System shall validate email format and uniqueness
- **FR1.3**: System shall hash passwords using bcrypt before storage
- **FR1.4**: System shall support role-based authentication (admin/applicant)
- **FR1.5**: System shall maintain user sessions using JWT
- **FR1.6**: System shall provide logout functionality

#### 3.1.2 User Profile Management (FR2)
- **FR2.1**: Users shall be able to view their profile
- **FR2.2**: Users shall be able to update their name
- **FR2.3**: Users shall be able to update their email (with uniqueness validation)
- **FR2.4**: System shall prevent password updates through profile (separate feature)

#### 3.1.3 Internship Management (FR3)
- **FR3.1**: Administrators shall be able to create new internships with:
  - Title, description, company name
  - Stipend amount
  - Location
  - Type (remote/onsite/hybrid)
  - Number of openings
  - Required skills (array)
- **FR3.2**: Administrators shall be able to edit existing internships
- **FR3.3**: Administrators shall be able to delete internships
- **FR3.4**: All users shall be able to browse internships
- **FR3.5**: All users shall be able to view internship details
- **FR3.6**: System shall display internships in paginated format

#### 3.1.4 Application Management (FR4)
- **FR4.1**: Applicants shall be able to submit applications with resume upload
- **FR4.2**: System shall prevent duplicate applications for same internship
- **FR4.3**: Applicants shall be able to withdraw pending applications
- **FR4.4**: Applicants shall be able to view their application status
- **FR4.5**: Administrators shall be able to view all applications
- **FR4.6**: Administrators shall be able to accept or reject applications
- **FR4.7**: System shall track application status (pending/accepted/rejected)

#### 3.1.5 Search and Filter (FR5)
- **FR5.1**: Users shall be able to search internships by title/company
- **FR5.2**: Users shall be able to filter by location
- **FR5.3**: Users shall be able to filter by internship type (remote/onsite/hybrid)
- **FR5.4**: Users shall be able to filter by stipend range
- **FR5.5**: Users shall be able to filter by skills
- **FR5.6**: System shall support combined filters

#### 3.1.6 Bookmarking (FR6)
- **FR6.1**: Applicants shall be able to bookmark internships
- **FR6.2**: Applicants shall be able to remove bookmarks
- **FR6.3**: Applicants shall be able to view bookmarked internships
- **FR6.4**: System shall indicate bookmark status on internship cards

#### 3.1.7 Dashboard Features (FR7)
- **FR7.1**: Applicants shall see dashboard with:
  - Total applications submitted
  - Applications by status (pending/accepted/rejected)
  - Recent applications list
  - Recommended internships
- **FR7.2**: Administrators shall see dashboard with:
  - Total internships created
  - Total applications received
  - Total applicants
  - Applications by status
  - Recent applications list
  - Recent internships list

#### 3.1.8 File Upload (FR8)
- **FR8.1**: System shall allow PDF resume uploads
- **FR8.2**: System shall enforce 4MB file size limit
- **FR8.3**: System shall validate file type (PDF only)
- **FR8.4**: System shall store files securely on UploadThing

### 3.2 Non-Functional Requirements

#### 3.2.1 Performance Requirements
- **NFR1.1**: Page load time shall be less than 2 seconds
- **NFR1.2**: Database queries shall complete within 500ms
- **NFR1.3**: System shall support at least 100 concurrent users
- **NFR1.4**: File uploads shall complete within 10 seconds for files up to 4MB

#### 3.2.2 Security Requirements
- **NFR2.1**: All passwords shall be hashed using bcrypt (12 rounds)
- **NFR2.2**: All API routes shall be protected with authentication
- **NFR2.3**: Role-based access control shall be enforced
- **NFR2.4**: Session tokens shall expire after 30 days
- **NFR2.5**: All user inputs shall be validated and sanitized
- **NFR2.6**: File uploads shall be validated for type and size

#### 3.2.3 Usability Requirements
- **NFR3.1**: Interface shall be responsive (mobile, tablet, desktop)
- **NFR3.2**: Interface shall follow modern UI/UX principles
- **NFR3.3**: Error messages shall be clear and actionable
- **NFR3.4**: System shall provide loading indicators for async operations
- **NFR3.5**: System shall support dark/light mode

#### 3.2.4 Reliability Requirements
- **NFR4.1**: System uptime shall be 99.5%
- **NFR4.2**: Database shall have automatic backups
- **NFR4.3**: System shall handle errors gracefully
- **NFR4.4**: System shall log errors for debugging

#### 3.2.5 Scalability Requirements
- **NFR5.1**: System shall handle 10,000+ internships
- **NFR5.2**: System shall support 1,000+ concurrent users
- **NFR5.3**: Database shall be optimized for read/write operations

#### 3.2.6 Maintainability Requirements
- **NFR6.1**: Code shall follow TypeScript best practices
- **NFR6.2**: Code shall be modular and well-documented
- **NFR6.3**: System shall use version control (Git)

### 3.3 System Models

#### 3.3.1 Use Case Model
See Design Diagrams section for detailed use case diagrams.

#### 3.3.2 Data Model
**User Model:**
- _id: ObjectId
- name: String (required)
- email: String (required, unique, lowercase)
- password: String (required, hashed)
- role: String (enum: 'admin' | 'applicant', default: 'applicant')
- bookmarks: [ObjectId] (ref: Internship)
- createdAt: Date
- updatedAt: Date

**Internship Model:**
- _id: ObjectId
- title: String (required)
- description: String (required)
- company: String (required)
- stipend: Number (required, min: 0)
- location: String (required)
- type: String (enum: 'remote' | 'onsite' | 'hybrid', required)
- openings: Number (required, min: 1)
- skills: [String]
- createdBy: ObjectId (ref: User, required)
- createdAt: Date
- updatedAt: Date

**Application Model:**
- _id: ObjectId
- internshipId: ObjectId (ref: Internship, required)
- userId: ObjectId (ref: User, required)
- resumeUrl: String (required)
- status: String (enum: 'pending' | 'accepted' | 'rejected', default: 'pending')
- createdAt: Date
- updatedAt: Date
- Unique index: (internshipId, userId)

---

## 4. System Architecture

### 4.1 Technology Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js v5
- **File Storage**: UploadThing
- **Deployment**: Vercel (recommended)

### 4.2 System Architecture Diagram
See Design Diagrams section for detailed architecture diagrams.

---

## 5. Interface Requirements

### 5.1 User Interfaces
- Responsive web interface supporting:
  - Desktop (1920x1080 and above)
  - Tablet (768x1024)
  - Mobile (375x667 and above)
- Dark and light mode support
- Accessible design (WCAG 2.1 Level AA)

### 5.2 Hardware Interfaces
- Standard web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (minimum 1 Mbps)

### 5.3 Software Interfaces
- MongoDB Atlas (Database)
- UploadThing API (File Storage)
- NextAuth.js (Authentication)

### 5.4 Communication Interfaces
- HTTPS protocol for all communications
- RESTful API endpoints
- JSON data format

---

## 6. Appendices

### 6.1 Glossary
- **Applicant**: A user with role 'applicant' seeking internships
- **Administrator**: A user with role 'admin' managing internships
- **Internship**: A job posting for an internship position
- **Application**: A submission by an applicant for an internship
- **Bookmark**: A saved internship for later reference

### 6.2 Change Log
- Version 1.0 (2024): Initial SRS document

---

**End of SRS Document**

