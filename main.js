// api code 300824539fb223da0c9801e33ef314da openweather
const apiKey = "42e1ff47a011f43ad286ed6a6f511201";
const btn = document.querySelectorAll(".search-btn");
const inputs = [...document.querySelectorAll(".search-city")];
const city_h2 = document.querySelector(".city h2");
const chevron_left = document.querySelector(".left-arrow");
const chevron_right = document.querySelector(".right-arrow");
let currentCityIndex = 0;


//funckja inicjalizująca
function init() {
    isFavourite = false;
    if (this.dataset.searchBtn === "home-btn") {
        if (!document.querySelector("[data-input='home']").value) {
            alert("Proszę podać miasto");
            return;
        } else {
            getData(document.querySelector("[data-input='home']").value);
            getForecastData(document.querySelector("[data-input='home']").value);
        }

    } else {
        if (!document.querySelector("[data-input='settings']").value) {
            alert("Proszę podać miasto");
            return;
        } else {
            getData(document.querySelector("[data-input='settings']").value);
            getForecastData(document.querySelector("[data-input='settings']").value)

        }
    }



}
//funckja pobierająca pogodę z danego dnia
function getData(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${apiKey}`)
        .then(response => response.json())
        .then(response => getWeatherDetails(response));
}

//funkcja pobierająca pogodę długoterminową
function getForecastData(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=${apiKey}`)
        .then(response => response.json())
        .then(response => forecastWeather(response))
}

//funkcja do pogody długoterminowej
function forecastWeather(weatherData) {
    let forecastContent = '';
    console.log(weatherData);
    for (let i = 7; i < weatherData.list.length; i += 8) {
        forecastContent += `
        <div class="long-forecast-details">
                            <div class="long-forecast-day">
                                <div>${getCurrentDay(weatherData.list[i].dt)}</div>
                            </div>
                            <div class="long-forecast-temp">
                                <div>${Math.floor(weatherData.list[i].main.temp)} &#176;
                                <img src='${changeWeatherIcon(weatherData.list[i].weather[0].main)}' width="25px" height="25px">
                                </div>
                            </div>
                        </div>
        `
    }
    document.querySelector(".long-forecast").innerHTML = forecastContent;


}


//wykrywanie inputa
inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
        console.log(`teraz piszemy w inpucie: ${input.dataset.input}`)
        if (input.dataset.input === "home") {
            document.querySelector("[data-input='settings'").value = input.value;
        } else {
            document.querySelector("[data-input='home'").value = input.value;
        }
    })

})

//funckja wyświetlająca dane pogodowe
function getWeatherDetails(weatherDetails) {
    //wyswietlenie miasta w zakładce home
    //change Home view
    const currentTemp = Math.floor(weatherDetails.main.temp);
    const currentDay = getCurrentDay(weatherDetails.dt);
    changeSettingsView(weatherDetails.name, currentTemp, weatherDetails.weather[0].main);
    changeHomeView(weatherDetails.name, currentTemp, weatherDetails.weather[0].main, currentDay);
}

//funkcja zmieniająca timestamp na dni tygodnia
function getCurrentDay(timestamp) {
    const day = new Date(timestamp * 1000).getDay();
    let currentDay = "";

    switch (day) {
        case 0:
            currentDay = "Sunday"
            break;
        case 1:
            currentDay = "Monday"
            break;
        case 2:
            currentDay = "Tuesday"
            break;
        case 3:
            currentDay = "Wednesday"
            break;
        case 4:
            currentDay = "Thursday"
            break;
        case 5:
            currentDay = "Friday"
            break;
        case 6:
            currentDay = "Saturday"
            break;


        default:
            break;
    }

    // console.log(currentDay)

    // return day;
    return currentDay;
}

//funckja zmieniająca ikone pogody
function changeWeatherIcon(weatherType) {
    const weatherIcon = document.querySelectorAll(".weatherType-icon");
    let imgUrl = "";
    if (weatherType === "Thunderstorm") {
        imgUrl = "thunderstorm.png";
    } else if (weatherType === "Drizzle") {
        imgUrl = "img/drizzle.png";
    } else if (weatherType === "Snow") {
        imgUrl = "img/snow.png";
    } else if (weatherType === "Clouds") {
        imgUrl = "img/clouds.png";
    } else if (weatherType === "Rain") {
        imgUrl = "img/rain.png";
    } else if (weatherType === "Clear") {
        imgUrl = "img/sunny.png";
    }
    return imgUrl;
}

//funkcja do wykonywania zapytań dla zmiany miasta w home
function showFavouriteCitiesHome(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${favouriteCity[currentCityIndex].name}&units=metric&APPID=${apiKey}`)
        .then(response => response.json())
        .then(response => {
            changeHomeView(response.name, Math.floor(response.main.temp));
            document.querySelector(".star").style.backgroundImage = "url('img/star.png')";
            getCurrentDay(response.dt);
            document.querySelector(".imgIcon").src = `${changeWeatherIcon(response.weather[0].main)}`
        })
}

//funkcje do obsługi zmiany miasta w zakładce home
function nextCity() {
    if (favouriteCity.length === 0) {
        alert("Nie masz żadnych ulubionych miast");
        return;
    }
    console.log(`index wyswietlanego miasta to: ${currentCityIndex}`);
    const currentCity = favouriteCity[currentCityIndex].name;
    console.log(`aktualnie wyświetlane miasto to: ${currentCity}`);

    if (currentCityIndex !== favouriteCity.length - 1) {
        currentCityIndex++;
        showFavouriteCitiesHome(favouriteCity[currentCityIndex].name);
        getForecastData(favouriteCity[currentCityIndex].name);
    } else {
        currentCityIndex = 0;
        showFavouriteCitiesHome(favouriteCity[currentCityIndex].name);
        getForecastData(favouriteCity[currentCityIndex].name)
    }
}

function prevCity() {
    if (favouriteCity.length === 0) {
        alert("Nie masz żadnych ulubionych miast");
        return;
    }
    console.log(`index wyswietlanego miasta to: ${currentCityIndex}`);
    const currentCity = favouriteCity[currentCityIndex].name;
    console.log(`aktualnie wyświetlane miasto to: ${currentCity}`);

    if (currentCityIndex === 0) {
        console.log(`currentIndex jest taki sam jak index elementu w tablicy`);
        currentCityIndex = favouriteCity.length - 1;
        showFavouriteCitiesHome(favouriteCity[currentCityIndex].name);
        getForecastData(favouriteCity[currentCityIndex].name);
    } else {
        currentCityIndex--;
        showFavouriteCitiesHome(favouriteCity[currentCityIndex].name);
        getForecastData(favouriteCity[currentCityIndex].name);
    }
}

//funkcja zmieniająca UI home
function changeHomeView(city, currentTemp, icon, currentDay) {
    document.querySelector(".your-city").textContent = city;
    document.querySelector(".current-temp").textContent = currentTemp;
    const urlIMG = changeWeatherIcon(icon);
    document.querySelector(".imgIcon").src = `${urlIMG}`;
    document.querySelector(".current-day").textContent = currentDay;
}




btn.forEach(btn => btn.addEventListener("click", init));
chevron_left.addEventListener("click", prevCity)
chevron_right.addEventListener("click", nextCity)