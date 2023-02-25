const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const API_KEY="43458e562fb5cb3c289d105316e2ec99";
const dotenv = require("dotenv").config();

const request = require("request");
const { error } = require("console");

// return the index page when user accesses
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// upon connection input the socket received from client
io.on("connection", (socket) => {
  console.log("user has successfully connected!");
  
  socket.on("temperatureRequest", (cityName) => {
    // units=metric will output temperature in celcius
    let options = {
      url: `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`,
      method: "GET",
      json: true,
    }
    
    let temperature = null;
    request(options, (error, res, body) => {
      temperature = body.main.temp;
      console.log(temperature);
      io.emit("temperatureResponse", temperature);
    });
  });
});

server.listen(process.env.PORT, () => {
  console.log("listening on 3000");
});