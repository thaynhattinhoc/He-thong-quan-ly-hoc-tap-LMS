/**
 * ==========================================================================
 * HỆ THỐNG QUẢN LÝ HỌC TẬP LMS - KAYLA EDUCATION
 * Thiết kế bởi: KS. Nguyễn Đăng Nhật
 * Điện thoại: 0973761096, Email: dangnhat96@gmail.com
 * Blog: tinhocdangnhat.blogspot.com
 * Add: 72/2 Lê Văn Triều, xóm 2, thôn Đồi Giang, xã Tánh Linh, tỉnh Lâm Đồng.
 * ==========================================================================
 */

// Mock Database & State
const LMS_DATA = {
  currentUser: {
    name: "Đăng Nhật",
    role: "Học viên IELTS Mastery",
    target: "IELTS 7.5+",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    streak: 7,
    points: 1250,
    hoursLearned: 24.5
  },
  courses: [
    {
      id: "ielts-intensive",
      title: "IELTS Intensive 7.5+ Toàn Diện",
      category: "IELTS",
      instructor: "Mr. David Wilson (Ex-Examiner) & Thầy Nhật",
      progress: 68,
      totalLessons: 45,
      completedLessons: 31,
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80",
      nextLesson: "Speaking Part 3 - Idiomatic Language & Fluency",
      badge: "Đang học",
      schedule: "Tối 2-4-6 (19:30 - 21:00)"
    },
    {
      id: "toeic-listening-reading",
      title: "TOEIC Đột Phá 850+ Cấp Tốc",
      category: "TOEIC",
      instructor: "Ms. KayLa Tran & Cô Thu Hà",
      progress: 82,
      totalLessons: 36,
      completedLessons: 30,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80",
      nextLesson: "Part 7 Double Passages Strategy",
      badge: "Gần hoàn thành",
      schedule: "Tối 3-5-7 (18:00 - 19:30)"
    },
    {
      id: "business-comm",
      title: "Tiếng Anh Giao Tiếp & Thuyết Trình Doanh Nghiệp",
      category: "Giao tiếp",
      instructor: "Mr. Anthony Hopkins (Native)",
      progress: 40,
      totalLessons: 24,
      completedLessons: 10,
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80",
      nextLesson: "Negotiation Tactics & Email Etiquette",
      badge: "Đang học",
      schedule: "Chiều Thứ 7 & CN (14:00 - 16:00)"
    },
    {
      id: "vstep-b2-c1",
      title: "Luyện Thi Chuẩn B2 - C1 Khung Châu Âu VSTEP",
      category: "VSTEP",
      instructor: "ThS. Hoàng Phương Thảo",
      progress: 25,
      totalLessons: 40,
      completedLessons: 10,
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80",
      nextLesson: "Writing Task 2: Opinion Essay Formulas",
      badge: "Mới bắt đầu",
      schedule: "Tối Thứ 2 & Thứ 5 (20:00 - 21:30)"
    }
  ],
  liveClasses: [
    {
      title: "Workshop: Master IELTS Speaking Part 2 with Former Examiner",
      teacher: "Mr. David Wilson (8.5 IELTS Native)",
      time: "20:00 Hôm nay",
      countdown: "01:45:20",
      link: "https://meet.google.com/kayla-lms-demo",
      type: "Phòng học trực tuyến VIP",
      room: "Phòng Lab A301 / Zoom Live"
    },
    {
      title: "Giải đề dự đoán TOEIC Speaking & Writing Quý 4",
      teacher: "Ms. KayLa Tran",
      time: "19:30 Ngày mai",
      countdown: "24:15:00",
      link: "https://zoom.us/j/kayla-live",
      type: "Lớp phụ đạo tăng cường",
      room: "Trực tuyến 100%"
    }
  ],
  quizSample: [
    {
      q: "Which of the following phrases is the most natural to express an opinion in academic IELTS Writing Task 2?",
      options: [
        "A. According to me, people should...",
        "B. It is widely argued that investing in education brings...",
        "C. I think from my mind that...",
        "D. By my idea, government must..."
      ],
      correct: 1,
      explain: "Cụm 'It is widely argued that...' mang tính học thuật (academic tone) cao, phù hợp với tiêu chuẩn band 7.0+ của IELTS."
    },
    {
      q: "Choose the correct collocation: 'The government should ______ immediate measures to curb pollution.'",
      options: [
        "A. make",
        "B. do",
        "C. take",
        "D. bring"
      ],
      correct: 2,
      explain: "Collocation chuẩn là 'take measures' (thực hiện biện pháp)."
    }
  ]
};

