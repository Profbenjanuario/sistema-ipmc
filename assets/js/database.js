class Database {
    constructor() {
        this.init();
    }

    init() {
        // Inicializar dados se não existirem
        if (!localStorage.getItem('ipmc_users')) {
            const adminUser = {
                id: 1,
                username: 'admin',
                password: 'admin123',
                profile: 'director',
                personalInfo: {
                    nome: 'Administrador Sistema',
                    formacao: 'Gestão de Sistemas',
                    dataNascimento: '1980-01-01',
                    residencia: 'IPMC',
                    contacto: '+244 900 000 000',
                    email: 'admin@ipmc.ao',
                    bilheteIdentidade: '000000000LA000'
                },
                createdAt: new Date().toISOString()
            };
            
            localStorage.setItem('ipmc_users', JSON.stringify([adminUser]));
        }

        if (!localStorage.getItem('ipmc_cursos')) {
            localStorage.setItem('ipmc_cursos', JSON.stringify([]));
        }

        if (!localStorage.getItem('ipmc_turmas')) {
            localStorage.setItem('ipmc_turmas', JSON.stringify([]));
        }

        if (!localStorage.getItem('ipmc_estudantes')) {
            localStorage.setItem('ipmc_estudantes', JSON.stringify([]));
        }

        if (!localStorage.getItem('ipmc_avaliacoes')) {
            localStorage.setItem('ipmc_avaliacoes', JSON.stringify([]));
        }
    }

    // Users
    getUsers() {
        return JSON.parse(localStorage.getItem('ipmc_users') || '[]');
    }

    saveUsers(users) {
        localStorage.setItem('ipmc_users', JSON.stringify(users));
    }

    addUser(user) {
        const users = this.getUsers();
        user.id = this.generateId(users);
        user.createdAt = new Date().toISOString();
        users.push(user);
        this.saveUsers(users);
        return user;
    }

    getUserByUsername(username) {
        const users = this.getUsers();
        return users.find(user => user.username === username);
    }

    // Cursos
    getCursos() {
        return JSON.parse(localStorage.getItem('ipmc_cursos') || '[]');
    }

    saveCursos(cursos) {
        localStorage.setItem('ipmc_cursos', JSON.stringify(cursos));
    }

    addCurso(curso) {
        const cursos = this.getCursos();
        curso.id = this.generateId(cursos);
        curso.createdAt = new Date().toISOString();
        cursos.push(curso);
        this.saveCursos(cursos);
        return curso;
    }

    // Turmas
    getTurmas() {
        return JSON.parse(localStorage.getItem('ipmc_turmas') || '[]');
    }

    saveTurmas(turmas) {
        localStorage.setItem('ipmc_turmas', JSON.stringify(turmas));
    }

    addTurma(turma) {
        const turmas = this.getTurmas();
        turma.id = this.generateId(turmas);
        turma.createdAt = new Date().toISOString();
        turmas.push(turma);
        this.saveTurmas(turmas);
        return turma;
    }

    // Estudantes
    getEstudantes() {
        return JSON.parse(localStorage.getItem('ipmc_estudantes') || '[]');
    }

    saveEstudantes(estudantes) {
        localStorage.setItem('ipmc_estudantes', JSON.stringify(estudantes));
    }

    addEstudante(estudante) {
        const estudantes = this.getEstudantes();
        estudante.id = this.generateId(estudantes);
        estudante.createdAt = new Date().toISOString();
        estudantes.push(estudante);
        this.saveEstudantes(estudantes);
        return estudante;
    }

    // Avaliações
    getAvaliacoes() {
        return JSON.parse(localStorage.getItem('ipmc_avaliacoes') || '[]');
    }

    saveAvaliacoes(avaliacoes) {
        localStorage.setItem('ipmc_avaliacoes', JSON.stringify(avaliacoes));
    }

    addAvaliacao(avaliacao) {
        const avaliacoes = this.getAvaliacoes();
        avaliacao.id = this.generateId(avaliacoes);
        avaliacao.createdAt = new Date().toISOString();
        avaliacoes.push(avaliacao);
        this.saveAvaliacoes(avaliacoes);
        return avaliacao;
    }

    // Utilitários
    generateId(array) {
        return array.length > 0 ? Math.max(...array.map(item => item.id)) + 1 : 1;
    }

    getNextCodigoTurma() {
        const turmas = this.getTurmas();
        const lastTurma = turmas[turmas.length - 1];
        return lastTurma ? lastTurma.codigo + 1 : 1001;
    }
}

// Instância global do banco de dados
const db = new Database();
