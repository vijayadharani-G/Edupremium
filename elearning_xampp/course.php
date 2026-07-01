<?php
// course.php - Single Course Syllabus detail view
require_once 'header.php';

$course_id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($course_id <= 0) {
    header("Location: courses.php");
    exit();
}

try {
    // 1. Fetch Course details
    $stmt = $pdo->prepare("SELECT * FROM courses WHERE id = ?");
    $stmt->execute([$course_id]);
    $course = $stmt->fetch();

    if (!$course) {
        $_SESSION['flash_message'] = "Requested course not found.";
        $_SESSION['flash_type'] = "danger";
        header("Location: courses.php");
        exit();
    }

    // 2. Fetch Lessons for this course
    $stmt = $pdo->prepare("SELECT id, title, order_num FROM lessons WHERE course_id = ? ORDER BY order_num ASC");
    $stmt->execute([$course_id]);
    $lessons = $stmt->fetchAll();

    // 3. Check user progress if logged in
    $completed_lessons = [];
    if (isset($_SESSION['user_id'])) {
        $user_id = $_SESSION['user_id'];
        $stmt = $pdo->prepare("SELECT lesson_id FROM progress WHERE user_id = ? AND course_id = ?");
        $stmt->execute([$user_id, $course_id]);
        $completed_lessons = $stmt->fetchAll(PDO::FETCH_COLUMN);
    }
} catch (PDOException $e) {
    die("Database Query Failure: " . $e->getMessage());
}
?>

