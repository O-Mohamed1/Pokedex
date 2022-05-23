const pokedexElement = document.getElementById("pokedex");
const backButton = document.getElementById("backButton");
const nextButton = document.getElementById("nextButton");
const resultsInput = document.getElementById("resultsInput");
const resultsSubmit = document.getElementById("resultsSubmit");
let localPoke = localStorage.getItem("pokemon")
let results = [];
let limit = 30;
let offset = 0;
let pokeID = 0;
let imageCol = "";
let nameCol = "";
let description = "";
let flavorTexts = "";
resultsInput.placeholder = `Results per page: ${limit}`

function getpokeID(pokemon) {
  let url = pokemon.url.replace("https://pokeapi.co/api/v2/pokemon-species/", "").replace("/", "");
  pokeID = parseInt(url);
  return pokeID;
}

function makeimageCol(pokemon) {
  getpokeID(pokemon);

  const imageCol = document.createElement("div");
  imageCol.classList.add("col-4");

  const image = document.createElement("img");
  image.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeID}.png`;
  image.width = 100;
  image.height = 100;
  image.addEventListener("click", () => {
    pokeInfoPage(pokemon)
    saveOnRefresh(pokemon)
  })
  imageCol.appendChild(image);

  return imageCol;
}
function drawUI() {
  results.forEach((pokemon) => {
    const container = document.createElement("div");
    container.classList.add("row", "d-flex", "justify-content-between");

    let imageCol = makeimageCol(pokemon);
    let nameCol = document.createElement("div");
    nameCol.classList.add("col-6");

    const nameElement = document.createElement("p");
    nameElement.innerText = `#${pokeID} ${capitalizeFirst(pokemon["name"])}`;

    nameCol.appendChild(nameElement);
    container.appendChild(nameCol);
    container.appendChild(imageCol);
    pokedexElement.appendChild(container);

  });
  checkStorage()
}

function getPokemon() {
  fetch(`https://pokeapi.co/api/v2/pokemon-species?limit=${limit}&offset=${offset}/`)
    .then((response) => { return response.json() })
    .then((json) => {
      results = json["results"];
      drawUI();
      offset += parseInt(limit)
    })
    .catch((error) => { console.log(error) });

}
getPokemon()

function goBack(pokeID) {//back button
  resultsInput.style.display = "inline"
  resultsSubmit.style.display = "inline"
  backButton.style.display = "none";
  nextButton.style.display = "inline";
  pokedexElement.innerHTML = "";
  offset = 0;
  getPokemon();
  localStorage.clear()
}
function createDescription(pokemon) {//after image "click" clears pokedexElement, this gets and displays description about pokemon with image
  const pokeInfo = document.createElement("p");
  pokeInfo.classList.add("container")
  getpokeID(pokemon)
  fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokeID}/`)
    .then((response) => { return response.json() })
    .then((json) => {
      console.log(json);
      let flavorTexts = json["flavor_text_entries"];
      console.log(json["name"]);

      let descText = checkLanguage(flavorTexts).replace(/\s/g, " ");//API sends poke descriptions with a bunch of random line breaks in between, this gets rid of them

      pokeInfo.innerText = capitalizeFirst(json["name"]) + `: ` + descText;
      console.log(pokeInfo)
    })
    .catch((error) => { console.log(error) })

  pokedexElement.appendChild(pokeInfo)
  imageCol = makeimageCol(pokemon)
  pokedexElement.appendChild(imageCol)

  console.log(pokeInfo)
}
function pokeInfoPage(pokemon) {
  pokedexElement.innerHTML = "";
  createDescription(pokemon);
  backButton.style.display = "inline";//hide next button and navbar, show back button
  nextButton.style.display = "none";
  resultsInput.style.display = "none"
  resultsSubmit.style.display = "none"
}
function changeResults() {//for navbar, to change reults per page
  pokedexElement.innerHTML = ""
  limit = resultsInput.value;
  offset = 0;
  resultsInput.placeholder = `Results per page: ${limit}`
  resultsInput.value = ""
  getPokemon();
  console.log(limit)
}
function capitalizeFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function checkLanguage(texts) {//finds english descriptions
  for (let i = 0; i < texts.length; i++) {
    if (texts[i].language.name == "en") {
      console.log(texts[i].flavor_text)
      console.log(i)
      return texts[i].flavor_text
    }
  }
}
function saveOnRefresh(pokemon) {
  localStorage.clear()
  localStorage.setItem("limit", limit)
  localStorage.setItem("pokemon", JSON.stringify(pokemon))
}
function checkStorage() {
  if (localStorage.getItem("pokemon") !== null) {
    limit=localStorage.getItem("limit")
    resultsInput.placeholder = `Results per page: ${limit}`
    pokeInfoPage(JSON.parse(localPoke))
    return false
  } else { return false }
}
