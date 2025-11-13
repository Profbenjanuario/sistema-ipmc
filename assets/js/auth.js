class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkLoginStatus();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
    }

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        const user = db.getUserByUsername(username);
        
        if (user && user.password === password) {
            this.loginSuccess(user);
        } else {
            this.showMessage('Username ou senha incorretos!', 'error');
        }
    }

    loginSuccess(user) {
        this.currentUser = user;
        localStorage.setItem('ipmc_currentUser', JSON.stringify(user));
        this.showMessage('Login realizado com sucesso!', 'success');
        
        setTimeout(() => {
            this.redirectToDashboard(user.profile);
        }, 1000);
    }

    redirectToDashboard(profile) {
        const pages = {
            'director': 'director.html',
            'pedagogico': 'pedagogico.html',
            'secretaria': 'secretaria.html',
            'tutor': 'tutor.html',
            'estudante': 'estudante.html'
        };
        
        window.location.href = pages[profile] || 'index.html';
    }

    checkLoginStatus() {
        const savedUser = localStorage.getItem('ipmc_currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            // Se já está logado e na página de login, redireciona
            if (window.location.pathname.endsWith('index.html')) {
                this.redirectToDashboard(this.currentUser.profile);
            }
        }
    }

    showMessage(text, type) {
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('ipmc_currentUser');
        window.location.href = 'index.html';
    }
}

// Instância global do sistema de autenticação
const auth = new AuthSystem();

// Função global para logout
function logout() {
    auth.logout();
}
