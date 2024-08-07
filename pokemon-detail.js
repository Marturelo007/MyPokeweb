let currentPokemonId = null;
let isShinyActive = false;

document.addEventListener("DOMContentLoaded", async () => {
  const pokemonID = new URLSearchParams(window.location.search).get("id");
  const id = parseInt(pokemonID, 10);

  if (id >= 1 && id <= 1025) {
    currentPokemonId = id;
    await loadPokemon(id);
    setupShinyToggle();
    setupNavigationButtons();
    await logPokemonVarieties(id);
  } else {
    window.location.href = "./pokedex.html";
  }
});


async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}


async function loadPokemon(id) {
  try {
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetchData(`https://pokeapi.co/api/v2/pokemon/${id}`),
      fetchData(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
    ]);

    displayPokemonDetails(pokemon);
    const flavorText = getEnglishFlavorText(pokemonSpecies);
    document.querySelector(".pokemon-description").textContent = flavorText;
    
    window.history.pushState({}, "", `./detail.html?id=${id}`);
  } catch (error) {
    console.error("An error occurred while fetching Pokémon data:", error);
    document.querySelector(".pokemon-description").textContent = "Failed to load Pokémon data. Please try again later.";
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

  document.querySelector(".name-wrap .name").textContent = capitalizePokemonName;

  document.querySelector(".pokemon-id-wrap .body2-fonts").textContent = `#${String(id).padStart(3, "0")}`;

  const imageElement = document.querySelector(".detail-img-wrapper img");
  imageElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  imageElement.alt = name;

  const shinyImageElement = document.getElementById("shinyImage");
  shinyImageElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`;
  shinyImageElement.alt = name;

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

  // Clear the move section before adding new data
  const movesWrapper = document.querySelector(".pokemon-detail.move");
  movesWrapper.innerHTML = "";

  abilities.forEach(({ ability }) => {
    createAndAppendElement(movesWrapper, "p", {
      className: "body3-fonts",
      textContent: ability.name,
    });
  });

  document.querySelector(
    ".pokemon-detail-wrap .pokemon-detail p.body3-fonts.weight"
  ).textContent = `${weight / 10}kg`;

  document.querySelector(
    ".pokemon-detail-wrap .pokemon-detail p.body3-fonts.height"
  ).textContent = `${height / 10}m`;

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
    const flavorTextEntry = pokemonSpecies.flavor_text_entries.find(
      (entry) => entry.language.name === "en"
    );
    return flavorTextEntry ? flavorTextEntry.flavor_text : "No flavor text available.";
  }
  
  
  async function logPokemonVarieties(id) {
    try {
      const pokemonSpecies = await fetchData(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
  
      // Select the dropdown element
      const dropdown = document.getElementById("varietyDropdown");
  
      // Clear previous options
      dropdown.innerHTML = "";
  
      // Create a map to track unique variety IDs
      const varietyDataMap = new Map();
  
      // Check if varieties exist
      if (pokemonSpecies.varieties && pokemonSpecies.varieties.length > 0) {
        // Fetch and process variety data
        await Promise.all(pokemonSpecies.varieties.map(async (variety) => {
          try {
            const varietyData = await fetchData(variety.pokemon.url);
            if (varietyData.sprites) {
              const { id, name, sprites } = varietyData;
  
              // Add unique variety data
              if (!varietyDataMap.has(id)) {
                varietyDataMap.set(id, {
                  name: capitalizeFirstLetter(name),
                  normalSpriteUrl: sprites.front_default,
                  shinySpriteUrl: sprites.front_shiny
                });
  
                // Create option element
                const option = document.createElement("option");
                option.value = id;
                option.textContent = varietyDataMap.get(id).name;
                option.dataset.spriteUrl = varietyDataMap.get(id).normalSpriteUrl;
                option.dataset.shinySpriteUrl = varietyDataMap.get(id).shinySpriteUrl;
                option.classList.add("pokemon-variety-option");
  
                dropdown.appendChild(option);
              }
            } else {
              console.error(`No sprite data for variety ${varietyData.name}`);
            }
          } catch (error) {
            console.error("Failed to fetch variety data:", error);
          }
        }));
  
        // Show or hide the dropdown based on the number of varieties
        if (dropdown.options.length > 1) {
          dropdown.style.display = "block";
          dropdown.options[0].selected = true;
          dropdown.dispatchEvent(new Event("change"));
        } else {
          dropdown.style.display = "none";
        }
  
        // Add event listener to handle variety changes
        dropdown.removeEventListener("change", handleVarietyChange);
        dropdown.addEventListener("change", handleVarietyChange);
      } else {
        // Hide the dropdown if there are no varieties
        dropdown.style.display = "none";
      }
    } catch (error) {
      console.error("An error occurred while fetching Pokémon varieties:", error);
    }
  }
  
  
  
  
  function handleVarietyChange(event) {
    const selectedOption = event.target.selectedOptions[0];
    if (selectedOption) {
      const normalImageUrl = selectedOption.dataset.spriteUrl;
      const shinyImageUrl = selectedOption.dataset.shinySpriteUrl;
      const optionText = selectedOption.textContent;
  
      const normalImage = document.getElementById("normalImage");
      if (normalImageUrl) {
        normalImage.src = normalImageUrl;
        normalImage.alt = `Normal ${optionText}`;
      }
  
      const shinyImage = document.getElementById("shinyImage");
      if (shinyImageUrl) {
        shinyImage.src = shinyImageUrl;
        shinyImage.alt = `Shiny ${optionText}`;
      }
  
      // Update the sprite images based on the shiny state
      const targetImage = isShinyActive ? shinyImage : normalImage;
      const imageUrl = isShinyActive ? shinyImageUrl : normalImageUrl;
      targetImage.src = imageUrl;
      targetImage.alt = `${isShinyActive ? 'Shiny' : 'Normal'} ${optionText}`;
    }
  }
  
  
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  // Assuming you have a button to toggle shiny images
  document.getElementById("shinyToggle").addEventListener("click", () => {
    const dropdown = document.getElementById("varietyDropdown");
    const selectedOption = dropdown.selectedOptions[0];
    if (selectedOption) {
      const shinyImageUrl = selectedOption.dataset.shinySpriteUrl;
      const normalImage = document.getElementById("normalImage");
      if (shinyImageUrl) {
        normalImage.src = shinyImageUrl;
        normalImage.alt = `Shiny ${selectedOption.textContent}`;
      }
    }
  });
  
  
  
  
document.addEventListener("DOMContentLoaded", async () => {
  // Initial setup when the DOM is fully loaded
  const pokemonID = new URLSearchParams(window.location.search).get("id");
  const id = parseInt(pokemonID, 10);

  if (id >= 1 && id <= 1025) {
    currentPokemonId = id;
    await loadPokemon(id);
    setupShinyToggle();
    setupNavigationButtons();
    await logPokemonVarieties(id);
  }
});

function updateSprite(pokemonData) {
  const spriteElement = document.getElementById("varietySprite");
  if (pokemonData.sprites && pokemonData.sprites.front_default) {
    spriteElement.src = pokemonData.sprites.front_default;
    spriteElement.alt = pokemonData.name;
  } else {
    console.error("Sprite data is not available for this Pokémon.");
    spriteElement.src = '';
    spriteElement.alt = pokemonData.name || 'Unknown Pokémon';
  }
}



async function setupShinyToggle() {
  const shinyButton = document.getElementById("shinyButton");
  const normalImage = document.getElementById("normalImage");
  const shinyImage = document.getElementById("shinyImage");

  shinyButton.addEventListener("click", () => {
    isShinyActive = !isShinyActive;

    if (isShinyActive) {
      normalImage.style.display = "none";
      shinyImage.style.display = "block";
    } else {
      normalImage.style.display = "block";
      shinyImage.style.display = "none";
    }

    // Update the sprite images based on the shiny state
    const currentOption = document.getElementById("varietyDropdown").selectedOptions[0];
    if (currentOption) {
      const imageUrl = isShinyActive ? currentOption.dataset.shinySpriteUrl : currentOption.dataset.spriteUrl;
      const targetImage = isShinyActive ? shinyImage : normalImage;
      targetImage.src = imageUrl;
      targetImage.alt = `${isShinyActive ? 'Shiny' : 'Normal'} ${currentOption.textContent}`;
    }
  });
}



async function loadPokemonImages(id, isShinyActive) {
  try {
    const pokemonData = await fetchData(`https://pokeapi.co/api/v2/pokemon/${id}`);

    const targetImage = isShinyActive ? document.getElementById("shinyImage") : document.getElementById("normalImage");
    targetImage.src = isShinyActive ? pokemonData.sprites.front_shiny : pokemonData.sprites.front_default;
    targetImage.alt = pokemonData.name;
  } catch (error) {
    console.error("Error loading Pokémon images:", error);
  }
}


// Function to handle navigation to the next or previous Pokémon
async function navigatePokemon(id) {
  currentPokemonId = id;
  await loadPokemon(id);
  await logPokemonVarieties(id); // Ensure dropdown is updated for the new Pokémon
  setupShinyToggle(); // Ensure shiny toggle is set up for the new Pokémon
}


// Function to handle clicking on the "Next" and "Previous" buttons
function setupNavigationButtons() {
  const leftArrow = document.getElementById("leftArrow");
  const rightArrow = document.getElementById("rightArrow");

  leftArrow.addEventListener("click", async () => {
    if (currentPokemonId > 1) {
      await navigatePokemon(currentPokemonId - 1);
    }
  });

  rightArrow.addEventListener("click", async () => {
    if (currentPokemonId < 1025) {
      await navigatePokemon(currentPokemonId + 1);
    }
  });
}

// Initial setup to add event listeners and functionality
async function setupPage() {
  const pokemonID = new URLSearchParams(window.location.search).get("id");
  const id = parseInt(pokemonID, 10);

  if (id >= 1 && id <= 1025) {
    currentPokemonId = id;
    await loadPokemon(id);
    setupShinyToggle();
    setupNavigationButtons();
    await logPokemonVarieties(id);
  }
}

setupPage();
  