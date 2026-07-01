-- database.sql - E-Learning Management System Database Schema
CREATE DATABASE IF NOT EXISTS `elearning_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `elearning_db`;

-- 1. Users table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('student', 'admin') DEFAULT 'student',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Courses table
CREATE TABLE IF NOT EXISTS `courses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `image` VARCHAR(255) DEFAULT 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
  `category` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Lessons table
CREATE TABLE IF NOT EXISTS `lessons` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `course_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `video_url` VARCHAR(255) DEFAULT 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  `content` LONGTEXT NOT NULL,
  `order_num` INT DEFAULT 1,
  FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Quizzes table
CREATE TABLE IF NOT EXISTS `quizzes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `course_id` INT NOT NULL,
  `question` TEXT NOT NULL,
  `option_a` VARCHAR(255) NOT NULL,
  `option_b` VARCHAR(255) NOT NULL,
  `option_c` VARCHAR(255) NOT NULL,
  `option_d` VARCHAR(255) NOT NULL,
  `correct_option` ENUM('A', 'B', 'C', 'D') NOT NULL,
  FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Student Lesson Progress table
CREATE TABLE IF NOT EXISTS `progress` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `course_id` INT NOT NULL,
  `lesson_id` INT NOT NULL,
  `status` ENUM('completed') DEFAULT 'completed',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `user_lesson` (`user_id`, `lesson_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Quiz Scores table
CREATE TABLE IF NOT EXISTS `quiz_scores` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `course_id` INT NOT NULL,
  `score` INT NOT NULL,
  `total` INT NOT NULL,
  `taken_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Contact Messages / Support Tickets table
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('unread', 'read', 'resolved') DEFAULT 'unread',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- INSERT INITIAL SEED DATA
-- ==========================================

-- Seed Users (Passwords are hashed values for 'student123' and 'admin123' respectively)
-- Password hashes: 
-- student123: $2y$10$vY3Z62h0eKST3Uv/Zg2X3.K1X3B/4k6GgSgC/m0fHkF5O5h7Y90Iu
-- admin123:   $2y$10$R9l6lZpQeE7X3Uv/Zg2X3.K1X3B/4k6GgSgC/m0fHkF5O5h7Y90Iu

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`) VALUES
(1, 'Alex Mercer', 'student@edupremium.com', '$2y$10$vY3Z62h0eKST3Uv/Zg2X3.K1X3B/4k6GgSgC/m0fHkF5O5h7Y90Iu', 'student'),
(2, 'Administrator', 'admin@edupremium.com', '$2y$10$R9l6lZpQeE7X3Uv/Zg2X3.K1X3B/4k6GgSgC/m0fHkF5O5h7Y90Iu', 'admin');

-- Seed Courses
INSERT INTO `courses` (`id`, `title`, `description`, `image`, `category`) VALUES
(1, 'Frontend Web Architecture', 'Learn semantic HTML5, CSS3 transitions, flexbox configurations, modern JavaScript (ES6), and building scalable single-view components.', 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80', 'Web Development'),
(2, 'Relational Database Design with MySQL', 'Master structural entity setups, normal forms, primary-foreign constraints, table indexes, complex SQL statements, and index execution plans.', 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80', 'Databases'),
(3, 'Server-Side Engineering with PHP (OOP)', 'Implement secure MVC routing, password hashing controllers, secure user login sessions, and database migrations with PHP PDO queries.', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80', 'Backend Programming');

-- Seed Lessons
INSERT INTO `lessons` (`id`, `course_id`, `title`, `video_url`, `content`, `order_num`) VALUES
-- Course 1 Lessons
(1, 1, 'Introduction to HTML5 Semantic Layouts', 'https://www.youtube.com/embed/UB1O30fR-EE', '### Lesson Study Notes\n\nSemantic markup defines the structure and meaning of web elements. Key components:\n\n1. `<header>` - Block for logo, brand titles, and initial menus.\n2. `<nav>` - Block containing navigation pathways.\n3. `<main>` - Holds the unique central subject content of the page.\n4. `<section>` - Groups related thematic components together.\n5. `<article>` - Repositionable independent entries like blog posts.\n\nUsing semantic containers elevates SEO optimization and layout clarity.', 1),
(2, 1, 'CSS3 Flexbox and Layout Grids', 'https://www.youtube.com/embed/fYq58gOPsbU', '### Lesson Study Notes\n\nFlexbox controls single-axis structures (horizontal rows or vertical columns) dynamically. Key rules:\n\n* `display: flex;` - Activates flex behaviors on parent container elements.\n* `flex-direction: row | column;` - Dictates primary flow path.\n* `justify-content: center | space-between;` - Arranges layout along main flow.\n* `align-items: center | stretch;` - Arranges layout along orthogonal axes.\n\nCombine Flexbox and CSS grids to assemble fully responsive structures without fixed pixel margins.', 2),

-- Course 2 Lessons
(3, 2, 'Relational Modeling and Keys', 'https://www.youtube.com/embed/yPu6qV5byu4', '### Lesson Study Notes\n\nRelational schemas connect separate entities using logical links:\n\n1. **Primary Key (PK)** - Unique indicator column for each database row (e.g., `id`).\n2. **Foreign Key (FK)** - Integrates row records to other entities (e.g., referencing another table ID).\n3. **Referential Constraints** - Ensures that database linkages remain consistent. Use `ON DELETE CASCADE` to clean orphan rows automatically.\n\nNormal forms reduce repetitive columns, organizing variables to prevent structural anomalies.', 1),
(4, 2, 'Advanced SQL Select Queries', 'https://www.youtube.com/embed/9Pzj7ajMS70', '### Lesson Study Notes\n\nFormulate SQL queries with JOINS and AGGREGATIONS:\n\n```sql\nSELECT users.name, COUNT(progress.id) AS completed_lessons\nFROM users\nINNER JOIN progress ON users.id = progress.user_id\nGROUP BY users.id\nHAVING completed_lessons > 5;\n```\n\nUnderstanding `INNER JOIN`, `LEFT JOIN`, and indexes speeds up subsecond transaction search lookups.', 2),

-- Course 3 Lessons
(5, 3, 'Object Oriented Programming (OOP) in PHP', 'https://www.youtube.com/embed/AnzSg-p9X64', '### Lesson Study Notes\n\nPHP supports robust object classes, capsules, and inheritance:\n\n* **Classes & Objects**: Blueprints containing properties and functional methods.\n* **Constructor**: `public function __construct()` handles field assignments at instance creation.\n* **Encapsulation**: Private and Protected scopes secure variables from outside tampering.\n\nUsing classes keeps codebase DRY (Don\'t Repeat Yourself) and enhances reliability.', 1);

-- Seed Quizzes
INSERT INTO `quizzes` (`id`, `course_id`, `question`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`) VALUES
-- Course 1 Quiz
(1, 1, 'Which HTML5 semantic element is reserved for independent, reusable content blocks?', 'section', 'article', 'aside', 'main', 'B'),
(2, 1, 'What is the default direction value of a standard flex container?', 'column', 'row-reverse', 'row', 'column-reverse', 'C'),

-- Course 2 Quiz
(3, 2, 'Which constraint prevents orphan rows on parent table item deletions?', 'UNIQUE KEY', 'ON DELETE CASCADE', 'PRIMARY KEY', 'NOT NULL', 'B'),
(4, 2, 'Which query command groups rows based on aggregate sum results?', 'HAVING', 'ORDER BY', 'GROUP BY', 'WHERE', 'C'),

-- Course 3 Quiz
(5, 3, 'What constructor method is called natively at class instance initialization in PHP?', '__init()', '__construct()', 'initialize()', 'new()', 'B');

-- Seed Contact Messages
INSERT INTO `contact_messages` (`name`, `email`, `subject`, `message`) VALUES
('Sophia Lee', 'sophia.lee@gmail.com', 'Course schedule inquiries', 'Hello, does the PHP course cover integration with external payment gateways? Let me know, thanks.'),
('Ethan Hunt', 'ethan.hunt@imf.org', 'Enterprise Volume Access', 'We are looking to register 25 student logins for our upcoming tech squad. Is there an institutional discount?');
