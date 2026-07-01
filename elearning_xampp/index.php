<?php
// index.php - E-Learning System Home Landing Page
require_once 'header.php';

// Fetch courses to display on landing
try {
    $stmt = $pdo->query("SELECT * FROM courses LIMIT 3");
    $featured_courses = $stmt->fetchAll();
} catch (PDOException $e) {
    $featured_courses = [];
}
?>

<!-- Redesigned Premium Hero Section -->
<div class="relative bg-light py-5 sm:py-24 border-bottom border-light" id="home-hero">
    <div class="container py-4">
        <div class="row align-items-center g-5">
            <!-- Hero Left Content -->
            <div class="col-lg-6 space-y-4 text-start">
                <span class="inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill text-xs font-bold bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 mb-3 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-star-fill text-warning animate-pulse" viewBox="0 0 16 16">
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                    </svg>
                    <span>Accredited Academic Digital Portal</span>
                </span>
                
                <h1 class="display-4 fw-black text-dark tracking-tight leading-tight mb-3">
                    Master Modern Web <br>
                    <span class="text-primary bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">Engineering</span> With Precision.
                </h1>
                
                <p class="lead text-muted mb-4 max-w-xl">
                    EduPremium delivers high-fidelity interactive dashboards, expert-guided video content, extensive documentation notes, and automated previous-year exam prep. Establish your user login credentials, enroll in your target domain, and unlock a fully synchronized academic path.
                </p>

                <!-- Interactive Action Links -->
                <div class="d-flex flex-wrap gap-3">
                    <a href="courses.php" class="btn btn-premium-primary px-4 py-3 text-sm tracking-wide">
                        Browse 15+ Advanced Courses
                    </a>
                    <a href="contact.php" class="btn btn-outline-dark rounded-pill px-4 py-3 text-sm tracking-wide">
                        Our Portal Mission
                    </a>
                </div>
            </div>
            
            <!-- Hero Right Image Frame -->
            <div class="col-lg-6 mt-5 mt-lg-0 text-center">
                <div class="position-relative d-inline-block">
                    <div class="bg-white border border-light rounded-4 p-3 shadow-lg max-w-lg">
                        <img 
                          src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80" 
                          alt="Premium Interactive E-Learning Portal dashboard preview" 
                          class="img-fluid rounded-3"
                          style="max-height: 340px; width: 100%; object-fit: cover;"
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Quick Stats Banner with icons -->
<div class="container py-5" id="stats-banner">
    <div class="row g-4 justify-content-center bg-white p-4 rounded-4 shadow-sm border border-light mx-1">
        <div class="col-6 col-md-3 text-center py-2">
            <h3 class="fw-black text-primary mb-1">15+</h3>
            <div class="text-xs fw-bold text-muted uppercase tracking-wider text-uppercase">Expert Syllabus Courses</div>
        </div>
        <div class="col-6 col-md-3 text-center py-2 border-start border-light">
            <h3 class="fw-black text-dark mb-1">12,500+</h3>
            <div class="text-xs fw-bold text-muted uppercase tracking-wider text-uppercase">Registered Graduates</div>
        </div>
        <div class="col-6 col-md-3 text-center py-2 border-start border-light">
            <h3 class="fw-black text-dark mb-1">100%</h3>
            <div class="text-xs fw-bold text-muted uppercase tracking-wider text-uppercase">Verifiable Credentials</div>
        </div>
        <div class="col-6 col-md-3 text-center py-2 border-start border-light">
            <h3 class="fw-black text-success mb-1">Real-time</h3>
            <div class="text-xs fw-bold text-muted uppercase tracking-wider text-uppercase">Responsive Studio</div>
        </div>
    </div>
</div>

