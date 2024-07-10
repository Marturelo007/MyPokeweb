  const MAX_POKEMON = 1025 ;
  const listWrapper = document.querySelector(".list-wrapper");
  const searchInput = document.querySelector("#search-input");
  const numberFilter = document.querySelector("#number");
  const nameFilter = document.querySelector("#name");
  const notFoundMessage = document.querySelector("#not-found-message");

  let allPokemons = [];

  fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
    .then((response) => response.json())
    .then((data) => {
      allPokemons = data.results;
      displayPokemons(allPokemons);
    });

  async function fetchPokemonDataBeforeRedirect(id) {
    try {
      const [pokemon, pokemonSpecies] = await Promise.all([
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
          res.json()  
        ),
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) =>
          res.json()
        ),
      ]);
      return true;
    } catch (error) {
      console.error("Failed to fetch Pokemon data before redirect");
    }
  }

  function displayPokemons(pokemon) {
    listWrapper.innerHTML = "";

    pokemon.forEach((pokemon) => {
      const pokemonID = pokemon.url.split("/")[6];
      const listItem = document.createElement("div");
      listItem.className = "list-item";
      listItem.innerHTML = `
          <div class="number-wrap">
              <p class="caption-fonts">#${pokemonID}</p>
          </div>
          <div class="img-wrap">
              <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/${pokemonID}.png" alt="${pokemon.name}" />
          </div>
          <div class="name-wrap">
              <p class="body1-fonts">#${pokemon.name}</p>
          </div>
      `;

      listItem.addEventListener("click", async () => {
        const success = await fetchPokemonDataBeforeRedirect(pokemonID);
        if (success) {
          window.location.href = `./detail.html?id=${pokemonID}`;
        }
      });

      listWrapper.appendChild(listItem);
    });
  }

  searchInput.addEventListener("keyup", handleSearch);

  function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    let filteredPokemons;

    if (nameFilter.checked) {
      filteredPokemons = allPokemons.filter((pokemon) => {
        const pokemonID = pokemon.url.split("/")[6];
        return pokemonID.startsWith(searchTerm);
      });
    } else if (numberFilter.checked) {
      filteredPokemons = allPokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().startsWith(searchTerm)
      );
    } else {
      filteredPokemons = allPokemons;
    }

    displayPokemons(filteredPokemons);

    if (filteredPokemons.length === 0) {
      notFoundMessage.style.display = "block";
    } else {
      notFoundMessage.style.display = "none";
    }
  }

  const closeButton = document.querySelector(".search-close-icon");
  closeButton.addEventListener("click", clearSearch);

  function clearSearch() {
    searchInput.value = "";
    displayPokemons(allPokemons);
    notFoundMessage.style.display = "none";
  }

  const checkbox = document.querySelector(".checkbox");
  const pokeballImage = document.getElementById("pokeball-image");
  
  checkbox.addEventListener("change", function() {
      const root = document.documentElement;
  
      if (this.checked) {
          root.style.setProperty("--colorscale-dark", "white");
          root.style.setProperty("--colorscale-light", "black");
          root.style.setProperty("--colorscale-blue", "#efefef");
          root.style.setProperty("--light-shadow", "0px 1px 3px 1px rgba(0, 0, 0, 0.2)");
          root.style.setProperty("--drop-shadow", "0px 1px 3px 1px rgba(255, 255, 255, 0.2)");
      } else {
          root.style.setProperty("--colorscale-dark", "black");
          root.style.setProperty("--colorscale-light", "white");
          root.style.setProperty("--colorscale-blue", "#35b5c9");
          root.style.setProperty("--light-shadow", "0px 3px 12px 3px rgba(255, 255, 255, 0.2)");
          root.style.setProperty("--drop-shadow", "0px 1px 3px 1px rgba(0, 0, 0, 0.25) inset");
      }
  
      // Cambiar el color del texto para mantener la legibilidad
      const elementsWithcolorscaleDark = document.querySelectorAll("[style*='--colorscale-dark']");
      elementsWithcolorscaleDark.forEach(element => {
          const currentColor = window.getComputedStyle(element).getPropertyValue("--colorscale-dark");
          if (currentColor === "black") {
              element.style.color = "white";
          } else {
              element.style.color = "black";
          }
      });
  
      const elementsWithcolorscaleBlue = document.querySelectorAll("[style*='--colorscale-blue']");
      elementsWithcolorscaleBlue.forEach(element => {
          const currentColor = window.getComputedStyle(element).getPropertyValue("--colorscale-blue");
          if (currentColor === "#35b5c9") {
              element.style.color = "#efefef";
          } else {
              element.style.color = "#35b5c9";
          }
      });
      const elementsWithcolorscaleLight = document.querySelectorAll("[style*='--colorscale-light']");
      elementsWithcolorscaleLight.forEach(element => {
          const currentColor = window.getComputedStyle(element).getPropertyValue("--colorscale-light");
          if (currentColor === "white") {
              element.style.color = "black";
          } else {
              element.style.color = "white";
          }
      });
  
      const elementsWithDropShadow = document.querySelectorAll("[style*='--drop-shadow']");
      elementsWithDropShadow.forEach(element => {
          const currentShadow = window.getComputedStyle(element).getPropertyValue("--drop-shadow");
          element.style.setProperty("box-shadow", currentShadow);
          element.style.removeProperty("--drop-shadow");
      });
  
      const elementsWithLightShadow = document.querySelectorAll("[style*='--light-shadow']");
      elementsWithLightShadow.forEach(element => {
          const currentShadow = window.getComputedStyle(element).getPropertyValue("--light-shadow");
          element.style.setProperty("box-shadow", currentShadow);
          element.style.removeProperty("--light-shadow");
      });
  
      // Cambiar color de la imagen de la pokeball
      const pokeballColor = this.checked ? "white" : "black";
      pokeballImage.style.filter = `invert(${pokeballColor === "black" ? "0" : "1"})`;
  });
  
  function filterPokemonsByRange(start, end) {
    return allPokemons.filter(pokemon => {
      const pokemonID = parseInt(pokemon.url.split("/")[6]);
      return pokemonID >= start && pokemonID <= end;
    });
  }

  // Event listeners for section buttons
  document.getElementById('section1Button').addEventListener('click', () => {
    const kantoPokemons = filterPokemonsByRange(1, 151);
    displayPokemons(kantoPokemons);
  });

  document.getElementById('section2Button').addEventListener('click', () => {
    const johtoPokemons = filterPokemonsByRange(152, 251);
    displayPokemons(johtoPokemons);
  });

  document.getElementById('section3Button').addEventListener('click', () => {
    const hoennPokemons = filterPokemonsByRange(252,  386);
    displayPokemons(hoennPokemons);
  });

  document.getElementById('section4Button').addEventListener('click', () => {
    const sinnohPokemons = filterPokemonsByRange(387, 494);
    displayPokemons(sinnohPokemons);
  });

  document.getElementById('section5Button').addEventListener('click', () => {
    const teseliaPokemons = filterPokemonsByRange(495, 649);
    displayPokemons(teseliaPokemons);
  });

  document.getElementById('section6Button').addEventListener('click', () => {
    const kalosPokemons = filterPokemonsByRange(650, 721);
    displayPokemons(kalosPokemons);
  });

  document.getElementById('section7Button').addEventListener('click', () => {
    const alolaPokemons = filterPokemonsByRange(722, 809);
    displayPokemons(alolaPokemons);
  });

  document.getElementById('section8Button').addEventListener('click', () => {
    const galarPokemons = filterPokemonsByRange(810, 905);
    displayPokemons(galarPokemons);
  });

  document.getElementById('section9Button').addEventListener('click', () => {
    const paldeaPokemons = filterPokemonsByRange(906, 1025);
    displayPokemons(paldeaPokemons);
  });
  // Initially display Pokémon from the first section
  document.getElementById('section1Button').click();

  document.getElementById('section2Button').click();

  document.getElementById('section3Button').click();
  
  document.getElementById('section4Button').click();
  
  document.getElementById('section5Button').click();

  document.getElementById('section6Button').click();

  document.getElementById('section7Button').click();

  document.getElementById('section8Button').click();

  document.getElementById('section9Button').click();


  document.addEventListener('DOMContentLoaded', function(){

    var img = document.getElementById('myImage');
  
    img.addEventListener('mouseenter', function (){
      img.src = "/assets/FullPokeball.png";
    });
    
    img.addEventListener('mouseleave', function() {
      img.src = "/assets/EmptyPokeball.png"
    });
  
  });

  document.addEventListener('DOMContentLoaded', function(){
    var img = document.getElementById('myImage');
  
    img.addEventListener('touchstart', function (){
      img.src = "/assets/FullPokeball.png";
    });
  
    img.addEventListener('touchend', function() {
      img.src = "/assets/EmptyPokeball.png";
    });
  });
  


  // Event listener para el select
document.getElementById('sectionSelect').addEventListener('change', function() {
  const selectedRange = this.value.split('-');
  const start = parseInt(selectedRange[0]);
  const end = parseInt(selectedRange[1]);
  const filteredPokemons = filterPokemonsByRange(start, end);
  displayPokemons(filteredPokemons);
});

// También puedes hacer que se seleccione la opción inicialmente
document.getElementById('sectionSelect').selectedIndex = 0;
const initialRange = document.getElementById('sectionSelect').value.split('-');
const initialStart = parseInt(initialRange[0]);
const initialEnd = parseInt(initialRange[1]);
const initialPokemons = filterPokemonsByRange(initialStart, initialEnd);
displayPokemons(initialPokemons);
