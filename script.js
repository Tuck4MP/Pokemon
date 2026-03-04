const STORAGE_KEY = "infinite-fusion-nuzlocke-captured";

const state = {
  allPokemon: [],
  filteredPokemon: [],
  captured: new Set(loadCaptured()),
};

const elements = {
  searchInput: document.getElementById("searchInput"),
  locationFilter: document.getElementById("locationFilter"),
  onlyMissing: document.getElementById("onlyMissing"),
  clearBtn: document.getElementById("clearBtn"),
  pokemonList: document.getElementById("pokemonList"),
  progressText: document.getElementById("progressText"),
  progressFill: document.getElementById("progressFill"),
  template: document.getElementById("pokemonCardTemplate"),
};

init();

async function init() {
  try {
    const response = await fetch("data/pokemon_locations.json");
    state.allPokemon = await response.json();

    populateLocationFilter();
    bindEvents();
    applyFilters();
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    elements.pokemonList.innerHTML =
      '<p class="empty">Não foi possível carregar os dados do Pokédex.</p>';
  }
}

function bindEvents() {
  elements.searchInput.addEventListener("input", applyFilters);
  elements.locationFilter.addEventListener("change", applyFilters);
  elements.onlyMissing.addEventListener("change", applyFilters);

  elements.clearBtn.addEventListener("click", () => {
    state.captured.clear();
    persistCaptured();
    applyFilters();
  });
}

function populateLocationFilter() {
  const locations = new Set();

  state.allPokemon.forEach((pokemon) => {
    pokemon.locations.forEach((location) => locations.add(location));
  });

  [...locations]
    .sort((a, b) => a.localeCompare(b, "pt-BR"))
    .forEach((location) => {
      const option = document.createElement("option");
      option.value = location;
      option.textContent = location;
      elements.locationFilter.appendChild(option);
    });
}

function applyFilters() {
  const query = elements.searchInput.value.trim().toLowerCase();
  const location = elements.locationFilter.value;
  const onlyMissing = elements.onlyMissing.checked;

  state.filteredPokemon = state.allPokemon.filter((pokemon) => {
    const matchesQuery =
      pokemon.name.toLowerCase().includes(query) ||
      String(pokemon.number).includes(query);

    const matchesLocation =
      location === "all" || pokemon.locations.includes(location);

    const isCaptured = state.captured.has(String(pokemon.number));
    const matchesCaptured = onlyMissing ? !isCaptured : true;

    return matchesQuery && matchesLocation && matchesCaptured;
  });

  renderPokemonList();
  updateProgress();
}

function renderPokemonList() {
  elements.pokemonList.innerHTML = "";

  if (state.filteredPokemon.length === 0) {
    elements.pokemonList.innerHTML =
      '<p class="empty">Nenhum Pokémon encontrado com os filtros atuais.</p>';
    return;
  }

  const fragment = document.createDocumentFragment();

  state.filteredPokemon.forEach((pokemon) => {
    const card = elements.template.content.firstElementChild.cloneNode(true);
    const captured = state.captured.has(String(pokemon.number));

    card.querySelector(".poke-name").textContent = pokemon.name;
    card.querySelector(".poke-number").textContent = `#${pokemon.number}`;
    card.querySelector(".types").textContent = `Tipo(s): ${pokemon.types.join(
      " / "
    )}`;
    card.querySelector(".locations").textContent = `Local(is): ${pokemon.locations.join(
      ", "
    )}`;
    card.querySelector(".method").textContent = `Método: ${pokemon.method}`;

    const captureButton = card.querySelector(".capture-toggle");
    captureButton.textContent = captured ? "Capturado ✅" : "Marcar como capturado";
    captureButton.classList.toggle("is-captured", captured);
    card.classList.toggle("captured", captured);

    captureButton.addEventListener("click", () => {
      toggleCaptured(pokemon.number);
    });

    fragment.appendChild(card);
  });

  elements.pokemonList.appendChild(fragment);
}

function toggleCaptured(number) {
  const id = String(number);

  if (state.captured.has(id)) {
    state.captured.delete(id);
  } else {
    state.captured.add(id);
  }

  persistCaptured();
  applyFilters();
}

function updateProgress() {
  const total = state.allPokemon.length;
  const capturedCount = [...state.captured].filter((number) =>
    state.allPokemon.some((pokemon) => String(pokemon.number) === number)
  ).length;

  const percent = total > 0 ? Math.round((capturedCount / total) * 100) : 0;

  elements.progressText.textContent = `${capturedCount} / ${total} capturados (${percent}%)`;
  elements.progressFill.style.width = `${percent}%`;
  elements.progressFill.parentElement.setAttribute("aria-valuenow", String(percent));
}

function loadCaptured() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistCaptured() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...state.captured]));
}
