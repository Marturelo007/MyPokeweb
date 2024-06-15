let currentPokemonId = null;
document.addEventListener("DOMContentLoaded", () => {
  const MAX_POKEMONS = 1025;
  const pokemonID = new URLSearchParams(window.location.search).get("id");
  const id = parseInt(pokemonID, 10);

  if (id < 1 || id > MAX_POKEMONS) {
    return (window.location.href = "./pokedex.html");
  }

  currentPokemonId = id;
  loadPokemon(id);
});

async function loadPokemon(id) {
  try {
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
        res.json()
      ),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) =>
        res.json()
      ),
    ]);

    const abilitiesWrapper = document.querySelector(
      ".pokemon-detail-wrap .pokemon-detail.move"
    );
    abilitiesWrapper.innerHTML = "";

    if (currentPokemonId === id) {
      displayPokemonDetails(pokemon);
      const flavorText = getEnglishFlavorText(pokemonSpecies);
      document.querySelector(".body3-fonts.pokemon-description").textContent =
        flavorText;

      const [leftArrow, rightArrow] = ["#leftArrow", "#rightArrow"].map((sel) =>
        document.querySelector(sel)
      );
      leftArrow.removeEventListener("click", navigatePokemon);
      rightArrow.removeEventListener("click", navigatePokemon);

      if (id !== 1) {
        leftArrow.addEventListener("click", () => {
          navigatePokemon(id - 1);
        });
      }
      if (id !== 1025) {
        rightArrow.addEventListener("click", () => {
          navigatePokemon(id + 1);
        });
      }

      window.history.pushState({}, "", `./detail.html?id=${id}`);
    }

    return true;
  } catch (error) {
    console.error("An error occured while fetching Pokemon data:", error);
    return false;
  }
}

async function navigatePokemon(id) {
  currentPokemonId = id;
  await loadPokemon(id);
}

const typeColors = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#585858",
  steel: "#B8B8D0",
  fairy: "#ff6cdd",
};

function setElementStyles(elements, cssProperty, value) {
  elements.forEach((element) => {
    element.style[cssProperty] = value;
  });
}

function rgbaFromHex(hexColor) {
  return [
    parseInt(hexColor.slice(1, 3), 16),
    parseInt(hexColor.slice(3, 5), 16),
    parseInt(hexColor.slice(5, 7), 16),
  ].join(", ");
}

function setTypeBackgroundColor(pokemon) {
  const types = pokemon.types;

  if (types.length === 0) {
    console.warn("No type found for this Pokémon");
    return;
  }

  const mainType = types[0].type.name;
  const mainTypeColor = typeColors[mainType] || "#000000"; // Default to black if color not found
  
  const detailMainElement = document.querySelector(".detail-main");
  setElementStyles([detailMainElement], "backgroundColor", mainTypeColor);
  setElementStyles([detailMainElement], "borderColor", mainTypeColor);

  const powerWrapper = document.querySelector(".power-wrapper");
  powerWrapper.innerHTML = ""; // Clear previous types

  types.forEach((type, index) => {
    const typeColor = typeColors[type.type.name] || "#000000"; // Default to black if color not found
    const typeClass = `${type.type.name} ${index === 1 ? 'second-type' : ''}`;
    const style = `background-color: ${typeColor};`;
    createAndAppendElement(powerWrapper, "p", {
      className: `body3-fonts type ${typeClass}`,
      textContent: type.type.name,
      style: style,
    });
  });

  const statsColor = typeColors[mainType] || "#000000"; // Use mainTypeColor for stats color
  setElementStyles(
    document.querySelectorAll(".stats-wrap p.stats"),
    "color",
    statsColor
  );

  setElementStyles(
    document.querySelectorAll(".stats-wrap .progress-bar"),
    "color",
    statsColor
  );

  const rgbaColor = rgbaFromHex(statsColor);
  const styleTag = document.createElement("style");
  styleTag.innerHTML = `
    .stats-wrap .progress-bar::-webkit-progress-bar {
        background-color: rgba(${rgbaColor}, 0.5);
    }
    .stats-wrap .progress-bar::-webkit-progress-value {
        background-color: ${statsColor};
    }
  `;
  document.head.appendChild(styleTag);
}


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function createAndAppendElement(parent, tag, options = {}) {
  const element = document.createElement(tag);
  Object.keys(options).forEach((key) => {
    element[key] = options[key];
  });
  parent.appendChild(element);
  return element;
}

