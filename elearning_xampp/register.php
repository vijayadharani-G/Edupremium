<?php
// register.php - Student Registration Module
require_once 'config.php';

if (isset($_SESSION['user_id'])) {
    header("Location: dashboard.php");
    exit();
}

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);
    $confirm_password = trim($_POST['confirm_password']);

    if (!empty($name) && !empty($email) && !empty($password) && !empty($confirm_password)) {
        if ($password !== $confirm_password) {
            $error = "Passwords do not match. Please verify your entries.";
        } elseif (strlen($password) < 6) {
            $error = "Password must be at least 6 characters in length.";
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $error = "Please enter a valid email address.";
        } else {
            try {
                // Check if email already exists
                $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
                $stmt->execute([$email]);
                if ($stmt->fetch()) {
                    $error = "This email address is already registered on our portal.";
                } else {
                    // Safe encryption hashing of password
                    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
                    
                    // Insert into users table
                    $insert_stmt = $pdo->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'student')");
                    $insert_stmt->execute([$name, $email, $hashed_password]);

                    $_SESSION['flash_message'] = "Registration completed successfully! Please log in below.";
                    $_SESSION['flash_type'] = "success";
                    header("Location: login.php");
                    exit();
                }
            } catch (PDOException $e) {
                $error = "Registration Database Failure: " . $e->getMessage();
            }
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
                    <h3 class="fw-extrabold text-dark">Student Registration</h3>
                    <p class="text-muted text-xs">Register your profile to enroll in courses and earn certified badges.</p>
                </div>

                <?php if (!empty($error)): ?>
                    <div class="alert alert-danger text-xs py-2.5 rounded-3 mb-3" role="alert">
                        <?= htmlspecialchars($error) ?>
                    </div>
                <?php endif; ?>

                <form method="POST" action="register.php" class="needs-validation" novalidate>
                    <div class="mb-3">
                        <label class="form-label text-xs fw-extrabold text-muted text-uppercase">Your Full Name</label>
                        <input type="text" name="name" required class="form-control text-xs py-2.5 bg-light border-0" placeholder="Alex Mercer" value="<?= isset($_POST['name']) ? htmlspecialchars($_POST['name']) : '' ?>">
                    </div>

                    <div class="mb-3">
                        <label class="form-label text-xs fw-extrabold text-muted text-uppercase">Email Address</label>
                        <input type="email" name="email" required class="form-control text-xs py-2.5 bg-light border-0" placeholder="alex@mercer.com" value="<?= isset($_POST['email']) ? htmlspecialchars($_POST['email']) : '' ?>">
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label text-xs fw-extrabold text-muted text-uppercase">Create Password</label>
                        <input type="password" name="password" required class="form-control text-xs py-2.5 bg-light border-0" placeholder="minimum 6 characters">
                    </div>

                    <div class="mb-3">
                        <label class="form-label text-xs fw-extrabold text-muted text-uppercase">Confirm Password</label>
                        <input type="password" name="confirm_password" required class="form-control text-xs py-2.5 bg-light border-0" placeholder="re-enter password">
                    </div>

                    <button type="submit" class="btn btn-premium-primary w-100 py-2.5 font-bold text-xs uppercase text-uppercase mt-2">
                        Create Student Account
                    </button>
                </form>

                <div class="text-center mt-3">
                    <p class="text-xs text-muted">Already registered on our portal? <a href="login.php" class="font-semibold">Sign In Here</a></p>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once 'footer.php'; ?>
