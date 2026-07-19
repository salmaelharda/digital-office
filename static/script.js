// ============================================================
// 1. CUSTOM TOAST NOTIFICATION ENGINE (نظام الإشعارات العصرية الجديد)
// ============================================================
function showToast(message, type = 'success') {
    // 1. إنشاء عنصر الإشعار
    const toast = document.createElement('div');
    toast.className = `custom-toast toast-${type}`;
    
    // 2. اختيار الأيقونة المناسبة حسب النوع (نجاح أو خطأ)
    const icon = type === 'success' 
        ? '<i class="fas fa-check-circle"></i>' 
        : '<i class="fas fa-exclamation-circle"></i>';
    
    // 3. تركيب محتوى الإشعار (الكتابة على اليمين والأيقونة حداها)
    toast.innerHTML = `
        <span class="toast-text">${message}</span>
        <span class="toast-icon">${icon}</span>
    `;
    
    // 4. إضافة الإشعار لصفحة الـ HTML
    document.body.appendChild(toast);
    
    // 5. حذفه تلقائياً بعد 3.5 ثواني مع حركة اختفاء ناعمة
    setTimeout(() => {
        toast.classList.add('hide');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 3500);
}


// ============================================================
// 2. AUTHENTICATION LOGIC (تسجيل الدخول والإنشاء)
// ============================================================
const tabs = document.querySelectorAll('.tab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

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
        
        // هنا استعملنا الإشعار العصري الجديد للنجاح
        showToast('مرحباً بعودتك! تم تسجيل الدخول بنجاح.', 'success');
        
        // توجيه المستخدم بعد ثانية واحدة باش يلحق يشوف الإشعار الزوين
        setTimeout(() => {
            window.location.href = 'dashboard.html'; 
        }, 1200);
    });

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        showToast('تم إنشاء الحساب بنجاح! يمكنك الدخول الآن.', 'success');
        
        if(tabs[0]) tabs[0].click();
    });
}


// ============================================================
// 3. GLOBAL & SIDEBAR LOGIC (تسجيل الخروج)
// ============================================================
function logout() {
    showToast('تم تسجيل الخروج بنجاح. رافقتك السلامة!', 'success');
    
    setTimeout(() => {
        window.location.href = 'index.html'; 
    }, 1200);
}


// ============================================================
// 4. MODAL LOGIC (تحريك وفتح وإغلاق نافذة تسجيل المراسلات)
// ============================================================
const modal = document.getElementById('correspondenceModal');
const btnOpenModal = document.querySelector('.btn-add');
const formNewCorrespondence = document.getElementById('formNewCorrespondence');

if (btnOpenModal && modal) {
    btnOpenModal.addEventListener('click', function() {
        modal.style.display = 'flex'; 
    });
}

function closeModal() {
    const modal = document.getElementById('correspondenceModal');
    if (modal) {
        modal.style.display = 'none'; 
        if(formNewCorrespondence) formNewCorrespondence.reset(); 
    }
}

if (modal) {
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// تعويض الجزء الأخير الخاص بالـ Submit فـ script.js بهاد الكود الديناميكي:
if (formNewCorrespondence) {
    formNewCorrespondence.addEventListener('submit', function(e) {
        e.preventDefault(); // منع الصفحة من الريفريش التلقائي
        
        // تجميع البيانات الحقيقية من الفورم
        const formData = new FormData(formNewCorrespondence);
        
        // اللعبة الذكية: كيقرا الـ action من الـ HTML نيشان (/add_arrivee أو /add_depart)
        const targetUrl = formNewCorrespondence.getAttribute('action');
        
        // إرسال البيانات للبايثون ديناميكياً
        fetch(targetUrl, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                showToast(data.message, 'success'); // الإشعار العصري ديالك
                closeModal(); // شد النافذة
                
                // إعادة تحميل الصفحة مورا ثانية باش تظهر المراسلة الجديدة فالجدول تلقائياً
                setTimeout(() => {
                    window.location.reload();
                }, 1200);
            }
        })
        .catch(error => {
            showToast('حدث خطأ أثناء تسجيل المراسلة!', 'error');
            console.error('Error:', error);
        });
    });
}