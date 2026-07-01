<?php
// contact.php - Academic Help Center & Support Tickets
require_once 'config.php';

$success_msg = '';
$error_msg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $subject = trim($_POST['subject']);
    $message = trim($_POST['message']);

    if (!empty($name) && !empty($email) && !empty($subject) && !empty($message)) {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $error_msg = "Please enter a valid email address.";
        } else {
            try {
                $stmt = $pdo->prepare("INSERT INTO contact_messages (name, email, subject, message, status) VALUES (?, ?, ?, ?, 'unread')");
                $stmt->execute([$name, $email, $subject, $message]);
                
                $success_msg = "Your support ticket has been dispatched successfully! Our team will respond shortly.";
                // Clear post inputs
                $_POST = array();
            } catch (PDOException $e) {
                $error_msg = "Support Dispatch Failure: " . $e->getMessage();
            }
        }
    } else {
        $error_msg = "Please fill in all requested fields.";
    }
}

require_once 'header.php';
?>

<div class="bg-light py-5 border-bottom">
    <div class="container py-3">
        <span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 px-3 py-1.5 rounded-pill text-xs font-bold text-uppercase mb-2">
            Academic Help Center
        </span>
        <h1 class="fw-extrabold text-dark tracking-tight mb-2">Connect With Academic Registrar</h1>
        <p class="text-muted text-xs sm:text-sm mb-0">Submit inquiry tickets, report database access errors, or message facilitators directly.</p>
    </div>
</div>

<div class="container py-5">
    <div class="row g-5">
        
        <!-- Left Column: FAQ & Contact Details -->
        <div class="col-lg-5 space-y-4">
            
            <!-- Quick office coordinates -->
            <div class="bg-white p-4 border rounded-4 shadow-sm">
                <h5 class="fw-extrabold text-dark border-bottom pb-2 mb-3">Academic Headquarters</h5>
                <div class="text-xs text-muted space-y-3">
                    <div class="d-flex align-items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-geo-alt-fill text-primary" viewBox="0 0 16 16">
                            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                        </svg>
                        <span>IIT Madras Research Park, Kanagam Rd, Taramani, Chennai, India</span>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-envelope-at-fill text-primary" viewBox="0 0 16 16">
                            <path d="M2 2A2 2 0 0 0 .05 3.555L8 8.414l7.95-4.859A2 2 0 0 0 14 2H2Zm-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4l-8 4.899L0 4ZM14.39 12.18c-.37-.308-.73-.591-.73-1.026v-1.12c0-.522.424-.946.946-.946H15.5v3.092h-.11c-.37 0-.63-.308-1-.026Z"/>
                        </svg>
                        <span>support@edupremium.com</span>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-telephone-fill text-primary" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                        </svg>
                        <span>+91 44 6663 9001</span>
                    </div>
                </div>
            </div>

            <!-- FAQ Accordion -->
            <div class="faq-accordion mt-4" id="faqAccordion">
                <h5 class="fw-extrabold text-dark mb-3">Frequently Asked Inquiries</h5>
                
                <div class="accordion" id="faqItems">
                    <!-- Q1 -->
                    <div class="accordion-item shadow-sm">
                        <h2 class="accordion-header" id="headingOne">
                            <button class="accordion-button collapsed text-xs font-bold text-dark" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                                How do I download my course credentials diploma?
                            </button>
                        </h2>
                        <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#faqItems">
                            <div class="accordion-body text-xs text-muted leading-relaxed">
                                Complete 100% of the lessons in your target course. An automatic "Print Diploma" button will materialize in your student dashboard, which will open a customizable certificate sheet and prompt saving to PDF directly.
                            </div>
                        </div>
                    </div>

                    <!-- Q2 -->
                    <div class="accordion-item shadow-sm mt-2">
                        <h2 class="accordion-header" id="headingTwo">
                            <button class="accordion-button collapsed text-xs font-bold text-dark" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                How can I configure the SQL database in XAMPP?
                            </button>
                        </h2>
                        <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#faqItems">
                            <div class="accordion-body text-xs text-muted leading-relaxed">
                                Open phpMyAdmin in your browser (`http://localhost/phpmyadmin`), click "New" to create a database named `elearning_db`, click "Import", select the `database.sql` file provided inside this project directory, and click "Go" or "Import".
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <!-- Right Column: Interactive Dispatch Form -->
        <div class="col-lg-7">
            <div class="bg-white p-4 border rounded-4 shadow-sm">
                <h4 class="fw-extrabold text-dark mb-1">Academic Ticket Dispatch</h4>
                <p class="text-xs text-muted mb-4">Your tickets are registered immediately in our SQL database for administrative review.</p>

                <?php if (!empty($success_msg)): ?>
                    <div class="alert alert-success text-xs py-2.5 rounded-3 mb-4" role="alert">
                        <?= htmlspecialchars($success_msg) ?>
                    </div>
                <?php endif; ?>

                <?php if (!empty($error_msg)): ?>
                    <div class="alert alert-danger text-xs py-2.5 rounded-3 mb-4" role="alert">
                        <?= htmlspecialchars($error_msg) ?>
                    </div>
                <?php endif; ?>

                <form method="POST" action="contact.php" class="needs-validation" novalidate>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label text-[10px] fw-extrabold text-muted text-uppercase">Full Name</label>
                            <input type="text" name="name" required class="form-control text-xs py-2.5 bg-light border-0" placeholder="Alex Mercer" value="<?= isset($_POST['name']) ? htmlspecialchars($_POST['name']) : '' ?>">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-[10px] fw-extrabold text-muted text-uppercase">Email Address</label>
                            <input type="email" name="email" required class="form-control text-xs py-2.5 bg-light border-0" placeholder="alex@mercer.com" value="<?= isset($_POST['email']) ? htmlspecialchars($_POST['email']) : '' ?>">
                        </div>
                    </div>

                    <div class="mb-3 mt-3">
                        <label class="form-label text-[10px] fw-extrabold text-muted text-uppercase">Ticket Subject</label>
                        <input type="text" name="subject" required class="form-control text-xs py-2.5 bg-light border-0" placeholder="Course syllabus inquiries" value="<?= isset($_POST['subject']) ? htmlspecialchars($_POST['subject']) : '' ?>">
                    </div>

                    <div class="mb-3">
                        <label class="form-label text-[10px] fw-extrabold text-muted text-uppercase">Message Description</label>
                        <textarea name="message" rows="5" required class="form-control text-xs py-2.5 bg-light border-0" placeholder="State your academic or technical inquiry in detail..."><?= isset($_POST['message']) ? htmlspecialchars($_POST['message']) : '' ?></textarea>
                    </div>

                    <button type="submit" class="btn btn-premium-primary w-100 py-2.5 font-bold text-xs uppercase text-uppercase">
                        Dispatch Help Ticket
                    </button>
                </form>

            </div>
        </div>

    </div>
</div>

<?php require_once 'footer.php'; ?>
