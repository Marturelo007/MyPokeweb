let currentItemID = null;

document.addEventListener("DOMContentLoaded", () => {
  const MAX_ITEMS = 954;
  const itemID = new URLSearchParams(window.location.search).get("id");
  const id = parseInt(itemID, 10);

  if (id < 1 || id > MAX_ITEMS) {
    return (window.location.href = "./items.html");
  }

  currentItemID = id;
  loadItem(id);
});

async function loadItem(id) {
  try {
    const item = await fetch(`https://pokeapi.co/api/v2/item/${id}`).then((res) =>
      res.json()
    );


    if (currentItemID === id) {
      displayItemDetails(item);

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
      if (id !== MAX_ITEMS) {
        rightArrow.addEventListener("click", () => {
          navigateItem(id + 1);
        });
      }

      window.history.pushState({}, "", `./items-detail.html?id=${id}`);
    }

    return true;
  } catch (error) {
    console.error("An error occurred while fetching item data:", error);
    return false;
  }
}

async function navigateItem(id) {
  currentItemID = id;
  await loadItem(id);
}

function displayItemDetails(item) {
  const { name, id } = item;
  const capitalizeItemName = capitalizeFirstLetter(name);

  document.querySelector("title").textContent = capitalizeItemName;

  const detailMainElement = document.querySelector(".detail-main");
  detailMainElement.classList.add(name.toLowerCase());

  document.querySelector(".name-wrap .name").textContent = capitalizeItemName;

  document.querySelector(
    ".Item-id-wrap .body2-fonts"
  ).textContent = `#${String(id).padStart(3, "0")}`;

  const imageElement = document.querySelector(".detail-img-wrapper img");
  imageElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${name}.png`;
  imageElement.alt = name;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function getCurrentItemId() {
  const itemID = new URLSearchParams(window.location.search).get("id");
  return parseInt(itemID, 10);
}

document.addEventListener("DOMContentLoaded", () => {
  const currentItemId = getCurrentItemId();
});

async function loadNextItem() {
  const currentItemId = getCurrentItemId();
  const nextItemId = currentItemId + 1;
  await navigateItem(nextItemId);
}

async function loadPreviousItem() {
  const currentItemId = getCurrentItemId();
  const previousItemId = currentItemId - 1;
  await navigateItem(previousItemId);
}

const rightArrow = document.getElementById("rightArrow");
rightArrow.addEventListener("click", loadNextItem);
