import { useState } from 'react'
import CountryInfo from './CountryInfo'

const Data = ({ filteredCountries, countryData }) => {
    const [showDetails, setShowDetails] = useState(null)
   
    const onClick = (country) => {
        setShowDetails(country)
    }

    if (filteredCountries.length > 10) {
        return <p>Too many matches, make filter more specific</p>
    }

    if (filteredCountries.length > 1) {
        return (
            <ul>
                {filteredCountries.map(country => (
                    <li key={country.name.common}>
                        {country.name.common}
                        <button onClick = {() => onClick(country)} style={{ marginLeft: "3px" }}>Show</button>
                    </li>
                ))}
                {showDetails && <CountryInfo countryData={showDetails} />} 
            </ul>      
        )
    }

    if (filteredCountries.length === 1){
        return (
        <CountryInfo countryData={countryData}/>
    )}
    }

export default Data