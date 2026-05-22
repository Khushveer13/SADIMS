// Clear any existing session to ensure a clean login attempt
localStorage.removeItem('user');

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Get Inputs
    const mobile = document.getElementById('mobile').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');

    // Simple Validation
    if (!mobile || !password) {
        errorMsg.textContent = "Please fill in all fields.";
        errorMsg.classList.remove('hidden');
        return;
    }

    try {
        // 2. Call Backend API
        const user = await ApiService.login(mobile, password);

        // 3. Store Session (Basic Security)
        localStorage.setItem('user', JSON.stringify(user));

        // 4. Role-Based Redirect
        if (user.role === 'ADMIN') {
            window.location.href = '../admin/dashboard.html';
        } else {
            // Default to Farmer
            window.location.href = '../farmer/dashboard.html';
        }
    } catch (error) {
        // Handle Errors (Invalid Credentials)
        console.error(error);
        errorMsg.textContent = "Login Failed: Invalid mobile number or password.";
        errorMsg.classList.remove('hidden');
    }
});
