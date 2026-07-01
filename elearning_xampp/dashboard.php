<?php
// dashboard.php - Student Progress and Profile Dashboard
require_once 'config.php';

// Auth Guard
if (!isset($_SESSION['user_id'])) {
    $_SESSION['flash_message'] = "Please sign in to view your personalized dashboard.";
    $_SESSION['flash_type'] = "warning";
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];
$user_name = $_SESSION['user_name'];
$user_email = $_SESSION['user_email'];

try {
    // 1. Fetch user progress grouped by course
    $progress_stmt = $pdo->prepare("
        SELECT c.id AS course_id, c.title AS course_title, c.category, c.image, COUNT(p.id) AS completed_lessons
        FROM courses c
        LEFT JOIN progress p ON c.id = p.course_id AND p.user_id = ?
        GROUP BY c.id
    ");
    $progress_stmt->execute([$user_id]);
    $user_courses_progress = $progress_stmt->fetchAll();

    // 2. Fetch total lesson counts per course to calculate complete %
    $lessons_count_stmt = $pdo->query("
        SELECT course_id, COUNT(*) AS total_lessons
        FROM lessons
        GROUP BY course_id
    ");
    $course_lesson_counts = $lessons_count_stmt->fetchAll(PDO::FETCH_KEY_PAIR);

    // 3. Fetch past quiz scores
    $scores_stmt = $pdo->prepare("
        SELECT qs.*, c.title AS course_title 
        FROM quiz_scores qs
        JOIN courses c ON qs.course_id = c.id
        WHERE qs.user_id = ?
        ORDER BY qs.taken_at DESC
    ");
    $scores_stmt->execute([$user_id]);
    $quiz_scores = $scores_stmt->fetchAll();

} catch (PDOException $e) {
    die("Database Query Error: " . $e->getMessage());
}

require_once 'header.php';
?>

<div class="bg-primary-gradient text-white py-5 mb-5 shadow-sm">
    <div class="container py-3">
        <div class="row align-items-center justify-content-between g-4">
            <div class="col-md-8">
                <span class="badge bg-white bg-opacity-10 border border-white border-opacity-10 text-white text-xs px-2.5 py-1 rounded-pill uppercase mb-2">Student Portal Profiles</span>
                <h1 class="fw-black text-white display-5 mb-1">Welcome back, <?= htmlspecialchars($user_name) ?>!</h1>
                <p class="text-white-50 text-xs sm:text-sm mb-0">Track your completed lessons, test score logs, and download graduation credentials directly.</p>
            </div>
            <div class="col-md-4 text-md-end">
                <div class="bg-white bg-opacity-5 p-3 rounded-4 border border-white border-opacity-10 d-inline-block text-start text-white">
                    <div class="text-[10px] text-white-50 font-bold uppercase mb-1">Authenticated Account</div>
                    <div class="text-xs font-semibold"><?= htmlspecialchars($user_email) ?></div>
                    <div class="text-[10px] text-primary text-uppercase font-bold bg-white px-2.5 py-0.5 rounded-pill mt-2 d-inline-block">Academic Student ID: #<?= sprintf("%05d", $user_id) ?></div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="container py-3 mb-5">
    <div class="row g-4">
        
        <!-- Left Column: Syllabus tracks & completion certificates -->
        <div class="col-lg-8 space-y-4">
            <h4 class="fw-extrabold text-dark mb-4">My Enrolled Course Progress</h4>

            <?php if (empty($user_courses_progress)): ?>
                <div class="bg-white p-5 rounded-4 border text-center">
                    <p class="text-muted">You are not currently enrolled in any technical courses.</p>
                    <a href="courses.php" class="btn btn-premium-primary">Explore Syllabus</a>
                </div>
            <?php else: ?>
                <div class="space-y-4">
                    <?php foreach ($user_courses_progress as $course): ?>
                        <?php 
                        $c_id = $course['course_id'];
                        $total_lessons = isset($course_lesson_counts[$c_id]) ? (int)$course_lesson_counts[$c_id] : 0;
                        $completed = (int)$course['completed_lessons'];
                        
                        $percentage = ($total_lessons > 0) ? round(($completed / $total_lessons) * 100) : 0;
                        ?>
                        <div class="card shadow-sm border p-4 bg-white rounded-4 mb-4">
                            <div class="row align-items-center g-3">
                                <div class="col-sm-3 text-center text-sm-start">
                                    <img src="<?= htmlspecialchars($course['image']) ?>" class="rounded-3 img-fluid" style="height: 110px; width: 100%; object-fit: cover;" alt="<?= htmlspecialchars($course['course_title']) ?>">
                                </div>
                                <div class="col-sm-9">
                                    <div class="d-flex align-items-center justify-content-between mb-2">
                                        <span class="badge bg-light text-primary border text-xs px-2.5 py-1 rounded-pill uppercase"><?= htmlspecialchars($course['category']) ?></span>
                                        <span class="text-xs text-muted"><?= $completed ?> / <?= $total_lessons ?> Lessons Finished</span>
                                    </div>
                                    <h5 class="fw-extrabold text-dark mb-3"><?= htmlspecialchars($course['course_title']) ?></h5>

                                    <!-- Progress line bar -->
                                    <div class="progress rounded-pill bg-light mb-3" style="height: 8px;">
                                        <div class="progress-bar bg-primary rounded-pill" role="progressbar" style="width: <?= $percentage ?>%;" aria-valuenow="<?= $percentage ?>" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>

                                    <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
                                        <span class="text-xs font-bold text-dark"><?= $percentage ?>% Completed</span>
                                        
                                        <div class="d-flex gap-2">
                                            <a href="course.php?id=<?= $c_id ?>" class="btn btn-outline-secondary rounded-pill px-3 py-1.5 text-xs font-bold">
                                                Review Syllabus
                                            </a>
                                            <?php if ($percentage === 100): ?>
                                                <a href="certificate.php?course_id=<?= $c_id ?>" target="_blank" class="btn btn-success rounded-pill px-3 py-1.5 text-xs font-bold flex align-items-center gap-1 shadow-sm">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-patch-check-fill" viewBox="0 0 16 16">
                                                        <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.293l2.646-2.647a.5.5 0 0 1 .708.708z"/>
                                                    </svg>
                                                    <span>Print Diploma</span>
                                                </a>
                                            <?php endif; ?>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>

        <!-- Right Column: Quiz score logs & badges earned -->
        <div class="col-lg-4 space-y-4">
            
            <!-- Overall Stats box -->
            <div class="card shadow-sm border p-4 bg-white rounded-4 mb-4">
                <h5 class="fw-extrabold text-dark border-bottom pb-2 mb-3">Academic Achievements</h5>
                
                <div class="row text-center g-2 mt-2">
                    <div class="col-6">
                        <div class="p-3 bg-light rounded-3">
                            <h4 class="fw-black text-primary mb-1"><?= count($quiz_scores) ?></h4>
                            <span class="text-[10px] text-muted font-bold uppercase text-uppercase">Quizzes Submitted</span>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="p-3 bg-light rounded-3">
                            <!-- Compute completed certificates count -->
                            <?php 
                            $certs_count = 0;
                            foreach ($user_courses_progress as $course) {
                                $c_id = $course['course_id'];
                                $total_lessons = isset($course_lesson_counts[$c_id]) ? (int)$course_lesson_counts[$c_id] : 0;
                                $completed = (int)$course['completed_lessons'];
                                if ($total_lessons > 0 && $completed === $total_lessons) {
                                    $certs_count++;
                                }
                            }
                            ?>
                            <h4 class="fw-black text-success mb-1"><?= $certs_count ?></h4>
                            <span class="text-[10px] text-muted font-bold uppercase text-uppercase">Diplomas Earned</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quiz Score History Logs -->
            <div class="card shadow-sm border p-4 bg-white rounded-4">
                <h5 class="fw-extrabold text-dark border-bottom pb-2 mb-3 flex align-items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock-history text-primary" viewBox="0 0 16 16">
                        <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.848 1.205c-.156-.268-.332-.522-.524-.762l.775-.63c.253.315.48.647.68 1.001l-.93.491zm1.196 1.838a7.005 7.005 0 0 0-.584-.712l.674-.74c.29.263.558.556.804.876l-.894.576zM16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8z"/>
                    </svg>
                    <span>Quiz Score Records</span>
                </h5>

                <?php if (empty($quiz_scores)): ?>
                    <p class="text-xs text-muted">Complete course video lessons to unlock the Final Exam quizzes.</p>
                <?php else: ?>
                    <div class="space-y-3" style="max-height: 250px; overflow-y: auto;">
                        <?php foreach ($quiz_scores as $score): ?>
                            <?php 
                            $passed = (($score['score'] / $score['total']) >= 0.7);
                            ?>
                            <div class="p-3 bg-light rounded-3 border border-light mb-2.5 d-flex justify-content-between align-items-center">
                                <div>
                                    <div class="text-xs fw-extrabold text-dark"><?= htmlspecialchars($score['course_title']) ?></div>
                                    <span class="text-[10px] text-muted">Submitted on <?= date('Y-m-d', strtotime($score['taken_at'])) ?></span>
                                </div>
                                <div class="text-end">
                                    <div class="h6 fw-bold mb-0 text-primary"><?= $score['score'] ?>/<?= $score['total'] ?></div>
                                    <span class="badge <?= $passed ? 'bg-success' : 'bg-danger' ?> text-[9px] rounded-pill uppercase px-2 py-0.5"><?= $passed ? 'Pass' : 'Failed' ?></span>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>

        </div>

    </div>
</div>

<?php require_once 'footer.php'; ?>
