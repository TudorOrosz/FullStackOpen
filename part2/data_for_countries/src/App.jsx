import { useState} from 'react'
import Services from './services/countries'
//console.log(import.meta.env.VITE_SOME_KEY)

import Search from './components/Search'
import Data from './components/Data'

const App = (props) => {
  // Declaring states to use
  const [filteredCountries, setFilteredCountries] = useState([])
  const [countryData, setCountryData] = useState({}) // state for the 1 selected country data
  
  
  // Event handlers
  const handleInputChange = (event) => {
    let input = event.target.value
    Services.getAll().then((countriesAll) => {
      let filteredCountries = countriesAll
        .filter(country => country.name.common.toLowerCase().includes(input.toLowerCase()))
      // Condition to evaluate if there is only one country left in the filtering and set the state of countryData  
      if (filteredCountries.length === 1) {
        const countryData = filteredCountries[0]
        setCountryData(countryData)
      }
    setFilteredCountries(filteredCountries)    
    })
  }

  // HTML of app
  return (
    <div>
      <Search handleInputChange={handleInputChange}/>
      <Data filteredCountries={filteredCountries} countryData={countryData}/>
    </div>
  )
}

export default App