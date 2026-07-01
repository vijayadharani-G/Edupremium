# EduPremium - E-Learning Management System (PHP & MySQL Standalone)

EduPremium is a professional-grade, high-fidelity academic portal designed to run directly on **XAMPP (Apache + MySQL)** without requiring Vite, Node.js, React, or any modern frameworks.

It uses **pure PHP, custom CSS animations, modern Bootstrap 5**, and a relational **MySQL database** to handle student registrations, secure session-based authenticated logins, course syllabus catalogs, lesson progress tracking, interactive quizzes, direct PDF notes, support ticketing, and dynamic degree graduation diplomas.

---

## 🛠️ XAMPP Installation and Setup Steps

Follow these simple steps to host and run this system locally:

### Step 1: Clone or Copy Project Files to htdocs
1. Extract this ZIP file.
2. Copy the entire `elearning_xampp` directory.
3. Paste it inside your local XAMPP **`htdocs`** folder:
   * **Windows default path:** `C:\xampp\htdocs\elearning_xampp\`
   * **Mac default path:** `/Applications/XAMPP/xamppfiles/htdocs/elearning_xampp/`

### Step 2: Boot Apache & MySQL Servers
1. Open the **XAMPP Control Panel**.
2. Click **Start** next to **Apache**.
3. Click **Start** next to **MySQL**.

### Step 3: Setup the MySQL Database in phpMyAdmin
1. Open your web browser and go to: **`http://localhost/phpmyadmin`**
2. Click on **New** in the left sidebar to create a new database.
3. Set the database name to exactly: **`elearning_db`** (use collation: `utf8mb4_unicode_ci` or standard default).
4. Click **Create**.
5. Once inside `elearning_db`, click the **Import** tab at the top.
6. Click **Choose File** and select the **`database.sql`** file located inside your project folder (`C:\xampp\htdocs\elearning_xampp\database.sql`).
7. Scroll down to the bottom of the page and click **Import** or **Go**.
8. You should see a green success message indicating that the database tables and sample records were created successfully!

### Step 4: Run the Application!
1. In your browser, navigate to:
   👉 **`http://localhost/elearning_xampp/`**
2. The application is fully live and connected to MySQL!

---

## 🔐 Sample Account Login Credentials

Use the following pre-configured credentials to explore the student tracker and administrator CRUD portal immediately:

### 🎓 Student Profile
* **Email Address:** `student@edupremium.com`
* **Security Password:** `student123`
* *Syllabus actions:* Explore courses, play video lectures, download PDF notes, take interactive quizzes, track completions, and print a custom graduation diploma in the dashboard!

### ⚙️ Administrator Profile
* **Email Address:** `admin@edupremium.com`
* **Security Password:** `admin123`
* *Admin actions:* Access the administrative console, review overall KPI stats, create new course syllabi (Syllabus CRUD), track recent student completions in real time, and view support tickets dispatched from the contact form.

---

## 📂 Project Directory Structure

```text
elearning_xampp/
│
├── css/
│   └── style.css            # Custom styling, animations, gradients, certificate overlays
├── js/
│   └── script.js            # Client-side validation, auto-dismiss alerts, quiz helper
│
├── config.php               # MySQL PDO database connection & active session initialization
├── database.sql             # SQL database script (tables: users, courses, lessons, progress, scores)
│
├── header.php               # Universal HTML template top, navbar with dynamic login state
├── footer.php               # Universal HTML template bottom, footer, and Bootstrap bundles
│
├── index.php                # Homepage landing with premium hero, metrics, and academic faculty grid
├── login.php                # Authentication page for students & administrators
├── register.php             # New student registration with password hashing
├── logout.php               # Clear active session cookies and return to sign-in
│
├── courses.php              # Curricula search catalog with query parameters
├── course.php               # Detailed course viewer, listing lessons and interactive quizzes
├── lesson.php               # Lecture video player, study notes section, auto-completes progress
├── download_notes.php       # Zero-dependency printable PDF note exporter
├── quiz.php                 # MCQ quiz engine, calculates results and saves to scores table
├── certificate.php          # Dynamic printable graduation credentials degree
├── contact.php              # Help center ticketing form (saves to database)
├── admin.php                # Administrator console with stats and Course CRUD capability
│
└── README.md                # Project documentation and setup guides
```

---

## 💎 Custom Visual Features

1. **Responsive Bootstrap 5 Grid Framework:** Fits perfectly on mobile devices, tablets, and wide computer monitors.
2. **Beautiful Design Gradients:** Custom `.bg-primary-gradient` and `.bg-secondary-gradient` variables matching elite tech branding.
3. **Interactive Course Tracker:** Displays percentage lines in real-time on your student dashboard.
4. **Instant PDF Print Formats:** Zero-dependency `download_notes.php` and `certificate.php` layouts use special CSS media rules (`@media print`) and native `window.print()` triggers so you can save high-fidelity copies locally in 1 click.
5. **Secure Database Queries:** Uses PHP **PDO Prepared Statements** for all transactions to completely prevent SQL injection vulnerabilities.
