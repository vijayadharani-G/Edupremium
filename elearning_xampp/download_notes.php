<?php
// download_notes.php - Printable PDF exporter for Study Notes
require_once 'config.php';

// Auth Guard
if (!isset($_SESSION['user_id'])) {
    die("Access Denied. Please sign in to the portal.");
}

$lesson_id = isset($_GET['lesson_id']) ? (int)$_GET['lesson_id'] : 0;
if ($lesson_id <= 0) {
    die("Invalid request parameters.");
}

try {
    $stmt = $pdo->prepare("SELECT l.*, c.title AS course_title FROM lessons l JOIN courses c ON l.course_id = c.id WHERE l.id = ?");
    $stmt->execute([$lesson_id]);
    $lesson = $stmt->fetch();

    if (!$lesson) {
        die("Lesson study notes not found.");
    }
} catch (PDOException $e) {
    die("Database failure: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Syllabus Notes - <?= htmlspecialchars($lesson['title']) ?></title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #ffffff;
            color: #1e293b;
            padding: 2rem;
        }
        .header-box {
            border-bottom: 3px double #e2e8f0;
            padding-bottom: 1.5rem;
            margin-bottom: 2rem;
        }
        .meta-text {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.75rem;
            color: #64748b;
        }
        .notes-body {
            font-size: 0.95rem;
            line-height: 1.7;
            color: #334155;
            white-space: pre-wrap;
        }
        @media print {
            .no-print {
                display: none !important;
            }
            body {
                padding: 0;
            }
        }
    </style>
</head>
<body onload="window.print()">

<div class="container max-w-3xl">
    <!-- Close / Print bar -->
    <div class="no-print d-flex justify-content-between mb-4 bg-light p-3 rounded-3 border">
        <span class="text-xs font-semibold text-muted">A printable layout is ready. Use 'Save to PDF' in your browser print window.</span>
        <div>
            <button onclick="window.print()" class="btn btn-primary btn-sm rounded-pill px-3 font-bold text-xs me-2">Print notes</button>
            <button onclick="window.close()" class="btn btn-secondary btn-sm rounded-pill px-3 font-bold text-xs">Close window</button>
        </div>
    </div>

    <!-- Printable Header -->
    <div class="header-box">
        <div class="d-flex justify-content-between align-items-baseline">
            <h5 class="text-primary fw-black text-uppercase tracking-wider">EduPremium Academy Portal</h5>
            <span class="meta-text">Verification Code: EP-<?= rand(100000, 999999) ?></span>
        </div>
        <hr class="my-2 text-muted">
        <div class="row mt-3 text-xs">
            <div class="col-sm-8">
                <span class="text-muted">Course syllabus:</span>
                <div class="fw-bold text-dark text-base mt-0.5"><?= htmlspecialchars($lesson['course_title']) ?></div>
            </div>
            <div class="col-sm-4 text-sm-start text-sm-end">
                <span class="text-muted">Chapter order:</span>
                <div class="fw-bold text-dark text-base mt-0.5">Lesson #<?= htmlspecialchars($lesson['order_num']) ?></div>
            </div>
        </div>
    </div>

    <!-- Lesson Title -->
    <h3 class="fw-extrabold text-dark mb-4"><?= htmlspecialchars($lesson['title']) ?></h3>

    <!-- Lesson Content -->
    <div class="notes-body">
        <?= htmlspecialchars($lesson['content']) ?>
    </div>

    <!-- Printable Footer -->
    <div class="mt-5 pt-4 border-top text-center text-muted text-xs meta-text">
        EduPremium Academic Portal &bull; Generated on <?= date('Y-m-d H:i:s') ?> UTC &bull; Verified Digital Student Copy
    </div>
</div>

</body>
</html>
