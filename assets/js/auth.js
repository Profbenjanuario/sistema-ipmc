// assets/js/auth.js
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
        console.log('🔄 Inicializando base de dados...');
        
        // Inicializar dados padrão se não existirem
        if (!localStorage.getItem('ipmc_users')) {
            console.log('📦 Criando usuários padrão...');
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
            console.log('✅ Base de dados inicializada com', defaultUsers.length, 'usuários!');
            
            // Log dos usuários criados para debug
            defaultUsers.forEach(user => {
                console.log(`👤 ${user.username} / ${user.password} (${user.profile})`);
            });
        } else {
            const users = JSON.parse(localStorage.getItem('ipmc_users') || '[]');
            console.log('📊 Usuários existentes:', users.length);
            users.forEach(user => {
                console.log(`👤 ${user.username} / ${user.password} (${user.profile})`);
            });
        }

        // Inicializar outras coleções se não existirem
        const collections = [
            'ipmc_cursos',
            'ipmc_turmas', 
            'ipmc_estudantes',
            'ipmc_avaliacoes',
            'ipmc_estagios',
            'ipmc_mensalidades',
            'ipmc_pagamentos',
            'ipmc_atividades'
        ];

        collections.forEach(collection => {
            if (!localStorage.getItem(collection)) {
                localStorage.setItem(collection, JSON.stringify([]));
                console.log(`📁 Coleção ${collection} inicializada`);
            }
        });
    }

    checkExistingAuth() {
        const currentUser = localStorage.getItem('ipmc_currentUser');
        if (currentUser) {
            try {
                const user = JSON.parse(currentUser);
                console.log('🔐 Usuário já autenticado:', user.username);
                this.redirectToDashboard(user.profile);
            } catch (e) {
                console.error('❌ Erro ao verificar autenticação:', e);
                localStorage.removeItem('ipmc_currentUser');
            }
        }
    }

    handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        console.log('🔐 Tentativa de login:', { username, password });

        // Validação básica
        if (!username || !password) {
            this.showError('Por favor, preencha todos os campos.');
            return;
        }

        const users = JSON.parse(localStorage.getItem('ipmc_users') || '[]');
        console.log('📊 Total de usuários no sistema:', users.length);

        // Debug: mostrar todos os usuários
        users.forEach(user => {
            console.log(`🔍 Verificando: ${user.username} (${user.password})`);
        });

        const user = users.find(u => 
            u.username === username && 
            u.password === password
        );

        if (user) {
            console.log('✅ Login bem-sucedido para:', user.username);
            
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
            console.log('❌ Credenciais inválidas para:', username);
            this.showError('Credenciais inválidas. Verifique username e password.');
            
            // Sugerir usuários disponíveis
            this.sugerirUsuarios(users);
        }
    }

    sugerirUsuarios(users) {
        console.log('💡 Usuários disponíveis:');
        users.forEach(user => {
            console.log(`   👤 ${user.username} / ${user.password} (${user.profile})`);
        });
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
        const colors = ['#667eea', '#764ba2', '#28a745', '#ffc107', '#dc3545'];
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.width = '8px';
                confetti.style.height = '8px';
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = '50%';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.top = '-10px';
                confetti.style.zIndex = '9999';
                confetti.style.animation = `confettiFall ${Math.random() * 1.5 + 0.5}s linear forwards`;
                
                document.body.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 2000);
            }, i * 80);
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
        console.log('📝 Atividade de login registrada');
    }

    redirectToDashboard(profile) {
        console.log('🔄 Redirecionando para:', profile);
        
        const dashboardMap = {
            'secretaria': 'secretaria.html',
            'pedagogico': 'pedagogico.html',
            'director': 'director.html',
            'tutor': 'tutor.html',
            'estudante': 'estudante.html',
            'financeiro': 'financeiro.html'
        };

        const dashboardPage = dashboardMap[profile];
        if (dashboardPage) {
            setTimeout(() => {
                window.location.href = dashboardPage;
            }, 800);
        } else {
            console.error('❌ Perfil não reconhecido:', profile);
            this.showError('Perfil não configurado. Contacte o administrador.');
        }
    }

    showError(message) {
        let errorDiv = document.getElementById('errorMessage');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'errorMessage';
            errorDiv.className = 'error-message';
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.parentNode.insertBefore(errorDiv, loginForm);
            }
        }
        
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        // Efeito de shake no formulário
        const loginContainer = document.querySelector('.login-container');
        if (loginContainer) {
            loginContainer.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                loginContainer.style.animation = '';
            }, 500);
        }

        // Adicionar estilo de shake se não existir
        if (!document.querySelector('#shake-style')) {
            const style = document.createElement('style');
            style.id = 'shake-style';
            style.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-8px); }
                    75% { transform: translateX(8px); }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            if (errorDiv) {
                errorDiv.style.display = 'none';
            }
        }, 5000);
    }

    // Método para forçar reinicialização do banco de dados
    reinicializarBancoDados() {
        if (confirm('⚠️ Tem certeza que deseja reinicializar o banco de dados? Todos os dados serão perdidos!')) {
            localStorage.removeItem('ipmc_users');
            localStorage.removeItem('ipmc_currentUser');
            this.initDatabase();
            alert('✅ Banco de dados reinicializado com sucesso!');
            window.location.reload();
        }
    }
}

