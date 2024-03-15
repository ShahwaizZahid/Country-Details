const filterContainer = document.querySelector(".filter-region-container");
const optionContainer = document.querySelector(".options-container");
const options = document.querySelectorAll(".option");
const filterRegionHeading = document.querySelector(".filter-region-heading");
const searchBtn = document.querySelector(".fa-magnifying-glass");
const countries = document.querySelector(".countries");
const templateCard = document.querySelector(".template-card");
const searchForm = document.querySelector("form");
const input = document.querySelector("input");
let hasSearched;

let themeHeading = document.querySelector(".theme-heading");
let themeChanges = document.querySelector(".fa-moon");

themeChanges.addEventListener("click", () => {
  if (themeHeading.innerHTML === "Dark Mode") {
    themeHeading.innerHTML = "Light Mode";
    console.log(themeHeading.innerHTML);
    document.documentElement.style.setProperty("--bg-dark", "#F6F4EB");
    document.documentElement.style.setProperty("--bg-light", "#91C8E4");
    document.documentElement.style.setProperty("--font-col-white", "black");
    document.documentElement.style.setProperty("--border-sha-col", "#F6F4EB");
    document.documentElement.style.setProperty("--font-col-grey", "#221d1d");
    document.documentElement.style.setProperty(
      "--icon-col",
      "rgb(47, 110, 182)"
    );

    themeChanges.classList.remove("fa-moon");
    themeChanges.classList.add("fa-sun");
    themeChanges.style.color = "yellow";
  } else {
    themeHeading.innerHTML = "Dark Mode";
    document.documentElement.style.setProperty("--bg-dark", "#202c37");
    document.documentElement.style.setProperty("--bg-light", "#2b3945");
    document.documentElement.style.setProperty("--font-col-white", "white");
    document.documentElement.style.setProperty("--border-sha-col", "#0000000d");
    document.documentElement.style.setProperty("--font-col-grey", "#858585");
    document.documentElement.style.setProperty("--icon-col", "white");

    themeChanges.classList.remove("fa-sun");
    themeChanges.classList.add("fa-moon");
    themeChanges.style.color = "white";
  }
});

input.addEventListener("input", () => {
  if (input.value == "") {
    if (
      countries.innerHTML ===
      `<div class="error">Not Found this Country.....</div>`
    ) {
      countries.innerHTML = "";
      AllCountryApi(0, 40);
    } else {
      let a = countries.innerHTML;
      countries.innerHTML = "";
      countries.innerHTML = a;
    }
  }
});

// For show all county cards in start fetch Api
function AllCountryApi(start, end) {
  let AllCountryApiUrl = `https://restcountries.com/v3.1/all`;
  fetch(AllCountryApiUrl)
    .then((res) => res.json())
    .then((data) => seeMoreAppendCountryData(data, start, end));
}

// For show all county cards create All country cards and append data
function createAndAppendCountryCards(data, start, end) {
  for (let i = start; i < end; i++) {
    // console.log(data.length)
    if (i >= data.length) {
      return;
    }
    let context = templateCard.content.cloneNode(true);

    let countryFlagElement = context.querySelector("img");
    let countryNameElement = context.querySelector(".name");
    let countryPopulationElement = context.querySelector(".population-numbers");
    let countryRegionElement = context.querySelector(".region-name");
    let countryCapitalElement = context.querySelector(".capital-name");
    let countryCard = context.querySelector(".country-card");
    // console.log(countryCard)
    if (
      countryFlagElement &&
      countryNameElement &&
      countryCapitalElement &&
      countryPopulationElement &&
      countryRegionElement
    ) {
      countryFlagElement.src = data[i].flags.png;
      countryNameElement.innerHTML = data[i].name.common;
      countryPopulationElement.innerHTML =
        "Population: " + data[i].population.toLocaleString();
      countryCapitalElement.innerHTML = "Capital: " + data[i].capital;
      countryRegionElement.innerHTML = "Region: " + data[i].region;
    }

    countryCard.addEventListener("click", () => {
      hasSearched = i;
      detailCardShow(data);
    });
    countries.appendChild(context);
  }
}

