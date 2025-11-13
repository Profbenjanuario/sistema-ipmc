// Sistema de Base de Dados LocalStorage - ATUALIZADO
class IPMCDatabase {
    constructor() {
        this.init();
    }

    init() {
        if (!localStorage.getItem('ipmc_database')) {
            const database = {
                users: {
                    "admin": { 
                        password: "admin123", 
                        type: "secretaria", 
                        nome: "Administrador do Sistema",
                        email: "admin@ipmc.edu.mz"
                    },
                    "est2023001": { 
                        password: "123", 
                        type: "estudante", 
                        nome: "João Silva",
                        email: "joao.silva@ipmc.edu.mz",
                        curso: "Informática de Gestão",
                        ano: 2,
                        turma: "IG2-T1"
                    },
                    "tut2023001": { 
                        password: "123", 
                        type: "tutor", 
                        nome: "Dr. Carlos Santos",
                        email: "carlos.santos@ipmc.edu.mz",
                        departamento: "Informática",
                        categoria: "Professor Auxiliar"
                    },
                    "sec2023001": { 
                        password: "123", 
                        type: "secretaria", 
                        nome: "Maria Fernandes",
                        email: "maria.fernandes@ipmc.edu.mz"
                    },
                    "ped2023001": { 
                        password: "123", 
                        type: "pedagogico", 
                        nome: "Dr. António Muchanga",
                        email: "antonio.muchanga@ipmc.edu.mz"
                    }
                },
                
                // NOVA ESTRUTURA DE CURSOS E TURMAS
                cursos: [
                    {
                        id: 1,
                        codigo: "IG",
                        nome: "Informática de Gestão",
                        duracao: 3,
                        estado: "aprovado",
                        dataCriacao: "2024-01-15",
                        criadoPor: "sec2023001"
                    },
                    {
                        id: 2,
                        codigo: "AG",
                        nome: "Agronomia", 
                        duracao: 3,
                        estado: "aprovado",
                        dataCriacao: "2024-01-16",
                        criadoPor: "sec2023001"
                    }
                ],
                
                disciplinas: [
                    {
                        id: 1,
                        codigo: "IG101",
                        nome: "Programação Web",
                        cursoId: 1,
                        ano: 1,
                        semestre: 1,
                        creditos: 6,
                        estado: "aprovado"
                    },
                    {
                        id: 2, 
                        codigo: "IG102",
                        nome: "Base de Dados",
                        cursoId: 1,
                        ano: 1, 
                        semestre: 1,
                        creditos: 6,
                        estado: "aprovado"
                    },
                    {
                        id: 3,
                        codigo: "AG101",
                        nome: "Agricultura Geral",
                        cursoId: 2,
                        ano: 1,
                        semestre: 1, 
                        creditos: 5,
                        estado: "aprovado"
                    }
                ],
                
                turmas: [
                    {
                        id: 1,
                        codigo: "IG1-T1",
                        cursoId: 1,
                        ano: 1,
                        turma: "T1",
                        capacidade: 40,
                        estudantes: 35,
                        tutorId: "",
                        estado: "pendente", // pendente, aprovada, ativa, inativa
                        turno: "manha",
                        criadoPor: "sec2023001",
                        dataCriacao: "2024-01-20"
                    },
                    {
                        id: 2,
                        codigo: "AG1-T1", 
                        cursoId: 2,
                        ano: 1,
                        turma: "T1",
                        capacidade: 35,
                        estudantes: 0,
                        tutorId: "",
                        estado: "pendente",
                        turno: "tarde",
                        criadoPor: "sec2023001", 
                        dataCriacao: "2024-01-20"
                    }
                ],
                
                atribuicoesTutores: [
                    // Será preenchido quando pedagogico atribuir tutores
                ],
                
                estudantes: [],
                inscricoes: [],
                notas: [],
                pautas: [],
                exames: [],
                estagios: [],
                propinas: [],
                pagamentos: []
            };
            localStorage.setItem('ipmc_database', JSON.stringify(database));
        }
    }

    getDatabase() {
        return JSON.parse(localStorage.getItem('ipmc_database'));
    }

    saveDatabase(database) {
        localStorage.setItem('ipmc_database', JSON.stringify(database));
    }

    // MÉTODOS PARA CURSOS
    addCurso(curso) {
        const database = this.getDatabase();
        curso.id = Date.now();
        curso.estado = "pendente";
        curso.dataCriacao = new Date().toISOString().split('T')[0];
        database.cursos.push(curso);
        this.saveDatabase(database);
        return curso;
    }

    getCursos(estado = null) {
        const database = this.getDatabase();
        if (estado) {
            return database.cursos.filter(curso => curso.estado === estado);
        }
        return database.cursos;
    }

    updateCursoEstado(cursoId, estado) {
        const database = this.getDatabase();
        const curso = database.cursos.find(c => c.id == cursoId);
        if (curso) {
            curso.estado = estado;
            this.saveDatabase(database);
        }
    }

    // MÉTODOS PARA DISCIPLINAS
    addDisciplina(disciplina) {
        const database = this.getDatabase();
        disciplina.id = Date.now();
        disciplina.estado = "pendente";
        database.disciplinas.push(disciplina);
        this.saveDatabase(database);
        return disciplina;
    }

    getDisciplinasPorCurso(cursoId) {
        const database = this.getDatabase();
        return database.disciplinas.filter(d => d.cursoId == cursoId);
    }

    // MÉTODOS PARA TURMAS
    addTurma(turma) {
        const database = this.getDatabase();
        turma.id = Date.now();
        turma.estado = "pendente";
        turma.estudantes = 0;
        turma.tutorId = "";
        turma.dataCriacao = new Date().toISOString().split('T')[0];
        database.turmas.push(turma);
        this.saveDatabase(database);
        return turma;
    }

    getTurmas(estado = null) {
        const database = this.getDatabase();
        if (estado) {
            return database.turmas.filter(turma => turma.estado === estado);
        }
        return database.turmas;
    }

    getTurmasPorTutor(tutorId) {
        const database = this.getDatabase();
        return database.turmas.filter(turma => turma.tutorId === tutorId && turma.estado === "ativa");
    }

    updateTurmaEstado(turmaId, estado) {
        const database = this.getDatabase();
        const turma = database.turmas.find(t => t.id == turmaId);
        if (turma) {
            turma.estado = estado;
            this.saveDatabase(database);
        }
    }

    atribuirTutorTurma(turmaId, tutorId, disciplinas) {
        const database = this.getDatabase();
        const turma = database.turmas.find(t => t.id == turmaId);
        
        if (turma) {
            turma.tutorId = tutorId;
            turma.estado = "ativa";
            
            // Registrar atribuição
            database.atribuicoesTutores.push({
                id: Date.now(),
                turmaId: turmaId,
                tutorId: tutorId,
                disciplinas: disciplinas,
                dataAtribuicao: new Date().toISOString(),
                atribuidoPor: JSON.parse(sessionStorage.getItem('currentUser')).email
            });
            
            this.saveDatabase(database);
        }
    }

    // MÉTODOS PARA TUTORES
    getTutores() {
        const database = this.getDatabase();
        return Object.values(database.users).filter(user => user.type === 'tutor');
    }

    getTutor(tutorId) {
        const database = this.getDatabase();
        return database.users[tutorId];
    }

    // Outros métodos existentes...
    getUser(username) {
        const database = this.getDatabase();
        return database.users[username];
    }

    authenticate(username, password, userType) {
        const user = this.getUser(username);
        return user && user.password === password && user.type === userType;
    }
}

// Inicializar base de dados
const ipmcDB = new IPMCDatabase();
