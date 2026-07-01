import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  User, 
  Mail, 
  Lock, 
  GraduationCap, 
  Award, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Download, 
  Database, 
  Eye, 
  Copy, 
  FileCode, 
  Menu, 
  X, 
  Star, 
  Users, 
  Check, 
  PlayCircle, 
  Code, 
  AlertTriangle, 
  Clock, 
  Printer, 
  FolderOpen, 
  ShieldCheck,
  Server,
  Sparkles,
  Info,
  ChevronRight,
  Send,
  Phone,
  MapPin,
  HelpCircle,
  Activity
} from "lucide-react";
import { Course, Lesson, User as UserType } from "./types";
import { COURSES } from "./data";

export default function App() {
  // Navigation & Core States
  const [activeTab, setActiveTab] = useState<string>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  // User Authentication & Persistence States
  const [users, setUsers] = useState<UserType[]>(() => {
    const saved = localStorage.getItem("elearning_users");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  
  const [currentUser, setCurrentUser] = useState<UserType | null>(() => {
    const saved = localStorage.getItem("elearning_current_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Auth Inputs
  const [usernameInput, setUsernameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [registerSelectedCourseIds, setRegisterSelectedCourseIds] = useState<number[]>([1]);
  const [loginEmailInput, setLoginEmailInput] = useState("");
  const [loginPasswordInput, setLoginPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  const handleToggleRegisterCourse = (courseId: number) => {
    if (registerSelectedCourseIds.includes(courseId)) {
      if (registerSelectedCourseIds.length > 1) {
        setRegisterSelectedCourseIds(prev => prev.filter(id => id !== courseId));
      }
    } else {
      setRegisterSelectedCourseIds(prev => [...prev, courseId]);
    }
  };

  const handleSelectAllRegisterCourses = () => {
    if (registerSelectedCourseIds.length === COURSES.length) {
      setRegisterSelectedCourseIds([1]); // Default to first
    } else {
      setRegisterSelectedCourseIds(COURSES.map(c => c.id));
    }
  };

  // Course Dashboard Player States
  const [activeLessonIdx, setActiveLessonIdx] = useState<number>(0);
  const [customCertificateName, setCustomCertificateName] = useState("");



  // Contact States
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Sync users list to localStorage
  useEffect(() => {
    localStorage.setItem("elearning_users", JSON.stringify(users));
  }, [users]);

  // Sync current user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("elearning_current_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("elearning_current_user");
    }
  }, [currentUser]);

  // Auto scroll to top on tab change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  // Handle Registration
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    if (!usernameInput.trim() || !emailInput.trim() || !passwordInput) {
      setAuthError("Please fill in all details.");
      return;
    }

    if (registerSelectedCourseIds.length === 0) {
      setAuthError("Please select at least one course to register.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      setAuthError("Please provide a valid email address.");
      return;
    }

    // Check if user exists
    const exists = users.find(u => u.email === emailInput || u.username === usernameInput);
    if (exists) {
      setAuthError("Email or Username already exists!");
      return;
    }

    const newUser: UserType = {
      id: Date.now(),
      username: usernameInput,
      email: emailInput,
      enrolledCourseId: registerSelectedCourseIds[0],
      registeredCourseIds: registerSelectedCourseIds,
      completedLessons: []
    };

    setUsers(prev => [...prev, newUser]);
    
    // Auto-login the registered user
    setCurrentUser(newUser);
    setActiveLessonIdx(0);
    setAuthSuccess("Registration completed successfully!");
    
    // Redirect to dashboard
    setTimeout(() => {
      setActiveTab("dashboard");
      // reset inputs
      setUsernameInput("");
      setEmailInput("");
      setPasswordInput("");
    }, 1000);
  };

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    if (!loginEmailInput.trim() || !loginPasswordInput) {
      setAuthError("Please provide both email and password.");
      return;
    }

    // Since this is a local preview with a mock DB, we can search by email
    const user = users.find(u => u.email === loginEmailInput);
    if (!user) {
      setAuthError("User with this email not found. Please register first!");
      return;
    }

    // Auto log in (password accepted for any string in this prototype preview)
    setCurrentUser(user);
    setActiveLessonIdx(0);
    setAuthSuccess("Logged in successfully! Loading your dashboard...");
    
    setTimeout(() => {
      setActiveTab("dashboard");
      setLoginEmailInput("");
      setLoginPasswordInput("");
    }, 1000);
  };

  // Logout Handler
  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab("home");
  };

  // Complete lesson logic
  const handleMarkLessonComplete = (lessonId: number) => {
    if (!currentUser) return;

    const isAlreadyCompleted = currentUser.completedLessons.includes(lessonId);
    let updatedCompleted = [...currentUser.completedLessons];

    if (!isAlreadyCompleted) {
      updatedCompleted.push(lessonId);
    }

    const updatedUser = {
      ...currentUser,
      completedLessons: updatedCompleted
    };

    // Update in state & lists
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));

    // Auto advance to next lesson if available
    const activeCourse = COURSES.find(c => c.id === currentUser.enrolledCourseId);
    if (activeCourse && activeLessonIdx < activeCourse.lessons.length - 1) {
      setActiveLessonIdx(prev => prev + 1);
    }
  };

  // Enroll directly from catalog (requires registration or links to active course)
  const handleEnrollClick = (courseId: number) => {
    if (currentUser) {
      // Add course to registered list if not exists, and set as active enrolled
      const currentRegistered = currentUser.registeredCourseIds || [currentUser.enrolledCourseId || 1];
      const updatedRegistered = currentRegistered.includes(courseId)
        ? currentRegistered
        : [...currentRegistered, courseId];

      const updatedUser = {
        ...currentUser,
        enrolledCourseId: courseId,
        registeredCourseIds: updatedRegistered
      };
      setCurrentUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
      setActiveLessonIdx(0);
      setActiveTab("dashboard");
    } else {
      setRegisterSelectedCourseIds([courseId]);
      setActiveTab("register");
    }
  };



  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactSubject.trim() || !contactMessage.trim()) {
      return;
    }
    setContactSubmitted(true);
    setTimeout(() => {
      setContactName("");
      setContactEmail("");
      setContactSubject("");
      setContactMessage("");
    }, 100);
  };

  // Get active user's enrolled course & progress calculations
  const registeredCourses = currentUser 
    ? COURSES.filter(c => (currentUser.registeredCourseIds || [currentUser.enrolledCourseId || 1]).includes(c.id))
    : [];

  const enrolledCourse = currentUser 
    ? (COURSES.find(c => c.id === currentUser.enrolledCourseId) || registeredCourses[0] || COURSES[0]) 
    : null;

  const totalLessons = enrolledCourse ? enrolledCourse.lessons.length : 0;
  const completedCount = enrolledCourse && currentUser 
    ? enrolledCourse.lessons.filter(l => currentUser.completedLessons.includes(l.id)).length 
    : 0;

  const progressPercent = totalLessons > 0 
    ? Math.round((completedCount / totalLessons) * 100) 
    : 0;

  const isCourseFullyCompleted = progressPercent === 100;

  // Render Page Header / Navbar
  const renderNavbar = () => (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm" id="main-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => { setActiveTab("home"); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 cursor-pointer border-none bg-transparent"
              id="logo-button"
            >
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-extrabold shadow-md shadow-blue-500/30">
                E
              </div>
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">
                Edu<span className="text-blue-600">Premium</span>
              </span>
            </button>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            <button 
              onClick={() => setActiveTab("home")} 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "home" ? "text-blue-600 font-semibold" : "text-slate-600 hover:text-blue-600"}`}
            >
              Home
            </button>
            <button 
              onClick={() => setActiveTab("about")} 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "about" ? "text-blue-600 font-semibold" : "text-slate-600 hover:text-blue-600"}`}
            >
              About
            </button>
            <button 
              onClick={() => setActiveTab("courses")} 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "courses" ? "text-blue-600 font-semibold" : "text-slate-600 hover:text-blue-600"}`}
            >
              Courses
            </button>
            <button 
              onClick={() => setActiveTab("contact")} 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "contact" ? "text-blue-600 font-semibold" : "text-slate-600 hover:text-blue-600"}`}
            >
              Contact
            </button>

            <span className="h-5 w-[1px] bg-slate-200 mx-2"></span>

            {/* Auth Buttons */}
            {currentUser ? (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setActiveTab("dashboard")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === "dashboard" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-800 hover:bg-slate-200"}`}
                  id="dashboard-nav-btn"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>My Studio</span>
                </button>
                <div className="text-right leading-none hidden lg:block">
                  <div className="text-xs text-slate-400 font-medium">Logged in</div>
                  <div className="text-sm text-slate-800 font-semibold">{currentUser.username}</div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors"
                  id="logout-btn"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setActiveTab("login")}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                  id="login-nav-btn"
                >
                  Login
                </button>
                <button 
                  onClick={() => setActiveTab("register")}
                  className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/10"
                  id="register-nav-btn"
                >
                  Register Now
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-600 hover:text-slate-900 p-2 rounded-lg"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-4 space-y-1 shadow-inner animate-fade-in" id="mobile-menu-drawer">
          <button 
            onClick={() => { setActiveTab("home"); setMobileMenuOpen(false); }}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            Home
          </button>
          <button 
            onClick={() => { setActiveTab("about"); setMobileMenuOpen(false); }}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            About Us
          </button>
          <button 
            onClick={() => { setActiveTab("courses"); setMobileMenuOpen(false); }}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            Courses
          </button>
          <button 
            onClick={() => { setActiveTab("contact"); setMobileMenuOpen(false); }}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            Contact Us
          </button>
          
          <div className="border-t border-slate-100 my-2 pt-2"></div>

          {currentUser ? (
            <div className="space-y-2">
              <div className="px-3 py-1.5 text-slate-500 text-sm">
                Enrolled: <strong className="text-slate-800">{enrolledCourse?.title || "None"}</strong>
              </div>
              <button 
                onClick={() => { setActiveTab("dashboard"); setMobileMenuOpen(false); }}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-blue-600 text-white font-semibold"
              >
                <GraduationCap className="w-5 h-5" />
                <span>Go to Learning Studio</span>
              </button>
              <button 
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="block w-full text-center px-4 py-2 rounded-lg border border-red-200 text-red-600 font-semibold"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button 
                onClick={() => { setActiveTab("login"); setMobileMenuOpen(false); }}
                className="text-center py-2 px-4 rounded-lg bg-slate-100 text-slate-800 font-semibold"
              >
                Login
              </button>
              <button 
                onClick={() => { setActiveTab("register"); setMobileMenuOpen(false); }}
                className="text-center py-2 px-4 rounded-lg bg-blue-600 text-white font-semibold"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 antialiased font-sans">
      {renderNavbar()}

      {/* Main Container */}
      <main className="flex-grow">
        
        {/* ======================================================== */}
        {/* TAB 1: HOME PAGE */}
        {/* ======================================================== */}
        {activeTab === "home" && (
          <div className="animate-fade-in" id="home-view">
            {/* Redesigned Premium Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-100 py-20 lg:py-28">
              {/* Subtle background decoration */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/40 rounded-full filter blur-3xl -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-100/30 rounded-full filter blur-3xl -ml-20 -mb-20"></div>
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
                  
                  {/* Hero Left Content */}
                  <div className="lg:col-span-6 space-y-6 text-left">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100/80 shadow-xs">
                      <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                      <span>Accredited Academic Digital Portal</span>
                    </span>
                    
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                      Master Modern Web <br />
                      <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Engineering</span> With Precision.
                    </h1>
                    
                    <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                      EduPremium delivers high-fidelity React interactive dashboards, expert-guided video content, extensive documentation notes, and automated previous-year exam prep. Establish your user login credentials, enroll in your target domain, and unlock a fully synchronized academic path.
                    </p>
                    
                    {/* User Avatars / Social Proof */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-1">
                      <div className="flex -space-x-3 overflow-hidden">
                        <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Student" referrerPolicy="no-referrer" />
                        <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80" alt="Student" referrerPolicy="no-referrer" />
                        <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Student" referrerPolicy="no-referrer" />
                        <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Student" referrerPolicy="no-referrer" />
                      </div>
                      <div className="text-xs sm:text-sm text-slate-600 font-medium">
                        Joined by <strong className="text-slate-900 font-bold">12,500+ computer science</strong> graduates worldwide.
                      </div>
                    </div>

                    {/* Interactive Action Links */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button 
                        onClick={() => setActiveTab("courses")}
                        className="px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide text-center transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
                        id="hero-explore-btn"
                      >
                        <span>Browse 15+ Advanced Courses</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setActiveTab("about")}
                        className="px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm tracking-wide text-center transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
                        id="hero-about-btn"
                      >
                        <span>Our Portal Mission</span>
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Hero Right Layered Mockup Visuals */}
                  <div className="lg:col-span-6 mt-16 lg:mt-0 relative flex justify-center">
                    <div className="relative w-full max-w-md sm:max-w-lg">
                      {/* Interactive Blob shapes */}
                      <div className="absolute -top-10 -left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse"></div>
                      <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse"></div>
                      
                      {/* Modern Card Image Frame */}
                      <div className="relative bg-white border border-slate-150 rounded-3xl p-4 shadow-xl shadow-slate-200/50">
                        <img 
                          src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80" 
                          alt="Premium Interactive E-Learning Portal dashboard preview" 
                          className="rounded-2xl w-full h-[340px] object-cover"
                          referrerPolicy="no-referrer"
                        />
                        
                        {/* Layered Interactive Indicator 1 */}
                        <div className="absolute -bottom-6 -left-6 bg-slate-900 text-white p-4 rounded-2xl shadow-lg border border-slate-800 max-w-xs space-y-2 hidden sm:block animate-bounce" style={{ animationDuration: '6s' }}>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                            <span className="text-[10px] font-bold uppercase text-slate-400">Student Live Attendance</span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black">98.4%</span>
                            <span className="text-xs text-emerald-400 font-bold">+2.3% this sem</span>
                          </div>
                        </div>

                        {/* Layered Interactive Indicator 2 */}
                        <div className="absolute -top-6 -right-6 bg-white border border-slate-150 p-3 rounded-2xl shadow-md flex items-center gap-3 hidden sm:flex">
                          <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                            <Award className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase leading-none">Latest Badge</div>
                            <div className="text-xs text-slate-900 font-extrabold leading-normal mt-0.5">Database Architect</div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                  
                </div>
              </div>
            </div>

            {/* Quick Stats Banner with icons */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="stats-banner">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="text-center p-4 space-y-1">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-extrabold text-blue-600">15+</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Expert Syllabus Courses</div>
                </div>
                <div className="text-center p-4 space-y-1 border-t sm:border-t-0 sm:border-l border-slate-100">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900">12,500+</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Graduates</div>
                </div>
                <div className="text-center p-4 space-y-1 border-t lg:border-t-0 lg:border-l border-slate-100">
                  <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <Award className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900">100%</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verifiable Credentials</div>
                </div>
                <div className="text-center p-4 space-y-1 border-t lg:border-t-0 lg:border-l border-slate-100">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <Server className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-extrabold text-emerald-600">Real-time</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Responsive Studio</div>
                </div>
              </div>
            </div>

            {/* HIGH-QUALITY VISUAL TRACKS CATALOGUE WITH REAL PHOTOS */}
            <div className="bg-slate-50 py-16 sm:py-24 border-t border-b border-slate-100" id="tracks-catalogue">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Section Title */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Comprehensive Academic Pillars</span>
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
                    Explore Advanced Professional Domains
                  </h2>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    Our dynamic system covers multiple technical dimensions. Register to enroll in individual courses and access tailored videos, interactive previous-year quiz tests, and digital PDF downloads.
                  </p>
                </div>

                {/* 6 Visual Pillars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  
                  {/* Pillar 1 */}
                  <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all group">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src="https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80" 
                        alt="Web Application Architecture" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <span className="absolute bottom-4 left-4 text-white font-extrabold text-xs uppercase tracking-wider bg-blue-600/90 px-2.5 py-1 rounded">
                        Frontend & UI
                      </span>
                    </div>
                    <div className="p-6 space-y-2">
                      <h3 className="font-extrabold text-slate-900 text-lg">Web Application Architecture</h3>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        Master modular frontend layout structures using state-of-the-art frameworks, responsive grid grids, CSS variables, and native animation hooks.
                      </p>
                    </div>
                  </div>

                  {/* Pillar 2 */}
                  <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all group">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src="https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80" 
                        alt="Relational DBMS & SQL" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <span className="absolute bottom-4 left-4 text-white font-extrabold text-xs uppercase tracking-wider bg-emerald-600/90 px-2.5 py-1 rounded">
                        Databases
                      </span>
                    </div>
                    <div className="p-6 space-y-2">
                      <h3 className="font-extrabold text-slate-900 text-lg">Relational DBMS & MySQL</h3>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        Design scalable entity diagrams, primary-foreign constraints, complex joins, indexing keys, and structured database queries.
                      </p>
                    </div>
                  </div>

                  {/* Pillar 3 */}
                  <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all group">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src="https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=600&q=80" 
                        alt="Interactive UI/UX Design" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <span className="absolute bottom-4 left-4 text-white font-extrabold text-xs uppercase tracking-wider bg-purple-600/90 px-2.5 py-1 rounded">
                        UI/UX Design
                      </span>
                    </div>
                    <div className="p-6 space-y-2">
                      <h3 className="font-extrabold text-slate-900 text-lg">Interactive Experience (UX)</h3>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        Design micro-interactions, responsive side navigation menus, clean forms, focus visual outlines, and modal trigger controllers.
                      </p>
                    </div>
                  </div>

                  {/* Pillar 4 */}
                  <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all group">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80" 
                        alt="Server-Side PHP Scripting" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <span className="absolute bottom-4 left-4 text-white font-extrabold text-xs uppercase tracking-wider bg-orange-600/90 px-2.5 py-1 rounded">
                        Backend Servers
                      </span>
                    </div>
                    <div className="p-6 space-y-2">
                      <h3 className="font-extrabold text-slate-900 text-lg">Server-Side Logic & PHP</h3>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        Integrate clean object-oriented controllers, server-side data validations, user sessions, secure password encryptions, and email relays.
                      </p>
                    </div>
                  </div>

                  {/* Pillar 5 */}
                  <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all group">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src="https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=600&q=80" 
                        alt="Data Structures and Algorithms" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <span className="absolute bottom-4 left-4 text-white font-extrabold text-xs uppercase tracking-wider bg-pink-600/90 px-2.5 py-1 rounded">
                        Theory & Algorithmic
                      </span>
                    </div>
                    <div className="p-6 space-y-2">
                      <h3 className="font-extrabold text-slate-900 text-lg">Data Structures & Logic</h3>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        Understand arrays, trees, heaps, stack queues, complexity estimations, algorithmic search patterns, and dynamic array indexing.
                      </p>
                    </div>
                  </div>

                  {/* Pillar 6 */}
                  <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all group">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80" 
                        alt="Cloud Deployments" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <span className="absolute bottom-4 left-4 text-white font-extrabold text-xs uppercase tracking-wider bg-cyan-600/90 px-2.5 py-1 rounded">
                        Cloud DevOps
                      </span>
                    </div>
                    <div className="p-6 space-y-2">
                      <h3 className="font-extrabold text-slate-900 text-lg">Cloud Hosting & Deployments</h3>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        Configure deployment workflows, manage environment variables, secure database credentials, and stream visual telemetry.
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* VISUAL STUDENT TIMELINE ROADMAP */}
            <div className="bg-white py-16 sm:py-24 border-b border-slate-100" id="student-milestones">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Your Learning Journey Map</span>
                  </span>
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                    How EduPremium Works
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm">
                    Follow these 5 streamlined milestones to transition from registration to certified expert in our web learning environment.
                  </p>
                </div>

                {/* Horizontal Timeline Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 relative">
                  
                  {/* Step 1 */}
                  <div className="space-y-3 relative">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-extrabold text-lg shadow-sm border border-blue-200">
                      1
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Register Account</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      Establish unique secure user credentials on our authentication panel to initialize your student tracker.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="space-y-3 relative">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-extrabold text-lg shadow-sm border border-indigo-200">
                      2
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Enroll Domain</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      Select your target syllabus path from the Course Catalog. Switch tracks dynamically without state loss.
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="space-y-3 relative">
                    <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-extrabold text-lg shadow-sm border border-purple-200">
                      3
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Stream & Learn</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      Navigate interactive lessons sidebars. Read structured, extensive study notes and play high-quality streaming videos.
                    </p>
                  </div>

                  {/* Step 4 */}
                  <div className="space-y-3 relative">
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-extrabold text-lg shadow-sm border border-amber-200">
                      4
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Submit Exams</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      Complete previous-year testing questionnaire modules. Check live correctness scores immediately.
                    </p>
                  </div>

                  {/* Step 5 */}
                  <div className="space-y-3 relative">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-extrabold text-lg shadow-sm border border-emerald-200">
                      5
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Print Diploma</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      Complete 100% of chapters to unlock, preview, and print customized academic graduation credentials!
                    </p>
                  </div>

                </div>

              </div>
            </div>

            {/* MEET OUR ACADEMIC FACULTY SECTION */}
            <div className="bg-slate-50 py-16 sm:py-20" id="academic-faculty">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                    <Users className="w-3.5 h-3.5" />
                    <span>Expert Facilitator Core</span>
                  </span>
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                    Meet Our Academic Faculty
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm">
                    Learn from world-class computer science authors, senior software architects, and SQL coordinators.
                  </p>
                </div>

                {/* Faculty Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  
                  {/* Faculty 1 */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-xs text-center space-y-4">
                    <img 
                      className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-blue-50" 
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80" 
                      alt="Dr. Priya Ramasamy"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">Dr. Priya Ramasamy</h4>
                      <div className="text-blue-600 text-[10px] font-bold uppercase tracking-wider mt-0.5">Head of Web Engineering</div>
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      Over 12 years of core development experience. Dr. Priya oversees our interactive frontend architectures, curriculum pathways, and UX templates.
                    </p>
                    <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 text-[9px] font-bold px-2 py-0.5 rounded-full">
                      <span>PhD - Stanford</span>
                    </div>
                  </div>

                  {/* Faculty 2 */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-xs text-center space-y-4">
                    <img 
                      className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-indigo-50" 
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80" 
                      alt="Prof. S. Rajesh"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">Prof. S. Rajesh</h4>
                      <div className="text-indigo-600 text-[10px] font-bold uppercase tracking-wider mt-0.5">Relational DB Coordinator</div>
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      Specialist in large-scale database clusters, normalized schemas, and query compilers. Prof. Rajesh guides our MySQL exam modules.
                    </p>
                    <div className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-800 text-[9px] font-bold px-2 py-0.5 rounded-full">
                      <span>M.Tech - IIT Madras</span>
                    </div>
                  </div>

                  {/* Faculty 3 */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-xs text-center space-y-4">
                    <img 
                      className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-pink-50" 
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80" 
                      alt="Dr. Elena Rostova"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">Dr. Elena Rostova</h4>
                      <div className="text-pink-600 text-[10px] font-bold uppercase tracking-wider mt-0.5">Senior Server Developer</div>
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      Author of 4 international textbooks on cloud APIs, server caching layers, and high-performance server architectures.
                    </p>
                    <div className="inline-flex items-center gap-1 bg-pink-50 text-pink-800 text-[9px] font-bold px-2 py-0.5 rounded-full">
                      <span>PhD - MIT</span>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* Bottom Final Call to Action banner */}
            <div className="bg-slate-900 text-white py-16 text-center relative overflow-hidden" id="home-courses-cta">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
              <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Join the Academic Community</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Ready to Accelerate Your Academic Study Track?</h2>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xl mx-auto">
                  Sign up for an account, register your custom student profile, choose your target study syllabus, and print your verified graduation certificate.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button 
                    onClick={() => setActiveTab("courses")}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md shadow-blue-500/10 cursor-pointer"
                  >
                    <span>Browse Syllabus</span>
                    <ArrowRight className="w-4.5 h-4.5" />
                  </button>
                  <button 
                    onClick={() => setActiveTab("register")}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-sm transition-all border border-slate-750 cursor-pointer"
                  >
                    <span>Create Account</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 1.1: ABOUT PAGE */}
        {/* ======================================================== */}
        {activeTab === "about" && (
          <div className="animate-fade-in" id="about-view">
            {/* About Section */}
            <div className="bg-white border-b border-slate-100 py-16" id="about-section">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
                  <div className="lg:col-span-6">
                    <img 
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" 
                      alt="Students Collaborating" 
                      className="rounded-2xl shadow-md w-full max-h-[380px] object-cover"
                    />
                  </div>
                  <div className="lg:col-span-6 mt-8 lg:mt-0 space-y-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Our Heritage & Mission</span>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                      Why Learn With EduPremium?
                    </h2>
                    <p className="text-slate-600 leading-relaxed">
                      Our system is custom-designed for computer science students and modern web learners. We focus on bridging visual execution with rigorous back-end logic. Our courses contain interactive source blocks, fully functioning previous/next navigation elements, and dynamic quiz structures.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="flex gap-3 items-start">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                          <Code className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 text-sm">Hands-on Code Examples</h4>
                          <p className="text-xs text-slate-500 mt-0.5">Learn using clean syntax and real-world project layouts.</p>
                        </div>
                      </div>
                      <div className="flex gap-3 items-start">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 text-sm">Complete Chapters Track</h4>
                          <p className="text-xs text-slate-500 mt-0.5">Your study state updates immediately in our learning sidebar.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Spotlight Block */}
            <div className="bg-slate-50 py-16 border-b border-slate-100" id="features-showcase">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">Premium Utilities</span>
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">E-Learning Platform Highlights</h2>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    EduPremium bridges beautiful visual designs with academic standards, giving computer science students a complete toolkit.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-xs space-y-3 hover-lift">
                    <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                      <PlayCircle className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">Integrated Lecture Playback</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      All syllabus courses feature an interactive lesson scheduler, streaming lecture materials directly inside the studio dashboard.
                    </p>
                  </div>

                  <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-xs space-y-3 hover-lift">
                    <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                      <Award className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">Academic Diploma Badges</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Upon completing 100% of any active course, instantly unlock and print a personalized graduation credential certificate.
                    </p>
                  </div>

                  <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-xs space-y-3 hover-lift">
                    <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">Comprehensive Study Guides</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Every syllabus course has extensive notes and detailed study guides to aid your conceptual and practical learning.
                    </p>
                  </div>

                  <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-xs space-y-3 hover-lift">
                    <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">Previous-Year Question Quizzes</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Embedded testing questionnaires let you submit answers and receive instant, live correctness scores to test your preparation.
                    </p>
                  </div>

                  <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-xs space-y-3 hover-lift">
                    <div className="w-11 h-11 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">Multi-Course Track Switcher</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Register once, choose multiple courses, and dynamically switch tracks without losing your progress or individual lecture states.
                    </p>
                  </div>

                  <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-xs space-y-3 hover-lift">
                    <div className="w-11 h-11 bg-cyan-50 text-cyan-600 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">Self-Paced Progress Tracker</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Track your learning journey step-by-step. Go back and review any video lectures, chapters, or notes anytime.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 1.2: CONTACT PAGE */}
        {/* ======================================================== */}
        {activeTab === "contact" && (
          <div className="animate-fade-in" id="contact-view">
            
            {/* Dark Premium Banner Header */}
            <div className="bg-slate-900 text-white py-16 px-4 relative overflow-hidden text-center border-b border-slate-800">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(30,58,138,0.4),transparent)]"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-3xl"></div>
              
              <div className="relative z-10 max-w-3xl mx-auto space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-widest">
                  <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
                  <span>Interactive Support Console</span>
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Academic Help Center & Support</h1>
                <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
                  Submit customized helpdesk requests, trace ticket streams, check verified office coordinates, or review our automated FAQs to jumpstart your educational track.
                </p>
              </div>
            </div>

            {/* Main Contact Content - Dual Column Grid */}
            <div className="bg-slate-100 py-16" id="contact-section">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Helpdesk details + Interactive FAQ Accordion */}
                  <div className="lg:col-span-5 space-y-6">
                    
                    {/* Active Helpdesk Status Card */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Helpdesk Status</span>
                        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">
                          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                          <span>Fully Operational</span>
                        </div>
                      </div>
                      
                      <p className="text-slate-600 text-xs leading-relaxed">
                        Need assistance managing your academic student account, troubleshooting chapter trackers, or downloading verified digital diplomas? Our coordinators are online to assist.
                      </p>

                      <div className="space-y-3.5 pt-2 border-t border-slate-100">
                        {/* Mail Item */}
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                            <Mail className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase leading-none">Email Support</div>
                            <div className="text-slate-900 font-extrabold text-xs mt-1">support@edupremium.edu</div>
                            <div className="text-[10px] text-slate-400">Response guaranteed in 2 hrs</div>
                          </div>
                        </div>

                        {/* Phone Item */}
                        <div className="flex items-start gap-3 border-t border-slate-50 pt-3">
                          <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                            <Phone className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase leading-none">Global Hotline</div>
                            <div className="text-slate-900 font-extrabold text-xs mt-1">+1 (800) 555-0199</div>
                            <div className="text-[10px] text-slate-400">Mon - Fri: 09:00 AM - 06:00 PM EST</div>
                          </div>
                        </div>

                        {/* Location Item */}
                        <div className="flex items-start gap-3 border-t border-slate-50 pt-3">
                          <div className="w-8 h-8 bg-pink-50 text-pink-600 rounded-lg flex items-center justify-center shrink-0">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase leading-none">Academic Campus Office</div>
                            <div className="text-slate-900 font-extrabold text-xs mt-1">450 University Way, Suite 100</div>
                            <div className="text-[10px] text-slate-400">Palo Alto, California, USA</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* INTERACTIVE FAQ ACCORDION */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs space-y-4">
                      <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-indigo-500" />
                        <span>Frequently Asked Questions</span>
                      </h3>
                      
                      <div className="space-y-2">
                        {/* FAQ Item 1 */}
                        <div className="border border-slate-100 rounded-xl overflow-hidden">
                          <button 
                            type="button"
                            onClick={() => setExpandedFaq(expandedFaq === 0 ? null : 0)}
                            className="w-full p-3 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between text-left"
                          >
                            <span className="text-xs font-bold text-slate-800">Is registration entirely free?</span>
                            <span className="text-xs text-slate-400 font-bold">{expandedFaq === 0 ? "−" : "+"}</span>
                          </button>
                          {expandedFaq === 0 && (
                            <div className="p-3 bg-white text-xs text-slate-500 leading-relaxed border-t border-slate-100 animate-fade-in">
                              Yes! You can register a secure student account for free. Once authenticated, browse the full 15+ syllabus and track progress.
                            </div>
                          )}
                        </div>

                        {/* FAQ Item 2 */}
                        <div className="border border-slate-100 rounded-xl overflow-hidden">
                          <button 
                            type="button"
                            onClick={() => setExpandedFaq(expandedFaq === 1 ? null : 1)}
                            className="w-full p-3 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between text-left"
                          >
                            <span className="text-xs font-bold text-slate-800">How do I verify certificates?</span>
                            <span className="text-xs text-slate-400 font-bold">{expandedFaq === 1 ? "−" : "+"}</span>
                          </button>
                          {expandedFaq === 1 && (
                            <div className="p-3 bg-white text-xs text-slate-500 leading-relaxed border-t border-slate-100 animate-fade-in">
                              Every printed digital diploma includes a secure, unique credential identifier hash. Employers can request validation of this hash anytime.
                            </div>
                          )}
                        </div>

                        {/* FAQ Item 3 */}
                        <div className="border border-slate-100 rounded-xl overflow-hidden">
                          <button 
                            type="button"
                            onClick={() => setExpandedFaq(expandedFaq === 2 ? null : 2)}
                            className="w-full p-3 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between text-left"
                          >
                            <span className="text-xs font-bold text-slate-800">Can I register multiple courses?</span>
                            <span className="text-xs text-slate-400 font-bold">{expandedFaq === 2 ? "−" : "+"}</span>
                          </button>
                          {expandedFaq === 2 && (
                            <div className="p-3 bg-white text-xs text-slate-500 leading-relaxed border-t border-slate-100 animate-fade-in">
                              Absolutely! Use the Courses Catalog to enroll. You can switch tracks dynamically and your current progress/notes states are preserved on your active profile.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Interactive Support Form + Live Ticket Queue Simulator */}
                  <div className="lg:col-span-7 space-y-6">
                    
                    {/* Support Form Card */}
                    <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-md space-y-4">
                      <div className="border-b border-slate-100 pb-4">
                        <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                          <Send className="w-5 h-5 text-blue-500" />
                          <span>Transmit Support Ticket</span>
                        </h3>
                        <p className="text-slate-500 text-xs">Fill out the fields below to dispatch a secure academic request to our support queue.</p>
                      </div>

                      {contactSubmitted ? (
                        <div className="p-8 bg-emerald-50 border border-emerald-150 rounded-2xl text-center space-y-3 animate-fade-in" id="contact-success-msg">
                          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                            <CheckCircle className="w-6 h-6 animate-bounce" />
                          </div>
                          <h4 className="font-extrabold text-slate-900 text-base">Inquiry Successfully Transmitted!</h4>
                          <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                            Thank you for contacting EduPremium. A support ticket has been registered in our database. Our academic helpdesk staff will reply shortly.
                          </p>
                          <button 
                            onClick={() => setContactSubmitted(false)}
                            className="px-6 py-2.5 text-xs font-bold bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-800 rounded-full transition-all cursor-pointer shadow-xs"
                          >
                            Send Another Message
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleContactSubmit} className="space-y-4" id="contact-form">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Your Name</label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                  <User className="w-4 h-4" />
                                </span>
                                <input 
                                  type="text" 
                                  required 
                                  value={contactName} 
                                  onChange={(e) => setContactName(e.target.value)}
                                  placeholder="Alex Mercer"
                                  className="w-full pl-9 pr-3 py-2.5 border border-slate-250 rounded-xl text-xs bg-slate-50 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-hidden transition-all font-semibold"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Email Address</label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                  <Mail className="w-4 h-4" />
                                </span>
                                <input 
                                  type="email" 
                                  required 
                                  value={contactEmail} 
                                  onChange={(e) => setContactEmail(e.target.value)}
                                  placeholder="alex@mercer.com"
                                  className="w-full pl-9 pr-3 py-2.5 border border-slate-250 rounded-xl text-xs bg-slate-50 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-hidden transition-all font-semibold"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Request Subject</label>
                            <input 
                              type="text" 
                              required 
                              value={contactSubject} 
                              onChange={(e) => setContactSubject(e.target.value)}
                              placeholder="Help with course enrollment or verified certificate code"
                              className="w-full px-3 py-2.5 border border-slate-250 rounded-xl text-xs bg-slate-50 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-hidden transition-all font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Your Message</label>
                            <textarea 
                              rows={4} 
                              required 
                              value={contactMessage} 
                              onChange={(e) => setContactMessage(e.target.value)}
                              placeholder="Describe your question or issue in detail..."
                              className="w-full px-3 py-2.5 border border-slate-250 rounded-xl text-xs bg-slate-50 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-hidden transition-all font-semibold"
                            ></textarea>
                          </div>

                          <button 
                            type="submit"
                            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md shadow-slate-900/10 cursor-pointer hover:scale-[1.01]"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Dispatch Live Ticket</span>
                          </button>
                        </form>
                      )}
                    </div>

                    {/* LIVE SUPPORT TICKET QUEUE STATUS SIMULATOR */}
                    <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                          <Activity className="w-4 h-4 text-emerald-500" />
                          <span>Academic Ticket Dispatch Streams</span>
                        </h4>
                        <span className="text-[10px] text-slate-400 font-bold">Auto Updated Just Now</span>
                      </div>

                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <span className="text-xs font-bold text-slate-700">Ticket #EP-9204</span>
                            <span className="text-[10px] text-slate-400">| Verification of Certificate</span>
                          </div>
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full uppercase border border-emerald-100">Resolved</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-bold text-slate-700">Ticket #EP-9210</span>
                            <span className="text-[10px] text-slate-400">| Lecture Playback Caching</span>
                          </div>
                          <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full uppercase border border-blue-100">Processing</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                            <span className="text-xs font-bold text-slate-700">Ticket #EP-9215</span>
                            <span className="text-[10px] text-slate-400">| MySQL Exam Score Recalculation</span>
                          </div>
                          <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full uppercase border border-amber-100">In Queue</span>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: COURSE CATALOG OVERVIEW */}
        {/* ======================================================== */}
        {activeTab === "courses" && (() => {
          const displayedCourses = currentUser ? registeredCourses : COURSES;
          return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in" id="courses-catalog-view">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                  {currentUser ? "My Registered Course Tracks" : "Course Syllabus List"}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
                  {currentUser ? "Your Selected Courses" : "Discover Our Premium Curriculum"}
                </h2>
                <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                  {currentUser 
                    ? `Showing the ${displayedCourses.length} courses you selected during registration. Click "Continue studying" to switch active track or view details.`
                    : "Browse our 15+ syllabus courses. Register an account and select your custom learning tracks to unlock complete interactive lectures, XAMPP project codes, and PDF materials."}
                </p>
                {currentUser && (
                  <p className="text-xs text-blue-600 font-semibold mt-2 bg-blue-50/60 py-1.5 px-3 rounded-lg inline-block border border-blue-100">
                    💡 Register a new student account to select a different combination from our 15+ curriculum catalogue.
                  </p>
                )}
              </div>

              {displayedCourses.length === 0 ? (
                <div className="text-center bg-white p-12 rounded-2xl border border-slate-200">
                  <p className="text-slate-500 text-sm font-medium">No registered courses found. Create an account to pick your learning tracks.</p>
                  <button onClick={() => setActiveTab("register")} className="mt-4 px-6 py-2.5 rounded-full bg-blue-600 text-white font-bold text-xs">
                    Go to Register
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  {displayedCourses.map(course => (
                    <div key={course.id} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm flex flex-col justify-between hover-lift">
                      <div>
                        <img 
                          src={course.coverImage} 
                          alt={course.title} 
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-6 space-y-4">
                          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">{course.category}</span>
                          <h3 className="font-extrabold text-slate-900 text-lg leading-snug">{course.title}</h3>
                          <p className="text-slate-500 text-xs leading-relaxed">{course.description}</p>
                          
                          {/* Features Checkbox Icons */}
                          <div className="space-y-1.5 pt-2">
                            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">What you will learn:</div>
                            {course.features.map((feature, idx) => (
                              <div key={idx} className="flex gap-2 items-center text-xs text-slate-600">
                                <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="px-6 pb-6 pt-2">
                        {/* Lesson Syllabus overview dropdown details */}
                        <div className="border-t border-slate-100 my-4 pt-4">
                          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Lectures Syllabus ({course.lessons.length}):</div>
                          <div className="space-y-1 max-h-40 overflow-y-auto bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            {course.lessons.map((lesson, idx) => (
                              <div key={lesson.id} className="flex justify-between items-center text-xs text-slate-600 py-1 border-b border-slate-100/50 last:border-0">
                                <span className="truncate font-medium">{idx + 1}. {lesson.title}</span>
                                <span className="text-slate-400 font-mono text-[10px] shrink-0">{lesson.duration}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <button 
                          onClick={() => handleEnrollClick(course.id)}
                          className="w-full text-center py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm shadow-blue-500/10 flex items-center justify-center gap-1.5"
                        >
                          <GraduationCap className="w-4 h-4" />
                          <span>{currentUser?.enrolledCourseId === course.id ? "Continue studying" : "Unlock Course Lectures"}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* ======================================================== */}
        {/* TAB 3: REGISTER PAGE */}
        {/* ======================================================== */}
        {activeTab === "register" && (
          <div className="max-w-5xl mx-auto px-4 py-12 animate-fade-in" id="register-view">
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
              
              {/* Left Column: Visual & Feature Pitch */}
              <div className="lg:col-span-5 bg-indigo-950 text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
                {/* Decorative background gradients */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -ml-20 -mb-20"></div>
                
                <div className="relative space-y-8 z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center font-bold text-sm text-white">E</div>
                    <span className="font-bold text-lg tracking-tight">EduPremium</span>
                  </div>
                  
                  <div className="space-y-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-300 bg-indigo-900/40 px-2.5 py-1 rounded-full inline-block border border-indigo-800">Student Enrollment Portal</span>
                    <h3 className="text-3xl font-extrabold leading-tight">Begin Your Academic Study</h3>
                    <p className="text-indigo-200 text-xs leading-relaxed">
                      Register your student study profile today. Select multiple courses from our syllabus catalogues to unlock lecture streamings, quizzes, and complete XAMPP server setups.
                    </p>
                  </div>

                  <div className="space-y-3.5 pt-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-indigo-800/60 text-indigo-200 flex items-center justify-center shrink-0 text-xs font-bold">✓</div>
                      <div>
                        <h4 className="font-bold text-xs text-indigo-100">Dynamic Multi-Course System</h4>
                        <p className="text-[11px] text-indigo-300">Register and switch between different syllabus tracks instantly.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-indigo-800/60 text-indigo-200 flex items-center justify-center shrink-0 text-xs font-bold">✓</div>
                      <div>
                        <h4 className="font-bold text-xs text-indigo-100">PHP & PDO Exporters</h4>
                        <p className="text-[11px] text-indigo-300">Ready-to-deploy htdocs project bundles with full source codes.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-indigo-800/60 text-indigo-200 flex items-center justify-center shrink-0 text-xs font-bold">✓</div>
                      <div>
                        <h4 className="font-bold text-xs text-indigo-100">Diploma Verification</h4>
                        <p className="text-[11px] text-indigo-300">Custom print diplomas upon reaching 100% video lectures completion.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 pt-8 border-t border-indigo-900/60 text-[11px] text-indigo-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Verified academic project guidelines.</span>
                </div>
              </div>

              {/* Right Column: Register Form */}
              <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
                <div className="max-w-md w-full mx-auto space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-extrabold text-slate-900">Create Account</h3>
                    <p className="text-slate-500 text-xs">Fill out your details below to activate your learning portal.</p>
                  </div>

                  {authError && (
                    <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-xs rounded-lg flex items-center gap-1.5 animate-pulse" id="register-error">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}
                  {authSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs rounded-lg flex items-center gap-1.5 animate-pulse" id="register-success">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>{authSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Username</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                            <User className="w-4 h-4" />
                          </span>
                          <input 
                            type="text" 
                            required 
                            value={usernameInput}
                            onChange={(e) => setUsernameInput(e.target.value)}
                            placeholder="e.g. alex_mercer"
                            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-hidden transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                            <Mail className="w-4 h-4" />
                          </span>
                          <input 
                            type="email" 
                            required 
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            placeholder="alex@mercer.com"
                            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-hidden transition-all"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Password</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                          <Lock className="w-4 h-4" />
                        </span>
                        <input 
                          type="password" 
                          required 
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-hidden transition-all"
                        />
                      </div>
                    </div>
                    
                    {/* Register multiple courses selector */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Select Course(s) to Register
                        </label>
                        <button
                          type="button"
                          onClick={handleSelectAllRegisterCourses}
                          className="text-[11px] text-indigo-600 hover:text-indigo-700 font-bold border-none bg-transparent cursor-pointer"
                        >
                          {registerSelectedCourseIds.length === COURSES.length ? "Deselect All" : "Select All 15+ Courses"}
                        </button>
                      </div>

                      <div className="border border-slate-200 rounded-xl bg-slate-50 p-3 max-h-40 overflow-y-auto space-y-1.5" id="register-course-checklist">
                        {COURSES.map(course => {
                          const isChecked = registerSelectedCourseIds.includes(course.id);
                          return (
                            <label 
                              key={course.id}
                              className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-colors border ${isChecked ? "bg-indigo-50/50 border-indigo-200" : "hover:bg-slate-100 border-transparent"}`}
                            >
                              <input 
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleRegisterCourse(course.id)}
                                className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 w-4 h-4 shrink-0"
                              />
                              <div className="text-left">
                                <p className="text-xs font-bold text-slate-800 line-clamp-1">{course.title}</p>
                                <p className="text-[10px] text-slate-400 font-semibold">{course.category} • {course.lessons.length} Chapters</p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-indigo-500/15"
                    >
                      Create Account & Register Courses
                    </button>
                  </form>

                  <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                    Already registered?{" "}
                    <button onClick={() => setActiveTab("login")} className="text-indigo-600 hover:underline font-bold border-none bg-transparent cursor-pointer">
                      Log in here
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: LOGIN PAGE */}
        {/* ======================================================== */}
        {activeTab === "login" && (
          <div className="max-w-5xl mx-auto px-4 py-16 animate-fade-in" id="login-view">
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 min-h-[550px]">
              
              {/* Left Column: Visual & Info */}
              <div className="lg:col-span-5 bg-slate-950 text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
                {/* Decorative gradients */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 -mr-20 -mt-20"></div>
                
                <div className="relative space-y-8 z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-sm text-white">E</div>
                    <span className="font-bold text-lg tracking-tight">EduPremium</span>
                  </div>
                  
                  <div className="space-y-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-slate-900 px-2.5 py-1 rounded-full inline-block border border-slate-800">Welcome Back Student</span>
                    <h3 className="text-3xl font-extrabold leading-tight">Access Your Personal Studio</h3>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                      Sign in to your learning dashboard to resume lesson tracking, stream advanced video tutorials, write practice quizzes, and download verified school report outputs.
                    </p>
                  </div>

                  <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Instant Learning Dashboard</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Your registered syllabus tracks will be loaded dynamically on your dashboard panel once you login successfully.
                    </p>
                  </div>
                </div>

                <div className="relative z-10 pt-8 border-t border-slate-900 text-[11px] text-slate-400">
                  Secure local SQLite / MySQL session verification enabled.
                </div>
              </div>

              {/* Right Column: Login Form */}
              <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
                <div className="max-w-md w-full mx-auto space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-extrabold text-slate-900">Sign In</h3>
                    <p className="text-slate-500 text-xs">Enter your email and password to resume studying.</p>
                  </div>

                  {authError && (
                    <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-xs rounded-lg flex items-center gap-1.5 animate-pulse" id="login-error">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}
                  {authSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs rounded-lg flex items-center gap-1.5 animate-pulse" id="login-success">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>{authSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                          <Mail className="w-4 h-4" />
                        </span>
                        <input 
                          type="email" 
                          required 
                          value={loginEmailInput}
                          onChange={(e) => setLoginEmailInput(e.target.value)}
                          placeholder="e.g. alex@mercer.com"
                          className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-hidden transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Password</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                          <Lock className="w-4 h-4" />
                        </span>
                        <input 
                          type="password" 
                          required 
                          value={loginPasswordInput}
                          onChange={(e) => setLoginPasswordInput(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-hidden transition-all"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-slate-900/10"
                    >
                      Login to Learning Dashboard
                    </button>
                  </form>

                  {/* Autocomplete Helper */}
                  <div className="pt-6 border-t border-slate-100">
                    <div className="text-xs text-slate-400 font-bold mb-2 uppercase tracking-wider">Fast Testing Credentials:</div>
                    <button 
                      onClick={() => {
                        const existingDemo = users.find(u => u.email === "student@example.com");
                        if (!existingDemo) {
                          const dummy: UserType = {
                            id: 1,
                            username: "demo_student",
                            email: "student@example.com",
                            enrolledCourseId: 1,
                            registeredCourseIds: [1, 2, 3],
                            completedLessons: [101, 102]
                          };
                          setUsers(prev => [...prev, dummy]);
                        } else if (!existingDemo.registeredCourseIds) {
                          setUsers(prev => prev.map(u => u.email === "student@example.com" ? { ...u, registeredCourseIds: [1, 2, 3] } : u));
                        }
                        setLoginEmailInput("student@example.com");
                        setLoginPasswordInput("password123");
                      }}
                      className="w-full text-left p-3.5 rounded-xl border border-blue-50 bg-blue-50/50 hover:bg-blue-50 text-blue-700 text-xs font-medium flex justify-between items-center transition-all"
                      id="autocomplete-btn"
                    >
                      <div>
                        <span className="font-bold block text-blue-800">Demo Student Auto-fill</span>
                        <span className="text-slate-400 text-[10px]">Email: student@example.com | Password: password123</span>
                      </div>
                      <Sparkles className="w-4 h-4 text-blue-600 animate-pulse shrink-0" />
                    </button>
                  </div>

                  <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                    New student?{" "}
                    <button onClick={() => setActiveTab("register")} className="text-indigo-600 hover:underline font-bold border-none bg-transparent cursor-pointer">
                      Register & enroll here
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: STUDENT LEARNING STUDIO DASHBOARD */}
        {/* ======================================================== */}
        {activeTab === "dashboard" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" id="dashboard-view">
            {!currentUser ? (
              <div className="max-w-md mx-auto text-center space-y-4 py-16">
                <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
                <h3 className="text-xl font-bold">Authentication Required</h3>
                <p className="text-slate-500 text-sm">Please register an account and choose your course, or login to view your active Dashboard details.</p>
                <div className="flex gap-2 justify-center">
                  <button onClick={() => setActiveTab("login")} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold">Login</button>
                  <button onClick={() => setActiveTab("register")} className="px-4 py-2 bg-slate-100 text-slate-800 rounded-lg text-sm font-semibold">Register</button>
                </div>
              </div>
            ) : !enrolledCourse ? (
              <div className="max-w-md mx-auto text-center space-y-4 py-16">
                <GraduationCap className="w-12 h-12 text-blue-500 mx-auto" />
                <h3 className="text-xl font-bold">No Course Enrollment Found</h3>
                <p className="text-slate-500 text-sm">You are logged in but have not enrolled in a course yet. Please explore our syllabus courses catalog to unlock your learning content.</p>
                <button onClick={() => setActiveTab("courses")} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold">Go to Course Catalog</button>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Dashboard Banner & Statistics */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Learning Studio</span>
                    <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Welcome back, {currentUser.username}!</h2>
                    <p className="text-sm text-slate-500">
                      Active Enrollment: <strong className="text-slate-700">{enrolledCourse.title}</strong>
                    </p>
                  </div>

                  {/* Progress Calculator */}
                  <div className="w-full md:w-72 space-y-1.5" id="dashboard-progress-panel">
                    <div className="flex justify-between text-xs text-slate-500 font-bold">
                      <span>Course Progress</span>
                      <span>{progressPercent}% Completed</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner flex">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      {completedCount} of {totalLessons} chapters completed
                    </div>
                  </div>
                </div>

                {/* Main Studio Workspace Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Sidebar Scheduler / Chapters Outline */}
                  <div className="lg:col-span-4 space-y-4">
                    
                    {/* My Registered Courses Selection */}
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                      <div className="bg-blue-600 text-white p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-bold text-sm uppercase tracking-wider">My Registered Courses</h3>
                            <p className="text-[10px] text-blue-100 mt-0.5">Your registered academic tracks</p>
                          </div>
                          <span className="bg-blue-700 text-white text-[11px] px-2 py-0.5 rounded-full font-bold">
                            {registeredCourses.length}
                          </span>
                        </div>
                      </div>
                      
                      <div className="divide-y divide-slate-100 max-h-[220px] overflow-y-auto" id="registered-courses-switcher">
                        {registeredCourses.map(course => {
                          const isActive = course.id === enrolledCourse.id;
                          return (
                            <button
                              key={course.id}
                              onClick={() => {
                                const updatedUser = {
                                  ...currentUser,
                                  enrolledCourseId: course.id
                                };
                                setCurrentUser(updatedUser);
                                setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
                                setActiveLessonIdx(0);
                              }}
                              className={`w-full text-left p-3 flex items-center gap-3 hover:bg-blue-50/30 transition-colors border-none bg-transparent ${isActive ? "bg-blue-50/50 border-l-4 border-l-blue-600 font-semibold" : ""}`}
                            >
                              <img 
                                src={course.coverImage} 
                                alt={course.title} 
                                className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-100"
                              />
                              <div className="min-w-0">
                                <span className={`block text-xs truncate ${isActive ? "text-blue-700 font-bold" : "text-slate-700"}`}>
                                  {course.title}
                                </span>
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                                  {course.category}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                      <div className="bg-slate-900 text-white p-4">
                        <h3 className="font-bold text-sm uppercase tracking-wider">Lessons Schedule</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Click to view lecture content</p>
                      </div>
                      
                      <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto" id="lesson-schedule-list">
                        {enrolledCourse.lessons.map((lesson, idx) => {
                          const isActive = idx === activeLessonIdx;
                          const isDone = currentUser.completedLessons.includes(lesson.id);
                          return (
                            <button 
                              key={lesson.id}
                              onClick={() => setActiveLessonIdx(idx)}
                              className={`w-full text-left p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors border-none bg-transparent ${isActive ? "bg-blue-50/50 border-l-4 border-l-blue-600" : ""}`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                                  isDone 
                                  ? "bg-emerald-100 text-emerald-700" 
                                  : (isActive ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500")
                                }`}>
                                  {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                                </div>
                                <div className="truncate">
                                  <span className={`block text-xs font-semibold truncate ${isActive ? "text-blue-700" : "text-slate-800"}`}>
                                    {lesson.title}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-medium">
                                    Duration: {lesson.duration}
                                  </span>
                                </div>
                              </div>
                              {isDone && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Completion Reward Center */}
                    {isCourseFullyCompleted && (
                      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-center space-y-3" id="completion-reward-card">
                        <Award className="w-12 h-12 text-emerald-600 mx-auto" />
                        <h4 className="font-extrabold text-slate-900 text-base">Graduation Unlocked!</h4>
                        <p className="text-xs text-slate-600">You have finalized all coursework. Claim your certificate of completion below.</p>
                        <div className="space-y-2">
                          <input 
                            type="text" 
                            required
                            placeholder="Type Your Full Name"
                            value={customCertificateName}
                            onChange={(e) => setCustomCertificateName(e.target.value)}
                            className="w-full text-center px-3 py-1.5 border border-emerald-200 rounded-lg text-xs bg-white outline-hidden"
                          />
                          <button 
                            onClick={() => {
                              if (!customCertificateName.trim()) {
                                alert("Please type your name to print the graduation certificate.");
                                return;
                              }
                              setActiveTab("certificate-print");
                            }}
                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors shadow-xs"
                          >
                            Print Custom Certificate
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Active Video Player & Lecture notes workspace */}
                  <div className="lg:col-span-8 space-y-6">
                    {/* Media Card */}
                    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                      {/* Responsive Iframe Container */}
                      <div className="aspect-video w-full bg-slate-950">
                        <iframe 
                          src={enrolledCourse.lessons[activeLessonIdx].videoUrl}
                          title={enrolledCourse.lessons[activeLessonIdx].title}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        ></iframe>
                      </div>

                      {/* Video info bar */}
                      <div className="p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
                          <div>
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 mb-1.5">
                              Lesson {activeLessonIdx + 1} of {totalLessons}
                            </span>
                            <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
                              {enrolledCourse.lessons[activeLessonIdx].title}
                            </h3>
                          </div>
                          
                          {/* Mark as complete button */}
                          <button 
                            onClick={() => handleMarkLessonComplete(enrolledCourse.lessons[activeLessonIdx].id)}
                            className={`px-4 py-2 rounded-full text-xs font-bold border flex items-center gap-1.5 transition-all shrink-0 ${
                              currentUser.completedLessons.includes(enrolledCourse.lessons[activeLessonIdx].id)
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                              : "bg-blue-600 border-blue-600 hover:bg-blue-700 text-white shadow-xs"
                            }`}
                            id="complete-lesson-btn"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>
                              {currentUser.completedLessons.includes(enrolledCourse.lessons[activeLessonIdx].id) 
                                ? "Chapter Finished" 
                                : "Mark as Completed"
                              }
                            </span>
                          </button>
                        </div>

                        {/* Textual Study Notes */}
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                          <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5 mb-3">
                            <BookOpen className="w-4 h-4 text-blue-600" />
                            <span>Lecture Notes / Guide</span>
                          </h4>
                          <div className="text-slate-600 text-xs sm:text-sm whitespace-pre-line leading-relaxed space-y-4">
                            {enrolledCourse.lessons[activeLessonIdx].notes}
                          </div>
                        </div>

                        {/* Footer navigation triggers */}
                        <div className="flex justify-between items-center pt-2">
                          <button 
                            disabled={activeLessonIdx === 0}
                            onClick={() => setActiveLessonIdx(prev => prev - 1)}
                            className="px-4 py-2 text-xs font-semibold border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 rounded-lg disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1 bg-white"
                            id="prev-lesson-btn"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Previous Chapter</span>
                          </button>
                          
                          <button 
                            disabled={activeLessonIdx === totalLessons - 1}
                            onClick={() => setActiveLessonIdx(prev => prev + 1)}
                            className="px-4 py-2 text-xs font-semibold border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 rounded-lg disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1 bg-white"
                            id="next-lesson-btn"
                          >
                            <span>Next Chapter</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: CERTIFICATE PRINT PREVIEW */}
        {/* ======================================================== */}
        {activeTab === "certificate-print" && enrolledCourse && (
          <div className="max-w-4xl mx-auto px-4 py-16 animate-fade-in text-center" id="certificate-print-view">
            <div className="bg-white border-8 border-double border-amber-600 rounded-3xl p-12 shadow-2xl relative overflow-hidden max-w-3xl mx-auto" id="printable-area">
              
              {/* Decorative corners */}
              <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-600"></div>
              <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-600"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-600"></div>
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-600"></div>

              {/* Certificate content */}
              <div className="space-y-6">
                <span className="text-xs uppercase tracking-widest text-slate-400 font-bold block">Honorary Diploma and Graduation Certificate</span>
                
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-sm border border-amber-200">
                  <Award className="w-8 h-8" />
                </div>
                
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight font-serif" style={{ fontFamily: "Georgia, serif" }}>
                  Certificate of Course Completion
                </h1>
                
                <p className="text-sm text-slate-500 leading-relaxed italic">
                  This academic credential is proudly awarded and presented to
                </p>

                <div className="py-2 border-b-2 border-slate-200 max-w-md mx-auto">
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-wide font-sans underline decoration-amber-600/30 decoration-wavy">
                    {customCertificateName || "Alex Mercer"}
                  </h2>
                </div>

                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  For successfully finalising and graduating all theoretical assignments, quiz structures, code implementations, and interactive lessons associated with the curriculum:
                </p>

                <h3 className="text-lg font-bold text-blue-600 max-w-lg mx-auto leading-snug">
                  {enrolledCourse.title}
                </h3>

                <p className="text-[10px] text-slate-400">
                  Credential ID: <span className="font-mono text-[9px]">EDUP-{enrolledCourse.id}-{Date.now().toString().slice(-6)}</span> | Date: {new Date().toLocaleDateString()}
                </p>

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-100 max-w-lg mx-auto">
                  <div className="text-center">
                    <div className="font-serif italic text-sm text-slate-800 border-b border-slate-200 pb-1 max-w-[150px] mx-auto">
                      {enrolledCourse.author}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Lead Academic Director</div>
                  </div>
                  <div className="text-center">
                    <div className="font-serif italic text-sm text-slate-800 border-b border-slate-200 pb-1 max-w-[150px] mx-auto">
                      EduPremium Board
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Verification Committee</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Back to Studio CTA */}
            <div className="mt-8 flex justify-center gap-3">
              <button 
                onClick={() => window.print()}
                className="px-6 py-2 rounded-full bg-slate-900 text-white font-bold text-sm transition-colors shadow-sm flex items-center gap-1.5"
                id="print-trigger-btn"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certificate</span>
              </button>
              <button 
                onClick={() => setActiveTab("dashboard")}
                className="px-6 py-2 rounded-full bg-blue-600 text-white font-bold text-sm transition-colors shadow-sm"
                id="back-studio-btn"
              >
                Back to Learning Studio
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Premium Footer */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 py-12" id="main-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">E</div>
                <span className="font-bold text-base text-white">EduPremium</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                A highly secure, mobile-friendly E-Learning portal offering top quality coding lessons, comprehensive study guides, dynamic sidebar navigations, and customized graduation certificates.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-bold text-slate-200 text-xs uppercase tracking-widest">Syllabus</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                {COURSES.slice(0, 5).map(c => (
                  <li key={c.id}>
                    <button 
                      onClick={() => handleEnrollClick(c.id)}
                      className="hover:text-blue-400 text-left cursor-pointer border-none bg-transparent p-0 block"
                    >
                      {c.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-200 text-xs uppercase tracking-widest">Quick Links</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <button onClick={() => setActiveTab("home")} className="hover:text-blue-400 cursor-pointer border-none bg-transparent p-0">Home View</button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("about")} className="hover:text-blue-400 cursor-pointer border-none bg-transparent p-0">About Us</button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("courses")} className="hover:text-blue-400 cursor-pointer border-none bg-transparent p-0">Curriculums</button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("contact")} className="hover:text-blue-400 cursor-pointer border-none bg-transparent p-0">Academic Support</button>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-200 text-xs uppercase tracking-widest">Connect with Us</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Have questions about our curriculums? Reach out to our team for quick guidance and support.
              </p>
              <button 
                onClick={() => setActiveTab("contact")}
                className="w-full text-center py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
                id="footer-contact-btn"
              >
                Go to Contact Page
              </button>
            </div>
          </div>

          <hr className="border-slate-800 my-8" />

          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4">
            <span>&copy; {new Date().getFullYear()} EduPremium. All rights reserved.</span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Online Academic Platform</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