const templateSpecificCountryData = document.querySelector(
  ".template-specfic-country-data"
);

// function for see More countrys
function seeMoreAppendCountryData(data, start, end) {
  createAndAppendCountryCards(data, start, end);
  console.log(start);
  // if(start === data.length){
  //   return
  // }
  const loadMoreButton = document.createElement("div");
  loadMoreButton.classList.add("load-more-div");
  loadMoreButton.innerHTML = "Load More...";
  countries.appendChild(loadMoreButton);
  loadMoreButton.addEventListener("click", () => {
    loadMoreButton.remove();

    createAndAppendCountryCards(data, end, end + 40);
    seeMoreAppendCountryData(data, end, end + 40);
  });
}

// function call for show start country cards
AllCountryApi(0, 40);

// function for show details of click card

function setDetailsOfCard(data, selectCountry, templateNode) {

  const countryFlag = templateNode.querySelector(".specfic-country-flag img");
  const countryNativeName = templateNode.querySelector(".country-native-name");
  const countryRegion = templateNode.querySelector(".Country-Region");
  const countrySubRegion = templateNode.querySelector(".country-sub-region");
  const countryCapital = templateNode.querySelector(".country-capital");
  const countryArea = templateNode.querySelector(".country-area");
  const countryCurrencies = templateNode.querySelector(".country-currencies");
  const countryLanguages = templateNode.querySelector(".country-languages");
  const countryPopulation = templateNode.querySelector(".country-population");

  countryFlag.src = selectCountry.flags.png;
  countryNativeName.innerHTML = selectCountry.name.common;
  countryRegion.innerHTML = selectCountry.region;
  countrySubRegion.innerHTML = selectCountry.subregion;
  countryCapital.innerHTML = selectCountry.capital;
  countryArea.innerHTML = selectCountry.area;
  let currencies =
    selectCountry.currencies[Object.keys(selectCountry.currencies)].name;
  countryCurrencies.innerHTML = currencies;

  let languages = Object.values(selectCountry.languages)
    .toString()
    .split(",")
    .join(",");
  countryLanguages.innerHTML = languages;

  countryPopulation.innerHTML = selectCountry.population;

  let border = templateNode.querySelector(".border-country");

  let borders = selectCountry.borders;
  if (borders) {
    borders.forEach((e) => {
      // console.log(data.name.common)
      data.forEach((borderCountryNameSearchInData) => {
        if (borderCountryNameSearchInData.fifa === e) {
          let borderDiv = document.createElement("div");
          borderDiv.innerHTML = borderCountryNameSearchInData.name.common;
          border.appendChild(borderDiv);
          borderDiv.addEventListener("click", (event) => {
            let selectBorderCountryClick = event.target.innerHTML;
            let showBorderCountryDataOnClick = data.find(
              (country) => country.name.common === selectBorderCountryClick
            );
            if (selectCountry) {
              showBorderCountryDetail(data, showBorderCountryDataOnClick);
            }
          });
        }
      });
    });
  }
  let backButton = templateNode.querySelector(".back-btn");
  backButton.addEventListener("click", () => {
    let backBtnParent = backButton.parentElement;

    backBtnParent.style.top = "100%"; // Move the detail container out of the viewport
    setTimeout(() => {
      backBtnParent.innerHTML = ""; // Clear the detail container
      document.documentElement.style.overflow = "auto";
      backBtnParent.remove();
      // Restore the scroll
    }, 500);
  });
  let bordertem = document.createElement("div");
  bordertem.classList.add("specfic-country-data-container");
  document.body.appendChild(bordertem);
  bordertem.appendChild(templateNode);
  document.documentElement.style.overflow = "hidden";

  setTimeout(() => {
    bordertem.style.top = "50px";
  });
}

function detailCardShow(data) {
  let detailsDataContext = templateSpecificCountryData.content.cloneNode(true);
  setDetailsOfCard(data, data[hasSearched], detailsDataContext);
}

function showBorderCountryDetail(data, selectedCountryData) {
  let detailDataContext = templateSpecificCountryData.content.cloneNode(true);
  setDetailsOfCard(data, selectedCountryData, detailDataContext);
}

