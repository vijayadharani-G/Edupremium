<?php
// login.php - Login authentication module for Students & Admins
require_once 'config.php';

// If user already logged in, redirect them
if (isset($_SESSION['user_id'])) {
    header("Location: dashboard.php");
    exit();
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    if (!empty($email) && !empty($password)) {
        try {
            $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['password'])) {
                // Register session variables
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_name'] = $user['name'];
                $_SESSION['user_email'] = $user['email'];
                $_SESSION['user_role'] = $user['role'];

                $_SESSION['flash_message'] = "Welcome back, " . htmlspecialchars($user['name']) . "!";
                $_SESSION['flash_type'] = "success";

                if ($user['role'] === 'admin') {
                    header("Location: admin.php");
                } else {
                    header("Location: dashboard.php");
                }
                exit();
            } else {
                $error = "Invalid email address or security password.";
            }
        } catch (PDOException $e) {
            $error = "System Query Failure: " . $e->getMessage();
        }
    } else {
        $error = "Please fill in all requested fields.";
    }
}

require_once 'header.php';
?>

<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-md-5">
            <div class="card shadow border-slate-100 p-4 rounded-4 bg-white">
                <div class="text-center mb-4">
                    <h3 class="fw-extrabold text-dark">Portal Authentication</h3>
                    <p class="text-muted text-xs">Access your personal student track and academic milestones.</p>
                </div>

                <?php if (!empty($error)): ?>
                    <div class="alert alert-danger text-xs py-2.5 rounded-3 mb-3" role="alert">
                        <?= htmlspecialchars($error) ?>
                    </div>
                <?php endif; ?>

                <form method="POST" action="login.php" class="needs-validation" novalidate>
                    <div class="mb-3">
                        <label class="form-label text-xs fw-extrabold text-muted text-uppercase">Email Address</label>
                        <input type="email" name="email" required class="form-control text-xs py-2.5 bg-light border-0" placeholder="student@edupremium.com">
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label text-xs fw-extrabold text-muted text-uppercase">Security Password</label>
                        <input type="password" name="password" required class="form-control text-xs py-2.5 bg-light border-0" placeholder="student123">
                    </div>

                    <button type="submit" class="btn btn-premium-primary w-100 py-2.5 font-bold text-xs uppercase text-uppercase mt-2">
                        Sign In to Portal
                    </button>
                </form>

                <div class="text-center mt-3">
                    <p class="text-xs text-muted">Don't have an account? <a href="register.php" class="font-semibold">Register Student</a></p>
                </div>

                <!-- Helper Credentials Cheat Sheet Box -->
                <div class="bg-light p-3 rounded-3 mt-4 border border-light">
                    <h6 class="text-xs font-bold text-dark text-uppercase mb-2 flex align-items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                        </svg>
                        <span>Sample Account Logins</span>
                    </h6>
                    <div class="text-[10px] text-muted space-y-1">
                        <div><strong>Student Access:</strong> email: <code>student@edupremium.com</code> | password: <code>student123</code></div>
                        <div><strong>Admin Access:</strong> email: <code>admin@edupremium.com</code> | password: <code>admin123</code></div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>

<?php require_once 'footer.php'; ?>
