<?php
// quiz.php - Interactive MCQ Quiz Module
require_once 'config.php';

// Auth Guard
if (!isset($_SESSION['user_id'])) {
    $_SESSION['flash_message'] = "Please sign in to take the final course quiz.";
    $_SESSION['flash_type'] = "warning";
    header("Location: login.php");
    exit();
}

$course_id = isset($_GET['course_id']) ? (int)$_GET['course_id'] : (isset($_POST['course_id']) ? (int)$_POST['course_id'] : 0);
if ($course_id <= 0) {
    header("Location: courses.php");
    exit();
}

$user_id = $_SESSION['user_id'];
$quiz_results = null;

try {
    // 1. Fetch Course details
    $stmt = $pdo->prepare("SELECT * FROM courses WHERE id = ?");
    $stmt->execute([$course_id]);
    $course = $stmt->fetch();

    if (!$course) {
        $_SESSION['flash_message'] = "Course syllabus not found.";
        $_SESSION['flash_type'] = "danger";
        header("Location: courses.php");
        exit();
    }

    // 2. Fetch Quiz questions
    $stmt = $pdo->prepare("SELECT * FROM quizzes WHERE course_id = ? ORDER BY id ASC");
    $stmt->execute([$course_id]);
    $questions = $stmt->fetchAll();

    // 3. Process quiz submission (POST)
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['submit_quiz'])) {
        $answers = isset($_POST['answers']) ? $_POST['answers'] : [];
        $correct_count = 0;
        $total_questions = count($questions);

        $graded_questions = [];

        foreach ($questions as $question) {
            $q_id = $question['id'];
            $submitted_opt = isset($answers[$q_id]) ? strtoupper(trim($answers[$q_id])) : '';
            $correct_opt = strtoupper(trim($question['correct_option']));
            $is_correct = ($submitted_opt === $correct_opt);

            if ($is_correct) {
                $correct_count++;
            }

            $graded_questions[] = [
                'question' => $question['question'],
                'option_a' => $question['option_a'],
                'option_b' => $question['option_b'],
                'option_c' => $question['option_c'],
                'option_d' => $question['option_d'],
                'submitted' => $submitted_opt,
                'correct' => $correct_opt,
                'is_correct' => $is_correct
            ];
        }

        // Record score to DB
        $score_stmt = $pdo->prepare("INSERT INTO quiz_scores (user_id, course_id, score, total) VALUES (?, ?, ?, ?)");
        $score_stmt->execute([$user_id, $course_id, $correct_count, $total_questions]);

        $quiz_results = [
            'score' => $correct_count,
            'total' => $total_questions,
            'percent' => ($total_questions > 0) ? round(($correct_count / $total_questions) * 100) : 0,
            'graded' => $graded_questions
        ];
    }

} catch (PDOException $e) {
    die("Database Query Error: " . $e->getMessage());
}

require_once 'header.php';
?>

<div class="bg-light py-5 border-bottom">
    <div class="container">
        <span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 px-3 py-1.5 rounded-pill text-xs font-bold text-uppercase mb-2">
            Final Course Quiz Evaluator
        </span>
        <h1 class="fw-extrabold text-dark tracking-tight mb-2"><?= htmlspecialchars($course['title']) ?> Assessment</h1>
        <p class="text-muted text-xs sm:text-sm mb-0">Verify your retention logs. Answer all multiple-choice questions correctly to earn your diploma badges.</p>
    </div>
</div>

