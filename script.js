async function getWeather() {
    const city = document.getElementById("cityInput").value;

    const apiKey = "YOUR_API_KEY_HERE";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === 200) {
            document.getElementById("cityName").innerText = data.name;
            document.getElementById("temperature").innerText = data.main.temp + "°C";
            document.getElementById("description").innerText = data.weather[0].description;
        } else {
            alert("City not found!");
        }
    } catch (error) {
        alert("Error fetching data!");
    }
}