// ============================================================
// 1. AUTHENTICATION LOGIC (خاص بصفحة تسجيل الدخول والإنشاء)
// ============================================================
const tabs = document.querySelectorAll('.tab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

/* 
   هاد الشرط (if) مهم بزاف حيت كيتأكد أننا فصفحة الـ Login،
   وبلا بيه الكود غايتبلوكا ويحبس ليك باقي الدوال فصفحة depart.html
*/
if (tabs.length > 0 && loginForm && signupForm) {
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            if (this.textContent.trim() === 'تسجيل الدخول') {
                loginForm.style.display = 'block';
                signupForm.style.display = 'none';
            } else {
                loginForm.style.display = 'none';
                signupForm.style.display = 'block';
            }
        });
    });

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('✅ تم تسجيل الدخول بنجاح!');
        // هنا زدنا التوجيه التلقائي لصفحة المراسلات الصادرة باش يدخل نيشان للمنصة
        window.location.href = 'depart.html'; 
    });

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('✅ تم إنشاء الحساب بنجاح!');
        // ملي ينشئ الحساب، نرجعوه تلقائياً لتبويب تسجيل الدخول
        if(tabs[0]) tabs[0].click();
    });
}

// ============================================================
// 2. GLOBAL & SIDEBAR LOGIC (خاص بالصفحات الداخلية بعد الدخول)
// ============================================================

// دالة تسجيل الخروج اللي كيعيط ليها الزر اللي كاين فـ السايدبار (Sidebar)
function logout() {
    alert('👋 تم تسجيل الخروج بنجاح.');
    // كيرجع المستخدم لصفحة اللوغان الرئيسية (تأكد أن اسمها index.html)
    window.location.href = 'index.html'; 
}

// دالة تفاعلية لزر "تسجيل مراسلة جديدة" إذا كان متواجداً في الشاشة
const btnAdd = document.querySelector('.btn-add');
if (btnAdd) {
    btnAdd.addEventListener('click', function() {
        alert('➕ قريباً: سيتم ربط هاد الزر بـ Modal أو نافذة منبثقة لإضافة المراسلة الصادرة الجديدة!');
    });
}