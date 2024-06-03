let currentItemId = null;
document.addEventListener("DOMContentLoaded", () => {
  const MAX_ITEMSS = 954;
  const ItemID = new URLSearchParams(window.location.search).get("id");
  const id = parseInt(ItemID, 10);

  if (id < 1 || id > MAX_ITEMSS) {
    return (window.location.href = "./items.html");
  }

  currentItemId = id;
  loadItem(id);
});

async function loadItem(id) {
  try {
    const [Item] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/item/${id}`).then((res) =>
        res.json()
      ),
      // fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) =>
      //   res.json()
      // ),
    ]);

    const abilitiesWrapper = document.querySelector(
      ".Item-detail-wrap .Item-detail.move"
    );
    abilitiesWrapper.innerHTML = "";

    if (currentItemId === id) {
      displayItemDetails(Item);
      const flavorText = getEnglishFlavorText(ItemSpecies);
      document.querySelector(".body3-fonts.Item-description").textContent =
        flavorText;

      const [leftArrow, rightArrow] = ["#leftArrow", "#rightArrow"].map((sel) =>
        document.querySelector(sel)
      );
      leftArrow.removeEventListener("click", navigateItem);
      rightArrow.removeEventListener("click", navigateItem);

      if (id !== 1) {
        leftArrow.addEventListener("click", () => {
          navigateItem(id - 1);
        });
      }
      if (id !== 954) {
        rightArrow.addEventListener("click", () => {
          navigateItem(id + 1);
        });
      }

      window.history.pushState({}, "", `./items-detail.html?id=${id}`);
    }

    return true;
  } catch (error) {
    console.error("An error occured while fetching Item data:", error);
    return false;
  }
}

async function navigateItem(id) {
  currentItemId = id;
  await loadItem(id);
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
  dark: "#705848",
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

function setTypeBackgroundColor(Item) {
  const mainType = Item.types[0].type.name;
  const color = typeColors[mainType];

  if (!color) {
    console.warn(`Color not defined for type: ${mainType}`);
    return;
  }

  const detailMainElement = document.querySelector(".detail-main");
  setElementStyles([detailMainElement], "backgroundColor", color);
  setElementStyles([detailMainElement], "borderColor", color);

  setElementStyles(
    document.querySelectorAll(".power-wrapper > p"),
    "backgroundColor",
    color
  );

  setElementStyles(
    document.querySelectorAll(".stats-wrap p.stats"),
    "color",
    color
  );

  setElementStyles(
    document.querySelectorAll(".stats-wrap .progress-bar"),
    "color",
    color
  );

  const rgbaColor = rgbaFromHex(color);
  const styleTag = document.createElement("style");
  styleTag.innerHTML = `
    .stats-wrap .progress-bar::-webkit-progress-bar {
        background-color: rgba(${rgbaColor}, 0.5);
    }
    .stats-wrap .progress-bar::-webkit-progress-value {
        background-color: ${color};
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

function displayItemDetails(Item) {
  const {name, id} = Item;
  const capitalizeItemName = capitalizeFirstLetter(name);

  document.querySelector("title").textContent = capitalizeItemName;

  const detailMainElement = document.querySelector(".detail-main");
  detailMainElement.classList.add(name.toLowerCase());

  document.querySelector(".name-wrap .name").textContent =
    capitalizeItemName;

  document.querySelector(
    ".Item-id-wrap .body2-fonts"
  ).textContent = `#${String(id).padStart(3, "0")}`;

  const imageElement = document.querySelector(".detail-img-wrapper img");
  imageElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${game_indices.name}.png`;

                    // "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png
  imageElement.alt = name;
  
  // const typeWrapper = document.querySelector(".power-wrapper");
  // typeWrapper.innerHTML = "";
  // types.forEach(({ type }) => {
  //   createAndAppendElement(typeWrapper, "p", {
  //     className: `body3-fonts type ${type.name}`,
  //     textContent: type.name,
  //   });
  // });

  // document.querySelector(
  //   ".pokemon-detail-wrap .pokemon-detail p.body3-fonts.weight"
  // ).textContent = `${weight / 10}kg`;
  document.querySelector(
    ".Item-detail-wrap .Item-detail p.body3-fonts.height"
  ).textContent = `${name}m`;

  const abilitiesWrapper = document.querySelector(
    ".Item-detail-wrap .Item-detail.move"
  );
  abilities.forEach(({ ability }) => {
    createAndAppendElement(abilitiesWrapper, "p", {
      className: "body3-fonts",
      textContent: ability.name,
    });
  });

  setTypeBackgroundColor(Item);
}

function getEnglishFlavorText(ItemSpecies) {
  for (let entry of ItemSpecies.flavor_text_entries) {
    if (entry.language.name === "en") {
      let flavor = entry.flavor_text.replace(/\f/g, " ");
      return flavor;
    }
  }
  return "";
}

document.addEventListener("DOMContentLoaded", () => {
  const normalImage = document.getElementById("normalImage");

    const currentItemId = getCurrentItemId();
  });

  async function loadItemImages(id) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/item/${id}`);
      const ItemData = await response.json();
    } catch (error) {
      console.error("Error al cargar las imágenes:", error);
    }
  }

  function getCurrentItemId() {
    const ItemID = new URLSearchParams(window.location.search).get("id");
    return parseInt(ItemID, 10);
  }

  async function loadNextItem() {
    const currentItemId = getCurrentItemId();
    const nextItemId = currentItemId + 1;
  }
  
  async function loadPreviousItem() {
    const currentItemId = getCurrentItemId();
    const previousItemId = currentItemId - 1;
  }
  

  const rightArrow = document.getElementById("rightArrow");
  rightArrow.addEventListener("click", loadNextItem);
;