input.addEventListener("input", function () {

  if (input.value === "") {
    // Remove the submit event listener
    searchForm.removeEventListener("submit", searchCountry);
    searchForm.addEventListener("click", searchCountry);
  } else {
    // Add the submit event listener back if the input is not empty
    searchForm.addEventListener("submit", searchCountry);
    searchForm.addEventListener("click", searchCountry);
  }
});

//function for set input value
function searchCountry(e) {
  e.preventDefault();
  countryName = input.value;
  countries.innerHTML = "";
  fetchSearchApi(countryName);
}

function fetchSearchApi(country) {
  
  const allCountriesApiUrl = `https://restcountries.com/v3.1/all`;
  const searchApiUrl = `https://restcountries.com/v3.1/name/${country}?fullText=true`;

  fetch(allCountriesApiUrl)
    .then((res) => {
      if (!res.ok) {
        console.log("Error while fetching all countries data");
        error();
      }
      return res.json();
    })
    .then((allData) => {
      // Fetch data for the specific country
      fetch(searchApiUrl)
        .then((res) => {
          if (!res.ok) {
            error();
          }
          return res.json();
        })
        .then((searchData) => {
          countryData(allData, searchData, country);
        })
        .catch((error) => {
          console.error("Error during search data retrieval:", error);
          error();
        });
    })
    .catch((error) => {
      console.error("Error during all countries data retrieval:", error);
      error();
    });
}

function error() {
  let errorDiv = document.createElement("div");
  errorDiv.innerHTML = "Not Found this Country.....";
  errorDiv.classList.add("error");
  countries.appendChild(errorDiv);
}

// function for show search country data
function countryData(Alldata, data, country) {
  let contextSearch = templateCard.content.cloneNode(true);
  let countryFlagElement = contextSearch.querySelector("img");
  let countryNameElement = contextSearch.querySelector(".name");
  let countryPopulationElement = contextSearch.querySelector(
    ".population-numbers"
  );

  let countryRegionElement = contextSearch.querySelector(".region-name");
  let countryCapitalElement = contextSearch.querySelector(".capital-name");

  let countryCard = contextSearch.querySelector(".country-card");

  if (
    countryFlagElement &&
    countryNameElement &&
    countryCapitalElement &&
    countryPopulationElement &&
    countryRegionElement
  ) {
    countryFlagElement.src = data[0].flags.png;
    countryNameElement.innerHTML = data[0].name.common;
    countryPopulationElement.innerHTML =
      "Population: " + data[0].population.toLocaleString();
    countryCapitalElement.innerHTML = "Capital: " + data[0].capital;
    countryRegionElement.innerHTML = "Region: " + data[0].region;
  }
  countries.appendChild(contextSearch);
  countryCard.addEventListener("click", () => {
    let searchCardClickContext =
      templateSpecificCountryData.content.cloneNode(true);

    setDetailsOfCard(Alldata, data[0], searchCardClickContext);
  });
}

// function for filter region Api
function AllFilterCountryApi(region) {
  let AllCountryApiUrl = `https://restcountries.com/v3.1/all`;
  fetch(AllCountryApiUrl)
    .then((res) => res.json())
    .then((data) => appendFilterCountryData(data, region));
}

// function for append filter region cards
function appendFilterCountryData(data, region) {
  countries.innerHTML = "";

  if (filterRegionHeading.innerText === "All") {
    AllCountryApi(0, 99);
  } else if (filterRegionHeading.innerText !== "Filter-Region") {
    const filteredData = data.filter((country) => country.region === region);
    console.log("Filtered Data for Region", region);
    createAndAppendCountryCards(filteredData, 0, filteredData.length);
    console.log(filteredData);
  }
}
let isOpen = false;

// function for options or more region
filterContainer.addEventListener("click", () => {
  if (!isOpen) {
    optionContainer.style.maxHeight = "500px";
  } else {
    optionContainer.style.maxHeight = "0";
  }
  isOpen = !isOpen;
  options.forEach((option) => {
    option.addEventListener("click", () => {
      let filter = option.innerText;
      console.log(filter);
      filterRegionHeading.innerText = option.innerText;
      AllFilterCountryApi(filter);
    });
  });
});
