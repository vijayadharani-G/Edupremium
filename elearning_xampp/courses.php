<?php
// courses.php - Course Syllabus Catalog
require_once 'header.php';

// Fetch all courses
try {
    $search = isset($_GET['q']) ? trim($_GET['q']) : '';
    if (!empty($search)) {
        $stmt = $pdo->prepare("SELECT * FROM courses WHERE title LIKE ? OR description LIKE ? OR category LIKE ?");
        $stmt->execute(["%$search%", "%$search%", "%$search%"]);
    } else {
        $stmt = $pdo->query("SELECT * FROM courses ORDER BY category ASC");
    }
    $courses = $stmt->fetchAll();
} catch (PDOException $e) {
    $courses = [];
}
?>

<div class="bg-light py-5 border-bottom">
    <div class="container py-3">
        <div class="row align-items-center justify-content-between">
            <div class="col-md-6">
                <h1 class="fw-extrabold text-dark tracking-tight mb-2">Technical Syllabus Courses</h1>
                <p class="text-muted text-sm mb-0">Explore our dynamic learning paths. Register a free account to track milestones, take interactive previous-year quiz tests, and download PDF notes.</p>
            </div>
            
            <!-- Search bar -->
            <div class="col-md-5 mt-3 mt-md-0">
                <form method="GET" action="courses.php" class="d-flex gap-2">
                    <input type="text" name="q" value="<?= htmlspecialchars(isset($_GET['q']) ? $_GET['q'] : '') ?>" class="form-control rounded-pill text-xs px-3 bg-white" placeholder="Search courses (e.g. PHP, SQL)...">
                    <button type="submit" class="btn btn-primary rounded-pill px-4 text-xs font-bold">Search</button>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="container py-5">
    <?php if (empty($courses)): ?>
        <div class="text-center py-5">
            <div class="text-muted mb-3">No courses matching your criteria were found.</div>
            <a href="courses.php" class="btn btn-outline-primary rounded-pill px-4 text-xs">Clear Filter</a>
        </div>
    <?php else: ?>
        <div class="row g-4">
            <?php foreach ($courses as $course): ?>
                <div class="col-md-4">
                    <div class="card card-premium h-100 shadow-sm d-flex flex-column justify-content-between">
                        <div>
                            <img src="<?= htmlspecialchars($course['image']) ?>" class="card-img-top" alt="<?= htmlspecialchars($course['title']) ?>" style="height: 180px; object-fit: cover;">
                            <div class="p-4">
                                <span class="badge bg-primary text-white text-xs px-2.5 py-1 rounded-pill mb-2 text-uppercase"><?= htmlspecialchars($course['category']) ?></span>
                                <h5 class="fw-bold text-dark mb-2"><?= htmlspecialchars($course['title']) ?></h5>
                                <p class="text-muted text-xs leading-relaxed mb-0"><?= htmlspecialchars($course['description']) ?></p>
                            </div>
                        </div>
                        <div class="px-4 pb-4">
                            <hr class="my-3 border-slate-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="text-[10px] text-muted font-bold text-uppercase">Self-Paced Track</span>
                                <a href="course.php?id=<?= $course['id'] ?>" class="btn btn-premium-primary px-4 py-2 text-xs">
                                    View Syllabus
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>

<?php require_once 'footer.php'; ?>
