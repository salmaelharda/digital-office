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

// ============================================================
// 3. MODAL LOGIC (تحريك وفتح وإغلاق نافذة تسجيل المراسلات)
// ============================================================

const modal = document.getElementById('correspondenceModal');
const btnOpenModal = document.querySelector('.btn-add');
const formNewCorrespondence = document.getElementById('formNewCorrespondence');

// فتح المودال عند الضغط على زر "+ تسجيل مراسلة جديدة"
if (btnOpenModal && modal) {
    btnOpenModal.addEventListener('click', function() {
        modal.style.display = 'flex'; // إظهار النافذة
    });
}

// دالة إغلاق المودال (كتخدم مع زر X وزر إلغاء)
function closeModal() {
    const modal = document.getElementById('correspondenceModal');
    if (modal) {
        modal.style.display = 'none'; // إخفاء النافذة
        if(formNewCorrespondence) formNewCorrespondence.reset(); // مسح البيانات المدخلة تلقائياً
    }
}

// إغلاق المودال تلقائياً لو المستخدم كليكا خارج الإطار الأبيض
window.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});

// التعامل مع إرسال الفورم (Submit)
if (formNewCorrespondence) {
    formNewCorrespondence.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('✅ تم تسجيل المراسلة بنجاح وحفظها في النظام!');
        closeModal(); // إغلاق النافذة بعد الحفظ
    });
}