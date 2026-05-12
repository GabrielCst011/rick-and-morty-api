const API_BASE = 'https://rickandmortyapi.com/api/character';

// ---- SELETORES ----
const container    = document.getElementById('cards-container');
const loading      = document.getElementById('loading');
const countDisplay = document.getElementById('count-display');
const searchInput  = document.getElementById('search');
const statusFilter = document.getElementById('status-filter');
const speciesFilter= document.getElementById('species-filter');
const modalOverlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');
const modalClose   = document.getElementById('modal-close');
const scrollTopBtn = document.getElementById('scroll-top');

// ---- ESTADO ----
let allCharacters = [];
let favorites     = JSON.parse(localStorage.getItem('rm-favorites') || '[]');
let searchDebounce;

//BUSCAR TODOS OS PERSONAGENS
async function fetchAllCharacters() {
  showLoading(true);
  allCharacters = [];

  try {
    const firstResponse = await fetch(API_BASE);
    const firstData     = await firstResponse.json();
    const totalPages    = firstData.info.pages;

    allCharacters.push(...firstData.results);

    const pagePromises = [];
    for (let page = 2; page <= totalPages; page++) {
      pagePromises.push(
        fetch(`${API_BASE}?page=${page}`).then(r => r.json())
      );
    }

    const pagesData = await Promise.all(pagePromises);
    pagesData.forEach(pageData => {
      allCharacters.push(...pageData.results);
    });

    renderCards(allCharacters);
    countDisplay.textContent = `${allCharacters.length} personagens encontrados no multiverso`;

  } catch (error) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>⚠️ Portal Interdimensional Falhou</h3>
        <p>Não foi possível conectar ao multiverso. Verifique sua conexão.</p>
        <p style="font-size:0.8rem;margin-top:8px;color:#7AAFC4;">${error.message}</p>
      </div>`;
    countDisplay.textContent = 'Erro ao carregar personagens';
  } finally {
    showLoading(false);
  }
}

// CRIAR CARD DINAMICAMENTE COM JavaScript
function createCard(character) {
  const isFav = favorites.includes(character.id);

  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.id = character.id;

  const idBadge = document.createElement('span');
  idBadge.classList.add('card-id-badge');
  idBadge.textContent = `#${character.id}`;

  const imgWrap = document.createElement('div');
  imgWrap.classList.add('card-img-wrap');

  const img = document.createElement('img');
  img.src   = character.image;
  img.alt   = character.name;
  img.loading = 'lazy';

  const favBtn = document.createElement('button');
  favBtn.classList.add('card-fav');
  if (isFav) favBtn.classList.add('active');
  favBtn.innerHTML = isFav ? '♥' : '♡';
  favBtn.title = 'Adicionar aos favoritos';
  favBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFavorite(character.id, favBtn);
  });

  imgWrap.appendChild(img);
  imgWrap.appendChild(favBtn);

  const body = document.createElement('div');
  body.classList.add('card-body');

  const name = document.createElement('h3');
  name.classList.add('card-name');
  name.textContent = character.name;
  name.title = character.name;

  const statusRow = document.createElement('div');
  statusRow.classList.add('card-status');

  const dot = document.createElement('span');
  dot.classList.add('status-dot', character.status.toLowerCase());

  const statusText = document.createElement('span');
  statusText.textContent = `${translateStatus(character.status)} — ${character.species}`;

  statusRow.appendChild(dot);
  statusRow.appendChild(statusText);

  const info = document.createElement('div');
  info.classList.add('card-info');

  info.innerHTML = `
    <span>Gênero: <strong>${translateGender(character.gender)}</strong></span>
    <span>Origem: <strong>${character.origin.name}</strong></span>
    <span>Episódios: <strong>${character.episode.length}</strong></span>
  `;

  body.appendChild(name);
  body.appendChild(statusRow);
  body.appendChild(info);

  card.appendChild(idBadge);
  card.appendChild(imgWrap);
  card.appendChild(body);

  card.addEventListener('click', () => openModal(character));

  return card;
}

