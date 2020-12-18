'use strict';



/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content 
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
*/

// Confirmed COVID-19 Cases in each state
// function getConfirmedCases(state) {
let STATS = null
function getStats() {
  fetch('https://energ.ee/covid19-us-api/states.json')
  .then(response => response.json())
  .then(data => {
      STATS = data
    })
}
getStats() 

function getStates(state){
  state = state[0].toUpperCase() + state.slice(1)
  const {date, confirmed, deaths} = STATS[state][STATS[state].length -1]
    console.log(`Since ${date} there has been ${confirmed} active cases and ${deaths} deaths caused by COVID-19 in ${state}.`)
    return `Since ${date} there has been ${confirmed} active cases and ${deaths} deaths caused by COVID-19 in ${state}.`
}

fetch('https://energ.ee/covid19-us-api/states.json')
  .then(response => response.json())
  .then(data => {
    // Data is available
    const states = Object.keys(data)
    const dataByState = states.map(state => ({[state]: data[state]}))

    const caseObj = {}
    dataByState.forEach(stateData => {
      const currentState = Object.keys(stateData)[0]
      caseObj[currentState] = stateData[currentState][stateData[currentState].length -1]
    })
    console.log(caseObj)
  })
//}

/*
function displayResults(responseJson, state) {
  let html = getStates(state)
  html += 
      '<ul>'
      <li class="cases-item">
        <p>${caseObj(object['state'])}</p>
      </li>
    
  })
  html += '</ul>'
  return html
}
*/

/*
 // function displayConfirmedCases(responseJson) {
  fetch('https://raw.githubusercontent.com/energee/covid19-us-api/master/docs/states.json')
  .then(response => response.json())
  .then(data => {
    const formattedData = {}
    Object.keys(data).forEach(state => {
      formattedData[state] = data[state][data[state].length - 1]
    })
    // This is that formatted data
    console.log(formattedData)
  })
//}
*/


 /* 
function getConfirmedCases(state) {
  fetch(`https://github.com/energee/covid19-us-api/blob/master/docs/states.json`)
    .then(response => response.json())
    .then(responseJson => 
       displayResults(responseJson))
    .catch(error => console.log(error));
}

function displayConfirmedCases(responseJson) {
  console.log(responseJson);
  let html = '<ul>'
  responseJson.forEach(location => {
      html += `
      <li>
         <h1>${location.state}</h1>
         <p>${location.state.date}</p>
         <p>${location.state.confirmed}</p>
         <p>${location.state.deaths}</p>
      </li>`
        })
        html += '</ul>'
        $('.results').html(html)
      }
*/

// COVID-19 testing sites
function getLocation(state) {
  fetch(`https://covid-19-testing.github.io/locations/${state}/complete.json`)
    .then(response => response.json())
    .then(responseJson => 
      displayResults(responseJson, state))
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

function displayResults(responseJson, state) {
  let html = getStates(state)
  html += '<ul>'
  responseJson.forEach(location => {
    icons(location.transportation)
      html += `
      <li>
         <h2>${location.name}</h2>
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

         /* 
         ${location.physical_address[0] != null 
          ? displayAddress(location.physical_address[0])
          : <p>No address</p>
         }
         */
     

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