// Sistema de Autenticação
document.addEventListener('DOMContentLoaded', function() {
    initLoginSystem();
});

function initLoginSystem() {
    // Seleção de tipo de usuário
    document.querySelectorAll('.user-type-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.user-type-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Formulário de login
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const activeBtn = document.querySelector('.user-type-btn.active');
        
        if (!activeBtn) {
            alert('Por favor, selecione o tipo de utilizador.');
            return;
        }

        const userType = activeBtn.getAttribute('data-type');
        
        if (username && password && userType) {
            if (ipmcDB.authenticate(username, password, userType)) {
                loginSuccess(username, userType);
            } else {
                alert('Credenciais inválidas. Por favor, tente novamente.');
            }
        } else {
            alert('Por favor, preencha todos os campos.');
        }
    });
}

function loginSuccess(username, userType) {
    const user = ipmcDB.getUser(username);
    
    // Salvar sessão
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    
    // Redirecionar para o módulo correspondente
    switch(userType) {
        case 'estudante':
            window.location.href = 'estudante.html';
            break;
        case 'tutor':
            window.location.href = 'tutor.html';
            break;
        case 'secretaria':
            window.location.href = 'secretaria.html';
            break;
        case 'pedagogico':
            window.location.href = 'pedagogico.html';
            break;
        case 'financeiro':
            window.location.href = 'financeiro.html';
            break;
        case 'director':
            window.location.href = 'director.html';
            break;
        default:
            alert('Tipo de utilizador não reconhecido.');
    }
}

function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Verificar se há sessão ativa ao carregar páginas
function checkAuth() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
        return null;
    }
    return JSON.parse(currentUser);
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}
