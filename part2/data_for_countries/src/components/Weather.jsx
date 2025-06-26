import { useState, useEffect } from 'react'
import Services from '../services/countries'


const Weather = ({ countryData }) => {

    const [weatherData, setWeatherData] = useState({})
    const [icon, setIcon] = useState()

    useEffect(() => {
        Services.Weather(countryData.capitalInfo.latlng[0], countryData.capitalInfo.latlng[1], import.meta.env.VITE_REACT_APP_API_KEY)
        .then((weatherData) =>{
            setWeatherData(weatherData)
        })
    }, [countryData])
 
    const iconUrl = weatherData.weather?.[0]?.icon
        ? `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
        : ''

    return(
        <div>
            <h2>Weather in {countryData.capital}</h2>
            <p>Temperature {weatherData.main?.temp} Celsius</p>
            {iconUrl && <img src={iconUrl} />}
            <p>Wind {weatherData.wind?.speed} m/s</p>
        </div>
    )
}

export default Weather