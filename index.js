'use strict';

// Confirmed COVID-19 Cases in each state
let STATS = null
let START = $('.start')
function getStats() {
  fetch('https://energ.ee/covid19-us-api/states.json')
  .then(response => response.json())
  .then(data => {
      STATS = data
    })
}
getStats() 

function getStates(state){
  const num = new Intl.NumberFormat()
  if(!state) return
  state = state[0].toUpperCase() + state.slice(1)
  const {date, confirmed, deaths} = STATS[state][STATS[state].length -1]
    console.log(`Since ${date} there has been ${confirmed} confirmed cases and ${deaths} deaths caused by COVID-19 in ${state}.`)
    return `<h3> Since ${new Date(date).toLocaleDateString()} there has been ${num.format(confirmed)} confirmed cases and ${num.format(deaths)} deaths caused by COVID-19 in ${state}.</h3>`
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
  })

// COVID-19 testing sites
function getLocation(state) {
  if(!state) {
    console.log('clear')
    displayResults()
    $('.results').html(START)
  } else {
    fetch(`https://covid-19-testing.github.io/locations/${state}/complete.json`)
      .then(response => response.json())
      .then(responseJson => 
        displayResults(responseJson, state))
      .catch(error => console.log(error));
  }
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
  if (array == null) { return ""}
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
  if (address == null) { return ""}
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

function displayResults(responseJson=[], state='') {
  let html = getStates(state)
  html += '<ul>'
  responseJson.forEach(location => {
      html += `
      <li>
         <h2>${location.name}</h2>
         <p class="description">${location.description}</p>
         ${displayAddress(location.physical_address[0])}
         ${location.phones[0] ? `<p>☎️: <a href="tel:${location.phones[0].number}">${location.phones[0].number}</a></p>` : "" }
         <p>Language: ${location.phones[0] ? location.phones[0].language : ""} </p>
         ${location.regular_schedule ? displaySchedule(location.regular_schedule) : ""}
         <p>${location.transportation ? icons(location.transportation) : ""}</p>
         </li>`
        })
        html += '</ul>'
        $('.results').html(html) 
}
   
function icons(str) {
    let obj = {
      Car: "🚗",
      Bus: "🚌",
      Uber: "🚕",
      Shuttle: "🚐",
      "DriveThrough": "🚘",
      Depends: "❓",
      Train: "🚆"
    }
    let iconArray = str.replaceAll(' ','').split(',')

    let result = iconArray.map(icon => {
      return `${obj[icon]} ${icon}`
    })
    console.log(result)
    console.log(iconArray)
    return result.join(', ')
}

function watchForm() {
  $('select').change(event => {
    event.preventDefault();
    let state = $('select :selected').val()
    getLocation(state);
  });
}

$(function() {
  console.log('App loaded! Waiting for submit!');
  watchForm();
});

$(".results").removeClass ( "ts-cards" ).addClass ( "ts-cards" );