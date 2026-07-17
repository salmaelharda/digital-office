// ===== LOGIN =====
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    window.location.href = 'dashboard.html';
});

// ===== LOGOUT =====
function logout() {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        window.location.href = 'index.html';
    }
}

// ===== SIMULATE DATA (pour tester) =====
// Exemple: ajouter des données factices
const sampleArrivee = [
    { num: '001', expediteur: 'وزارة الداخلية', departement: 'المديرية العامة', sujet: 'طلب ترخيص', date: '2026-07-15' },
    { num: '002', expediteur: 'الجماعة المحلية', departement: 'قسم التعمير', sujet: 'شهادة سكنى', date: '2026-07-16' }
];

const sampleDepart = [
    { num: '101', destinataire: 'وزارة التربية', sujet: 'مراسلة بشأن المنحة', piece: 'ملف PDF', date: '2026-07-14' }
];

// Fonction pour remplir un tableau
function renderTable(tbodyId, data, columns) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    if (!data || data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="${columns.length}" class="empty-row">
                    <i class="fas fa-inbox fa-2x"></i>
                    <p>لا توجد مراسلات مسجلة بعد</p>
                </td>
            </tr>
        `;
        return;
    }
    tbody.innerHTML = data.map(row => {
        return `<tr>${columns.map(col => `<td>${row[col] || '-'}</td>`).join('')}</tr>`;
    }).join('');
}

// Remplir les tableaux si on est sur la bonne page
if (document.getElementById('arriveeBody')) {
    renderTable('arriveeBody', sampleArrivee, ['num', 'expediteur', 'departement', 'sujet', 'date']);
}
if (document.getElementById('departBody')) {
    renderTable('departBody', sampleDepart, ['num', 'destinataire', 'sujet', 'piece', 'date']);
}

// ===== SEARCH (simulé) =====
document.querySelector('.search-row button')?.addEventListener('click', function(e) {
    e.preventDefault();
    alert('🔍 بحث متقدم: سيتم عرض النتائج حسب معايير البحث');
});