// Função global para logout
function logout() {
    console.log('🚪 Efetuando logout...');
    
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
    
    // Remover usuário atual
    localStorage.removeItem('ipmc_currentUser');
    
    console.log('✅ Logout realizado com sucesso');
    
    // Efeito de transição
    if (document.body) {
        document.body.style.opacity = '0.7';
        document.body.style.transition = 'opacity 0.3s ease';
    }
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 300);
}

// Função global para recuperação de password
function recuperarPassword() {
    const username = prompt('Digite seu username para recuperação de password:');
    if (username) {
        const users = JSON.parse(localStorage.getItem('ipmc_users') || '[]');
        const user = users.find(u => u.username === username);
        
        if (user) {
            alert(`🔐 Password para ${username}: ${user.password}\n\n💡 Por questões de segurança, altere sua password após o login.`);
        } else {
            alert('❌ Username não encontrado!');
        }
    }
}

// Função para demonstrar usuários disponíveis
function mostrarUsuariosDemo() {
    const users = JSON.parse(localStorage.getItem('ipmc_users') || '[]');
    
    if (users.length === 0) {
        alert('❌ Nenhum usuário encontrado no sistema!');
        return;
    }
    
    let mensagem = '👥 USUÁRIOS DISPONÍVEIS:\n\n';
    
    users.forEach(user => {
        mensagem += `👤 ${user.personalInfo.nome}\n`;
        mensagem += `   📧 Username: ${user.username}\n`;
        mensagem += `   🔑 Password: ${user.password}\n`;
        mensagem += `   🎯 Perfil: ${user.profile}\n`;
        mensagem += `   📞 Contacto: ${user.personalInfo.contacto}\n`;
        mensagem += '   ─────────────────────\n';
    });
    
    mensagem += '\n💡 DICA: Use "Benjanuario" para acessar como Director!';
    
    alert(mensagem);
}

// Função para debug do sistema
function debugSistema() {
    console.clear();
    console.log('🐛 DEBUG DO SISTEMA IPMC');
    console.log('========================');
    
    const users = JSON.parse(localStorage.getItem('ipmc_users') || '[]');
    console.log('👥 Usuários:', users);
    
    const currentUser = localStorage.getItem('ipmc_currentUser');
    console.log('🔐 Usuário atual:', currentUser ? JSON.parse(currentUser) : 'Nenhum');
    
    console.log('📊 LocalStorage keys:', Object.keys(localStorage));
    
    alert('✅ Debug realizado! Verifique o console (F12) para detalhes.');
}

// Inicializar sistema de autenticação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏫 Instituto Politécnico Makhetele - Caia');
    console.log('🔐 Sistema de Autenticação Inicializando...');
    
    const authSystem = new AuthSystem();
    
    // Adicionar botão de debug no console
    window.authSystem = authSystem;
    
    console.log('✅ Sistema de autenticação pronto!');
    console.log('💡 Use: Benjanuario / Ben12 para login como Director');
    console.log('🐛 Use: debugSistema() para diagnosticar problemas');
});

// Prevenir acesso direto às páginas sem autenticação
function verificarAutenticacao(perfilRequerido = null) {
    const currentUser = localStorage.getItem('ipmc_currentUser');
    
    if (!currentUser) {
        console.log('❌ Acesso negado: usuário não autenticado');
        window.location.href = 'index.html';
        return false;
    }
    
    const user = JSON.parse(currentUser);
    
    if (perfilRequerido && user.profile !== perfilRequerido) {
        console.log(`❌ Acesso negado: perfil ${user.profile} não tem acesso a ${perfilRequerido}`);
        alert(`⛔ Acesso negado! Esta página é apenas para ${perfilRequerido}.`);
        window.location.href = 'index.html';
        return false;
    }
    
    console.log(`✅ Acesso permitido para: ${user.username} (${user.profile})`);
    return true;
}
