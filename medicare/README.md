# MediCare Clinic Management System

MediCare is a comprehensive Clinic Management System built with a specialized focus on **Database Management Systems (DBMS)** and **Advanced SQL Queries**. This project serves as a practical implementation of relational database principles, ensuring data integrity, efficient retrieval, and complex analytical reporting.

---

## 🗄️ DBMS Focus & Architecture

The heart of MediCare is its robust relational schema, designed to handle the complex workflows of a healthcare facility.

### 1. Relational Schema Design
The system follows a highly normalized structure with 7 primary entities:
- **Patients**: Stores demographic and health profile data (Blood Group, Phone, Address).
- **Doctors**: Manages medical staff information, including specializations and department links.
- **Departments**: Categorizes medical services (Cardiology, Neurology, etc.).
- **Appointments**: The central transactional table linking Patients and Doctors.
- **Prescriptions**: Linked directly to Appointments for treatment history.
- **Bills**: Manages financial transactions, discounts, and payment statuses.
- **Admins**: Handles system-level configuration and staff management.

### 2. Advanced SQL Implementation
The project demonstrates mastery of several key SQL concepts:

#### 🟢 Multi-Table Joins (INNER & LEFT JOIN)
Used extensively for comprehensive reporting. For example, the **Appointment History** view joins `Appointments`, `Patients`, and `Doctors` to provide a unified health record:
```sql
SELECT a.id, p.name AS patient_name, d.name AS doctor_name, a.date, a.status
FROM Appointments a
INNER JOIN Patients p ON a.patient_id = p.id
INNER JOIN Doctors d ON a.doctor_id = d.id;
```

#### 🟢 Analytical Aggregations
The Admin Dashboard utilizes SQL `COUNT`, `SUM`, and `GROUP BY` functions to generate real-time business intelligence:
- Total revenue calculation across paid/pending bills.
- Appointment distribution by status (Scheduled vs. Completed).
- Patient demographics analysis.

#### 🟢 Data Integrity & Constraints
- **Primary & Foreign Keys**: Ensure strict referential integrity across all tables.
- **Role-Based Access Control (RBAC)**: SQL queries are dynamically filtered based on the logged-in user's role (PatientId vs. DoctorId) to enforce data privacy at the database layer.
- **Consistency**: Status tracking (Scheduled/Completed/Cancelled) ensures a reliable audit trail of clinic activities.

---

## 🚀 Technical Stack
- **Frontend**: React (Vite) with a premium Vanilla CSS design system.
- **Backend**: Node.js & Express.
- **Database**: MySQL / MariaDB.
- **Authentication**: JWT-based Secure Login.

---

## 🛠️ Getting Started

### 1. Database Setup
1. Create a database named `medicare_clinic`.
2. Import the schema and seed data:
   ```bash
   mysql -u root -p medicare_clinic < server/seed.sql
   ```

### 2. Backend Installation
```bash
cd server
npm install
npm run dev
```

### 3. Frontend Installation
```bash
cd client
npm install
npm run dev
```

---

## 🌟 Modern Features
- **Premium Patient Dashboard**: Specialized views for health summaries and appointment tracking.
- **Advanced Booking System**: Doctor selection filtered by specialization.
- **Responsive Design**: Glassmorphism UI with full **Dark Mode** support.
- **Profile Management**: Secure patient data updates and settings.

---

*This project was developed to bridge the gap between complex backend data management and a high-end, user-centric interface.*
