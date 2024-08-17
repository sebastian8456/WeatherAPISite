import express from 'express';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';
import 'dotenv/config';

const __dirname = import.meta.dirname;
const port = 3000;
const app = express();
const api_key = process.env["API_KEY"];

app.use(bodyParser.urlencoded({ extended: true}));

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// User requests the home page
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// User enters a city
app.post('/submit', async (req, res) => {
    var city = req.body["city"];
    if (String(city).length > 50) {
        console.log("Invalid city name.")
    }
    else {
    var response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${1}&appid=${api_key}`); // Get the geodata of the city
    var body = await response.json();
    try {
        var lat = body[0]['lat'];
        var lon = body[0]['lon'];
        var date = new Date();
        date.setDate(date.getDate() + 1);
        date = date.toISOString().slice(0, 10); // Change to tomorrow's date
        var response = await fetch(`https://api.openweathermap.org/data/3.0/onecall/overview?lat=${lat}&lon=${lon}&appid=${api_key}&date=${date}`); // Get the weather data
        var body = await response.json();
        res.send(`<h1>${city}'s Weather for Tomorrow</h1></br>` + body['weather_overview']);
    } catch {
        console.log("Invalid city.");
    }}
})
