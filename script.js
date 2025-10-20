document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');
    
    // تحقق إذا الملف موجود
    try {
        const response = await fetch('users.json');
        let users = [];
        
        if (response.ok) {
            users = await response.json();
        }
        
        // إضافة المستخدم الجديد
        const newUser = {
            id: Date.now(),
            email: email,
            password: password, // ⚠️ في الواقع استخدم تشفير!
            date: new Date().toLocaleString('ar')
        };
        
        users.push(newUser);
        
        // حفظ في users.json
        await fetch('users.json', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(users, null, 2)
        });
        
        message.innerHTML = '✅ تم حفظ بياناتك بنجاح!';
        message.className = 'success';
        document.getElementById('loginForm').reset();
        
    } catch (error) {
        // إذا الملف مش موجود، أنشئه
        const newUser = [{
            id: Date.now(),
            email: email,
            password: password,
            date: new Date().toLocaleString('ar')
        }];
        
        fetch('users.json', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser, null, 2)
        }).then(() => {
            message.innerHTML = '✅ تم إنشاء الملف وحفظ بياناتك!';
            message.className = 'success';
            document.getElementById('loginForm').reset();
        });
    }
});