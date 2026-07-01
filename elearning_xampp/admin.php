<?php
// admin.php - Administrator Course CRUD and System Control Panel
require_once 'config.php';

// Auth Guard - Admin Role check
if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'admin') {
    $_SESSION['flash_message'] = "Unauthorized access. Admins only.";
    $_SESSION['flash_type'] = "danger";
    header("Location: login.php");
    exit();
}

$user_name = $_SESSION['user_name'];
$crud_error = '';
$crud_success = '';

// Handle Course CRUD operations
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // 1. CREATE NEW COURSE
    if (isset($_POST['create_course'])) {
        $title = trim($_POST['title']);
        $description = trim($_POST['description']);
        $category = trim($_POST['category']);
        $image = trim($_POST['image']);

        if (empty($image)) {
            $image = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80';
        }

        if (!empty($title) && !empty($description) && !empty($category)) {
            try {
                $stmt = $pdo->prepare("INSERT INTO courses (title, description, category, image) VALUES (?, ?, ?, ?)");
                $stmt->execute([$title, $description, $category, $image]);
                $crud_success = "Course '$title' created successfully!";
            } catch (PDOException $e) {
                $crud_error = "CRUD Insert Error: " . $e->getMessage();
            }
        } else {
            $crud_error = "Please fill in all required fields.";
        }
    }

    // 2. DELETE COURSE
    if (isset($_POST['delete_course'])) {
        $course_id = (int)$_POST['course_id'];
        if ($course_id > 0) {
            try {
                // Delete course (will automatically delete lessons and quizzes because of CASCADE constraint)
                $stmt = $pdo->prepare("DELETE FROM courses WHERE id = ?");
                $stmt->execute([$course_id]);
                $crud_success = "Course deleted successfully!";
            } catch (PDOException $e) {
                $crud_error = "CRUD Delete Error: " . $e->getMessage();
            }
        }
    }
}

