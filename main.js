const APIKey = "<YOUR_KEY_HERE>";
let url = '';
const inputField = document.querySelector("input");
const searchButton = document.querySelector(".lupe");
const locationButton = document.querySelector('.location');

if (localStorage.getItem('latitude')){
    const latitude = localStorage.getItem('latitude');
    const longitude = localStorage.getItem('longitude');
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${APIKey}`;
    fetchData();
}

locationButton.addEventListener('click', () => {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(success, error);      
    } else {
        alert("Your browser doesn't support geolocation functionality");
    }
});
  
function success(position){
    const {latitude, longitude} = position.coords;
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${APIKey}`;
    fetchData();
}

function error(){
    alert("Unable to retrieve your location");
}

searchButton.addEventListener("click", () => {
    if(inputField.value){
        requestApi(inputField.value);
    } else {
        alert("Please type the city name");
    }
    
});

inputField.addEventListener("keyup", e => {
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

function requestApi(cityName){
    url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${APIKey}`;
    fetchData();
}


function fetchData(){
    fetch(url)
        .then((Response) => Response.json())
        .then((currentWeather) => {

            const {name, timezone} = currentWeather;
            const {country, sunrise, sunset} = currentWeather.sys;
            const {icon, description} = currentWeather.weather[0];
            const {temp} = currentWeather.main;
            const {speed} = currentWeather.wind;
            const {lat, lon} = currentWeather.coord;


            if(!name){
                alert("We're sorry, the city doesn't exist in our database.");
            }
            
            localStorage.setItem('latitude', lat);
            localStorage.setItem('longitude', lon);

            document.querySelector("h3").innerHTML = `${name}, ${country}`;
            document.querySelector("h3").style.margin = "20% 0% 5% 0%";

            document.querySelector("body").style.backgroundImage.url = `https://source.unsplash.com/1600x900/?${name}`;

            document.querySelector("img").src = `http://openweathermap.org/img/w/${icon}.png`;

            document.querySelector(".temp").innerHTML = `${Math.round(temp)}°C`;

            document.querySelector(".wind").innerHTML = `wind speed: ${Math.round(speed)}m/s`;

            document.querySelector(".clouds").innerHTML = description;

            document.querySelector(".sun").style.margin = "10% 0% 0% 0%";

            document.querySelector(".sunrise").innerHTML = `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M17 18a5 5 0 0 0-10 0"></path><line x1="12" y1="2" x2="12" y2="9"></line><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line><line x1="1" y1="18" x2="3" y2="18"></line><line x1="21" y1="18" x2="23" y2="18"></line><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line><line x1="23" y1="22" x2="1" y2="22"></line><polyline points="8 6 12 2 16 6"></polyline></svg>${timeFormater(sunrise, timezone)}`;
            
            document.querySelector(".sunset").innerHTML = `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M17 18a5 5 0 0 0-10 0"></path><line x1="12" y1="9" x2="12" y2="2"></line><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line><line x1="1" y1="18" x2="3" y2="18"></line><line x1="21" y1="18" x2="23" y2="18"></line><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line><line x1="23" y1="22" x2="1" y2="22"></line><polyline points="16 5 12 9 8 5"></polyline></svg>${timeFormater(sunset, timezone)}`;
            
            document.body.style.backgroundImage = `url('https://source.unsplash.com/2200x1000/?${name}')`;
        });
}


function timeFormater(unix_timestamp, timezone) {
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    const date = new Date((unix_timestamp + timezone) * 1000);
    const hours = date.getHours() - 1;
    const minutes = "0" + date.getMinutes();
    const seconds = "0" + date.getSeconds();

    // Will display time in 10:30 format
    const formattedTime = hours + ':' + minutes.substr(-2);

    return formattedTime;
}