function displayPokemonDetails(pokemon) {
  const { name, id, types, weight, height, abilities, stats } = pokemon;
  const capitalizePokemonName = capitalizeFirstLetter(name);

  document.querySelector("title").textContent = capitalizePokemonName;

  const detailMainElement = document.querySelector(".detail-main");
  detailMainElement.classList.add(name.toLowerCase());

  document.querySelector(".name-wrap .name").textContent =
    capitalizePokemonName;

  document.querySelector(
    ".pokemon-id-wrap .body2-fonts"
  ).textContent = `#${String(id).padStart(3, "0")}`;

  const imageElement = document.querySelector(".detail-img-wrapper img");
  imageElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  imageElement.alt = name;

  const shinyImageElement = document.getElementById("shinyImage");
  shinyImageElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`;
  shinyImageElement.alt = name;
  
  // const typeWrapper = document.querySelector(".power-wrapper");
  // typeWrapper.innerHTML = "";
  // types.forEach(({ type }) => {
  //   createAndAppendElement(typeWrapper, "p", {
  //     className: `body3-fonts type ${type.name}`,
  //     textContent: type.name,
  //   });
  // });

  const typeWrapper = document.querySelector(".power-wrapper");
typeWrapper.innerHTML = "";

types.forEach(({ type }, index) => {
  const typeClass = `body3-fonts type ${type.name}`;
  if (index === 0) {
    createAndAppendElement(typeWrapper, "p", {
      className: typeClass,
      textContent: type.name,
    });
  } else if (index === 1) {
    const secondTypeColor = typeColors[type.name] || "#000000"; // Default to black if color not found
    const secondTypeClass = `${type.name} second-type`;
    const style = `background-color: ${secondTypeColor};`;
    createAndAppendElement(typeWrapper, "p", {
      className: `body3-fonts type ${secondTypeClass}`,
      textContent: type.name,
      style: style,
    });
  }
});



  document.querySelector(
    ".pokemon-detail-wrap .pokemon-detail p.body3-fonts.weight"
  ).textContent = `${weight / 10}kg`;
  document.querySelector(
    ".pokemon-detail-wrap .pokemon-detail p.body3-fonts.height"
  ).textContent = `${height / 10}m`;

  const abilitiesWrapper = document.querySelector(
    ".pokemon-detail-wrap .pokemon-detail.move"
  );
  abilities.forEach(({ ability }) => {
    createAndAppendElement(abilitiesWrapper, "p", {
      className: "body3-fonts",
      textContent: ability.name,
    });
  });

  const statsWrapper = document.querySelector(".stats-wrapper");
  statsWrapper.innerHTML = "";

  const statNameMapping = {
    hp: "HP",
    attack: "ATK",
    defense: "DEF",
    "special-attack": "SATK",
    "special-defense": "SDEF",
    speed: "SPD",
  };

  stats.forEach(({ stat, base_stat }) => {
    const statDiv = document.createElement("div");
    statDiv.className = "stats-wrap";
    statsWrapper.appendChild(statDiv);

    createAndAppendElement(statDiv, "p", {
      className: "body3-fonts stats",
      textContent: statNameMapping[stat.name],
    });

    createAndAppendElement(statDiv, "p", {
      className: "body3-fonts",
      textContent: String(base_stat).padStart(3, "0"),
    });

    createAndAppendElement(statDiv, "progress", {
      className: "progress-bar",
      value: base_stat,
      max: 1000,
    });
  });

  setTypeBackgroundColor(pokemon);
}

function getEnglishFlavorText(pokemonSpecies) {
  for (let entry of pokemonSpecies.flavor_text_entries) {
    if (entry.language.name === "en") {
      let flavor = entry.flavor_text.replace(/\f/g, " ");
      return flavor;
    }
  }
  return "";
}

document.addEventListener("DOMContentLoaded", () => {
  let isShinyActive = false;
  const shinyButton = document.getElementById("shinyButton");
  const normalImage = document.getElementById("normalImage");
  const shinyImage = document.getElementById("shinyImage");

  shinyButton.addEventListener("click", async () => {
    normalImage.style.display =
      normalImage.style.display === "" || normalImage.style.display === "block"
        ? "none"
        : "block";
    shinyImage.style.display =
      shinyImage.style.display === "" || shinyImage.style.display === "none"
        ? "block"
        : "none";

    // Actualizar el estado de isShinyActive al hacer clic en el botón Shiny
    isShinyActive = !isShinyActive;

    const currentPokemonId = getCurrentPokemonId();

    await loadPokemonImages(currentPokemonId, isShinyActive); // Pasar el estado de isShinyActive a loadPokemonImages
  });

  async function loadPokemonImages(id, isShinyActive) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const pokemonData = await response.json();

      // Obtener el elemento de imagen correspondiente
      const targetImage = isShinyActive ? shinyImage : normalImage;

      // Cargar la imagen correspondiente al estado de brillo
      targetImage.src = isShinyActive
        ? pokemonData.sprites.front_shiny
        : pokemonData.sprites.front_default;
    } catch (error) {
      console.error("Error al cargar las imágenes:", error);
    }
  }

  function getCurrentPokemonId() {
    const pokemonID = new URLSearchParams(window.location.search).get("id");
    return parseInt(pokemonID, 10);
  }

  async function loadNextPokemon() {
    const currentPokemonId = getCurrentPokemonId();
    const nextPokemonId = currentPokemonId + 1;
  
    // Obtener el estado actual de isShinyActive
    const isShinyActive = document.getElementById("shinyImage").style.display === "block";
  
    // Llamar a navigatePokemon para cargar el siguiente Pokémon
    await navigatePokemon(nextPokemonId, isShinyActive);
  }
  
  async function loadPreviousPokemon() {
    const currentPokemonId = getCurrentPokemonId();
    const previousPokemonId = currentPokemonId - 1;
  
    // Obtener el estado actual de isShinyActive
    const isShinyActive = document.getElementById("shinyImage").style.display === "block";
  
    // Llamar a navigatePokemon para cargar el Pokémon anterior
    await navigatePokemon(previousPokemonId, isShinyActive);
  }
  

  const rightArrow = document.getElementById("rightArrow");
  rightArrow.addEventListener("click", loadNextPokemon);
});