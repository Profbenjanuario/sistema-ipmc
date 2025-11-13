// Funções utilitárias compartilhadas
function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-PT');
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: 'MZN'
    }).format(valor);
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function mostrarLoading(mensagem = 'A carregar...') {
    // Implementar overlay de loading
}

function esconderLoading() {
    // Implementar remoção de overlay
}

function mostrarErro(mensagem) {
    alert('Erro: ' + mensagem);
}

function mostrarSucesso(mensagem) {
    alert('Sucesso: ' + mensagem);
}

// Gestão de modais
function abrirModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function fecharModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Fechar modal ao clicar fora
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});