try {
    // A. Query dashboard counts
    $students_count = $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'student'")->fetchColumn();
    $courses_count = $pdo->query("SELECT COUNT(*) FROM courses")->fetchColumn();
    $lessons_count = $pdo->query("SELECT COUNT(*) FROM lessons")->fetchColumn();
    $tickets_count = $pdo->query("SELECT COUNT(*) FROM contact_messages")->fetchColumn();

    // B. Fetch courses list
    $courses_stmt = $pdo->query("SELECT * FROM courses ORDER BY id DESC");
    $all_courses = $courses_stmt->fetchAll();

    // C. Fetch recent registration and progress logs
    $progress_stmt = $pdo->query("
        SELECT p.*, u.name AS student_name, c.title AS course_title, l.title AS lesson_title 
        FROM progress p
        JOIN users u ON p.user_id = u.id
        JOIN courses c ON p.course_id = c.id
        JOIN lessons l ON p.lesson_id = l.id
        ORDER BY p.updated_at DESC LIMIT 6
    ");
    $recent_progress_logs = $progress_stmt->fetchAll();

    // D. Fetch recent help center contact tickets
    $tickets_stmt = $pdo->query("SELECT * FROM contact_messages ORDER BY id DESC LIMIT 5");
    $recent_tickets = $tickets_stmt->fetchAll();

} catch (PDOException $e) {
    die("Admin Query Failure: " . $e->getMessage());
}

require_once 'header.php';
?>

<div class="bg-secondary-gradient text-white py-5 mb-5 shadow-sm">
    <div class="container py-3">
        <div class="d-flex flex-wrap align-items-center justify-content-between g-4">
            <div>
                <span class="badge bg-white bg-opacity-10 border border-white border-opacity-10 text-white text-xs px-2.5 py-1 rounded-pill uppercase mb-2">Management Controls</span>
                <h1 class="fw-black text-white display-5 mb-1">Administrative Console</h1>
                <p class="text-white-50 text-xs sm:text-sm mb-0">System KPIs, complete syllabus Course CRUD operations, progress logging, and ticketing records.</p>
            </div>
            <div>
                <div class="bg-white bg-opacity-5 p-3 rounded-4 border border-white border-opacity-10 d-inline-block text-start text-white">
                    <div class="text-[10px] text-white-50 font-bold uppercase mb-1">Signed in as Administrator</div>
                    <div class="text-xs font-semibold"><?= htmlspecialchars($user_name) ?></div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="container py-3 mb-5">
    
    <!-- CRUD Status Feedback Banners -->
    <?php if (!empty($crud_success)): ?>
        <div class="alert alert-success text-xs py-2.5 rounded-3 mb-4" role="alert">
            <?= htmlspecialchars($crud_success) ?>
        </div>
    <?php endif; ?>
    <?php if (!empty($crud_error)): ?>
        <div class="alert alert-danger text-xs py-2.5 rounded-3 mb-4" role="alert">
            <?= htmlspecialchars($crud_error) ?>
        </div>
    <?php endif; ?>

    <!-- KPI Statistics Cards Grid -->
    <div class="row g-4 mb-5" id="admin-stats">
        <div class="col-6 col-md-3">
            <div class="bg-white p-4 border rounded-4 shadow-sm text-center">
                <div class="h3 fw-black text-primary mb-1"><?= $students_count ?></div>
                <span class="text-[10px] text-muted font-bold text-uppercase uppercase">Graduating Students</span>
            </div>
        </div>
        <div class="col-6 col-md-3">
            <div class="bg-white p-4 border rounded-4 shadow-sm text-center">
                <div class="h3 fw-black text-dark mb-1"><?= $courses_count ?></div>
                <span class="text-[10px] text-muted font-bold text-uppercase uppercase">Syllabus Courses</span>
            </div>
        </div>
        <div class="col-6 col-md-3">
            <div class="bg-white p-4 border rounded-4 shadow-sm text-center">
                <div class="h3 fw-black text-dark mb-1"><?= $lessons_count ?></div>
                <span class="text-[10px] text-muted font-bold text-uppercase uppercase">Syllabus Chapters</span>
            </div>
        </div>
        <div class="col-6 col-md-3">
            <div class="bg-white p-4 border rounded-4 shadow-sm text-center">
                <div class="h3 fw-black text-danger mb-1"><?= $tickets_count ?></div>
                <span class="text-[10px] text-muted font-bold text-uppercase uppercase">Active Help Tickets</span>
            </div>
        </div>
    </div>

    <!-- Main Content layout -->
    <div class="row g-4">
        
        <!-- Left Column: Courses list and Create CRUD form -->
        <div class="col-lg-8 space-y-5">
            
            <!-- Create Course CRUD Form card -->
            <div class="card shadow-sm border p-4 bg-white rounded-4 mb-4">
                <h4 class="fw-extrabold text-dark mb-1">Create Course Syllabus</h4>
                <p class="text-xs text-muted mb-4">Add a new dynamic learning path. Chapters and MCQs can be added inside XAMPP phpMyAdmin.</p>
                
                <form method="POST" action="admin.php" class="needs-validation" novalidate>
                    <input type="hidden" name="create_course" value="1">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label text-[10px] fw-extrabold text-muted text-uppercase">Course Title</label>
                            <input type="text" name="title" required class="form-control text-xs py-2.5 bg-light border-0" placeholder="Introduction to PHP OOP">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-[10px] fw-extrabold text-muted text-uppercase">Category Domain</label>
                            <input type="text" name="category" required class="form-control text-xs py-2.5 bg-light border-0" placeholder="Backend Programming">
                        </div>
                    </div>
                    <div class="mb-3 mt-3">
                        <label class="form-label text-[10px] fw-extrabold text-muted text-uppercase">Cover Image URL (Optional)</label>
                        <input type="url" name="image" class="form-control text-xs py-2.5 bg-light border-0" placeholder="https://images.unsplash.com/...">
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-[10px] fw-extrabold text-muted text-uppercase">Course Description</label>
                        <textarea name="description" rows="3" required class="form-control text-xs py-2.5 bg-light border-0" placeholder="Master clean code design..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-premium-primary w-100 py-2.5 font-bold text-xs uppercase text-uppercase">
                        Register & Launch Syllabus
                    </button>
                </form>
            </div>

            <!-- Manage Syllabus list -->
            <div class="card shadow-sm border p-4 bg-white rounded-4">
                <h4 class="fw-extrabold text-dark mb-3">Manage Course Syllabi</h4>
                <div class="table-responsive">
                    <table class="table align-middle text-xs text-muted mb-0">
                        <thead class="bg-light">
                            <tr>
                                <th class="p-3 font-bold text-uppercase">Title</th>
                                <th class="p-3 font-bold text-uppercase">Category</th>
                                <th class="p-3 font-bold text-uppercase text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($all_courses as $c): ?>
                                <tr>
                                    <td class="p-3 font-semibold text-dark"><?= htmlspecialchars($c['title']) ?></td>
                                    <td class="p-3"><?= htmlspecialchars($c['category']) ?></td>
                                    <td class="p-3 text-center">
                                        <form method="POST" action="admin.php" style="display:inline-block;" onsubmit="return confirm('Are you sure you want to delete this course and all its lessons?');">
                                            <input type="hidden" name="delete_course" value="1">
                                            <input type="hidden" name="course_id" value="<?= $c['id'] ?>">
                                            <button type="submit" class="btn btn-sm btn-outline-danger px-2.5 py-1 text-[10px] rounded-pill font-bold">
                                                Delete
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>

        <!-- Right Column: Student logs & tickets -->
        <div class="col-lg-4 space-y-4">
            
            <!-- Recent Lesson Progress Logs -->
            <div class="card shadow-sm border p-4 bg-white rounded-4 mb-4">
                <h5 class="fw-extrabold text-dark border-bottom pb-2 mb-3">Student Progress Logs</h5>
                <?php if (empty($recent_progress_logs)): ?>
                    <p class="text-xs text-muted">No student progress has been recorded yet.</p>
                <?php else: ?>
                    <div class="space-y-3" style="max-height: 250px; overflow-y: auto;">
                        <?php foreach ($recent_progress_logs as $log): ?>
                            <div class="p-2.5 bg-light rounded-3 mb-2">
                                <div class="text-xs font-bold text-dark mb-0.5"><?= htmlspecialchars($log['student_name']) ?></div>
                                <div class="text-[10px] text-muted">Completed lesson <strong>"<?= htmlspecialchars($log['lesson_title']) ?>"</strong> in course <em>"<?= htmlspecialchars($log['course_title']) ?>"</em></div>
                                <div class="text-[9px] text-muted mt-1 text-end font-monospace"><?= date('H:i M d', strtotime($log['updated_at'])) ?></div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>

            <!-- Support Ticket Logs -->
            <div class="card shadow-sm border p-4 bg-white rounded-4">
                <h5 class="fw-extrabold text-dark border-bottom pb-2 mb-3">Recent Ticket Requests</h5>
                <?php if (empty($recent_tickets)): ?>
                    <p class="text-xs text-muted">No incoming tickets are logged.</p>
                <?php else: ?>
                    <div class="space-y-3" style="max-height: 250px; overflow-y: auto;">
                        <?php foreach ($recent_tickets as $ticket): ?>
                            <div class="p-2.5 bg-light rounded-3 mb-2">
                                <div class="d-flex justify-content-between align-items-center mb-1">
                                    <span class="text-xs font-bold text-dark"><?= htmlspecialchars($ticket['name']) ?></span>
                                    <span class="badge bg-danger bg-opacity-10 text-danger text-[9px] px-1.5 py-0.5 rounded-pill uppercase"><?= htmlspecialchars($ticket['status']) ?></span>
                                </div>
                                <div class="text-[10px] text-dark font-semibold mb-1">Subject: <?= htmlspecialchars($ticket['subject']) ?></div>
                                <p class="text-[10px] text-muted mb-0 leading-relaxed italic border-start border-3 border-slate-300 ps-2">"<?= htmlspecialchars(substr($ticket['message'], 0, 80)) ?>..."</p>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>

        </div>

    </div>
</div>

<?php require_once 'footer.php'; ?>