<!-- Featured Courses Catalogue -->
<div class="bg-light py-5 border-top border-bottom" id="tracks-catalogue">
    <div class="container py-4">
        
        <!-- Section Title -->
        <div class="text-center max-w-3xl mx-auto mb-5">
            <span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 px-3 py-1.5 rounded-pill text-xs font-bold text-uppercase mb-2">
                Comprehensive Academic Pillars
            </span>
            <h2 class="fw-extrabold text-dark tracking-tight leading-none">
                Explore Advanced Professional Domains
            </h2>
            <p class="text-muted text-sm mt-2 max-w-xl mx-auto">
                Our dynamic system covers multiple technical dimensions. Register to enroll in individual courses and access tailored videos, interactive previous-year quiz tests, and digital PDF downloads.
            </p>
        </div>

        <!-- Courses Grid -->
        <div class="row g-4 mt-2">
            <?php if (!empty($featured_courses)): ?>
                <?php foreach ($featured_courses as $course): ?>
                    <div class="col-md-4">
                        <div class="card card-premium h-100 shadow-sm">
                            <img src="<?= htmlspecialchars($course['image']) ?>" class="card-img-top" alt="<?= htmlspecialchars($course['title']) ?>" style="height: 200px; object-fit: cover;">
                            <div class="card-body d-flex flex-column justify-content-between p-4">
                                <div>
                                    <span class="badge bg-primary text-white text-xs px-2.5 py-1 rounded-pill mb-2 text-uppercase"><?= htmlspecialchars($course['category']) ?></span>
                                    <h5 class="card-title fw-bold text-dark mb-2"><?= htmlspecialchars($course['title']) ?></h5>
                                    <p class="card-text text-muted text-xs leading-relaxed mb-4"><?= htmlspecialchars(substr($course['description'], 0, 120)) ?>...</p>
                                </div>
                                <a href="course.php?id=<?= $course['id'] ?>" class="btn btn-outline-primary rounded-pill w-100 font-bold text-xs py-2 mt-2">
                                    Explore Course Syllabus
                                </a>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <!-- Fallback offline mock values if Database is not populated yet -->
                <div class="col-md-4">
                    <div class="card card-premium h-100 shadow-sm">
                        <img src="https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80" class="card-img-top" alt="Web Architecture" style="height: 200px; object-fit: cover;">
                        <div class="card-body p-4">
                            <span class="badge bg-primary text-white text-xs px-2.5 py-1 rounded mb-2">Web Development</span>
                            <h5 class="card-title fw-bold text-dark">Web Application Architecture</h5>
                            <p class="card-text text-muted text-xs">Learn modular layouts, responsive containers, CSS configurations, and dynamic document objects.</p>
                            <a href="login.php" class="btn btn-outline-primary rounded-pill w-100 font-bold text-xs py-2 mt-3">Register to Enroll</a>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card card-premium h-100 shadow-sm">
                        <img src="https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80" class="card-img-top" alt="MySQL Databases" style="height: 200px; object-fit: cover;">
                        <div class="card-body p-4">
                            <span class="badge bg-success text-white text-xs px-2.5 py-1 rounded mb-2">Databases</span>
                            <h5 class="card-title fw-bold text-dark">Relational DBMS & MySQL</h5>
                            <p class="card-text text-muted text-xs">Design structural schemas, foreign constraints, indexing keys, and optimize structured queries.</p>
                            <a href="login.php" class="btn btn-outline-primary rounded-pill w-100 font-bold text-xs py-2 mt-3">Register to Enroll</a>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card card-premium h-100 shadow-sm">
                        <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80" class="card-img-top" alt="PHP Programming" style="height: 200px; object-fit: cover;">
                        <div class="card-body p-4">
                            <span class="badge bg-warning text-dark text-xs px-2.5 py-1 rounded mb-2">Backend Programming</span>
                            <h5 class="card-title fw-bold text-dark">Server-Side Logic & PHP</h5>
                            <p class="card-text text-muted text-xs">Integrate safe Object Oriented Controllers, session cookies, and secure password validation.</p>
                            <a href="login.php" class="btn btn-outline-primary rounded-pill w-100 font-bold text-xs py-2 mt-3">Register to Enroll</a>
                        </div>
                    </div>
                </div>
            <?php endif; ?>
        </div>

    </div>
</div>

