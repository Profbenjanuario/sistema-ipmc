// Módulo do Estudante
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = checkAuth();
    if (currentUser && currentUser.type === 'estudante') {
        initEstudanteModule(currentUser);
    }
});

function initEstudanteModule(user) {
    // Atualizar interface com dados do usuário
    document.getElementById('userName').textContent = user.nome;
    document.getElementById('welcomeName').textContent = user.nome.split(' ')[0];
    document.getElementById('userAvatar').textContent = getInitials(user.nome);
    document.getElementById('userRoleDisplay').textContent = `Portal do Estudante - ${user.curso}`;

    // Carregar dados do estudante
    carregarDadosEstudante();

    // Configurar navegação
    setupNavigation();
}

function carregarDadosEstudante() {
    // Dados de exemplo - serão substituídos por dados reais
    const estudanteData = {
        numero: "EST2023001",
        curso: "Informática de Gestão",
        anoLectivo: 2024,
        semestre: "2º Semestre",
        disciplinas: [
            { codigo: "IG201", nome: "Programação Web", creditos: 6, turma: "T1", estado: "Inscrito" },
            { codigo: "IG202", nome: "Base de Dados", creditos: 6, turma: "T1", estado: "Inscrito" },
            { codigo: "IG203", nome: "Redes de Computadores", creditos: 5, turma: "T2", estado: "Inscrito" }
        ],
        proximasAulas: [
            { disciplina: "Programação Web", data: "Hoje", hora: "08:00", sala: "Lab 3" },
            { disciplina: "Base de Dados", data: "Amanhã", hora: "11:30", sala: "S105" }
        ],
        prazos: [
            { descricao: "Entrega TP Programação Web", data: "15 Jun 2024", tipo: "urgente" },
            { descricao: "Inscrição Exames", data: "30 Jun 2024", tipo: "importante" }
        ]
    };

    // Atualizar informações pessoais
    document.querySelectorAll('.info-item')[0].querySelector('span').textContent = estudanteData.numero;
    document.querySelectorAll('.info-item')[1].querySelector('span').textContent = estudanteData.curso;
    document.querySelectorAll('.info-item')[2].querySelector('span').textContent = estudanteData.anoLectivo;
    document.querySelectorAll('.info-item')[3].querySelector('span').textContent = estudanteData.semestre;

    // Carregar próximas aulas
    carregarProximasAulas(estudanteData.proximasAulas);
    
    // Carregar prazos importantes
    carregarPrazosImportantes(estudanteData.prazos);
    
    // Carregar inscrições
    carregarInscricoes(estudanteData.disciplinas);
}

function carregarProximasAulas(aulas) {
    const container = document.getElementById('proximas-aulas');
    container.innerHTML = aulas.map(aula => `
        <div style="padding: 10px 0; border-bottom: 1px solid var(--gray-100);">
            <div style="font-weight: 600;">${aula.disciplina}</div>
            <div style="font-size: 12px; color: var(--gray-800);">
                <i class="fas fa-calendar"></i> ${aula.data} | 
                <i class="fas fa-clock"></i> ${aula.hora} | 
                <i class="fas fa-door-open"></i> ${aula.sala}
            </div>
        </div>
    `).join('');
}

function carregarPrazosImportantes(prazos) {
    const container = document.getElementById('prazos-importantes');
    container.innerHTML = prazos.map(prazo => `
        <div style="padding: 10px 0; border-bottom: 1px solid var(--gray-100);">
            <div style="font-weight: 600;">${prazo.descricao}</div>
            <div style="font-size: 12px; color: var(--gray-800);">
                <i class="fas fa-clock"></i> ${prazo.data}
                <span class="badge ${prazo.tipo === 'urgente' ? 'badge-danger' : 'badge-warning'}" style="float: right;">
                    ${prazo.tipo}
                </span>
            </div>
        </div>
    `).join('');
}

function carregarInscricoes(disciplinas) {
    const container = document.getElementById('tabela-inscricoes');
    container.innerHTML = disciplinas.map(disciplina => `
        <tr>
            <td>${disciplina.nome}</td>
            <td>${disciplina.codigo}</td>
            <td>${disciplina.creditos}</td>
            <td>${disciplina.turma}</td>
            <td><span class="badge badge-success">${disciplina.estado}</span></td>
            <td>
                <button class="btn btn-outline btn-sm">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-outline btn-sm">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            // Remover classe active de todos os itens
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            // Adicionar classe active ao item clicado
            this.classList.add('active');
            
            // Esconder todos os conteúdos
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Mostrar o conteúdo correspondente
            const tabId = this.getAttribute('data-tab') + '-tab';
            document.getElementById(tabId).classList.add('active');
        });
    });
}

function abrirModalInscricao() {
    alert('Funcionalidade de nova inscrição será implementada!');
}

// Estudante-specific functions
function verNotas() {
    // Implementar visualização de notas
}

function verHorario() {
    // Implementar visualização de horário
}

function solicitarDocumento(tipo) {
    // Implementar solicitação de documentos
}
