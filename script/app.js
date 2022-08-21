let msg = document.querySelector(".msg");
let CityName;

navigator.geolocation.getCurrentPosition(onSuccess, onError);

function onSuccess(position) {
  const { latitude, longitude } = position.coords;
  var coordinates = [latitude, longitude];
  getCity(coordinates);
}

function onError() {
  console.log("Failed to get position");
}

function padTo2Digits(num) {
  return String(num).padStart(2, "0");
}

const date = new Date();
const hoursAndMinutes =
  padTo2Digits(date.getHours()) + ":" + padTo2Digits(date.getMinutes());

document.getElementById("Time").innerHTML = hoursAndMinutes;

function getCity(coordinates) {
  var xhr = new XMLHttpRequest();
  var lat = coordinates[0];
  var lng = coordinates[1];

  xhr.open(
    "GET",
    "https://us1.locationiq.com/v1/reverse.php?key=pk.d09f691ce0eb7828ef26ae54f1d6158a&lat=" +
      lat +
      "&lon=" +
      lng +
      "&format=json",
    true
  );
  xhr.send();
  xhr.onreadystatechange = processRequest;
  xhr.addEventListener("readystatechange", processRequest, false);

  function processRequest(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var response = JSON.parse(xhr.responseText);
      CityName = response.address.city;
      document.getElementById("Place").innerHTML = CityName;

      let URL_WTH = `https://weatherdbi.herokuapp.com/data/weather/${CityName}`;
      fetch(URL_WTH)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          document.getElementById("Temp").innerHTML =
            data.currentConditions.temp.c;

          document.getElementById("WeatherType").innerHTML =
            data.currentConditions.comment;
        });
      return;
    }
  }
}