<!-- Meet Our Academic Faculty Section -->
<div class="bg-white py-5" id="academic-faculty">
    <div class="container py-4">
        
        <div class="text-center max-w-3xl mx-auto mb-5">
            <span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 px-3 py-1.5 rounded-pill text-xs font-bold text-uppercase mb-2">
                Expert Facilitator Core
            </span>
            <h2 class="fw-extrabold text-dark tracking-tight leading-none">
                Meet Our Academic Faculty
            </h2>
            <p class="text-muted text-sm mt-2">
                Learn from world-class computer science authors, senior software architects, and SQL coordinators.
            </p>
        </div>

        <div class="row g-4 mt-2">
            <div class="col-md-4 text-center">
                <div class="bg-white p-4 rounded-3 border border-light shadow-sm">
                    <img 
                      class="rounded-circle mb-3 object-cover" 
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80" 
                      alt="Dr. Priya Ramasamy"
                      width="100" height="100"
                    >
                    <h5 class="fw-bold mb-1">Dr. Priya Ramasamy</h5>
                    <div class="text-primary text-xs font-semibold text-uppercase mb-3">Head of Web Engineering</div>
                    <p class="text-muted text-xs lh-relaxed">Over 12 years of core development experience. Dr. Priya oversees our interactive frontend architectures, curriculum pathways, and UX templates.</p>
                    <span class="badge bg-light text-primary font-bold text-[10px] border px-2.5 py-1">PhD - Stanford</span>
                </div>
            </div>

            <div class="col-md-4 text-center">
                <div class="bg-white p-4 rounded-3 border border-light shadow-sm">
                    <img 
                      class="rounded-circle mb-3 object-cover" 
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80" 
                      alt="Prof. S. Rajesh"
                      width="100" height="100"
                    >
                    <h5 class="fw-bold mb-1">Prof. S. Rajesh</h5>
                    <div class="text-primary text-xs font-semibold text-uppercase mb-3">Relational DB Coordinator</div>
                    <p class="text-muted text-xs lh-relaxed">Specialist in large-scale database clusters, normalized schemas, and query compilers. Prof. Rajesh guides our MySQL exam modules.</p>
                    <span class="badge bg-light text-primary font-bold text-[10px] border px-2.5 py-1">M.Tech - IIT Madras</span>
                </div>
            </div>

            <div class="col-md-4 text-center">
                <div class="bg-white p-4 rounded-3 border border-light shadow-sm">
                    <img 
                      class="rounded-circle mb-3 object-cover" 
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80" 
                      alt="Dr. Elena Rostova"
                      width="100" height="100"
                    >
                    <h5 class="fw-bold mb-1">Dr. Elena Rostova</h5>
                    <div class="text-primary text-xs font-semibold text-uppercase mb-3">Senior Server Developer</div>
                    <p class="text-muted text-xs lh-relaxed">Author of 4 international textbooks on cloud APIs, server caching layers, and high-performance server architectures.</p>
                    <span class="badge bg-light text-primary font-bold text-[10px] border px-2.5 py-1">PhD - MIT</span>
                </div>
            </div>
        </div>

    </div>
</div>

<!-- Bottom Call to Action banner -->
<div class="bg-secondary-gradient text-white py-5 text-center position-relative overflow-hidden" id="home-courses-cta">
    <div class="container py-4 relative z-10">
        <span class="text-primary text-xs fw-bold uppercase tracking-widest mb-2 d-block">Join the Academic Community</span>
        <h2 class="fw-black text-white tracking-tight mb-3">Ready to Accelerate Your Academic Study Track?</h2>
        <p class="text-white-50 text-sm max-w-xl mx-auto mb-4">
            Sign up for an account, register your custom student profile, choose your target study syllabus, and print your verified graduation certificate.
        </p>
        <div class="d-flex justify-content-center gap-3">
            <a href="courses.php" class="btn btn-premium-primary px-4 py-2 text-xs">Browse Syllabus</a>
            <a href="register.php" class="btn btn-outline-light rounded-pill px-4 py-2 text-xs">Create Account</a>
        </div>
    </div>
</div>

<?php require_once 'footer.php'; ?>
