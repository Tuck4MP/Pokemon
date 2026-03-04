# Pokémon Infinite Fusion — Tracker de Nuzlocke

Site estático e interativo para:

- Filtrar Pokémon por nome/número;
- Filtrar por local de captura;
- Marcar Pokémon já capturados;
- Acompanhar progresso da sua run Nuzlocke.

## Como usar

Abra o `index.html` com um servidor local (recomendado para o `fetch` do JSON):

```bash
python3 -m http.server 4173
```

Depois acesse `http://localhost:4173`.

## Fonte dos dados

- Estrutura baseada no Pokédex de Infinite Fusion:
  https://infinitefusion.fandom.com/wiki/Pok%C3%A9dex
- O arquivo inicial `data/pokemon_locations.json` vem com uma amostra para começar.

## Expandindo para a Pokédex completa

Edite `data/pokemon_locations.json` usando este formato:

```json
{
  "number": 25,
  "name": "Pikachu",
  "types": ["Electric"],
  "locations": ["Viridian Forest", "Power Plant"],
  "method": "Wild"
}
```

Você pode importar todos os Pokémon/locais da wiki para transformar em um tracker completo para sua Nuzlocke.
