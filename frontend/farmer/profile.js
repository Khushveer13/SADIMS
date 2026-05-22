document.addEventListener('DOMContentLoaded', () => {
    // 1. Load User from Session
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        window.location.href = '../auth/login.html';
        return;
    }

    // 2. Populate UI
    document.getElementById('dispName').textContent = user.name || 'SADIMS Farmer';
    document.getElementById('dispMobile').textContent = user.mobileNumber || 'No Mobile Registered';

    const headerUserNameEl = document.getElementById('headerUserName');
    if (headerUserNameEl) {
        headerUserNameEl.textContent = user.name || 'Farmer';
    }

    document.getElementById('profName').value = user.name || '';
    document.getElementById('profMobile').value = user.mobileNumber || '';
    document.getElementById('profRole').value = user.role === 'FARMER' ? 'Verified Farmer' : 'System Administrator';

    // 3. Handle Creation Date (Formatting)
    if (user.createdAt) {
        const date = new Date(user.createdAt);
        document.getElementById('profJoinDate').value = date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    } else {
        document.getElementById('profJoinDate').value = 'January 2024';
    }

    // 4. Password Toggle
    document.getElementById('changePassBtn').addEventListener('click', () => {
        const form = document.getElementById('passForm');
        form.classList.toggle('hidden');
    });

    // 5. Auto-expand change password if query param is set
    const params = new URLSearchParams(window.location.search);
    if (params.get('changePassword') === 'true') {
        const form = document.getElementById('passForm');
        if (form) {
            form.classList.remove('hidden');
            form.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

async function updatePassword() {
    const user = JSON.parse(localStorage.getItem('user'));
    const oldPass = document.getElementById('oldPass').value;
    const newPass = document.getElementById('newPass').value;

    if (!oldPass || !newPass) {
        alert('Please fill both password fields');
        return;
    }

    try {
        await ApiService.changePassword(user.id, oldPass, newPass);
        alert('Password updated successfully! Please login again.');
        localStorage.removeItem('user');
        window.location.href = '../auth/login.html';
    } catch (e) {
        alert(e.message);
    }
}