// RENDERIZAR LISTA DE CARDS
function renderCards(characters) {
  container.innerHTML = '';

  if (characters.length === 0) {
    const empty = document.createElement('div');
    empty.classList.add('empty-state');
    empty.innerHTML = `
      <h3>🔭 Nenhum personagem encontrado</h3>
      <p>Tente outro nome ou remova os filtros.</p>
    `;
    container.appendChild(empty);
    countDisplay.textContent = '0 personagens encontrados';
    return;
  }

  characters.forEach(character => {
    const card = createCard(character);
    container.appendChild(card);
  });

  countDisplay.textContent = `${characters.length} personagens encontrados`;
}

// FILTRO
function applyFilters() {
  const query   = searchInput.value.toLowerCase().trim();
  const status  = statusFilter.value.toLowerCase();
  const species = speciesFilter.value.toLowerCase();

  const filtered = allCharacters.filter(c => {
    const matchName    = c.name.toLowerCase().includes(query);
    const matchStatus  = status  === '' || c.status.toLowerCase()  === status;
    const matchSpecies = species === '' || c.species.toLowerCase() === species;
    return matchName && matchStatus && matchSpecies;
  });

  renderCards(filtered);
}

searchInput.addEventListener('input', () => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(applyFilters, 300);
});

statusFilter.addEventListener('change', applyFilters);
speciesFilter.addEventListener('change', applyFilters);

// MODAL DE DETALHES
function openModal(character) {
  const isFav = favorites.includes(character.id);

  modalContent.innerHTML = `
    <img class="modal-img" src="${character.image}" alt="${character.name}" />
    <div class="modal-body">
      <h2 class="modal-name">${character.name}</h2>
      <div class="modal-status">
        <span class="status-dot ${character.status.toLowerCase()}"></span>
        ${translateStatus(character.status)} — ${character.species}
      </div>
      <div class="modal-grid">
        <div class="modal-field">
          <div class="modal-field-label">Gênero</div>
          <div class="modal-field-value">${translateGender(character.gender)}</div>
        </div>
        <div class="modal-field">
          <div class="modal-field-label">Espécie</div>
          <div class="modal-field-value">${character.species}</div>
        </div>
        <div class="modal-field">
          <div class="modal-field-label">Tipo</div>
          <div class="modal-field-value">${character.type || 'Padrão'}</div>
        </div>
        <div class="modal-field">
          <div class="modal-field-label">Episódios</div>
          <div class="modal-field-value">${character.episode.length} episódios</div>
        </div>
        <div class="modal-field" style="grid-column: 1 / -1">
          <div class="modal-field-label">Origem</div>
          <div class="modal-field-value">${character.origin.name}</div>
        </div>
        <div class="modal-field" style="grid-column: 1 / -1">
          <div class="modal-field-label">Última localização</div>
          <div class="modal-field-value">${character.location.name}</div>
        </div>
      </div>
    </div>
  `;

  modalOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.add('hidden');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// FAVORITOS
function toggleFavorite(id, btn) {
  const index = favorites.indexOf(id);
  if (index === -1) {
    favorites.push(id);
    btn.classList.add('active');
    btn.innerHTML = '♥';
  } else {
    favorites.splice(index, 1);
    btn.classList.remove('active');
    btn.innerHTML = '♡';
  }
  localStorage.setItem('rm-favorites', JSON.stringify(favorites));
}

// UTILITÁRIOS
function showLoading(show) {
  loading.classList.toggle('hidden', !show);
}

function translateStatus(status) {
  const map = { Alive: 'Vivo', Dead: 'Morto', unknown: 'Desconhecido' };
  return map[status] || status;
}

function translateGender(gender) {
  const map = { Male: 'Masculino', Female: 'Feminino', Genderless: 'Sem gênero', unknown: 'Desconhecido' };
  return map[gender] || gender;
}

window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
});
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// INICIALIZAÇÃO
fetchAllCharacters();
