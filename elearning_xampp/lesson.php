<?php
// lesson.php - Interactive Video Lesson Player & Study Notes
require_once 'config.php';

// Auth Guard
if (!isset($_SESSION['user_id'])) {
    $_SESSION['flash_message'] = "Please sign in to view premium lessons.";
    $_SESSION['flash_type'] = "warning";
    header("Location: login.php");
    exit();
}

$lesson_id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($lesson_id <= 0) {
    header("Location: courses.php");
    exit();
}

$user_id = $_SESSION['user_id'];

try {
    // 1. Fetch lesson details & parent course
    $stmt = $pdo->prepare("SELECT l.*, c.title AS course_title FROM lessons l JOIN courses c ON l.course_id = c.id WHERE l.id = ?");
    $stmt->execute([$lesson_id]);
    $lesson = $stmt->fetch();

    if (!$lesson) {
        $_SESSION['flash_message'] = "Requested lesson not found.";
        $_SESSION['flash_type'] = "danger";
        header("Location: courses.php");
        exit();
    }

    $course_id = $lesson['course_id'];

    // 2. Mark lesson as completed automatically upon reading!
    $progress_stmt = $pdo->prepare("INSERT INTO progress (user_id, course_id, lesson_id, status) VALUES (?, ?, ?, 'completed') ON DUPLICATE KEY UPDATE status='completed'");
    $progress_stmt->execute([$user_id, $course_id, $lesson_id]);

    // 3. Get all lessons in this course for navigation sidebar
    $stmt = $pdo->prepare("SELECT id, title, order_num FROM lessons WHERE course_id = ? ORDER BY order_num ASC");
    $stmt->execute([$course_id]);
    $all_lessons = $stmt->fetchAll();

    // 4. Determine Previous and Next lesson IDs
    $prev_lesson_id = null;
    $next_lesson_id = null;
    foreach ($all_lessons as $key => $item) {
        if ($item['id'] == $lesson_id) {
            if (isset($all_lessons[$key - 1])) {
                $prev_lesson_id = $all_lessons[$key - 1]['id'];
            }
            if (isset($all_lessons[$key + 1])) {
                $next_lesson_id = $all_lessons[$key + 1]['id'];
            }
            break;
        }
    }

    // 5. Check if user has completed ALL lessons to offer the Quiz
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM progress WHERE user_id = ? AND course_id = ?");
    $stmt->execute([$user_id, $course_id]);
    $completed_count = $stmt->fetchColumn();
    $course_complete = ($completed_count == count($all_lessons));

} catch (PDOException $e) {
    die("Database Query Error: " . $e->getMessage());
}

require_once 'header.php';
?>

<div class="bg-dark text-white py-4 mb-4 border-bottom border-secondary">
    <div class="container">
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
                <span class="text-primary text-[10px] fw-bold uppercase tracking-wider"><?= htmlspecialchars($lesson['course_title']) ?></span>
                <h2 class="fw-bold mb-0 text-white mt-1"><?= htmlspecialchars($lesson['title']) ?></h2>
            </div>
            <div>
                <a href="course.php?id=<?= $course_id ?>" class="btn btn-outline-light rounded-pill px-3 py-1.5 text-xs">
                    Return to Syllabus
                </a>
            </div>
        </div>
    </div>
</div>

