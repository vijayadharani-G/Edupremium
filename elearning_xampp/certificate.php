<?php
// certificate.php - Printable Graduation Credentials Diploma
require_once 'config.php';

// Auth Guard
if (!isset($_SESSION['user_id'])) {
    die("Access Denied. Please sign in to verify credentials.");
}

$user_id = $_SESSION['user_id'];
$user_name = $_SESSION['user_name'];
$course_id = isset($_GET['course_id']) ? (int)$_GET['course_id'] : 0;

if ($course_id <= 0) {
    die("Invalid request parameters.");
}

try {
    // 1. Fetch Course details
    $stmt = $pdo->prepare("SELECT * FROM courses WHERE id = ?");
    $stmt->execute([$course_id]);
    $course = $stmt->fetch();

    if (!$course) {
        die("Course syllabus not found.");
    }

    // 2. Count total lessons in course
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM lessons WHERE course_id = ?");
    $stmt->execute([$course_id]);
    $total_lessons = $stmt->fetchColumn();

    // 3. Count completed lessons by student
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM progress WHERE user_id = ? AND course_id = ?");
    $stmt->execute([$user_id, $course_id]);
    $completed_lessons = $stmt->fetchColumn();

    // 4. Verify 100% completion requirement
    if ($total_lessons <= 0 || $completed_lessons < $total_lessons) {
        die("Incomplete coursework logs. Please complete all video lectures inside this syllabus to qualify for your diploma.");
    }

    // 5. Query best quiz score
    $stmt = $pdo->prepare("SELECT MAX(score) AS max_score, total FROM quiz_scores WHERE user_id = ? AND course_id = ?");
    $stmt->execute([$user_id, $course_id]);
    $score_row = $stmt->fetch();
    $best_score = isset($score_row['max_score']) ? $score_row['max_score'] : 0;
    $total_questions = isset($score_row['total']) ? $score_row['total'] : 0;

} catch (PDOException $e) {
    die("Database Query Error: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Academic Credentials Diploma - <?= htmlspecialchars($user_name) ?></title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Inter:wght@400;500;600;700&family=JetBrains+Mono&display=swap" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">
    <style>
        body {
            background-color: #f1f5f9;
            font-family: 'Inter', sans-serif;
            padding: 3rem 1rem;
        }
        .certificate-outer {
            background: #ffffff;
            border: 2px solid #cbd5e1;
            padding: 1.5rem;
            border-radius: 1rem;
            box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
        }
        @media print {
            .no-print {
                display: none !important;
            }
            body {
                background: #ffffff;
                padding: 0;
            }
            .certificate-outer {
                border: none;
                box-shadow: none;
                padding: 0;
            }
        }
    </style>
</head>
<body onload="window.print()">

<div class="container max-w-3xl">
    
    <!-- Print toolbar -->
    <div class="no-print d-flex justify-content-between mb-4 bg-light p-3 rounded-3 border border-slate-200">
        <span class="text-xs font-semibold text-muted">High-fidelity diploma layout is active. Save as PDF in your print window.</span>
        <div>
            <button onclick="window.print()" class="btn btn-primary btn-sm rounded-pill px-3 font-bold text-xs me-2">Print Diploma</button>
            <button onclick="window.close()" class="btn btn-secondary btn-sm rounded-pill px-3 font-bold text-xs">Close</button>
        </div>
    </div>

    <!-- Diploma Frame container -->
    <div class="certificate-outer">
        <div class="certificate-container">
            
            <h5 class="text-uppercase tracking-widest text-muted font-bold text-xs mb-3">EduPremium Digital Credentials</h5>
            
            <h2 class="font-serif fw-black italic text-dark mb-4" style="font-family: 'Playfair Display', serif; font-size: 2.2rem;">
                Academic Degree Diploma
            </h2>
            
            <p class="text-muted text-xs mb-4">This credentials file hereby validates that</p>
            
            <h1 class="fw-black text-primary border-bottom border-light pb-2 mb-4 font-serif" style="font-family: 'Playfair Display', serif; font-size: 2.5rem;">
                <?= htmlspecialchars($user_name) ?>
            </h1>
            
            <p class="text-muted text-xs max-w-lg mx-auto mb-4 leading-relaxed">
                has successfully completed the structured academic coursework, playbacks, and self-evaluation quizzes to certify in the official syllabus domain:
            </p>
            
            <h3 class="fw-extrabold text-dark tracking-tight mb-4" style="font-size: 1.5rem;">
                <?= htmlspecialchars($course['title']) ?>
            </h3>
            
            <p class="text-muted text-xs mb-4">
                proving a high level of expertise in theoretical design, technical execution patterns, and structural operations.
            </p>

            <div class="row mt-5 pt-3 text-start align-items-center g-4">
                <div class="col-sm-4 text-center">
                    <span class="text-muted d-block text-[10px] uppercase font-bold text-uppercase">Certificate ID</span>
                    <span class="font-monospace text-xs text-dark" style="font-family: 'JetBrains Mono', monospace;">EP-<?= strtoupper(substr(md5($user_id . $course_id), 0, 10)) ?></span>
                </div>
                
                <div class="col-sm-4 text-center">
                    <div class="certificate-seal">
                        <span class="text-[10px] font-bold text-uppercase text-white">VERIFIED</span>
                    </div>
                </div>

                <div class="col-sm-4 text-center">
                    <span class="text-muted d-block text-[10px] uppercase font-bold text-uppercase">Graduation Date</span>
                    <span class="text-xs fw-bold text-dark"><?= date('F d, Y') ?></span>
                </div>
            </div>

            <div class="mt-4 pt-4 border-top border-light text-center text-[10px] text-muted font-bold uppercase tracking-wider" style="font-family: 'JetBrains Mono', monospace;">
                EduPremium Academic Registrar &bull; State Verified Digital Credential
            </div>

        </div>
    </div>

</div>

</body>
</html>
