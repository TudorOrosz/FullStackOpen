import Weather from './Weather'

const CountryInfo = ({ countryData }) => {
    
    return(
        <div>
            <h1>{countryData.name.common}</h1>
            <p>Capital {countryData.capital}</p>
            <p>Area {countryData.area}</p>
            <div>
                <h2>Languages</h2>
                    <ul>
                        {Object.values(countryData.languages).map(lang => (
                            <li key={lang}>{lang}</li>
                        ))}
                    </ul>
            </div>
            <img src={countryData.flags.png} alt="Country flag" />
            <Weather countryData={countryData}/>
        </div>
    )
}

export default CountryInfo