<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-lg-8">

            <?php if ($quiz_results !== null): ?>
                <!-- Score Results screen -->
                <div class="card shadow p-4 rounded-4 bg-white border border-light text-center mb-5 animate-fade-in">
                    <div class="w-20 h-20 rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-award-fill text-primary" viewBox="0 0 16 16">
                            <path d="m8 0 1.669.086 1.619.29.154.026c.79.13 1.558.42 2.22.844l.116.08.136.107c.62.518 1.096 1.18 1.378 1.91l.047.135.039.143c.2.82.2 1.69 0 2.51l-.039.143-.047.135c-.282.73-.758 1.392-1.378 1.91l-.136.106-.116.08c-.662.425-1.429.715-2.22.844l-.154.026L9.67 12 8 12.086 6.331 12l-1.619-.29-.154-.026c-.79-.13-1.558-.42-2.22-.844l-.116-.08-.136-.107C1.42 10.145.944 9.482.662 8.75l-.047-.135L.576 8.47c-.2-.82-.2-1.69 0-2.51l.039-.143.047-.135c.282-.73.758-1.392 1.378-1.91l.136-.106.116-.08c.662-.425 1.429-.715 2.22-.844l.154-.026L6.33 0 8 0z"/>
                        </svg>
                    </div>

                    <h3 class="fw-black text-dark mb-1">Quiz Score Summary</h3>
                    <div class="display-3 fw-black text-primary my-3">
                        <?= $quiz_results['score'] ?> / <?= $quiz_results['total'] ?>
                    </div>
                    <div class="h5 font-bold text-dark mb-4">
                        <?= $quiz_results['percent'] ?>% Success Rating
                    </div>

                    <div class="p-3 rounded-3 bg-light border border-light max-w-md mx-auto mb-4">
                        <?php if ($quiz_results['percent'] >= 70): ?>
                            <span class="text-success text-xs font-bold d-flex align-items-center justify-content-center gap-1">
                                <span class="w-2.5 h-2.5 bg-success rounded-circle"></span>
                                <span>Congratulations! You passed the assessment.</span>
                            </span>
                        <?php else: ?>
                            <span class="text-danger text-xs font-bold d-flex align-items-center justify-content-center gap-1">
                                <span class="w-2.5 h-2.5 bg-danger rounded-circle"></span>
                                <span>Passing score is 70% or higher. Keep studying!</span>
                            </span>
                        <?php endif; ?>
                    </div>

                    <div class="d-flex justify-content-center gap-2 mb-4">
                        <a href="quiz.php?course_id=<?= $course_id ?>" class="btn btn-outline-primary rounded-pill px-4 text-xs font-bold">
                            Retry Assessment
                        </a>
                        <a href="dashboard.php" class="btn btn-primary rounded-pill px-4 text-xs font-bold">
                            View Dashboard Profile
                        </a>
                    </div>

                    <hr class="my-4 border-slate-100">

                    <!-- Question Breakdown Details -->
                    <div class="text-start mt-4">
                        <h5 class="fw-extrabold text-dark mb-3">Syllabus Answers Feedback Review</h5>
                        <div class="space-y-4">
                            <?php foreach ($quiz_results['graded'] as $index => $item): ?>
                                <div class="p-3 border rounded-3 mb-3 <?= $item['is_correct'] ? 'border-success-subtle bg-success bg-opacity-5' : 'border-danger-subtle bg-danger bg-opacity-5' ?>">
                                    <h6 class="fw-bold text-dark text-xs mb-2">Q<?= $index + 1 ?>: <?= htmlspecialchars($item['question']) ?></h6>
                                    
                                    <div class="row g-2 text-[11px] text-muted mb-2">
                                        <div class="col-sm-6">A: <?= htmlspecialchars($item['option_a']) ?></div>
                                        <div class="col-sm-6">B: <?= htmlspecialchars($item['option_b']) ?></div>
                                        <div class="col-sm-6">C: <?= htmlspecialchars($item['option_c']) ?></div>
                                        <div class="col-sm-6">D: <?= htmlspecialchars($item['option_d']) ?></div>
                                    </div>

                                    <div class="text-xs">
                                        <span class="me-3">Your answer: <strong><?= $item['submitted'] ?: 'No Choice Selected' ?></strong></span>
                                        <span>Correct answer: <strong><?= $item['correct'] ?></strong></span>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>

                </div>
            <?php else: ?>
                <!-- Render Questions Form -->
                <?php if (empty($questions)): ?>
                    <div class="card shadow p-5 rounded-4 bg-white border border-light text-center">
                        <div class="text-muted mb-3">No questions have been configured for this course's final assessment quiz yet.</div>
                        <a href="course.php?id=<?= $course_id ?>" class="btn btn-outline-primary rounded-pill px-4 text-xs">Return to Syllabus</a>
                    </div>
                <?php else: ?>
                    <form id="quiz-submit-form" method="POST" action="quiz.php" class="space-y-4">
                        <input type="hidden" name="course_id" value="<?= $course_id ?>">

                        <?php foreach ($questions as $index => $q): ?>
                            <div class="card shadow-sm border p-4 rounded-4 bg-white mb-4 quiz-question-card" id="q_card_<?= $q['id'] ?>" style="transition: border-color 0.2s ease;">
                                <h5 class="fw-extrabold text-dark text-sm mb-3">
                                    Question <?= $index + 1 ?> of <?= count($questions) ?>:
                                </h5>
                                <p class="text-dark font-semibold text-xs mb-3"><?= htmlspecialchars($q['question']) ?></p>

                                <div class="space-y-2 text-xs">
                                    <!-- Choice A -->
                                    <div class="form-check p-2.5 border rounded-3 bg-light mb-2">
                                        <input class="form-check-input ms-0 me-2" type="radio" required name="answers[<?= $q['id'] ?>]" id="opt_a_<?= $q['id'] ?>" value="A">
                                        <label class="form-check-label w-100" style="cursor: pointer;" for="opt_a_<?= $q['id'] ?>">
                                            A) <?= htmlspecialchars($q['option_a']) ?>
                                        </label>
                                    </div>
                                    
                                    <!-- Choice B -->
                                    <div class="form-check p-2.5 border rounded-3 bg-light mb-2">
                                        <input class="form-check-input ms-0 me-2" type="radio" required name="answers[<?= $q['id'] ?>]" id="opt_b_<?= $q['id'] ?>" value="B">
                                        <label class="form-check-label w-100" style="cursor: pointer;" for="opt_b_<?= $q['id'] ?>">
                                            B) <?= htmlspecialchars($q['option_b']) ?>
                                        </label>
                                    </div>

                                    <!-- Choice C -->
                                    <div class="form-check p-2.5 border rounded-3 bg-light mb-2">
                                        <input class="form-check-input ms-0 me-2" type="radio" required name="answers[<?= $q['id'] ?>]" id="opt_c_<?= $q['id'] ?>" value="C">
                                        <label class="form-check-label w-100" style="cursor: pointer;" for="opt_c_<?= $q['id'] ?>">
                                            C) <?= htmlspecialchars($q['option_c']) ?>
                                        </label>
                                    </div>

                                    <!-- Choice D -->
                                    <div class="form-check p-2.5 border rounded-3 bg-light mb-2">
                                        <input class="form-check-input ms-0 me-2" type="radio" required name="answers[<?= $q['id'] ?>]" id="opt_d_<?= $q['id'] ?>" value="D">
                                        <label class="form-check-label w-100" style="cursor: pointer;" for="opt_d_<?= $q['id'] ?>">
                                            D) <?= htmlspecialchars($q['option_d']) ?>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>

                        <div class="mt-4 pt-2">
                            <button type="submit" name="submit_quiz" class="btn btn-premium-primary w-100 py-3 font-bold text-xs uppercase text-uppercase">
                                Submit Final Quiz Selection
                            </button>
                        </div>
                    </form>
                <?php endif; ?>
            <?php endif; ?>

        </div>
    </div>
</div>

<?php require_once 'footer.php'; ?>