// Initialize charts when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  initRadarChart();
  initWeeklyChart();
  renderCourses();
  setupEventListeners();
  startLiveCountdown();
});

// Switch Tabs Navigation
function switchTab(tabId) {
  const sections = document.querySelectorAll('.tab-content-section');
  sections.forEach(sec => sec.classList.add('hidden'));

  const targetSection = document.getElementById(`tab-${tabId}`);
  if (targetSection) {
    targetSection.classList.remove('hidden');
    targetSection.classList.add('animate-fade-in');
  }

  // Update nav buttons
  const navBtns = document.querySelectorAll('.nav-tab-btn');
  navBtns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active');
    }
  });

  // Scroll to top of content smoothly
  window.scrollTo({ top: 180, behavior: 'smooth' });
}

// Render Courses
function renderCourses(filterCategory = 'ALL') {
  const container = document.getElementById('courses-grid-container');
  if (!container) return;

  const filtered = filterCategory === 'ALL'
    ? LMS_DATA.courses
    : LMS_DATA.courses.filter(c => c.category === filterCategory);

  container.innerHTML = filtered.map(course => `
    <div class="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group">
      <div>
        <div class="relative h-44 overflow-hidden">
          <img src="${course.image}" alt="${course.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          <span class="absolute top-3 left-3 bg-indigo-600/90 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
            ${course.category}
          </span>
          <span class="absolute top-3 right-3 bg-emerald-500/90 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
            <i class="fa-solid fa-check-circle"></i> ${course.badge}
          </span>
          <div class="absolute bottom-3 left-3 right-3 text-white">
            <p class="text-xs text-indigo-200 flex items-center gap-1">
              <i class="fa-solid fa-chalkboard-user"></i> ${course.instructor}
            </p>
          </div>
        </div>

        <div class="p-5">
          <h3 class="font-bold text-slate-800 text-lg leading-snug group-hover:text-indigo-600 transition-colors">
            ${course.title}
          </h3>

          <div class="mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div class="flex justify-between items-center text-xs mb-1.5 font-medium">
              <span class="text-slate-500">Tiến độ khóa học:</span>
              <span class="text-indigo-600 font-bold">${course.progress}% (${course.completedLessons}/${course.totalLessons} bài)</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div class="bg-gradient-to-r from-indigo-500 to-sky-400 h-2 rounded-full transition-all duration-1000" style="width: ${course.progress}%"></div>
            </div>
          </div>

          <div class="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <i class="fa-regular fa-clock text-indigo-500"></i>
            <span>Bài học tiếp: <strong class="text-slate-700">${course.nextLesson}</strong></span>
          </div>

          <div class="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <i class="fa-regular fa-calendar-days text-amber-500"></i>
            <span>Lịch học: ${course.schedule}</span>
          </div>
        </div>
      </div>

      <div class="p-5 pt-0">
        <button onclick="openLessonModal('${course.title}', '${course.nextLesson}')" class="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white py-2.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm shadow-indigo-200 transition-all">
          <i class="fa-solid fa-play"></i> Vào học bài tiếp theo
        </button>
      </div>
    </div>
  `).join('');
}

// Radar Chart for 4 Skills Assessment
function initRadarChart() {
  const ctx = document.getElementById('skillsRadarChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Listening (Nghe)', 'Speaking (Nói)', 'Reading (Đọc)', 'Writing (Viết)', 'Vocabulary (Từ vựng)', 'Grammar (Ngữ pháp)'],
      datasets: [
        {
          label: 'Năng lực hiện tại (Band)',
          data: [7.5, 7.0, 8.0, 6.5, 8.0, 7.5],
          backgroundColor: 'rgba(79, 70, 229, 0.2)',
          borderColor: 'rgba(79, 70, 229, 1)',
          pointBackgroundColor: 'rgba(79, 70, 229, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(79, 70, 229, 1)',
          borderWidth: 2
        },
        {
          label: 'Mục tiêu KayLa IELTS 7.5+',
          data: [8.0, 7.5, 8.5, 7.5, 8.5, 8.0],
          backgroundColor: 'rgba(14, 165, 233, 0.1)',
          borderColor: 'rgba(14, 165, 233, 0.8)',
          pointBackgroundColor: 'rgba(14, 165, 233, 1)',
          borderDash: [5, 5],
          borderWidth: 1.5
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          min: 4,
          max: 9,
          ticks: {
            stepSize: 1,
            backdropColor: 'transparent',
            color: '#94a3b8',
            font: { size: 10 }
          },
          grid: {
            color: '#e2e8f0'
          },
          angleLines: {
            color: '#e2e8f0'
          },
          pointLabels: {
            font: {
              size: 11,
              weight: '600'
            },
            color: '#334155'
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            font: { size: 11, family: 'Plus Jakarta Sans' }
          }
        }
      }
    }
  });
}

