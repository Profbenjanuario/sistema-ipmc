// Sistema de Base de Dados LocalStorage
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
                        ano: 2
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
                    },
                    "fin2023001": { 
                        password: "123", 
                        type: "financeiro", 
                        nome: "Paulo Cossa",
                        email: "paulo.cossa@ipmc.edu.mz"
                    },
                    "dir2023001": { 
                        password: "123", 
                        type: "director", 
                        nome: "Prof. Doutor Manuel Bila",
                        email: "manuel.bila@ipmc.edu.mz"
                    }
                },
                estudantes: [],
                tutores: [],
                disciplinas: [],
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

    getUser(username) {
        const database = this.getDatabase();
        return database.users[username];
    }

    authenticate(username, password, userType) {
        const user = this.getUser(username);
        return user && user.password === password && user.type === userType;
    }

    // Métodos para adicionar dados
    addStudent(student) {
        const database = this.getDatabase();
        database.estudantes.push(student);
        this.saveDatabase(database);
    }

    addGrade(grade) {
        const database = this.getDatabase();
        database.notas.push(grade);
        this.saveDatabase(database);
    }

    // Outros métodos de gestão de dados...
}

// Inicializar base de dados
const ipmcDB = new IPMCDatabase();
