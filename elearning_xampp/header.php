<?php
// header.php - Global navigation and header structure
require_once 'config.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EduPremium - XAMPP E-Learning Portal</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Google Fonts Inter & JetBrains Mono -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <!-- Custom Style -->
    <link href="css/style.css" rel="stylesheet">
</head>
<body class="d-flex flex-column min-vh-100">

<!-- Navigation Bar -->
<nav class="navbar navbar-expand-lg sticky-top">
    <div class="container">
        <a class="navbar-brand text-primary d-flex align-items-center gap-2" href="index.php">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" class="bi bi-journal-bookmark-fill" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M6 1h6v7a.5.5 0 0 1-.757.429L9 7.083 6.757 8.43A.5.5 0 0 1 6 8V1z"/>
                <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
                <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
            </svg>
            <span>EduPremium</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="mainNavbar">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link font-semibold text-dark px-3" href="index.php">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link font-semibold text-dark px-3" href="courses.php">Course Syllabus</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link font-semibold text-dark px-3" href="contact.php">Academic Help Center</a>
                </li>
            </ul>
            <div class="d-flex align-items-center gap-2">
                <?php if (isset($_SESSION['user_id'])): ?>
                    <a href="dashboard.php" class="btn btn-outline-primary rounded-pill px-4 text-xs font-semibold me-2">
                        My Dashboard
                    </a>
                    <?php if ($_SESSION['user_role'] === 'admin'): ?>
                        <a href="admin.php" class="btn btn-dark rounded-pill px-4 text-xs font-semibold me-2">
                            Admin Portal
                        </a>
                    <?php endif; ?>
                    <div class="dropdown">
                        <button class="btn btn-light rounded-pill dropdown-toggle d-flex align-items-center gap-2 border" type="button" id="userMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                            <span class="badge bg-primary rounded-circle p-1 d-inline-block" style="width: 10px; height: 10px;">&nbsp;</span>
                            <span class="font-bold text-xs"><?= htmlspecialchars($_SESSION['user_name']) ?></span>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end shadow border-slate-100 rounded-3 mt-2" aria-labelledby="userMenuButton">
                            <li><a class="dropdown-item py-2 text-xs font-semibold" href="dashboard.php">My Profile</a></li>
                            <li><hr class="dropdown-divider my-1"></li>
                            <li><a class="dropdown-item py-2 text-xs font-semibold text-danger" href="logout.php">Sign Out</a></li>
                        </ul>
                    </div>
                <?php else: ?>
                    <a href="login.php" class="btn btn-outline-secondary rounded-pill px-4 text-xs font-semibold">Sign In</a>
                    <a href="register.php" class="btn btn-premium-primary px-4 text-xs">Register</a>
                <?php endif; ?>
            </div>
        </div>
    </div>
</nav>

<main class="flex-grow-1">
<?php
// Display Flash Alerts if any
if (isset($_SESSION['flash_message'])) {
    $type = isset($_SESSION['flash_type']) ? $_SESSION['flash_type'] : 'info';
    echo '<div class="container mt-4">
            <div class="alert alert-' . $type . ' alert-dismissible fade show rounded-3 shadow-sm" role="alert">
                ' . $_SESSION['flash_message'] . '
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          </div>';
    unset($_SESSION['flash_message']);
    unset($_SESSION['flash_type']);
}
?>
