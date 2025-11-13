class PedagogicoSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkAuth();
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
        if (this.currentUser.profile !== 'pedagogico') {
            window.location.href = 'index.html';
            return;
        }

        document.getElementById('userWelcome').textContent = 
            `Bem-vindo, ${this.currentUser.personalInfo?.nome || 'Pedagógico'}`;
    }

    setupEventListeners() {
        // Navegação
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSection(link.dataset.section);
            });
        });

        // Formulários
        const formSecretaria = document.getElementById('formSecretaria');
        if (formSecretaria) {
            formSecretaria.addEventListener('submit', (e) => {
                e.preventDefault();
                this.criarSecretaria();
            });
        }

        const formTutor = document.getElementById('formTutor');
        if (formTutor) {
            formTutor.addEventListener('submit', (e) => {
                e.preventDefault();
                this.criarTutor();
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

        // Carregar dados específicos da seção
        if (sectionId === 'validar-turmas') {
            this.loadTurmasPendentes();
        } else if (sectionId === 'atribuir-turmas') {
            this.loadAtribuicaoTurmas();
        } else if (sectionId === 'gerenciar-usuarios') {
            this.loadUsersTable();
        }
    }

    loadDashboardData() {
        const turmas = db.getTurmas();
        const users = db.getUsers();
        const cursos = db.getCursos();

        // Estatísticas
        document.getElementById('turmasPendentes').textContent = 
            turmas.filter(t => t.status === 'pendente').length;
        document.getElementById('turmasValidadas').textContent = 
            turmas.filter(t => t.status === 'validada').length;
        document.getElementById('tutoresAtivos').textContent = 
            users.filter(u => u.profile === 'tutor').length;
        document.getElementById('cursosCriados').textContent = cursos.length;

        // Turmas pendentes para validação
        this.loadTurmasPendentesDashboard();
    }

    loadTurmasPendentesDashboard() {
        const turmasPendentes = db.getTurmas().filter(t => t.status === 'pendente');
        const container = document.getElementById('turmasPendentesList');
        
        if (turmasPendentes.length === 0) {
            container.innerHTML = '<p class="no-data">Nenhuma turma pendente de validação</p>';
            return;
        }

        container.innerHTML = turmasPendentes.map(turma => `
            <div class="activity-item">
                <div class="activity-info">
                    <h4>${turma.nome}</h4>
                    <p>Curso: ${this.getCursoNome(turma.cursoId)} | Sala: ${turma.sala}</p>
                    <p>Período: ${turma.periodo} | Vagas: ${turma.vagas}</p>
                </div>
                <div class="activity-actions">
                    <button onclick="pedagogicoSystem.validarTurma(${turma.id})" class="action-btn success">Validar</button>
                    <button onclick="pedagogicoSystem.recusarTurma(${turma.id})" class="action-btn danger">Recusar</button>
                </div>
            </div>
        `).join('');
    }

    criarSecretaria() {
        const form = document.getElementById('formSecretaria');
        const formData = new FormData(form);
        
        const userData = {
            username: formData.get('username'),
            password: formData.get('password'),
            profile: 'secretaria',
            personalInfo: {
                nome: formData.get('nome'),
                formacao: formData.get('formacao'),
                dataNascimento: formData.get('dataNascimento'),
                residencia: formData.get('residencia'),
                contacto: formData.get('contacto'),
                email: formData.get('email'),
                bilheteIdentidade: formData.get('bilheteIdentidade')
            },
            criadoPor: this.currentUser.id
        };

        if (db.getUserByUsername(userData.username)) {
            alert('Username já existe! Escolha outro.');
            return;
        }

        try {
            const novaSecretaria = db.addUser(userData);
            alert('Perfil de secretaria criado com sucesso!');
            form.reset();
            this.loadDashboardData();
            
        } catch (error) {
            alert('Erro ao criar perfil: ' + error.message);
        }
    }

    criarTutor() {
        const form = document.getElementById('formTutor');
        const formData = new FormData(form);
        
        const userData = {
            username: formData.get('username'),
            password: formData.get('password'),
            profile: 'tutor',
            personalInfo: {
                nome: formData.get('nome'),
                formacao: formData.get('formacao'),
                especialidade: formData.get('especialidade'),
                dataNascimento: formData.get('dataNascimento'),
                residencia: formData.get('residencia'),
                contacto: formData.get('contacto'),
                email: formData.get('email'),
                bilheteIdentidade: formData.get('bilheteIdentidade')
            },
            criadoPor: this.currentUser.id
        };

        if (db.getUserByUsername(userData.username)) {
            alert('Username já existe! Escolha outro.');
            return;
        }

        try {
            const novoTutor = db.addUser(userData);
            alert('Perfil de tutor criado com sucesso!');
            form.reset();
            this.loadDashboardData();
            
        } catch (error) {
            alert('Erro ao criar perfil: ' + error.message);
        }
    }

    loadTurmasPendentes() {
        const turmasPendentes = db.getTurmas().filter(t => t.status === 'pendente');
        const container = document.getElementById('turmasPendentesValidacao');
        
        if (turmasPendentes.length === 0) {
            container.innerHTML = '<p class="no-data">Nenhuma turma pendente de validação</p>';
            return;
        }

        container.innerHTML = turmasPendentes.map(turma => `
            <div class="turma-card pendente">
                <div class="turma-info">
                    <h3>${turma.nome}</h3>
                    <div class="turma-details">
                        <p><strong>Curso:</strong> ${this.getCursoNome(turma.cursoId)}</p>
                        <p><strong>Sala:</strong> ${turma.sala}</p>
                        <p><strong>Período:</strong> ${turma.periodo}</p>
                        <p><strong>Vagas:</strong> ${turma.vagas}</p>
                        <p><strong>Criada por:</strong> ${this.getUserName(turma.criadoPor)}</p>
                        <p><strong>Data criação:</strong> ${this.formatDate(turma.createdAt)}</p>
                    </div>
                </div>
                <div class="turma-actions">
                    <button onclick="pedagogicoSystem.validarTurma(${turma.id})" class="action-btn success">✅ Validar</button>
                    <button onclick="pedagogicoSystem.recusarTurma(${turma.id})" class="action-btn danger">❌ Recusar</button>
                </div>
            </div>
        `).join('');
    }

    validarTurma(turmaId) {
        const turmas = db.getTurmas();
        const turmaIndex = turmas.findIndex(t => t.id === turmaId);
        
        if (turmaIndex !== -1) {
            turmas[turmaIndex].status = 'validada';
            turmas[turmaIndex].validadaPor = this.currentUser.id;
            turmas[turmaIndex].dataValidacao = new Date().toISOString();
            db.saveTurmas(turmas);
            
            alert('Turma validada com sucesso!');
            this.loadDashboardData();
            this.loadTurmasPendentes();
        }
    }

    recusarTurma(turmaId) {
        const motivo = prompt('Digite o motivo da recusa:');
        if (motivo) {
            const turmas = db.getTurmas();
            const turmaIndex = turmas.findIndex(t => t.id === turmaId);
            
            if (turmaIndex !== -1) {
                turmas[turmaIndex].status = 'recusada';
                turmas[turmaIndex].motivoRecusa = motivo;
                turmas[turmaIndex].recusadaPor = this.currentUser.id;
                turmas[turmaIndex].dataRecusa = new Date().toISOString();
                db.saveTurmas(turmas);
                
                alert('Turma recusada!');
                this.loadDashboardData();
                this.loadTurmasPendentes();
            }
        }
    }

    loadAtribuicaoTurmas() {
        this.loadTurmasValidadas();
        this.loadTutoresDisponiveis();
    }

    loadTurmasValidadas() {
        const turmasValidadas = db.getTurmas().filter(t => 
            t.status === 'validada' && !t.tutorId
        );
        const container = document.getElementById('turmasValidadasList');
        
        if (turmasValidadas.length === 0) {
            container.innerHTML = '<p class="no-data">Nenhuma turma validada disponível</p>';
            return;
        }

        container.innerHTML = turmasValidadas.map(turma => `
            <div class="turma-card" onclick="pedagogicoSystem.selecionarTurma(${turma.id})" 
                 id="turma-${turma.id}">
                <h4>${turma.nome}</h4>
                <p>Curso: ${this.getCursoNome(turma.cursoId)}</p>
                <p>Sala: ${turma.sala} | Período: ${turma.periodo}</p>
                <p>Vagas: ${turma.vagas}</p>
            </div>
        `).join('');
    }

    loadTutoresDisponiveis() {
        const tutores = db.getUsers().filter(u => 
            u.profile === 'tutor' && !this.tutorTemTurma(u.id)
        );
        const container = document.getElementById('tutoresDisponiveisList');
        
        if (tutores.length === 0) {
            container.innerHTML = '<p class="no-data">Nenhum tutor disponível</p>';
            return;
        }

        container.innerHTML = tutores.map(tutor => `
            <div class="tutor-card" onclick="pedagogicoSystem.selecionarTutor(${tutor.id})" 
                 id="tutor-${tutor.id}">
                <h4>${tutor.personalInfo.nome}</h4>
                <p>Especialidade: ${tutor.personalInfo.especialidade}</p>
                <p>Formação: ${tutor.personalInfo.formacao}</p>
                <p>Contacto: ${tutor.personalInfo.contacto}</p>
            </div>
        `).join('');
    }

    selecionarTurma(turmaId) {
        // Remover seleção anterior
        document.querySelectorAll('.turma-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Selecionar nova turma
        document.getElementById(`turma-${turmaId}`).classList.add('selected');
        this.turmaSelecionada = turmaId;
        
        // Habilitar atribuição se tutor também estiver selecionado
        this.verificarAtribuicao();
    }

    selecionarTutor(tutorId) {
        // Remover seleção anterior
        document.querySelectorAll('.tutor-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Selecionar novo tutor
        document.getElementById(`tutor-${tutorId}`).classList.add('selected');
        this.tutorSelecionado = tutorId;
        
        // Habilitar atribuição se turma também estiver selecionada
        this.verificarAtribuicao();
    }

    verificarAtribuicao() {
        if (this.turmaSelecionada && this.tutorSelecionado) {
            // Mostrar botão de confirmação
            const confirmacao = document.createElement('div');
            confirmacao.className = 'atribuicao-confirmacao';
            confirmacao.innerHTML = `
                <p>Atribuir turma ao tutor selecionado?</p>
                <button onclick="pedagogicoSystem.confirmarAtribuicao()" class="action-btn success">Confirmar Atribuição</button>
            `;
            
            const existingConfirm = document.querySelector('.atribuicao-confirmacao');
            if (existingConfirm) {
                existingConfirm.remove();
            }
            
            document.querySelector('.atribuicao-container').appendChild(confirmacao);
        }
    }

    confirmarAtribuicao() {
        if (!this.turmaSelecionada || !this.tutorSelecionado) {
            alert('Selecione uma turma e um tutor!');
            return;
        }

        const turmas = db.getTurmas();
        const turmaIndex = turmas.findIndex(t => t.id === this.turmaSelecionada);
        
        if (turmaIndex !== -1) {
            turmas[turmaIndex].tutorId = this.tutorSelecionado;
            turmas[turmaIndex].atribuidaPor = this.currentUser.id;
            turmas[turmaIndex].dataAtribuicao = new Date().toISOString();
            db.saveTurmas(turmas);
            
            alert('Turma atribuída com sucesso ao tutor!');
            
            // Limpar seleções
            this.turmaSelecionada = null;
            this.tutorSelecionado = null;
            document.querySelector('.atribuicao-confirmacao')?.remove();
            
            // Recarregar dados
            this.loadAtribuicaoTurmas();
        }
    }

    tutorTemTurma(tutorId) {
        const turmas = db.getTurmas();
        return turmas.some(t => t.tutorId === tutorId && t.status === 'validada');
    }

    loadUsersTable() {
        const users = db.getUsers().filter(u => 
            u.profile === 'secretaria' || u.profile === 'tutor'
        );
        const tbody = document.querySelector('#usersTable tbody');
        
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.personalInfo?.nome || 'N/A'}</td>
                <td><span class="profile-badge">${this.getProfileName(user.profile)}</span></td>
                <td>${user.username}</td>
                <td>${user.personalInfo?.email || 'N/A'}</td>
                <td>${this.formatDate(user.createdAt)}</td>
                <td>
                    <span class="status-badge ${this.getUserStatus(user)}">${this.getUserStatus(user)}</span>
                </td>
            </tr>
        `).join('');
    }

    // Métodos auxiliares
    getCursoNome(cursoId) {
        const cursos = db.getCursos();
        const curso = cursos.find(c => c.id === cursoId);
        return curso ? curso.nome : 'Curso não encontrado';
    }

    getUserName(userId) {
        const users = db.getUsers();
        const user = users.find(u => u.id === userId);
        return user ? user.personalInfo?.nome : 'Usuário não encontrado';
    }

    getProfileName(profile) {
        const profiles = {
            'secretaria': 'Secretaria',
            'tutor': 'Tutor',
            'pedagogico': 'Pedagógico'
        };
        return profiles[profile] || profile;
    }

    getUserStatus(user) {
        if (user.profile === 'tutor') {
            return this.tutorTemTurma(user.id) ? 'Com Turma' : 'Disponível';
        }
        return 'Ativo';
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('pt-PT');
    }
}

// Inicializar sistema do pedagógico
const pedagogicoSystem = new PedagogicoSystem();
