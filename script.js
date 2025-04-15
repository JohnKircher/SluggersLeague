// Update these URLs based on where your backend is hosted
const API_BASE_URL = 'http://localhost:5000/api';

// Login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Save token to localStorage
            localStorage.setItem('mssl_token', data.token);
            localStorage.setItem('mssl_user', JSON.stringify(data.user));
            currentUser = data.user;
            loginModal.hide();
            updateUI();
            loginForm.reset();
        } else {
            alert(data.errors?.[0]?.msg || 'Login failed');
        }
    } catch (err) {
        console.error('Login error:', err);
        alert('Login failed. Please try again.');
    }
});

// Register form submission
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Save token to localStorage
            localStorage.setItem('mssl_token', data.token);
            localStorage.setItem('mssl_user', JSON.stringify({
                id: data.user.id,
                username,
                email,
                joinDate: new Date().toISOString()
            }));
            currentUser = JSON.parse(localStorage.getItem('mssl_user'));
            registerModal.hide();
            updateUI();
            registerForm.reset();
            alert('Registration successful! Welcome to Mario Super Sluggers League!');
        } else {
            alert(data.errors?.[0]?.msg || 'Registration failed');
        }
    } catch (err) {
        console.error('Registration error:', err);
        alert('Registration failed. Please try again.');
    }
});

// Check for existing session on page load
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('mssl_token');
    const user = localStorage.getItem('mssl_user');
    
    if (token && user) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/user`, {
                method: 'GET',
                headers: {
                    'x-auth-token': token
                }
            });
            
            if (response.ok) {
                currentUser = JSON.parse(user);
            } else {
                // Token is invalid, clear storage
                localStorage.removeItem('mssl_token');
                localStorage.removeItem('mssl_user');
            }
        } catch (err) {
            console.error('Session check error:', err);
        }
    }
    
    updateUI();
});