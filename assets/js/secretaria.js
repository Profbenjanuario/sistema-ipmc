class SecretariaSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkAuth();
        this.setupEventListeners();
        this.loadDashboardData();
        this.carregarCursosParaSelect();
        this.carregarTurmasParaSelect();
    }

    checkAuth() {
        const savedUser = localStorage.getItem('ipmc_currentUser');
        if (!savedUser) {
            window.location.href = 'index.html';
            return;
        }

        this.currentUser = JSON.parse(savedUser);
        if (this.currentUser.profile !== 'secretaria') {
            window.location.href = 'index.html';
            return;
        }

        document.getElementById('userWelcome').textContent = 
            `Bem-vindo(a), ${this.currentUser.personalInfo?.nome || 'Secretaria'}`;
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
        const formCurso = document.getElementById('formCurso');
        if (formCurso) {
            formCurso.addEventListener('submit', (e) => {
                e.preventDefault();
                this.criarCurso();
            });
        }

        const formTurma = document.getElementById('formTurma');
        if (formTurma) {
            formTurma.addEventListener('submit', (e) => {
                e.preventDefault();
                this.criarTurma();
            });
        }

        const formEstudante = document.getElementById('formEstudante');
        if (formEstudante) {
            formEstudante.addEventListener('submit', (e) => {
                e.preventDefault();
                this.matricularEstudante();
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
        if (sectionId === 'gerenciar-cursos') {
            this.loadCursos();
        } else if (sectionId === 'gerenciar-turmas') {
            this.loadTurmas();
        }
    }

    loadDashboardData() {
        const cursos = db.getCursos();
        const turmas = db.getTurmas();
        const estudantes = db.getEstudantes();

        // Estatísticas
        document.getElementById('cursosAtivos').textContent = cursos.length;
        document.getElementById('turmasCriadas').textContent = turmas.length;
        document.getElementById('turmasPendentes').textContent = 
            turmas.filter(t => t.status === 'pendente').length;
        document.getElementById('estudantesMatriculados').textContent = estudantes.length;

        // Turmas aguardando validação
        this.loadTurmasAguardandoValidacao();
    }

    loadTurmasAguardandoValidacao() {
        const turmasPendentes = db.getTurmas().filter(t => t.status === 'pendente');
        const container = document.getElementById('turmasAguardandoValidacao');
        
        if (turmasPendentes.length === 0) {
            container.innerHTML = '<p class="no-data">Nenhuma turma aguardando validação</p>';
            return;
        }

        container.innerHTML = turmasPendentes.map(turma => `
            <div class="activity-item">
                <div class="activity-info">
                    <h4>${turma.nome}</h4>
                    <p>Curso: ${this.getCursoNome(turma.cursoId)} | Sala: ${turma.sala}</p>
                    <p>Período: ${turma.periodo} | Vagas: ${turma.vagas}</p>
                    <p>Criada em: ${this.formatDate(turma.createdAt)}</p>
                </div>
                <div class="activity-status">
                    <span class="status-badge pendente">Aguardando Validação</span>
                </div>
            </div>
        `).join('');
    }

    criarCurso() {
        const form = document.getElementById('formCurso');
        const formData = new FormData(form);
        
        // Coletar disciplinas
        const disciplinas = [];
        const disciplinasInputs = form.querySelectorAll('input[name="disciplinas[]"]');
        const cargasHorarias = form.querySelectorAll('input[name="cargasHorarias[]"]');
        
        for (let i = 0; i < disciplinasInputs.length; i++) {
            if (disciplinasInputs[i].value && cargasHorarias[i].value) {
                disciplinas.push({
                    nome: disciplinasInputs[i].value,
                    cargaHoraria: parseInt(cargasHorarias[i].value)
                });
            }
        }

        const cursoData = {
            nome: formData.get('nome'),
            codigo: formData.get('codigo'),
            duracao: parseInt(formData.get('duracao')),
            area: formData.get('area'),
            tipo: formData.get('tipo'),
            descricao: formData.get('descricao'),
            disciplinas: disciplinas,
            criadoPor: this.currentUser.id
        };

        // Verificar se código já existe
        const cursos = db.getCursos();
        if (cursos.some(c => c.codigo === cursoData.codigo)) {
            alert('Código do curso já existe! Escolha outro.');
            return;
        }

        try {
            const novoCurso = db.addCurso(cursoData);
            alert('Curso criado com sucesso!');
            form.reset();
            
            // Limpar disciplinas
            const disciplinasContainer = document.getElementById('disciplinasContainer');
            disciplinasContainer.innerHTML = `
                <div class="disciplina-item">
                    <input type="text" name="disciplinas[]" placeholder="Nome da disciplina" required>
                    <input type="number" name="cargasHorarias[]" placeholder="Carga horária (horas)" min="1" required>
                    <button type="button" class="remove-disciplina" onclick="removerDisciplina(this)">×</button>
                </div>
            `;
            
            this.loadDashboardData();
            this.carregarCursosParaSelect();
            
        } catch (error) {
            alert('Erro ao criar curso: ' + error.message);
        }
    }

    carregarCursosParaSelect() {
        const cursos = db.getCursos();
        const select = document.getElementById('turmaCurso');
        
        select.innerHTML = '<option value="">Selecione o curso</option>' +
            cursos.map(curso => `
                <option value="${curso.id}">${curso.nome} (${curso.codigo})</option>
            `).join('');
    }

    carregarTurmasParaSelect() {
        const turmasValidadas = db.getTurmas().filter(t => t.status === 'validada');
        const select = document.getElementById('estudanteTurma');
        
        select.innerHTML = '<option value="">Selecione a turma</option>' +
            turmasValidadas.map(turma => `
                <option value="${turma.id}">${turma.nome} - ${this.getCursoNome(turma.cursoId)}</option>
            `).join('');
    }

    criarTurma() {
        const form = document.getElementById('formTurma');
        const formData = new FormData(form);
        
        const turmaData = {
            nome: formData.get('nome'),
            cursoId: parseInt(formData.get('cursoId')),
            sala: formData.get('sala'),
            periodo: formData.get('periodo'),
            vagas: parseInt(formData.get('vagas')),
            anoLetivo: parseInt(formData.get('anoLetivo')),
            dataInicio: formData.get('dataInicio'),
            dataFim: formData.get('dataFim'),
            status: 'pendente', // Aguardando validação do pedagógico
            criadoPor: this.currentUser.id
        };

        // Verificar datas
        if (new Date(turmaData.dataInicio) >= new Date(turmaData.dataFim)) {
            alert('A data de início deve ser anterior à data de término!');
            return;
        }

        try {
            const novaTurma = db.addTurma(turmaData);
            alert('Turma criada com sucesso! Aguardando validação do pedagógico.');
            form.reset();
            this.loadDashboardData();
            
        } catch (error) {
            alert('Erro ao criar turma: ' + error.message);
        }
    }

    loadCursos() {
        const cursos = db.getCursos();
        const container = document.getElementById('cursosList');
        
        if (cursos.length === 0) {
            container.innerHTML = '<p class="no-data">Nenhum curso criado</p>';
            return;
        }

        container.innerHTML = cursos.map(curso => `
            <div class="curso-card">
                <div class="curso-header">
                    <h3>${curso.nome}</h3>
                    <span class="curso-codigo">${curso.codigo}</span>
                </div>
                <div class="curso-info">
                    <p><strong>Duração:</strong> ${curso.duracao} meses</p>
                    <p><strong>Área:</strong> ${curso.area}</p>
                    <p><strong>Tipo:</strong> ${curso.tipo}</p>
                    <p><strong>Disciplinas:</strong> ${curso.disciplinas.length}</p>
                </div>
                <div class="curso-disciplinas">
                    <h4>Disciplinas:</h4>
                    <ul>
                        ${curso.disciplinas.map(disciplina => `
                            <li>${disciplina.nome} (${disciplina.cargaHoraria}h)</li>
                        `).join('')}
                    </ul>
                </div>
                <div class="curso-actions">
                    <button onclick="secretariaSystem.editarCurso(${curso.id})" class="action-btn edit">Editar</button>
                    <button onclick="secretariaSystem.removerCurso(${curso.id})" class="action-btn danger">Remover</button>
                </div>
            </div>
        `).join('');
    }

    loadTurmas() {
        const turmas = db.getTurmas();
        const container = document.getElementById('turmasList');
        
        if (turmas.length === 0) {
            container.innerHTML = '<p class="no-data">Nenhuma turma criada</p>';
            return;
        }

        container.innerHTML = turmas.map(turma => `
            <div class="turma-card ${turma.status}">
                <div class="turma-header">
                    <h3>${turma.nome}</h3>
                    <span class="turma-status ${turma.status}">${this.getStatusText(turma.status)}</span>
                </div>
                <div class="turma-info">
                    <p><strong>Curso:</strong> ${this.getCursoNome(turma.cursoId)}</p>
                    <p><strong>Sala:</strong> ${turma.sala}</p>
                    <p><strong>Período:</strong> ${turma.periodo}</p>
                    <p><strong>Vagas:</strong> ${turma.vagas}</p>
                    <p><strong>Ano Letivo:</strong> ${turma.anoLetivo}</p>
                    <p><strong>Período:</strong> ${this.formatDate(turma.dataInicio)} a ${this.formatDate(turma.dataFim)}</p>
                </div>
                <div class="turma-actions">
                    ${turma.status === 'pendente' ? `
                        <span class="status-info">Aguardando validação</span>
                    ` : turma.status === 'validada' ? `
                        <span class="status-info success">✅ Validada</span>
                        ${turma.tutorId ? `
                            <span class="tutor-info">Tutor: ${this.getUserName(turma.tutorId)}</span>
                        ` : '<span class="status-info">Sem tutor atribuído</span>'}
                    ` : `
                        <span class="status-info danger">❌ Recusada</span>
                        ${turma.motivoRecusa ? `<p><strong>Motivo:</strong> ${turma.motivoRecusa}</p>` : ''}
                    `}
                </div>
            </div>
        `).join('');
    }

    filtrarTurmas() {
        const filtro = document.getElementById('filtroStatus').value;
        const turmas = db.getTurmas();
        
        let turmasFiltradas = turmas;
        if (filtro !== 'todas') {
            turmasFiltradas = turmas.filter(t => t.status === filtro);
        }
        
        const container = document.getElementById('turmasList');
        container.innerHTML = turmasFiltradas.map(turma => `
            <div class="turma-card ${turma.status}">
                <div class="turma-header">
                    <h3>${turma.nome}</h3>
                    <span class="turma-status ${turma.status}">${this.getStatusText(turma.status)}</span>
                </div>
                <div class="turma-info">
                    <p><strong>Curso:</strong> ${this.getCursoNome(turma.cursoId)}</p>
                    <p><strong>Sala:</strong> ${turma.sala}</p>
                    <p><strong>Período:</strong> ${turma.periodo}</p>
                    <p><strong>Vagas:</strong> ${turma.vagas}</p>
                </div>
            </div>
        `).join('');
    }

    matricularEstudante() {
        const form = document.getElementById('formEstudante');
        const formData = new FormData(form);
        
        const estudanteData = {
            username: formData.get('username'),
            password: formData.get('password'),
            profile: 'estudante',
            personalInfo: {
                nome: formData.get('nome'),
                dataNascimento: formData.get('dataNascimento'),
                genero: formData.get('genero'),
                bilheteIdentidade: formData.get('bilheteIdentidade'),
                contacto: formData.get('contacto'),
                email: formData.get('email'),
                residencia: formData.get('residencia')
            },
            turmaId: parseInt(formData.get('turmaId')),
            matricula: this.gerarNumeroMatricula(),
            dataMatricula: new Date().toISOString(),
            status: 'ativo'
        };

        if (db.getUserByUsername(estudanteData.username)) {
            alert('Username já existe! Escolha outro.');
            return;
        }

        // Verificar se há vagas na turma
        const turma = db.getTurmas().find(t => t.id === estudanteData.turmaId);
        const estudantesNaTurma = db.getEstudantes().filter(e => e.turmaId === estudanteData.turmaId).length;
        
        if (estudantesNaTurma >= turma.vagas) {
            alert('Não há vagas disponíveis nesta turma!');
            return;
        }

        try {
            const novoEstudante = db.addUser(estudanteData);
            db.addEstudante({
                userId: novoEstudante.id,
                turmaId: estudanteData.turmaId,
                matricula: estudanteData.matricula,
                dataMatricula: estudanteData.dataMatricula,
                status: 'ativo'
            });

            alert(`Estudante matriculado com sucesso! Número de matrícula: ${estudanteData.matricula}`);
            form.reset();
            this.loadDashboardData();
            
        } catch (error) {
            alert('Erro ao matricular estudante: ' + error.message);
        }
    }

    gerarNumeroMatricula() {
        const ano = new Date().getFullYear();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `${ano}${random}`;
    }

    editarCurso(cursoId) {
        // Implementar edição de curso
        alert(`Editar curso ID: ${cursoId}`);
    }

    removerCurso(cursoId) {
        if (confirm('Tem certeza que deseja remover este curso?')) {
            const cursos = db.getCursos();
            const updatedCursos = cursos.filter(curso => curso.id !== cursoId);
            db.saveCursos(updatedCursos);
            this.loadCursos();
            alert('Curso removido com sucesso!');
        }
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

    getStatusText(status) {
        const statusMap = {
            'pendente': 'Pendente',
            'validada': 'Validada',
            'recusada': 'Recusada'
        };
        return statusMap[status] || status;
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('pt-PT');
    }
}

// Funções globais para disciplinas
function adicionarDisciplina() {
    const container = document.getElementById('disciplinasContainer');
    const newDisciplina = document.createElement('div');
    newDisciplina.className = 'disciplina-item';
    newDisciplina.innerHTML = `
        <input type="text" name="disciplinas[]" placeholder="Nome da disciplina" required>
        <input type="number" name="cargasHorarias[]" placeholder="Carga horária (horas)" min="1" required>
        <button type="button" class="remove-disciplina" onclick="removerDisciplina(this)">×</button>
    `;
    container.appendChild(newDisciplina);
}

function removerDisciplina(button) {
    const disciplinaItem = button.parentElement;
    if (document.querySelectorAll('.disciplina-item').length > 1) {
        disciplinaItem.remove();
    } else {
        alert('O curso deve ter pelo menos uma disciplina!');
    }
}

// Inicializar sistema da secretaria
const secretariaSystem = new SecretariaSystem();