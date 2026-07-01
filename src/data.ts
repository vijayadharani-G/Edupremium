import { Course } from "./types";

export const COURSES: Course[] = [
  {
    id: 1,
    title: "Full-Stack Web Development Masterclass",
    shortDescription: "Master HTML, CSS, JavaScript, PHP, and MySQL by building real-world projects from scratch.",
    description: "Go from absolute beginner to professional developer. You will learn the entire stack—from building sleek user interfaces with HTML, CSS, and Bootstrap, to developing dynamic server-side scripts with PHP, and managing relational databases with MySQL.",
    category: "Development",
    difficulty: "Beginner to Intermediate",
    duration: "42 Hours",
    rating: 4.8,
    enrollmentsCount: 12540,
    coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    author: "Dr. Sarah Mitchell",
    features: [
      "Access to complete codebase & lecture notes",
      "Interactive coding challenge questions",
      "Step-by-step guidance on setting up XAMPP locally",
      "Professional Certificate upon course completion"
    ],
    lessons: [
      {
        id: 101,
        courseId: 1,
        title: "Introduction to Web Foundations & HTML5",
        duration: "45 Mins",
        videoUrl: "https://www.youtube.com/embed/pQN-pnXPaVg",
        imageUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80",
        notes: `### Lesson 1: Welcome to Full-Stack Web Development!

In this first lesson, we will lay down the foundational bricks of the World Wide Web.

#### What is HTML?
HTML stands for **HyperText Markup Language**. It is the standard markup language used to create the skeletal structure of web pages.

#### Essential HTML5 Tags:
1. \`<!DOCTYPE html>\` - Declares the document type and HTML version.
2. \`<html>\` - The root element that wraps all content on the page.
3. \`<head>\` - Contains metadata, document title, character sets, and styles.
4. \`<body>\` - Contains the visible content of the webpage.
5. Heading Tags (\`<h1>\` to \`<h6>\`) - Define headings, with \`<h1>\` being the most important.
6. Paragraphs (\`<p>\`) - Used to write body text.
7. Anchors (\`<a href="...">\`) - Define hyperlinks to connect webpages.

#### Basic Page Structure Example:
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My First Webpage</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>This is my first paragraph in HTML5.</p>
</body>
</html>
\`\`\`

Review the markup above, try to write it in a text editor, and open it in your browser! Let's move to the next lesson to style it beautifully.`,
        orderIndex: 1
      },
      {
        id: 102,
        courseId: 1,
        title: "Styling with Modern CSS3 & Bootstrap",
        duration: "55 Mins",
        videoUrl: "https://www.youtube.com/embed/1Rs2ND1RYYc",
        imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
        notes: `### Lesson 2: Elevating Design with CSS3 & Bootstrap

Plain HTML is functional, but CSS3 makes it gorgeous. Bootstrap takes it further by giving us pre-styled responsive components!

#### Core CSS Principles:
- **Selectors**: Target HTML elements (e.g., \`.class-name\`, \`#id-name\`, \`p\`).
- **The Box Model**: Composed of Margin, Border, Padding, and Content. Understanding this is key to spacing!
- **Flexbox**: A powerful one-dimensional layout model to arrange items in rows or columns easily.

#### What is Bootstrap?
Bootstrap is the world's most popular front-end open-source toolkit. It features a responsive **12-column grid system**, extensive prebuilt components, and powerful JavaScript plugins.

#### Implementing Bootstrap:
Include the Bootstrap CDN link in the \`<head>\` of your HTML document:
\`\`\`html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
\`\`\`

#### Responsive Grid Example:
\`\`\`html
<div class="container text-center">
  <div class="row">
    <div class="col-md-6 col-lg-4 bg-primary text-white p-3">Column 1</div>
    <div class="col-md-6 col-lg-4 bg-secondary text-white p-3">Column 2</div>
    <div class="col-md-12 col-lg-4 bg-dark text-white p-3">Column 3</div>
  </div>
</div>
\`\`\`

With these utilities, your website instantly becomes fully mobile-friendly. Next, we will add behavior with JavaScript!`,
        orderIndex: 2
      }
    ]
  },
  {
    id: 2,
    title: "Modern UI/UX Design & Figma Fundamentals",
    shortDescription: "Master digital interface design, user personas, layout grids, wireframes, and prototypes using Figma.",
    description: "Learn the core design principles that guide successful user experiences. Learn about white space, typographic scales, visual hierarchies, color theory, and prototyping micro-interactions to design interfaces that users absolutely love.",
    category: "Design",
    difficulty: "Beginner",
    duration: "18 Hours",
    rating: 4.7,
    enrollmentsCount: 8900,
    coverImage: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80",
    author: "Elena Rostova",
    features: [
      "Step-by-step wireframing guidelines",
      "Designing responsive grids & breakpoints",
      "Building a custom Figma Design System",
      "Certificate of Completion included"
    ],
    lessons: [
      {
        id: 201,
        courseId: 2,
        title: "Introduction to Visual Hierarchy & Whitespace",
        duration: "30 Mins",
        videoUrl: "https://www.youtube.com/embed/YgB-I-Aun5o",
        imageUrl: "https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?auto=format&fit=crop&w=800&q=80",
        notes: `### Lesson 1: Visual Hierarchy & The Art of Breathing Space

Design is not just about what looks pretty; it's about conveying a structured flow of information.

#### What is Visual Hierarchy?
Visual hierarchy is the arrangement of graphical elements in order of importance. Designers control this order using:
- **Size & Scale**: Larger elements draw the eyes first.
- **Color & Contrast**: High-contrast elements pop out.
- **Typography Selection**: Distinct font-weights establish hierarchy.
- **Positioning**: Top-left elements usually catch attention first in Western reading cultures.

#### The Power of Whitespace (Negative Space)
Whitespace is the empty space between and around elements of a page. 
- **Reduces Cognitive Load**: Clutter confuses users. Whitespace gives the eyes room to rest.
- **Improves Readability**: Text headers feel distinct and legible.
- **Creates Premium Aesthetic**: Minimalist layout patterns rely heavily on spacious compositions.

#### Figma Exercise:
Try creating a card design where the header text is 24px semi-bold, body text is 14px regular, and there is at least 24px of padded whitespace on all sides. Compare it to a cluttered alternative to see the instant boost in visual appeal!`,
        orderIndex: 1
      },
      {
        id: 202,
        courseId: 2,
        title: "Color Theory & Typography Selection",
        duration: "45 Mins",
        videoUrl: "https://www.youtube.com/embed/7V-VNo4-EHY",
        imageUrl: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80",
        notes: `### Lesson 2: Color Harmonies and Font Pairings

Colors and text set the complete psychological mood of your digital product.

#### The 60-30-10 Rule:
- **60% Dominant Tone**: Typically light background/canvas colors.
- **30% Secondary Tone**: Structural cards, borders, text.
- **10% Accent Color**: High-energy CTA buttons, active links, notification dots.

#### Choosing Font Pairings:
1. **Display Heading**: Outfit, Space Grotesk, or a striking serif like Playfair Display.
2. **Body Text**: Inter, Roboto, or standard system-sans (highly legible at small sizes).

In the next lesson, we will move from abstract theories into drawing physical wireframes and interactive prototypes in Figma!`,
        orderIndex: 2
      }
    ]
  },
  {
    id: 3,
    title: "Data Structures & Algorithms in JavaScript",
    shortDescription: "Build dynamic, fast, and optimized algorithms. Master Big O notation, trees, sorting, and graph structures.",
    description: "The complete guide to mastering coding interviews and writing highly optimized software. You will learn dynamic programming, complexity analyses, and solve real coding challenges in modern JavaScript.",
    category: "Computer Science",
    difficulty: "Advanced",
    duration: "30 Hours",
    rating: 4.9,
    enrollmentsCount: 6200,
    coverImage: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80",
    author: "Prof. Kenneth Sterling",
    features: [
      "50+ coding challenges with explanations",
      "Big O complexity analysis cheatsheet",
      "Visual animations of sorting & graph pathways",
      "Verified Certificate of Completion"
    ],
    lessons: [
      {
        id: 301,
        courseId: 3,
        title: "Big O Notation & Complexity Analysis",
        duration: "40 Mins",
        videoUrl: "https://www.youtube.com/embed/RBSGKlAobjM",
        imageUrl: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=800&q=80",
        notes: `### Lesson 1: Demystifying Big O Notation

Algorithms can be correct but highly inefficient. Big O notation gives us a standard math vocabulary to measure how fast an algorithm runs (Time Complexity) and how much memory it consumes (Space Complexity).

#### Common Big O Run-times (from fastest to slowest):
1. **O(1) - Constant Time**: Running time stays the same regardless of data size (e.g., accessing an array index).
2. **O(log N) - Logarithmic Time**: Search space splits in half each step (e.g., Binary Search).
3. **O(N) - Linear Time**: Algorithm loops through every element (e.g., Simple array search).
4. **O(N log N) - Linearithmic Time**: The standard sorting limit (e.g., Merge Sort).
5. **O(N²) - Quadratic Time**: Nested loops over data elements (e.g., Bubble Sort).

#### JavaScript Code Review:
\`\`\`javascript
// O(1) Example
function getFirstItem(arr) {
  return arr[0]; // Instant
}

// O(N) Example
function findTarget(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i; // Loops up to N times
  }
  return -1;
}
\`\`\`

Understanding these trade-offs separates amateur coders from elite engineers. Let's explore linear data structures next!`,
        orderIndex: 1
      }
    ]
  },
  {
    id: 4,
    title: "Python Programming for Artificial Intelligence",
    shortDescription: "Learn Python syntax, NumPy, Pandas, and foundational math needed to build smart AI models.",
    description: "A complete programming curriculum to master Python. Develop strong expertise in arrays with NumPy, manipulate complex data matrices with Pandas, and construct initial neural network computations from scratch.",
    category: "Data Science",
    difficulty: "Beginner to Intermediate",
    duration: "28 Hours",
    rating: 4.85,
    enrollmentsCount: 9340,
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    author: "Dr. Angela Yu",
    features: [
      "Frictionless Jupyter Notebook integration",
      "Detailed Pandas cheat sheets",
      "5 real-world analytical capstone files",
      "Authorized final year certificate code"
    ],
    lessons: [
      {
        id: 401,
        courseId: 4,
        title: "Pythonic Variables, Lists, and Control Flows",
        duration: "35 Mins",
        videoUrl: "https://www.youtube.com/embed/rfscVS0vtbw",
        imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
        notes: `### Lesson 1: Writing Clean Python Code

Python is celebrated for its readability and elegant layout syntax. Today we'll review variable assignments, list comprehensions, and conditional logic.

#### Key Syntax Examples:
\`\`\`python
# List Comprehensions
numbers = [1, 2, 3, 4, 5]
squares = [x**2 for x in numbers if x % 2 == 0]
print(squares) # Output: [4, 16]
\`\`\`

Let's proceed to make complex computations using NumPy matrices!`,
        orderIndex: 1
      }
    ]
  },
  {
    id: 5,
    title: "Cloud Computing & AWS Architect Associate Guide",
    shortDescription: "Secure, scale, and launch dynamic architectures utilizing AWS EC2, S3, RDS, and Serverless Lambda.",
    description: "Deep dive into cloud patterns. Learn how to architect highly-available networks, configure automated system backups, secure data streams, and minimize monthly server costs.",
    category: "Cloud Computing",
    difficulty: "Intermediate",
    duration: "35 Hours",
    rating: 4.76,
    enrollmentsCount: 5410,
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    author: "Stephanie Maarek",
    features: [
      "Step-by-step instructions on EC2 deployment",
      "Security rule auditing exercises",
      "Free-tier cost calculation tools",
      "Certificate of Excellence"
    ],
    lessons: [
      {
        id: 501,
        courseId: 5,
        title: "Understanding Cloud Models and AWS Global Infrastructure",
        duration: "40 Mins",
        videoUrl: "https://www.youtube.com/embed/3hLmDS179YE",
        imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
        notes: `### Lesson 1: Foundations of AWS Cloud Services

Cloud platforms allow organizations to lease computational power instantly instead of purchasing hardware.

#### Core Benefits of AWS:
1. **High Availability**: Multi-region architectures ensure minimal downtime.
2. **Elasticity**: Automatically provision more nodes during server traffic peaks.
3. **Pay-as-you-go**: Charge is calculated strictly per usage second.`,
        orderIndex: 1
      }
    ]
  },
  {
    id: 6,
    title: "Android App Development with Kotlin & Jetpack Compose",
    shortDescription: "Build modern, responsive native Android apps using Kotlin, MVVM design pattern, and Jetpack Compose.",
    description: "Master native mobile engineering. Build responsive client interfaces using Jetpack Compose, handle local room storage, and interact with web REST APIs safely.",
    category: "Development",
    difficulty: "Intermediate",
    duration: "38 Hours",
    rating: 4.82,
    enrollmentsCount: 4120,
    coverImage: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
    author: "Marc Andre",
    features: [
      "Kotlin Clean Architecture layout patterns",
      "Advanced state-management guides",
      "Complete Gradle build templates",
      "Android Studio deployment guide"
    ],
    lessons: [
      {
        id: 601,
        courseId: 6,
        title: "Introduction to Kotlin Syntax and Variables",
        duration: "30 Mins",
        videoUrl: "https://www.youtube.com/embed/F9UC9DY-vIU",
        imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
        notes: `### Lesson 1: Kotlin Programming Language foundations

Kotlin is a concise, safe, and fully interoperable modern language preferred for Android development.

#### Defining Variables:
\`\`\`kotlin
val name: String = "Kotlin Developer" // Read-only variable
var score: Int = 100 // Mutable variable
\`\`\``,
        orderIndex: 1
      }
    ]
  },
  {
    id: 7,
    title: "Cyber Security & Ethical Hacking Essentials",
    shortDescription: "Master network penetration testing, digital vulnerability assessments, OWASP Top 10, and Wireshark logs.",
    description: "Protect systems against dangerous online attacks. Conduct comprehensive local penetration analyses, audit database inputs against injection bugs, and secure enterprise networks.",
    category: "Cybersecurity",
    difficulty: "Beginner to Intermediate",
    duration: "45 Hours",
    rating: 4.91,
    enrollmentsCount: 11050,
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    author: "Nathan House",
    features: [
      "Virtual environment staging instructions",
      "Wireshark packet log templates",
      "OWASP vulnerability scoring guidelines",
      "Penetration testing reporting template"
    ],
    lessons: [
      {
        id: 701,
        courseId: 7,
        title: "Core Concepts of Cybersecurity and Threat Modelling",
        duration: "50 Mins",
        videoUrl: "https://www.youtube.com/embed/3Kq1MIfTWCE",
        imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
        notes: `### Lesson 1: The Cybersecurity Trinity

Security is built around three core objectives, collectively called the **CIA Triad**:
- **Confidentiality**: Ensuring only authorized users can read files.
- **Integrity**: Guaranteeing details cannot be modified during transmission.
- **Availability**: Maintaining server uptime against Denial-of-Service attacks.`,
        orderIndex: 1
      }
    ]
  },
  {
    id: 8,
    title: "SQL & NoSQL Database Architecture",
    shortDescription: "Learn to design relational databases in MySQL and PostgreSQL, and high-performance NoSQL models in MongoDB.",
    description: "Scale your storage layer to support thousands of concurrent transactions. Master primary indexes, query optimization strategies, database partitioning, and NoSQL key-value designs.",
    category: "Databases",
    difficulty: "Intermediate",
    duration: "25 Hours",
    rating: 4.69,
    enrollmentsCount: 4890,
    coverImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80",
    author: "Dr. Jennifer Widom",
    features: [
      "Database schema visualization guides",
      "Indexing performance benchmarking files",
      "MongoDB replication step-by-step files",
      "Final year project SQL structure files"
    ],
    lessons: [
      {
        id: 801,
        courseId: 8,
        title: "Database Normalization (1NF, 2NF, 3NF)",
        duration: "35 Mins",
        videoUrl: "https://www.youtube.com/embed/px6M6D_OqH8",
        imageUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80",
        notes: `### Lesson 1: The Foundations of Schema Design

Normalization organizes database structures to eliminate redundancy and block database anomalies (Insert, Update, Delete anomalies).

#### Summary of Normal Forms:
1. **First Normal Form (1NF)**: Eliminate duplicate columns. Keep all fields atomic.
2. **Second Normal Form (2NF)**: Must satisfy 1NF and remove partial dependencies.
3. **Third Normal Form (3NF)**: Must satisfy 2NF and remove transitive dependencies.`,
        orderIndex: 1
      }
    ]
  },
  {
    id: 9,
    title: "DevOps Engineering & Docker Pipelines",
    shortDescription: "Automate build and deployment pipelines using Docker, Kubernetes, Jenkins, and GitHub Actions.",
    description: "Accelerate software delivery cycles. Wrap microservices inside standardized lightweight Docker containers and build continuous integration / continuous deployment (CI/CD) triggers.",
    category: "DevOps",
    difficulty: "Advanced",
    duration: "32 Hours",
    rating: 4.88,
    enrollmentsCount: 3950,
    coverImage: "https://images.unsplash.com/photo-1484417894907-623942c8ea29?auto=format&fit=crop&w=800&q=80",
    author: "Richard Helm",
    features: [
      "Complete Dockerfile and Compose scripts",
      "Jenkins pipeline setup guides",
      "Kubernetes local clustering commands",
      "CI/CD workflow templates"
    ],
    lessons: [
      {
        id: 901,
        courseId: 9,
        title: "Introduction to Virtualization vs Containerization",
        duration: "45 Mins",
        videoUrl: "https://www.youtube.com/embed/fqMOX6JJhGo",
        imageUrl: "https://images.unsplash.com/photo-1484417894907-623942c8ea29?auto=format&fit=crop&w=800&q=80",
        notes: `### Lesson 1: The Container Revolution

Virtual Machines isolate hardware completely but consume heavy system overhead. Containers share the host Operating System kernel, making them lightweight and fast.

#### Simple Dockerfile Example:
\`\`\`dockerfile
FROM php:8.2-apache
COPY src/ /var/www/html/
EXPOSE 80
\`\`\``,
        orderIndex: 1
      }
    ]
  },
  {
    id: 10,
    title: "PHP MVC Frameworks & Laravel Bootcamp",
    shortDescription: "Build dynamic commercial web applications using the Model-View-Controller pattern in Laravel.",
    description: "The fast-track framework to build PHP web backends. Master Eloquent ORM relationships, routing engines, Blade rendering layout engines, secure authentication routes, and middleware layers.",
    category: "Development",
    difficulty: "Intermediate",
    duration: "40 Hours",
    rating: 4.87,
    enrollmentsCount: 8230,
    coverImage: "https://images.unsplash.com/photo-1599507591144-667d4ed35fca?auto=format&fit=crop&w=800&q=80",
    author: "Taylor Otwell",
    features: [
      "Full CRUD application codebases",
      "MySQL migrations databases designs",
      "Laravel Blade responsive web components",
      "Secure API routing rules"
    ],
    lessons: [
      {
        id: 1001,
        courseId: 10,
        title: "Introduction to MVC Architecture in PHP",
        duration: "40 Mins",
        videoUrl: "https://www.youtube.com/embed/ImtZ5yENzgE",
        imageUrl: "https://images.unsplash.com/photo-1599507591144-667d4ed35fca?auto=format&fit=crop&w=800&q=80",
        notes: `### Lesson 1: Understanding MVC Separation

Laravel is powered by the **Model-View-Controller** software architectural pattern:
- **Model**: Manages data variables and SQL database behaviors.
- **View**: Renders plain responsive HTML screens to the clients.
- **Controller**: Processes user inputs, interacts with Models, and sends response Views back.`,
        orderIndex: 1
      }
    ]
  },
  {
    id: 11,
    title: "Machine Learning with TensorFlow & PyTorch",
    shortDescription: "Train neural networks to perform linear regressions, image categorizations, and text summarization flows.",
    description: "Master real mathematical modeling. Configure activation functions (ReLU, Sigmoid), calculate gradient descent formulas, adjust learning weights, and optimize complex network parameters.",
    category: "Artificial Intelligence",
    difficulty: "Advanced",
    duration: "44 Hours",
    rating: 4.93,
    enrollmentsCount: 7120,
    coverImage: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=800&q=80",
    author: "Dr. Andrew Ng",
    features: [
      "Colab coding notebooks with clean datasets",
      "TensorFlow neural network structures",
      "Mathematical proof files of Backpropagation",
      "Professional Certificate on AI Completion"
    ],
    lessons: [
      {
        id: 1101,
        courseId: 11,
        title: "Fundamentals of Supervised Learning and Linear Regression",
        duration: "55 Mins",
        videoUrl: "https://www.youtube.com/embed/PkADv0K669s",
        imageUrl: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=800&q=80",
        notes: `### Lesson 1: Machine Learning Overview

Supervised learning maps inputs directly to outputs based on pre-labeled training datasets. Linear regression optimizes a straight line parameter ($y = mx + c$) minimizing mean squared errors.`,
        orderIndex: 1
      }
    ]
  },
  {
    id: 12,
    title: "React Native & Cross-Platform Mobile Apps",
    shortDescription: "Code a single codebase using React Native to release highly-responsive iOS and Android apps.",
    description: "Leverage your React JS knowledge to build high-performance mobile apps. Tap into native APIs like Camera, Geolocation, and local key storage using uniform TypeScript files.",
    category: "Development",
    difficulty: "Intermediate",
    duration: "26 Hours",
    rating: 4.74,
    enrollmentsCount: 5120,
    coverImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
    author: "William Chandler",
    features: [
      "Responsive layout flex containers for devices",
      "Expo CLI startup configuration instructions",
      "Offline cache synchronization logic",
      "State management using React Context"
    ],
    lessons: [
      {
        id: 1201,
        courseId: 12,
        title: "Introduction to Expo & Component Native Elements",
        duration: "30 Mins",
        videoUrl: "https://www.youtube.com/embed/gvkqT_qiZiM",
        imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
        notes: `### Lesson 1: React Native Core Views

In React Native, we compile JavaScript into actual native UI components. Instead of \`<div>\`, we use \`<View>\`. Instead of \`<span>\` or \`<p>\`, we use \`<Text>\`.`,
        orderIndex: 1
      }
    ]
  },
  {
    id: 13,
    title: "Blockchain Technologies & Solidity Smart Contracts",
    shortDescription: "Build decentralized applications (DApps) and write secure smart contracts on the Ethereum blockchain.",
    description: "Enter the world of Web3. Learn the mechanics of distributed ledgers, create digital tokens (ERC-20 & ERC-721), and compile Ethereum transactions with secure Solidity code.",
    category: "Computer Science",
    difficulty: "Advanced",
    duration: "34 Hours",
    rating: 4.68,
    enrollmentsCount: 3100,
    coverImage: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=800&q=80",
    author: "Vitalik Buterin",
    features: [
      "Solidity vulnerability audit files",
      "Remix IDE setup guidelines",
      "ERC-20 standard code templates",
      "Web3.js interaction scripts"
    ],
    lessons: [
      {
        id: 1301,
        courseId: 13,
        title: "Decentralization & Proof-of-Work Mechanics",
        duration: "40 Mins",
        videoUrl: "https://www.youtube.com/embed/M3EFi_SgS8E",
        imageUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=800&q=80",
        notes: `### Lesson 1: Demystifying Blockchains

A blockchain is a chronological, cryptographically-secured chain of records distributed across independent computer nodes worldwide. This architecture guarantees absolute database trust.`,
        orderIndex: 1
      }
    ]
  },
  {
    id: 14,
    title: "Game Development Masterclass using Unity & C#",
    shortDescription: "Create interactive 2D and 3D games. Write responsive scripts, coordinate camera rigs, and compile releases.",
    description: "Launch your dream games. Design 3D level stages, program physics actions, simulate collision vectors, control custom sound files, and build game executable files.",
    category: "Design",
    difficulty: "Beginner to Intermediate",
    duration: "36 Hours",
    rating: 4.89,
    enrollmentsCount: 5670,
    coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    author: "Brackeys",
    features: [
      "Complete 2D arcade physics code templates",
      "Prefab object models and visual packages",
      "C# state scripts for character navigation",
      "Executable build instructions"
    ],
    lessons: [
      {
        id: 1401,
        courseId: 14,
        title: "Understanding Unity Workspace Coordinates and Game Loops",
        duration: "45 Mins",
        videoUrl: "https://www.youtube.com/embed/gB1F9G0JXOo",
        imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
        notes: `### Lesson 1: The Core Game Loop

Unity runs an continuous infinite loop driving your graphics frame rates:
- **Awake() & Start()**: Initialize properties when the application fires.
- **Update()**: Executed once per graphics rendering frame (used for controller inputs).
- **FixedUpdate()**: Executed at set intervals (essential for calculating custom physical forces).`,
        orderIndex: 1
      }
    ]
  },
  {
    id: 15,
    title: "Agile Project Management & Scrum Framework",
    shortDescription: "Manage software projects using Scrum guidelines, Jira boards, sprint plans, and team review processes.",
    description: "Master modern software team management. Understand Agile manifestos, coordinate efficient daily Standup reviews, design burn-down tracking charts, and resolve project roadblocks.",
    category: "Management",
    difficulty: "Beginner",
    duration: "15 Hours",
    rating: 4.71,
    enrollmentsCount: 6810,
    coverImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    author: "Jeff Sutherland",
    features: [
      "Sprint retrospective question files",
      "Jira board configuration guides",
      "Burn-down chart Excel templates",
      "Scrum master certificate guidelines"
    ],
    lessons: [
      {
        id: 1501,
        courseId: 15,
        title: "Introduction to Agile Principles & Scrum",
        duration: "30 Mins",
        videoUrl: "https://www.youtube.com/embed/XU0dlbS3rHY",
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
        notes: `### Lesson 1: What is Agile?

Agile is an iterative, adaptive approach to managing software deployments, prioritizing human interactions, working codebases, customer collaborations, and continuous flexibility.`,
        orderIndex: 1
      }
    ]
  }
];