<div class="bg-light py-5 border-bottom">
    <div class="container">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-3">
                <li class="breadcrumb-item text-xs"><a href="courses.php">Courses Catalog</a></li>
                <li class="breadcrumb-item active text-xs text-muted" aria-current="page"><?= htmlspecialchars($course['title']) ?></li>
            </ol>
        </nav>
        
        <div class="row align-items-center g-4">
            <div class="col-md-8">
                <span class="badge bg-primary text-white text-xs px-2.5 py-1 rounded-pill mb-2 text-uppercase"><?= htmlspecialchars($course['category']) ?></span>
                <h1 class="fw-extrabold text-dark tracking-tight leading-tight"><?= htmlspecialchars($course['title']) ?></h1>
                <p class="text-muted leading-relaxed text-sm mt-3"><?= htmlspecialchars($course['description']) ?></p>
            </div>
            <div class="col-md-4 text-md-end">
                <?php if (isset($_SESSION['user_id'])): ?>
                    <div class="bg-white p-3 rounded-4 border shadow-sm text-center">
                        <div class="text-[10px] text-muted font-bold text-uppercase mb-2">My Course Tracker</div>
                        <div class="h4 fw-bold text-primary">
                            <?= count($completed_lessons) ?> / <?= count($lessons) ?>
                        </div>
                        <div class="text-xs text-muted">Lessons Completed</div>
                        
                        <?php if (count($completed_lessons) === count($lessons) && count($lessons) > 0): ?>
                            <a href="quiz.php?course_id=<?= $course_id ?>" class="btn btn-success rounded-pill px-4 text-xs font-bold w-100 mt-3 py-2">
                                Start Course Quiz
                            </a>
                        <?php endif; ?>
                    </div>
                <?php else: ?>
                    <div class="bg-white p-3 rounded-4 border shadow-sm text-center">
                        <p class="text-xs text-muted mb-3">Unlock extensive video tutorials, interactive study notes, and print your diploma.</p>
                        <a href="login.php" class="btn btn-premium-primary w-100 py-2.5 font-bold text-xs uppercase">Sign In & Enroll Now</a>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<div class="container py-5">
    <div class="row g-4">
        <!-- Lessons list column -->
        <div class="col-lg-8">
            <h4 class="fw-extrabold text-dark mb-4">Syllabus Lessons & Chapters</h4>

            <?php if (empty($lessons)): ?>
                <div class="bg-white p-5 rounded-4 border border-light text-center">
                    <div class="text-muted mb-3">Lessons for this syllabus are being prepared. Check back shortly!</div>
                </div>
            <?php else: ?>
                <div class="list-group shadow-sm border-0 rounded-4 overflow-hidden">
                    <?php foreach ($lessons as $index => $lesson): ?>
                        <?php 
                        $is_completed = in_array($lesson['id'], $completed_lessons);
                        ?>
                        <div class="list-group-item list-group-item-action d-flex align-items-center justify-content-between p-4 border-slate-100">
                            <div class="d-flex align-items-center gap-3">
                                <div class="w-8 h-8 rounded-circle bg-light d-flex align-items-center justify-content-center text-xs font-bold text-dark border">
                                    <?= $lesson['order_num'] ?>
                                </div>
                                <div>
                                    <h6 class="fw-bold mb-0 text-dark"><?= htmlspecialchars($lesson['title']) ?></h6>
                                    <span class="text-[10px] text-muted font-semibold text-uppercase">Interactive Lecture</span>
                                </div>
                            </div>
                            
                            <div class="d-flex align-items-center gap-3">
                                <?php if ($is_completed): ?>
                                    <span class="badge bg-success-subtle text-success border border-success border-opacity-25 text-xs font-bold px-2.5 py-1 rounded-pill">
                                        Completed
                                    </span>
                                <?php endif; ?>

                                <?php if (isset($_SESSION['user_id'])): ?>
                                    <a href="lesson.php?id=<?= $lesson['id'] ?>" class="btn btn-light rounded-pill border px-3 text-xs font-bold py-1.5">
                                        Play Video Notes
                                    </a>
                                <?php else: ?>
                                    <a href="login.php" class="btn btn-light rounded-pill border px-3 text-xs font-bold py-1.5 disabled">
                                        Locked
                                    </a>
                                <?php endif; ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>

        <!-- Sidebar notes column -->
        <div class="col-lg-4">
            <div class="bg-white p-4 rounded-4 border shadow-sm space-y-4">
                <h5 class="fw-extrabold text-dark border-bottom pb-2 mb-3">Academic Milestones</h5>
                
                <div class="d-flex align-items-start gap-3 mb-3">
                    <div class="w-8 h-8 rounded-3 bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"/>
                        </svg>
                    </div>
                    <div>
                        <h6 class="fw-bold mb-1 text-xs">Video Tutorial Lectures</h6>
                        <p class="text-muted text-[11px] mb-0">High-definition videos explaining semantic layouts, SQL schemas, or object loops.</p>
                    </div>
                </div>

                <div class="d-flex align-items-start gap-3 mb-3">
                    <div class="w-8 h-8 rounded-3 bg-indigo bg-opacity-10 text-indigo d-flex align-items-center justify-content-center shrink-0" style="background-color: rgba(79, 70, 229, 0.1); color: #4f46e5;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-pdf" viewBox="0 0 16 16">
                            <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
                            <path d="M4.603 12.087a.81.81 0 0 1-.438-.42c-.047-.121-.042-.311.475-.909.516-.597 1.244-1.257 2.197-1.838.224-.137.475-.28.747-.428a13.33 13.33 0 0 1-1.39-1.567c-.33-.414-.61-.807-.82-1.157-.11-.184-.184-.353-.222-.503-.033-.13-.045-.274-.009-.39.037-.122.102-.2.218-.23.11-.03.23-.016.348.038.118.053.243.149.375.293.308.333.608.84.891 1.447.13.278.252.576.368.887.33-.142.674-.29 1.013-.435.37-.159.732-.3 1.09-.41h.001c.155-.047.316-.078.479-.089.16-.011.314.015.441.079.116.058.192.146.218.26.028.125.013.272-.047.41-.06.138-.175.286-.337.413-.255.2-.6.313-.984.323l-.11-.002c-.36-.008-.737-.068-1.127-.18a14.12 14.12 0 0 1-2.035 1.447 11.832 11.832 0 0 1-1.533 2.112c-.287.311-.532.552-.733.72-.2.167-.358.264-.474.305-.116.04-.216.04-.316.002zm2.016-4.572c.076-.11.16-.242.247-.39.25-.42.446-.82.59-1.173L7.3 6c-.161-.311-.328-.567-.487-.743a.69.69 0 0 0-.182-.132c-.046-.017-.077-.01-.099.008a.109.109 0 0 0-.025.045c-.015.06-.012.18.067.42.083.25.226.568.438.95z"/>
                        </svg>
                    </div>
                    <div>
                        <h6 class="fw-bold mb-1 text-xs">Downloadable PDF Guides</h6>
                        <p class="text-muted text-[11px] mb-0">Study offline with clean formatted course documentation guides loaded directly inside lesson tabs.</p>
                    </div>
                </div>

                <div class="d-flex align-items-start gap-3">
                    <div class="w-8 h-8 rounded-3 bg-success bg-opacity-10 text-success d-flex align-items-center justify-content-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-journal-check" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M10.854 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 8.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                            <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
                        </svg>
                    </div>
                    <div>
                        <h6 class="fw-bold mb-1 text-xs">Self-Evaluation MCQ Quizzes</h6>
                        <p class="text-muted text-[11px] mb-0">Verify your correctness logs by submitting custom exam questionnaires once coursework is finished.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once 'footer.php'; ?>
