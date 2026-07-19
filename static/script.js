// ============================================================
// 1. CUSTOM TOAST NOTIFICATION ENGINE
// ============================================================
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `custom-toast toast-${type}`;
    const icon = type === 'success' 
        ? '<i class="fas fa-check-circle"></i>' 
        : '<i class="fas fa-exclamation-circle"></i>';
    
    toast.innerHTML = `
        <span class="toast-text">${message}</span>
        <span class="toast-icon">${icon}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('hide');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 3500);
}

// ============================================================
// 2. AUTHENTICATION LOGIC
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

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        showToast('تم إنشاء الحساب بنجاح! يمكنك الدخول الآن.', 'success');
        if(tabs[0]) tabs[0].click();
    });
}

// ============================================================
// 3. GLOBAL & SIDEBAR LOGIC
// ============================================================
function logout() {
    showToast('تم تسجيل الخروج بنجاح. رافقتك السلامة!', 'success');
    setTimeout(() => {
        window.location.href = '/'; 
    }, 1200);
}

// ============================================================
// 4. MODAL LOGIC
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

// ============================================================
// 5. FORM SUBMISSION (Dynamic)
// ============================================================
if (formNewCorrespondence) {
    formNewCorrespondence.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(formNewCorrespondence);
        const targetUrl = formNewCorrespondence.getAttribute('action');
        
        fetch(targetUrl, {
            method: 'POST',
            body: formData
        })
        .then(() => {
            showToast('تمت العملية بنجاح!', 'success');
            closeModal();
            setTimeout(() => { window.location.reload(); }, 1000);
        })
        .catch(error => {
            showToast('حدث خطأ أثناء التسجيل!', 'error');
            console.error('Error:', error);
        });
    });
}

// ============================================================
// 6. DELETE ITEM LOGIC (Compatible with POST)
// ============================================================
function deleteItem(url, element) {
    if (confirm('واش متأكدة بغيتي تمسحي هاد المراسلة؟')) {
        fetch(url, { method: 'POST' })
        .then(response => {
            if (response.ok) {
                const parent = element.closest('tr') || element.closest('.result-item');
                if (parent) parent.remove();
                showToast('تم الحذف بنجاح!', 'success');
            } else {
                showToast('وقع خطأ أثناء الحذف', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('وقع خطأ تقني', 'error');
        });
    }
}