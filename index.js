'use strict';

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(e) {
  if (!e.target.matches('.dropbtn')) {
  var myDropdown = document.getElementById("myDropdown");
    if (myDropdown.classList.contains('show')) {
      myDropdown.classList.remove('show');
    }
  }
}

function getLocation(state) {
  fetch(`https://covid-19-testing.github.io/locations/${state}/complete.json`)
    .then(response => response.json())
    .then(responseJson => 
      displayResults(responseJson))
    .catch(error => console.log(error));
}

function getWeekday(number) {
  const day = {
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    7: 'Sunday',
  }
  return day[number]
}

function displaySchedule(array) {
  let html = '<ul class="schedule">'
  array.forEach(weekday => {
    html += `
      <li class="schedule-item">
        <p>${getWeekday(weekday.weekday)}</p>
        <p>${weekday.opens_at}</p>
        <p>${weekday.closes_at}</p>
      </li>
    `
  })
  html += '</ul>'
  return html
}

function displayAddress(address) {
  let html = `
    <p>
      ${address.address_1}<br/>
      ${address.city}, ${address.state_province} ${address.postal_code}<br />
      <a href="https://www.google.com/maps/place/${address.address_1}, ${address.city} ${address.state_province} ${address.postal_code}" target="_blank">
      View on map
      </a>
    </p>
  `
  return html
}

function displayResults(responseJson) {
  console.log(responseJson);
  let html = '<ul>'
  responseJson.forEach(location => {
    icons(location.transportation)
      html += `
      <li>
         <h1>${location.name}</h1>
         <p>${location.description}</p>
         ${displayAddress(location.physical_address[0])}
         <p>Telephone number: <a href="tel:${location.phones[0].number}">${location.phones[0].number}</a></p>
         <p>Language: ${location.phones[0].language}</p>
         ${displaySchedule(location.regular_schedule)}
         <p>${location.transportation}</p>
      </li>`
  })
  html += '</ul>'
  $('.results').html(html)
}

function icons(str) {
    let iconArray = str.split(',')
    console.log(iconArray)
}

function watchForm() {
  $('select').change(event => {
    event.preventDefault();
    let state = $('select :selected').val()
    console.log(state)
    getLocation(state);
  });
}

$(function() {
  console.log('App loaded! Waiting for submit!');
  watchForm();
});