// Weekly Study Hours Bar Chart
function initWeeklyChart() {
  const ctx = document.getElementById('weeklyStudyChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
      datasets: [{
        label: 'Thời gian học (Giờ)',
        data: [3.5, 4.0, 2.5, 5.0, 3.0, 4.5, 2.0],
        backgroundColor: [
          '#6366f1',
          '#6366f1',
          '#6366f1',
          '#4f46e5',
          '#6366f1',
          '#4f46e5',
          '#38bdf8'
        ],
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            color: '#94a3b8',
            font: { size: 10 }
          },
          grid: {
            color: '#f1f5f9'
          }
        },
        x: {
          ticks: {
            color: '#64748b',
            font: { size: 11, weight: '600' }
          },
          grid: { display: false }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// Event Listeners Setup
function setupEventListeners() {
  // Live Search bar
  const searchInput = document.getElementById('top-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function (e) {
      const keyword = e.target.value.toLowerCase().trim();
      filterCoursesByKeyword(keyword);
    });
  }

  // Course Filter buttons
  const filterBtns = document.querySelectorAll('.course-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('bg-indigo-600', 'text-white'));
      filterBtns.forEach(b => b.classList.add('bg-slate-100', 'text-slate-600'));
      this.classList.remove('bg-slate-100', 'text-slate-600');
      this.classList.add('bg-indigo-600', 'text-white');
      const cat = this.getAttribute('data-filter');
      renderCourses(cat);
    });
  });
}

