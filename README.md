# 🛸 Rick & Morty Universe

Projeto front-end desenvolvido como trabalho acadêmico, que consome dados em tempo real da [Rick and Morty API](https://rickandmortyapi.com/) e exibe os personagens da série em cards dinâmicos criados via JavaScript.

---

## 🔗 Demo

> [Acesse o projeto online](https://seunome.github.io/rick-and-morty-api) ← substitua pelo seu link do GitHub Pages

---

## 🖥️ Preview

![Preview do projeto](https://rickandmortyapi.com/api/character/avatar/1.jpeg)

---

## 🚀 Funcionalidades

- ✅ Consumo da API pública via `fetch()`
- ✅ Busca de **todos os personagens** (~826) com paginação automática em paralelo (`Promise.all`)
- ✅ Cards criados **100% dinamicamente** com `createElement` e `appendChild`
- ✅ Filtro por **nome**, **status** (vivo/morto/desconhecido) e **espécie**
- ✅ Modal com detalhes completos ao clicar em um personagem
- ✅ Sistema de **favoritos** com persistência via `localStorage`
- ✅ Layout **responsivo** (mobile e desktop)
- ✅ Animações de entrada nos cards e efeitos de hover
- ✅ Botão "voltar ao topo"

---

## 🗂️ Estrutura do Projeto

```
rick-and-morty/
├── index.html   # Estrutura da página
├── style.css    # Estilização e tema visual
├── script.js    # Lógica, consumo da API e criação dos cards
└── README.md    # Documentação
```

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
|---|---|
| HTML5 | Estrutura semântica da página |
| CSS3 | Estilização, animações e responsividade |
| JavaScript (ES6+) | Consumo da API, manipulação do DOM, filtros |
| Fetch API | Requisições HTTP à Rick and Morty API |
| localStorage | Persistência dos favoritos no navegador |

---

## 📡 API Utilizada

**Rick and Morty API** — [rickandmortyapi.com](https://rickandmortyapi.com/)

- **Gratuita** e sem necessidade de token
- Retorna dados em formato JSON
- Suporta paginação (20 personagens por página)
- Endpoint principal utilizado:

```
GET https://rickandmortyapi.com/api/character
GET https://rickandmortyapi.com/api/character?page=2
```

**Exemplo de resposta da API:**
```json
{
  "id": 1,
  "name": "Rick Sanchez",
  "status": "Alive",
  "species": "Human",
  "gender": "Male",
  "origin": { "name": "Earth (C-137)" },
  "location": { "name": "Citadel of Ricks" },
  "image": "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
  "episode": ["https://rickandmortyapi.com/api/episode/1", "..."]
}
```

---

## ⚙️ Como Executar Localmente

Não requer instalação de dependências ou servidor. Basta:

1. Clone o repositório:
```bash
git clone https://github.com/seunome/rick-and-morty-api.git
```

2. Acesse a pasta:
```bash
cd rick-and-morty-api
```

3. Abra o arquivo `index.html` no navegador — ou use a extensão **Live Server** no VS Code.

---

## 📌 Como o JavaScript Cria os Cards

O HTML não contém nenhum card estático. Todo o conteúdo é gerado via JavaScript:

```javascript
function createCard(character) {
  const card = document.createElement('div');   // cria o elemento
  card.classList.add('card');                   // adiciona a classe CSS

  const img = document.createElement('img');
  img.src = character.image;
  img.alt = character.name;

  const name = document.createElement('h3');
  name.textContent = character.name;

  card.appendChild(img);                        // insere no card
  card.appendChild(name);

  return card;
}

// Inserção no DOM
container.appendChild(card);
```

---

## 📚 Referências

- [Documentação da Rick and Morty API](https://rickandmortyapi.com/documentation)
- [MDN — Fetch API](https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API/Using_Fetch)
- [MDN — createElement](https://developer.mozilla.org/pt-BR/docs/Web/API/Document/createElement)
- [MDN — appendChild](https://developer.mozilla.org/pt-BR/docs/Web/API/Node/appendChild)

---

## 👨‍💻 Autor

Feito por **[Seu Nome]** — Projeto acadêmico de Front-End com consumo de API.
