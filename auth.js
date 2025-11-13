class AuthSystem {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initDatabase();
        this.checkExistingAuth();
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

    initDatabase() {
        // Inicializar dados padrão se não existirem
        if (!localStorage.getItem('ipmc_users')) {
            const defaultUsers = [
                {
                    id: 1,
                    username: 'Benjanuario',
                    password: 'Ben12',
                    profile: 'director',
                    personalInfo: {
                        nome: 'Benjanuario Silva',
                        dataNascimento: '1980-03-20',
                        bilheteIdentidade: '008765432LA123',
                        formacao: 'Doutoramento em Administração Educacional',
                        residencia: 'Luanda, Talatona',
                        contacto: '+244 923 456 789',
                        email: 'benjanuario@ipmc.ed.ao'
                    },
                    status: 'ativo',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    username: 'secretaria',
                    password: 'secretaria123',
                    profile: 'secretaria',
                    personalInfo: {
                        nome: 'Maria Fernandes',
                        dataNascimento: '1990-07-15',
                        bilheteIdentidade: '009876543LA124',
                        formacao: 'Licenciatura em Secretariado',
                        residencia: 'Luanda, Kilamba',
                        contacto: '+244 934 567 890',
                        email: 'secretaria@ipmc.ed.ao'
                    },
                    status: 'ativo',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    username: 'pedagogico',
                    password: 'pedagogico123',
                    profile: 'pedagogico',
                    personalInfo: {
                        nome: 'João Pedro',
                        dataNascimento: '1985-11-30',
                        bilheteIdentidade: '007654321LA125',
                        formacao: 'Mestrado em Ciências da Educação',
                        residencia: 'Luanda, Belas',
                        contacto: '+244 945 678 901',
                        email: 'pedagogico@ipmc.ed.ao'
                    },
                    status: 'ativo',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 4,
                    username: 'tutor',
                    password: 'tutor123',
                    profile: 'tutor',
                    personalInfo: {
                        nome: 'Ana Costa',
                        dataNascimento: '1988-04-25',
                        bilheteIdentidade: '006543219LA126',
                        formacao: 'Mestrado em Informática',
                        especialidade: 'Programação e Base de Dados',
                        residencia: 'Luanda, Cazenga',
                        contacto: '+244 956 789 012',
                        email: 'tutor@ipmc.ed.ao'
                    },
                    status: 'ativo',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 5,
                    username: 'estudante',
                    password: 'estudante123',
                    profile: 'estudante',
                    personalInfo: {
                        nome: 'Pedro Mendes',
                        dataNascimento: '2002-09-12',
                        genero: 'Masculino',
                        bilheteIdentidade: '005432198LA127',
                        contacto: '+244 967 890 123',
                        email: 'estudante@ipmc.ed.ao',
                        residencia: 'Luanda, Viana'
                    },
                    status: 'ativo',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 6,
                    username: 'financeiro',
                    password: 'financeiro123',
                    profile: 'financeiro',
                    personalInfo: {
                        nome: 'Sofia Rodrigues',
                        dataNascimento: '1983-12-08',
                        bilheteIdentidade: '004321987LA128',
                        formacao: 'Licenciatura em Contabilidade',
                        residencia: 'Luanda, Maianga',
                        contacto: '+244 978 901 234',
                        email: 'financeiro@ipmc.ed.ao'
                    },
                    status: 'ativo',
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem('ipmc_users', JSON.stringify(defaultUsers));
            console.log('✅ Base de dados inicializada com usuários padrão!');
        }

        // Inicializar outras coleções se não existirem
        const collections = [
            'ipmc_cursos',
            'ipmc_turmas', 
            'ipmc_estudantes',
            'ipmc_avaliacoes',
            'ipmc_estagios',
            'ipmc_mensalidades',
            'ipmc_pagamentos'
        ];

        collections.forEach(collection => {
            if (!localStorage.getItem(collection)) {
                localStorage.setItem(collection, JSON.stringify([]));
            }
        });
    }

    checkExistingAuth() {
        const currentUser = localStorage.getItem('ipmc_currentUser');
        if (currentUser) {
            const user = JSON.parse(currentUser);
            this.redirectToDashboard(user.profile);
        }
    }

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const users = JSON.parse(localStorage.getItem('ipmc_users') || '[]');
        const user = users.find(u => 
            u.username === username && 
            u.password === password
        );

        if (user) {
            // Verificar se o usuário está ativo
            if (user.status !== 'ativo') {
                this.showError('Esta conta está desativada. Contacte o administrador.');
                return;
            }

            // Salvar usuário atual
            localStorage.setItem('ipmc_currentUser', JSON.stringify(user));
            
            // Registrar atividade de login
            this.registrarAtividadeLogin(user);
            
            // Efeito de transição
            this.animateLoginSuccess(() => {
                this.redirectToDashboard(user.profile);
            });
            
        } else {
            this.showError('Credenciais inválidas. Verifique username e password.');
        }
    }

    animateLoginSuccess(callback) {
        const loginContainer = document.querySelector('.login-container');
        if (loginContainer) {
            loginContainer.style.transform = 'translateY(-20px)';
            loginContainer.style.opacity = '0';
            
            // Adicionar efeito de confete visual
            this.createConfettiEffect();
            
            setTimeout(callback, 500);
        } else {
            callback();
        }
    }

    createConfettiEffect() {
        // Efeito visual simples de confete
        const colors = ['#667eea', '#764ba2', '#28a745', '#ffc107', '#dc3545'];
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.width = '10px';
                confetti.style.height = '10px';
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = '50%';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.top = '-10px';
                confetti.style.zIndex = '9999';
                confetti.style.animation = `confettiFall ${Math.random() * 2 + 1}s linear forwards`;
                
                document.body.appendChild(confetti);
                
                // Remover após animação
                setTimeout(() => confetti.remove(), 2000);
            }, i * 100);
        }

        // Adicionar estilo de animação se não existir
        if (!document.querySelector('#confetti-style')) {
            const style = document.createElement('style');
            style.id = 'confetti-style';
            style.textContent = `
                @keyframes confettiFall {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    registrarAtividadeLogin(user) {
        const atividades = JSON.parse(localStorage.getItem('ipmc_atividades') || '[]');
        atividades.push({
            id: atividades.length + 1,
            tipo: 'login',
            usuario: user.username,
            perfil: user.profile,
            data: new Date().toISOString(),
            descricao: `${user.personalInfo.nome} fez login no sistema`
        });
        localStorage.setItem('ipmc_atividades', JSON.stringify(atividades));
    }

    redirectToDashboard(profile) {
        switch(profile) {
            case 'secretaria':
                window.location.href = 'secretaria.html';
                break;
            case 'pedagogico':
                window.location.href = 'pedagogico.html';
                break;
            case 'director':
                window.location.href = 'director.html';
                break;
            case 'tutor':
                window.location.href = 'tutor.html';
                break;
            case 'estudante':
                window.location.href = 'estudante.html';
                break;
            case 'financeiro':
                window.location.href = 'financeiro.html';
                break;
            default:
                window.location.href = 'index.html';
        }
    }

    showError(message) {
        let errorDiv = document.getElementById('errorMessage');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'errorMessage';
            errorDiv.className = 'error-message';
            document.querySelector('.login-container').insertBefore(errorDiv, document.getElementById('loginForm'));
        }
        
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        // Efeito de shake no formulário
        const loginContainer = document.querySelector('.login-container');
        loginContainer.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            loginContainer.style.animation = '';
        }, 500);

        // Adicionar estilo de shake se não existir
        if (!document.querySelector('#shake-style')) {
            const style = document.createElement('style');
            style.id = 'shake-style';
            style.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-10px); }
                    75% { transform: translateX(10px); }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }

    // Método para recuperação de password (futura implementação)
    iniciarRecuperacaoPassword() {
        const username = prompt('Digite seu username para recuperação de password:');
        if (username) {
            const users = JSON.parse(localStorage.getItem('ipmc_users') || '[]');
            const user = users.find(u => u.username === username);
            
            if (user) {
                alert(`Password para ${username}: ${user.password}\n\nPor questões de segurança, altere sua password após o login.`);
            } else {
                alert('Username não encontrado!');
            }
        }
    }

    // Método para alterar password (futura implementação)
    alterarPassword(userId, novaPassword) {
        const users = JSON.parse(localStorage.getItem('ipmc_users') || '[]');
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex !== -1) {
            users[userIndex].password = novaPassword;
            users[userIndex].dataAlteracaoPassword = new Date().toISOString();
            localStorage.setItem('ipmc_users', JSON.stringify(users));
            return true;
        }
        return false;
    }
}

// Função global para logout
function logout() {
    // Registrar atividade de logout
    const currentUser = JSON.parse(localStorage.getItem('ipmc_currentUser') || '{}');
    const atividades = JSON.parse(localStorage.getItem('ipmc_atividades') || '[]');
    
    atividades.push({
        id: atividades.length + 1,
        tipo: 'logout',
        usuario: currentUser.username,
        perfil: currentUser.profile,
        data: new Date().toISOString(),
        descricao: `${currentUser.personalInfo?.nome || currentUser.username} fez logout do sistema`
    });
    localStorage.setItem('ipmc_atividades', JSON.stringify(atividades));
    
    // Remover usuário atual e redirecionar
    localStorage.removeItem('ipmc_currentUser');
    
    // Efeito de transição
    document.body.style.opacity = '0.7';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 300);
}

// Função global para recuperação de password
function recuperarPassword() {
    const authSystem = new AuthSystem();
    authSystem.iniciarRecuperacaoPassword();
}

// Função para demonstrar usuários disponíveis
function mostrarUsuariosDemo() {
    const users = JSON.parse(localStorage.getItem('ipmc_users') || '[]');
    let mensagem = '👥 USUÁRIOS DISPONÍVEIS PARA TESTE:\n\n';
    
    users.forEach(user => {
        mensagem += `👤 ${user.personalInfo.nome}\n`;
        mensagem += `   📧 Username: ${user.username}\n`;
        mensagem += `   🔑 Password: ${user.password}\n`;
        mensagem += `   🎯 Perfil: ${user.profile}\n`;
        mensagem += `   📞 Contacto: ${user.personalInfo.contacto}\n`;
        mensagem += '   ─────────────────────\n';
    });
    
    mensagem += '\n💡 DICA: Use o usuário "Benjanuario" para acessar como Director!';
    
    alert(mensagem);
}

// Inicializar sistema de autenticação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const authSystem = new AuthSystem();
    
    // Adicionar link de recuperação de password se não existir
    if (!document.getElementById('recovery-link')) {
        const recoveryLink = document.createElement('div');
        recoveryLink.id = 'recovery-link';
        recoveryLink.innerHTML = `
            <div style="text-align: center; margin-top: 1rem;">
                <a href="#" onclick="recuperarPassword()" style="color: #667eea; text-decoration: none; font-size: 0.9rem;">
                    🔓 Esqueci minha password
                </a>
                <br>
                <a href="#" onclick="mostrarUsuariosDemo()" style="color: #28a745; text-decoration: none; font-size: 0.9rem; margin-top: 0.5rem; display: inline-block;">
                    👥 Ver usuários de teste
                </a>
            </div>
        `;
        
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.parentNode.insertBefore(recoveryLink, loginForm.nextSibling);
        }
    }
    
    // Adicionar usuário atual no console para debug
    const currentUser = localStorage.getItem('ipmc_currentUser');
    if (currentUser) {
        console.log('✅ Usuário atual:', JSON.parse(currentUser));
    }
    
    console.log('🔐 Sistema de autenticação inicializado!');
    console.log('💡 Use "Benjanuario" / "Ben12" para login como Director');
});

// Prevenir acesso direto às páginas sem autenticação
function verificarAutenticacao(perfilRequerido = null) {
    const currentUser = localStorage.getItem('ipmc_currentUser');
    
    if (!currentUser) {
        window.location.href = 'index.html';
        return false;
    }
    
    const user = JSON.parse(currentUser);
    
    if (perfilRequerido && user.profile !== perfilRequerido) {
        alert(`Acesso negado! Esta página é apenas para ${perfilRequerido}.`);
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}