const optionsLis = [...document.querySelectorAll('[data-options-target]')];
const contentTargets = [...document.querySelectorAll('[data-content-target')];
const addBtn = document.querySelector(".addBtn");
let isFavourite = false;
const favouriteCity = JSON.parse(localStorage.getItem("city")) || [];
let delBtn;



window.addEventListener("load", showFavourites);

//wyświetlanie home/settings
optionsLis.forEach(el => el.addEventListener("click", () => {
    contentTargets.forEach(item => item.classList.remove("active"))
    const target = document.querySelector(el.dataset.optionsTarget);
    target.classList.add("active");
    showFavourites();
}))



//funkcja dodawania miast do local storage
function addToFavourite() {
    const city = document.querySelector("[data-input='settings'").value || document.querySelector("[data-input='home'").value;

    if (!(document.querySelector("[data-input='settings'").value || document.querySelector("[data-input='home'").value)) {
        alert("Proszę wyszukać miasto");
        return;
    }

    isFavourite = true;
    const currentCity = {
        name: city,
        isFavourite
    }
    favouriteCity.push(currentCity);
    localStorage.setItem("city", JSON.stringify(favouriteCity));
    console.log(`Dodano miasto do local storage`);
    showFavourites();
}

//funkcja aktualizująca widok w settings
function changeSettingsView(city, temp, icon) {
    document.querySelector(".searching-city-options .currentCity").textContent = city;
    document.querySelector(".currentCityTemp").textContent = temp;
    const urlIMG = changeWeatherIcon(icon);
    document.querySelector(".settings-icon").src = `${urlIMG}`
}


// wyświetlające ulubione miasta
function showFavourites() {
    let forecastContent = '';
    if (favouriteCity.length > 0) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${favouriteCity[0].name}&units=metric&APPID=${apiKey}`)
            .then(response => response.json())
            .then(response => {
                // console.log(response)
                changeHomeView(response.name, Math.floor(response.main.temp));
                getCurrentDay(response.dt);
                document.querySelector(".star").style.backgroundImage = "url('img/star.png')";
                document.querySelector(".imgIcon").src = `${changeWeatherIcon(response.weather[0].main)}`;

                getForecastData(response.name);
            })


    }
    updatePlaces();

}

//funkcja usuwająca z miasta z ulubionych (local storage)
function deleteFromFavourites() {
    const clickedBtn = this.dataset.delete;
    console.log(`index klikniętego przycisku ${clickedBtn}`)
    favouriteCity.splice(clickedBtn, 1);
    localStorage.setItem("city", JSON.stringify(favouriteCity));
    showFavourites();
}


//funkcja aktualizująca widok Places w setting
function updatePlaces() {
    let placesWrapper = "";
    document.querySelector(".places").innerHTML = placesWrapper;

    favouriteCity.forEach((city, index) => {
        document.querySelector(".places").innerHTML = "";
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.name}&units=metric&APPID=${apiKey}`)
            .then(response => response.json())
            .then(response => {
                placesWrapper = `
                <div class="favourites-cities clearfix">
                <p class="favourite-city">${response.name}</p>
                <div class="city-weather-details">
                <div class="city-temp">${Math.floor(response.main.temp)}</div>
                <span style="display:inline-block;margin-right:10px;">&#176;</span>
                <div class="weatherIcon">
                <img src=${changeWeatherIcon(response.weather[0].main)}>
                </div>
                <button class="deleteFromLS" id="del" data-delete=${index}>X</button>
                </div>

                </div>
                `

                document.querySelector(".places").innerHTML += placesWrapper;

                delBtn = document.querySelectorAll(".deleteFromLS");
                delBtn.forEach(el => el.addEventListener("click", deleteFromFavourites))

            })

    })

}
addBtn.addEventListener("click", addToFavourite)