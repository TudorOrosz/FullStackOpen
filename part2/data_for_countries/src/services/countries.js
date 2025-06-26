import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/'
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather'
const iconUrl = 'https://openweathermap.org/img/wn/'

const getAll = () => {
  const request = axios.get(`${baseUrl}api/all`)
  return request.then(response => response.data)
}

const Weather = (lat, lon, apiKey) => {
  const request = axios.get(`${weatherUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
  return request.then(response => response.data)
}

export default { getAll, Weather }