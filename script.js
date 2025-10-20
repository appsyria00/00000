const GITHUB_TOKEN = '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';
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push({email, password});
    localStorage.setItem('users', JSON.stringify(users));
    message.innerHTML = `✅ تم الحفظ! (${users.length})<br>${users.map(u=>`📧 ${u.email}`).join('<br>')}`;
    message.className = 'success';
    document.getElementById('loginForm').reset();
});