<div class="container py-3">
    <div class="row g-4">
        
        <!-- Sidebar Navigation columns (1/3 width) -->
        <div class="col-lg-4">
            <div class="lesson-sidebar p-3 border shadow-sm">
                <h5 class="fw-extrabold text-dark px-3 pt-2 pb-3 border-bottom mb-3 flex align-items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list-task text-primary" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M2 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5H2zM3 3H7v1H3V3z"/>
                        <path d="M5 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1zM5.5 13H12v1H5.5v-1zM1.5 7a.5.5 0 0 1 .5-.5h12a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5V7zm1 1h11v1H2.5V8zM1.5 10a.5.5 0 0 1 .5-.5h12a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5v-1zm1 1h11v1H2.5v-1z"/>
                    </svg>
                    <span>Course Coursework</span>
                </h5>
                <div class="list-group">
                    <?php foreach ($all_lessons as $item): ?>
                        <a href="lesson.php?id=<?= $item['id'] ?>" class="list-group-item list-group-item-action d-flex align-items-center justify-content-between <?= ($item['id'] == $lesson_id) ? 'active' : '' ?>">
                            <div class="text-truncate text-xs font-semibold">
                                <?= $item['order_num'] ?>. <?= htmlspecialchars($item['title']) ?>
                            </div>
                            <?php if ($item['id'] == $lesson_id): ?>
                                <span class="badge bg-primary text-[9px] uppercase">Playing</span>
                            <?php endif; ?>
                        </a>
                    <?php endforeach; ?>
                </div>

                <?php if ($course_complete): ?>
                    <div class="p-3 bg-success-subtle text-success border border-success border-opacity-25 rounded-3 mt-4 text-center">
                        <h6 class="font-bold text-xs uppercase mb-1">Course Complete!</h6>
                        <p class="text-[11px] mb-3">You have finished all interactive lessons in this course syllabus.</p>
                        <a href="quiz.php?course_id=<?= $course_id ?>" class="btn btn-success btn-sm rounded-pill font-bold px-3">
                            Take Final Quiz
                        </a>
                    </div>
                <?php endif; ?>
            </div>
        </div>

        <!-- Video Player & Study Notes columns (2/3 width) -->
        <div class="col-lg-8 space-y-4">
            
            <!-- Video Iframe Card -->
            <div class="card shadow-sm border-0 rounded-4 overflow-hidden mb-4">
                <div class="ratio ratio-16x9">
                    <!-- Embed code dynamically loaded with safety guard -->
                    <iframe 
                        src="<?= htmlspecialchars($lesson['video_url']) ?>" 
                        title="<?= htmlspecialchars($lesson['title']) ?>" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowfullscreen>
                    </iframe>
                </div>
                <div class="card-body bg-white p-3 border-top d-flex justify-content-between align-items-center">
                    <span class="text-[10px] text-muted font-bold text-uppercase d-flex align-items-center gap-1">
                        <span class="w-2 h-2 bg-success rounded-circle animate-pulse"></span>
                        <span>Streaming Active HD Playback</span>
                    </span>
                    <span class="text-xs text-muted">Lesson Order: <?= htmlspecialchars($lesson['order_num']) ?></span>
                </div>
            </div>

            <!-- Previous / Next Controls -->
            <div class="d-flex justify-content-between mb-4">
                <?php if ($prev_lesson_id): ?>
                    <a href="lesson.php?id=<?= $prev_lesson_id ?>" class="btn btn-light rounded-pill border px-4 py-2 text-xs font-bold">
                        &larr; Previous Lesson
                    </a>
                <?php else: ?>
                    <button class="btn btn-light rounded-pill border px-4 py-2 text-xs font-bold disabled" disabled>&larr; Start</button>
                <?php endif; ?>

                <?php if ($next_lesson_id): ?>
                    <a href="lesson.php?id=<?= $next_lesson_id ?>" class="btn btn-premium-primary px-4 py-2 text-xs">
                        Next Lesson &rarr;
                    </a>
                <?php else: ?>
                    <a href="course.php?id=<?= $course_id ?>" class="btn btn-premium-secondary px-4 py-2 text-xs">
                        Back to Syllabus
                    </a>
                <?php endif; ?>
            </div>

            <!-- Notes Card with PDF Download options -->
            <div class="card shadow-sm border rounded-4 bg-white p-4">
                <div class="d-flex flex-wrap align-items-center justify-content-between border-bottom pb-3 mb-4 gap-2">
                    <div>
                        <h4 class="fw-extrabold text-dark mb-1">Extensive Lesson Study Notes</h4>
                        <p class="text-xs text-muted mb-0">Prepared by academic facilitators for study reference.</p>
                    </div>
                    <div>
                        <!-- Dynamic Notes Printer serving as standard PDF exporter -->
                        <a href="download_notes.php?lesson_id=<?= $lesson_id ?>" target="_blank" class="btn btn-outline-primary rounded-pill px-3.5 py-1.5 text-xs font-bold flex align-items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-file-earmark-pdf-fill" viewBox="0 0 16 16">
                                <path d="M5.523 12.424c.14-.082.293-.162.459-.238a7.878 7.878 0 0 1-.45.606c-.28.33-.52.425-.573.347-.053-.08-.003-.408.564-.715zm-.082-2.94h-.001c-.137 0-.268.033-.301.122-.03.078-.023.235.14.415.15.162.39.279.612.24.088-.016.161-.06.216-.124a.087.087 0 0 0-.013-.102 1.836 1.836 0 0 0-.203-.193 11.21 11.21 0 0 0-.451-.358zM11.678 10.4a.976.976 0 0 0-.258-.22 4.15 4.15 0 0 0-1.013-.415c-.33.14-.674.29-1.013.435-.116.312-.238.61-.368.887a13.23 13.23 0 0 0 .89 1.447c.13.144.255.24.375.293a.473.473 0 0 0 .348.038.3.3 0 0 0 .218-.23c.036-.117.024-.26-.009-.39-.038-.15-.111-.32-.222-.504l-.002-.003zM7.34 8.794c.39-.115.764-.177 1.127-.18a11.171 11.171 0 0 0-1.127.18z"/>
                                <path d="M4 0h5.5L14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-3A1.5 1.5 0 0 1 8.5 3V1H4z"/>
                            </svg>
                            <span>Download Notes PDF</span>
                        </a>
                    </div>
                </div>

                <!-- Custom parser for Study Notes -->
                <div class="font-mono text-xs leading-relaxed p-4 bg-light rounded-3 border-0">
                    <div style="white-space: pre-wrap; font-family: 'Inter', sans-serif; font-size: 0.85rem; color: #334155;">
                        <?= htmlspecialchars($lesson['content']) ?>
                    </div>
                </div>
            </div>

        </div>

    </div>
</div>

<?php require_once 'footer.php'; ?>
