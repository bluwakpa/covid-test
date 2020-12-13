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
    .catch(error => alert('Something went wrong. Try again later.'));
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