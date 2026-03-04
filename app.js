const pokemonData = [
  {
    id: 1,
    name: 'Pidgey',
    location: 'Rota 1',
    notes: 'Comum em gramados no início do jogo.'
  },
  {
    id: 16,
    name: 'Rattata',
    location: 'Rota 1 / Rota 2',
    notes: 'Ótima opção para capturar cedo e usar como base de fusão.'
  },
  {
    id: 19,
    name: 'Spearow',
    location: 'Rota 3',
    notes: 'Mais ofensivo que Pidgey no começo da run.'
  },
  {
    id: 63,
    name: 'Abra',
    location: 'Rota 24 / Rota 25',
    notes: 'Pode fugir rápido: use Quick Ball ou status.'
  },
  {
    id: 92,
    name: 'Gastly',
    location: 'Pokémon Tower',
    notes: 'Excelente para fusões especiais e imunidade a Normal/Lutador.'
  },
  {
    id: 104,
    name: 'Cubone',
    location: 'Pokémon Tower',
    notes: 'Bom ataque físico e opções interessantes de fusão.'
  },
  {
    id: 133,
    name: 'Eevee',
    location: 'Celadon City (presente)',
    notes: 'Muito versátil para evoluções e combinações.'
  },
  {
    id: 120,
    name: 'Staryu',
    location: 'Vermilion (pesca com Good Rod)',
    notes: 'Acesso a água e boa velocidade para nuzlocke.'
  },
  {
    id: 129,
    name: 'Magikarp',
    location: 'Vendedor no Mt. Moon / pescaria',
    notes: 'Evolui para Gyarados, um dos mais fortes da campanha.'
  },
  {
    id: 147,
    name: 'Dratini',
    location: 'Safari Zone (áreas específicas)',
    notes: 'Raro, mas excelente para late game e fusões premium.'
  }
];

const storageKey = 'infinite-fusion-nuzlocke-caught';
let caughtIds = new Set(JSON.parse(localStorage.getItem(storageKey) || '[]'));

const elements = {
  list: document.getElementById('pokemonList'),
  template: document.getElementById('pokemonCardTemplate'),
  searchInput: document.getElementById('searchInput'),
  areaFilter: document.getElementById('areaFilter'),
  showOnlyMissing: document.getElementById('showOnlyMissing'),
  caughtCount: document.getElementById('caughtCount'),
  totalCount: document.getElementById('totalCount'),
  resetButton: document.getElementById('resetButton')
};

const uniqueAreas = [...new Set(pokemonData.map((pokemon) => pokemon.location))].sort();

for (const area of uniqueAreas) {
  const option = document.createElement('option');
  option.value = area;
  option.textContent = area;
  elements.areaFilter.append(option);
}

function saveCaught() {
  localStorage.setItem(storageKey, JSON.stringify([...caughtIds]));
}

function updateStats(totalVisible) {
  elements.caughtCount.textContent = caughtIds.size;
  elements.totalCount.textContent = totalVisible;
}

function buildCard(pokemon) {
  const node = elements.template.content.firstElementChild.cloneNode(true);
  const checkbox = node.querySelector('.caught-checkbox');

  node.querySelector('.name').textContent = `#${String(pokemon.id).padStart(3, '0')} ${pokemon.name}`;
  node.querySelector('.location').textContent = `Local: ${pokemon.location}`;
  node.querySelector('.notes').textContent = pokemon.notes;
  checkbox.checked = caughtIds.has(pokemon.id);

  if (checkbox.checked) {
    node.classList.add('caught');
  }

  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      caughtIds.add(pokemon.id);
      node.classList.add('caught');
    } else {
      caughtIds.delete(pokemon.id);
      node.classList.remove('caught');
    }

    saveCaught();
    updateStats(getFilteredPokemon().length);
  });

  return node;
}

function getFilteredPokemon() {
  const search = elements.searchInput.value.trim().toLowerCase();
  const area = elements.areaFilter.value;
  const onlyMissing = elements.showOnlyMissing.checked;

  return pokemonData.filter((pokemon) => {
    const matchesSearch =
      pokemon.name.toLowerCase().includes(search) ||
      pokemon.location.toLowerCase().includes(search);
    const matchesArea = area ? pokemon.location === area : true;
    const matchesMissing = onlyMissing ? !caughtIds.has(pokemon.id) : true;

    return matchesSearch && matchesArea && matchesMissing;
  });
}

function render() {
  const filteredPokemon = getFilteredPokemon();
  elements.list.replaceChildren(...filteredPokemon.map(buildCard));
  updateStats(filteredPokemon.length);
}

for (const input of [elements.searchInput, elements.areaFilter, elements.showOnlyMissing]) {
  input.addEventListener('input', render);
  input.addEventListener('change', render);
}

elements.resetButton.addEventListener('click', () => {
  caughtIds = new Set();
  saveCaught();
  render();
});

render();
