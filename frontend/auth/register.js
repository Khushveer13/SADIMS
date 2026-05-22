document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Get Inputs
    const name = document.getElementById('name').value;
    const mobile = document.getElementById('mobile').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');

    try {
        // 2. Call Backend API
        // User is registered as FARMER by default in the backend logic
        await ApiService.register(name, mobile, password);

        // 3. Success Feedback & Redirect
        alert('Registration Successful! Please login with your new credentials.');
        window.location.href = 'login.html';

    } catch (error) {
        // Handle Errors (e.g. Mobile already exists)
        errorMsg.textContent = "Registration Failed: Mobile number is likely already registered.";
        errorMsg.classList.remove('hidden');
    }
});
