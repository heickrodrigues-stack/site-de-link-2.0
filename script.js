// Dados iniciais de exemplo
const linksIniciais = [
    { id: 1, titulo: "Meu Portfolio", url: "https://www.google.com", cliques: 12, fixado: true },
    { id: 2, titulo: "Instagram", url: "https://www.instagram.com", cliques: 5, fixado: false },
    { id: 3, titulo: "GitHub", url: "https://www.github.com", cliques: 8, fixado: false }
];

// Estado da Aplicação
let meusLinks = JSON.parse(localStorage.getItem('meus_links_v2')) || linksIniciais;
let modoEscuro = localStorage.getItem('tema_escuro') !== 'false';

// Elementos DOM
const containerLinks = document.getElementById("links-container");
const formLink = document.getElementById("link-form");
const inputTitulo = document.getElementById("input-titulo");
const inputUrl = document.getElementById("input-url");
const inputSearch = document.getElementById("search-input");
const btnTheme = document.getElementById("theme-toggle");

// 1. Controle de Tema (Dark / Light)
function atualizarTema() {
    if (modoEscuro) {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        btnTheme.innerHTML = `<i class="fa-solid fa-sun"></i>`;
    } else {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        btnTheme.innerHTML = `<i class="fa-solid fa-moon"></i>`;
    }
    localStorage.setItem('tema_escuro', modoEscuro);
}

btnTheme.addEventListener("click", () => {
    modoEscuro = !modoEscuro;
    atualizarTema();
});

// 2. Renderização dos Links
function renderizarLinks() {
    containerLinks.innerHTML = "";
    const termoBusca = inputSearch.value.toLowerCase();

    // Ordenação: Fixados primeiro, depois por número de cliques
    const linksOrdenados = [...meusLinks].sort((a, b) => {
        if (a.fixado !== b.fixado) return b.fixado - a.fixado;
        return b.cliques - a.cliques;
    });

    // Filtro pela busca
    const linksFiltrados = linksOrdenados.filter(item => 
        item.titulo.toLowerCase().includes(termoBusca)
    );

    if (linksFiltrados.length === 0) {
        containerLinks.innerHTML = `<p style="text-align:center; color: var(--text-secondary); padding: 20px;">Nenhum link encontrado.</p>`;
        return;
    }

    linksFiltrados.forEach(item => {
        const div = document.createElement("div");
        div.className = `link-item ${item.fixado ? 'pinned' : ''}`;

        div.innerHTML = `
            <a href="${item.url}" target="_blank" class="link-content" data-id="${item.id}">
                <div class="link-header">
                    ${item.fixado ? '<i class="fa-solid fa-thumbtack" style="color: #f59e0b; font-size:0.8rem;"></i>' : ''}
                    <span>${item.titulo}</span>
                </div>
                <span class="click-badge">${item.cliques} cliques</span>
            </a>
            <div class="actions">
                <button class="action-btn ${item.fixado ? 'active' : ''}" onclick="toggleFixar(${item.id})" title="Fixar/Desfixar">
                    <i class="fa-solid fa-thumbtack"></i>
                </button>
                <button class="action-btn" onclick="copiarLink('${item.url}')" title="Copiar URL">
                    <i class="fa-regular fa-copy"></i>
                </button>
                <button class="action-btn delete" onclick="removerLink(${item.id})" title="Excluir">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;

        // Evento para incrementar o contador de cliques ao clicar no link
        div.querySelector('.link-content').addEventListener('click', () => registrarClique(item.id));

        containerLinks.appendChild(div);
    });

    localStorage.setItem('meus_links_v2', JSON.stringify(meusLinks));
}

// 3. Funções das Ações
formLink.addEventListener("submit", (e) => {
    e.preventDefault();
    let url = inputUrl.value.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    meusLinks.push({
        id: Date.now(),
        titulo: inputTitulo.value.trim(),
        url: url,
        cliques: 0,
        fixado: false
    });

    inputTitulo.value = "";
    inputUrl.value = "";
    renderizarLinks();
});

function registrarClique(id) {
    const link = meusLinks.find(l => l.id === id);
    if (link) {
        link.cliques += 1;
        renderizarLinks();
    }
}

function toggleFixar(id) {
    const link = meusLinks.find(l => l.id === id);
    if (link) {
        link.fixado = !link.fixado;
        renderizarLinks();
    }
}

function removerLink(id) {
    meusLinks = meusLinks.filter(l => l.id !== id);
    renderizarLinks();
}

function copiarLink(url) {
    navigator.clipboard.writeText(url);
    alert("Link copiado para a área de transferência!");
}

// Busca em tempo real
inputSearch.addEventListener("input", renderizarLinks);

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    atualizarTema();
    renderizarLinks();
});