// Filter courses by keyword
function filterCoursesByKeyword(keyword) {
  const container = document.getElementById('courses-grid-container');
  if (!container) return;

  const filtered = LMS_DATA.courses.filter(c =>
    c.title.toLowerCase().includes(keyword) ||
    c.instructor.toLowerCase().includes(keyword) ||
    c.category.toLowerCase().includes(keyword)
  );

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center">
        <i class="fa-solid fa-magnifying-glass text-4xl text-slate-300 mb-3"></i>
        <p class="text-slate-500 font-medium">Không tìm thấy khóa học nào phù hợp với từ khóa "${keyword}".</p>
        <button onclick="renderCourses('ALL')" class="mt-3 text-indigo-600 hover:underline font-semibold text-sm">Xem tất cả khóa học</button>
      </div>
    `;
    return;
  }

  // Render subset
  container.innerHTML = filtered.map(course => `
    <div class="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group">
      <div>
        <div class="relative h-44 overflow-hidden">
          <img src="${course.image}" alt="${course.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          <span class="absolute top-3 left-3 bg-indigo-600/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase">
            ${course.category}
          </span>
          <div class="absolute bottom-3 left-3 right-3 text-white">
            <p class="text-xs text-indigo-200"><i class="fa-solid fa-chalkboard-user"></i> ${course.instructor}</p>
          </div>
        </div>
        <div class="p-5">
          <h3 class="font-bold text-slate-800 text-lg leading-snug">${course.title}</h3>
          <div class="mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div class="flex justify-between items-center text-xs mb-1.5 font-medium">
              <span class="text-slate-500">Tiến độ:</span>
              <span class="text-indigo-600 font-bold">${course.progress}%</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-2">
              <div class="bg-indigo-600 h-2 rounded-full" style="width: ${course.progress}%"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="p-5 pt-0">
        <button onclick="openLessonModal('${course.title}', '${course.nextLesson}')" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
          <i class="fa-solid fa-play"></i> Vào học ngay
        </button>
      </div>
    </div>
  `).join('');
}

// Live Countdown Simulation
function startLiveCountdown() {
  let seconds = 3600 * 2 + 15 * 60; // 2h 15m
  const elem = document.getElementById('liveCountdownTimer');
  if (!elem) return;

  setInterval(() => {
    if (seconds <= 0) return;
    seconds--;
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    elem.innerText = `${h}:${m}:${s}`;
  }, 1000);
}

// Quiz Interactive Modal
let currentQuizIndex = 0;
function openQuickQuizModal() {
  currentQuizIndex = 0;
  renderQuizQuestion();
  const modal = document.getElementById('quizModal');
  if (modal) modal.classList.remove('hidden');
}

function closeQuizModal() {
  const modal = document.getElementById('quizModal');
  if (modal) modal.classList.add('hidden');
}

function renderQuizQuestion() {
  const quiz = LMS_DATA.quizSample[currentQuizIndex];
  const qTitle = document.getElementById('quizQuestionTitle');
  const qOptions = document.getElementById('quizOptionsContainer');
  const qExplanation = document.getElementById('quizExplanation');
  const qStep = document.getElementById('quizStepIndicator');

  if (!qTitle || !qOptions) return;

  qStep.innerText = `Câu hỏi ${currentQuizIndex + 1} / ${LMS_DATA.quizSample.length}`;
  qTitle.innerText = quiz.q;
  qExplanation.classList.add('hidden');

  qOptions.innerHTML = quiz.options.map((opt, idx) => `
    <button onclick="checkQuizAnswer(${idx})" class="quiz-option-btn w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all font-medium text-slate-700 text-sm flex items-center justify-between">
      <span>${opt}</span>
      <span class="opt-icon w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-xs text-transparent">✓</span>
    </button>
  `).join('');
}

function checkQuizAnswer(selectedIndex) {
  const quiz = LMS_DATA.quizSample[currentQuizIndex];
  const buttons = document.querySelectorAll('.quiz-option-btn');
  const qExplanation = document.getElementById('quizExplanation');

  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === quiz.correct) {
      btn.classList.add('bg-emerald-50', 'border-emerald-500', 'text-emerald-800');
      btn.querySelector('.opt-icon').classList.remove('text-transparent', 'border-slate-300');
      btn.querySelector('.opt-icon').classList.add('bg-emerald-500', 'text-white', 'border-emerald-500');
    }
    if (idx === selectedIndex && selectedIndex !== quiz.correct) {
      btn.classList.add('bg-rose-50', 'border-rose-500', 'text-rose-800');
      btn.querySelector('.opt-icon').innerText = '✕';
      btn.querySelector('.opt-icon').classList.remove('text-transparent', 'border-slate-300');
      btn.querySelector('.opt-icon').classList.add('bg-rose-500', 'text-white', 'border-rose-500');
    }
  });

  qExplanation.classList.remove('hidden');
  document.getElementById('quizExplainText').innerText = quiz.explain;

  if (selectedIndex === quiz.correct) {
    showToast("Chính xác! Bạn được cộng +50 điểm chuyên cần!", "success");
    if (typeof confetti === 'function') {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
    }
  } else {
    showToast("Chưa chính xác! Hãy đọc kỹ giải thích từ giảng viên nhé.", "error");
  }
}

function nextQuizQuestion() {
  if (currentQuizIndex < LMS_DATA.quizSample.length - 1) {
    currentQuizIndex++;
    renderQuizQuestion();
  } else {
    closeQuizModal();
    showToast("Chúc mừng! Bạn đã hoàn thành bài luyện tập nhanh hôm nay!", "success");
  }
}

// Lesson Player Modal
function openLessonModal(courseTitle, lessonName) {
  const modal = document.getElementById('lessonModal');
  document.getElementById('lessonModalCourseTitle').innerText = courseTitle;
  document.getElementById('lessonModalLessonName').innerText = lessonName;
  if (modal) modal.classList.remove('hidden');
}

function closeLessonModal() {
  const modal = document.getElementById('lessonModal');
  if (modal) modal.classList.add('hidden');
}

// Audio Drill Player Simulation
let isAudioPlaying = false;
function toggleAudioDrill() {
  const btn = document.getElementById('audioPlayBtn');
  const bars = document.querySelectorAll('.audio-visualizer-bar');
  isAudioPlaying = !isAudioPlaying;

  if (isAudioPlaying) {
    btn.innerHTML = '<i class="fa-solid fa-pause"></i> Tạm dừng nghe';
    btn.classList.replace('bg-indigo-600', 'bg-amber-600');
    bars.forEach(b => b.style.animationPlayState = 'running');
    showToast("Đang phát audio hội thoại IELTS Section 3...", "info");
  } else {
    btn.innerHTML = '<i class="fa-solid fa-play"></i> Bắt đầu nghe audio';
    btn.classList.replace('bg-amber-600', 'bg-indigo-600');
    bars.forEach(b => b.style.animationPlayState = 'paused');
  }
}

// AI Speaking Lab Simulation
let isRecording = false;
function toggleSpeakingRecord() {
  const btn = document.getElementById('recordSpeakingBtn');
  const status = document.getElementById('speakingStatusText');
  const resultBox = document.getElementById('speakingResultBox');

  isRecording = !isRecording;
  if (isRecording) {
    btn.classList.replace('bg-rose-600', 'bg-slate-700');
    btn.innerHTML = '<i class="fa-solid fa-stop text-lg animate-pulse"></i> Dừng ghi âm & Phân tích AI';
    status.innerHTML = '<span class="text-rose-600 font-bold animate-pulse">● Đang thu âm giọng nói của bạn... Hãy phát âm câu mẫu bên trên!</span>';
    resultBox.classList.add('hidden');
  } else {
    btn.classList.replace('bg-slate-700', 'bg-rose-600');
    btn.innerHTML = '<i class="fa-solid fa-microphone text-lg"></i> Bấm để đọc lại câu mẫu';
    status.innerHTML = '<span class="text-indigo-600 font-semibold">AI KayLa đang thẩm định ngữ điệu & độ chuẩn xác IPA...</span>';

    setTimeout(() => {
      status.innerHTML = '<span class="text-emerald-600 font-bold"><i class="fa-solid fa-circle-check"></i> Đã hoàn thành chấm điểm!</span>';
      resultBox.classList.remove('hidden');
      if (typeof confetti === 'function') {
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
      }
    }, 1500);
  }
}

// Toast Notifications
function showToast(message, type = "info") {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bgColors = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-rose-600 text-white',
    info: 'bg-indigo-600 text-white',
    warning: 'bg-amber-500 text-white'
  };

  const icons = {
    success: 'fa-circle-check',
    error: 'fa-circle-xmark',
    info: 'fa-circle-info',
    warning: 'fa-triangle-exclamation'
  };

  toast.className = `${bgColors[type] || bgColors.info} shadow-xl py-3 px-4 rounded-xl flex items-center gap-3 text-sm font-medium animate-fade-in transition-all transform`;
  toast.innerHTML = `
    <i class="fa-solid ${icons[type]} text-base"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Switch User Role Simulation (Học viên -> Giảng viên -> Quản trị viên)
function switchUserRole(role) {
  const badge = document.getElementById('userRoleDisplay');
  const name = document.getElementById('userNameDisplay');
  if (!badge || !name) return;

  if (role === 'TEACHER') {
    name.innerText = "Thầy Minh Anh";
    badge.innerText = "Giảng viên Trưởng - IELTS 8.5";
    badge.className = "text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800";
    showToast("Đã chuyển sang chế độ Quản lý bài giảng của Giảng viên!", "info");
  } else if (role === 'ADMIN') {
    name.innerText = "DỊCH VỤ TIN HỌC ĐĂNG NHẬT";
    badge.innerText = "Quản trị viên Hệ thống LMS KayLa";
    badge.className = "text-xs font-semibold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800";
    showToast("Đã kích hoạt quyền Quản trị tối cao LMS!", "success");
  } else {
    name.innerText = "Đăng Nhật";
    badge.innerText = "Học viên IELTS Mastery";
    badge.className = "text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700";
    showToast("Đã quay về giao diện Học tập của Học viên!", "info");
  }

  const dropdown = document.getElementById('userMenuDropdown');
  if (dropdown) dropdown.classList.add('hidden');
}

// Toggle notification panel
function toggleNotificationDropdown() {
  const panel = document.getElementById('notificationDropdown');
  if (panel) panel.classList.toggle('hidden');
}

// Toggle user profile dropdown
function toggleUserMenuDropdown() {
  const panel = document.getElementById('userMenuDropdown');
  if (panel) panel.classList.toggle('hidden');
}

// Close dropdowns on outside click
document.addEventListener('click', function(e) {
  const notifBtn = document.getElementById('notificationBtn');
  const notifDropdown = document.getElementById('notificationDropdown');
  const userBtn = document.getElementById('userMenuBtn');
  const userDropdown = document.getElementById('userMenuDropdown');

  if (notifBtn && notifDropdown && !notifBtn.contains(e.target) && !notifDropdown.contains(e.target)) {
    notifDropdown.classList.add('hidden');
  }

  if (userBtn && userDropdown && !userBtn.contains(e.target) && !userDropdown.contains(e.target)) {
    userDropdown.classList.add('hidden');
  }
});
