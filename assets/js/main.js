class DirectorSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkAuth();
        this.loadUserData();
        this.setupEventListeners();
        this.loadDashboardData();
    }

    checkAuth() {
        const savedUser = localStorage.getItem('ipmc_currentUser');
        if (!savedUser) {
            window.location.href = 'index.html';
            return;
        }

        this.currentUser = JSON.parse(savedUser);
        if (this.currentUser.profile !== 'director') {
            window.location.href = 'index.html';
            return;
        }

        document.getElementById('userWelcome').textContent = 
            `Bem-vindo, ${this.currentUser.personalInfo?.nome || 'Diretor'}`;
    }

    loadUserData() {
        // Carregar dados do usuário atual se necessário
    }

    setupEventListeners() {
        // Navegação
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSection(link.dataset.section);
            });
        });

        // Formulário de criação de pedagógico
        const formPedagogico = document.getElementById('formPedagogico');
        if (formPedagogico) {
            formPedagogico.addEventListener('submit', (e) => {
                e.preventDefault();
                this.criarPedagogico();
            });
        }
    }

    showSection(sectionId) {
        // Esconder todas as seções
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Remover active de todos os links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Mostrar seção selecionada
        document.getElementById(sectionId).classList.add('active');
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
    }

    loadDashboardData() {
        const users = db.getUsers();
        
        // Estatísticas
        document.getElementById('totalUsers').textContent = users.length;
        document.getElementById('totalPedagogicos').textContent = 
            users.filter(u => u.profile === 'pedagogico').length;
        document.getElementById('totalSecretarias').textContent = 
            users.filter(u => u.profile === 'secretaria').length;
        document.getElementById('totalTutores').textContent = 
            users.filter(u => u.profile === 'tutor').length;

        // Atividade recente
        this.loadRecentActivity(users);
        
        // Tabela de usuários
        this.loadUsersTable(users);
    }

    loadRecentActivity(users) {
        const activityList = document.getElementById('recentActivity');
        const recentUsers = users
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        activityList.innerHTML = recentUsers.map(user => `
            <div class="activity-item">
                <div class="activity-info">
                    <h4>Novo ${this.getProfileName(user.profile)}</h4>
                    <p>${user.personalInfo?.nome} - ${user.username}</p>
                </div>
                <div class="activity-time">
                    ${this.formatDate(user.createdAt)}
                </div>
            </div>
        `).join('');
    }

    loadUsersTable(users) {
        const tbody = document.querySelector('#usersTable tbody');
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.personalInfo?.nome || 'N/A'}</td>
                <td><span class="profile-badge">${this.getProfileName(user.profile)}</span></td>
                <td>${user.username}</td>
                <td>${user.personalInfo?.email || 'N/A'}</td>
                <td>${this.formatDate(user.createdAt)}</td>
                <td>
                    <button onclick="directorSystem.editarUsuario(${user.id})" class="action-btn edit">Editar</button>
                    <button onclick="directorSystem.removerUsuario(${user.id})" class="action-btn delete">Remover</button>
                </td>
            </tr>
        `).join('');
    }

    criarPedagogico() {
        const form = document.getElementById('formPedagogico');
        const formData = new FormData(form);
        
        const userData = {
            username: formData.get('username'),
            password: formData.get('password'),
            profile: 'pedagogico',
            personalInfo: {
                nome: formData.get('nome'),
                formacao: formData.get('formacao'),
                dataNascimento: formData.get('dataNascimento'),
                residencia: formData.get('residencia'),
                contacto: formData.get('contacto'),
                email: formData.get('email'),
                bilheteIdentidade: formData.get('bilheteIdentidade')
            }
        };

        // Verificar se username já existe
        if (db.getUserByUsername(userData.username)) {
            alert('Username já existe! Escolha outro.');
            return;
        }

        try {
            const novoUsuario = db.addUser(userData);
            alert('Perfil pedagógico criado com sucesso!');
            form.reset();
            this.loadDashboardData(); // Atualizar dados
            
            // Registrar atividade
            this.registrarAtividade(`Criou perfil pedagógico: ${userData.personalInfo.nome}`);
            
        } catch (error) {
            alert('Erro ao criar perfil: ' + error.message);
        }
    }

    editarUsuario(userId) {
        // Implementar edição de usuário
        alert(`Editar usuário ID: ${userId}`);
    }

    removerUsuario(userId) {
        if (confirm('Tem certeza que deseja remover este usuário?')) {
            const users = db.getUsers();
            const updatedUsers = users.filter(user => user.id !== userId);
            db.saveUsers(updatedUsers);
            this.loadDashboardData();
            alert('Usuário removido com sucesso!');
        }
    }

    getProfileName(profile) {
        const profiles = {
            'director': 'Diretor',
            'pedagogico': 'Pedagógico',
            'secretaria': 'Secretaria',
            'tutor': 'Tutor',
            'estudante': 'Estudante'
        };
        return profiles[profile] || profile;
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('pt-PT');
    }

    registrarAtividade(descricao) {
        // Poderia salvar em um log de atividades
        console.log('Atividade:', descricao);
    }
}

// Funções globais para relatórios
function gerarRelatorioUsuarios() {
    const users = db.getUsers();
    const relatorioContent = document.getElementById('relatorioContent');
    
    const relatorioHTML = `
        <h3>Relatório de Usuários</h3>
        <p><strong>Total de Usuários:</strong> ${users.length}</p>
        <div class="profile-stats">
            ${Object.entries({
                'director': 'Diretores',
                'pedagogico': 'Pedagógicos',
                'secretaria': 'Secretárias',
                'tutor': 'Tutores',
                'estudante': 'Estudantes'
            }).map(([profile, label]) => `
                <p><strong>${label}:</strong> ${users.filter(u => u.profile === profile).length}</p>
            `).join('')}
        </div>
    `;
    
    relatorioContent.innerHTML = relatorioHTML;
}

function gerarRelatorioAtividade() {
    const users = db.getUsers();
    const recentUsers = users
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);

    const relatorioContent = document.getElementById('relatorioContent');
    
    const relatorioHTML = `
        <h3>Relatório de Atividade Recente</h3>
        <div class="activity-report">
            ${recentUsers.map(user => `
                <div class="activity-item">
                    <strong>${user.personalInfo?.nome}</strong> 
                    (${user.username}) - 
                    ${new Date(user.createdAt).toLocaleString('pt-PT')}
                </div>
            `).join('')}
        </div>
    `;
    
    relatorioContent.innerHTML = relatorioHTML;
}

// Inicializar sistema do diretor
const directorSystem = new DirectorSystem();
