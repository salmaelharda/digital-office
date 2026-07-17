// التبديل بين تبويب تسجيل الدخول والحساب الجديد
const tabs = document.querySelectorAll('.tab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

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
});

signupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('✅ تم إنشاء الحساب بنجاح!');
});