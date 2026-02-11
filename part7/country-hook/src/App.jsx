import React, { useState, useEffect } from 'react'
import Services from './services/countries'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)
  const [countriesCache, setCountriesCache] = useState(null)

  useEffect(() => {
    let cancelled = false

    if (!name) {
      setCountry(null)
      return undefined
    }

    const findCountry = async () => {
      try {
        let countries = countriesCache
        if (!countries) {
          countries = await Services.getAll()
          if (cancelled) return
          setCountriesCache(countries)
        }

        if (cancelled) return

        const match = countries.find(c => c.name.common.toLowerCase().startsWith(name.toLowerCase()))
        if (match) {
          setCountry({ data: match, found: true })
        } else {
          setCountry({ found: false })
        }
      } catch (error) {
        if (!cancelled) setCountry({ found: false })
      }
    }

    findCountry()

    return () => { cancelled = true }
  }, [name])
  return country
}

const Country = ({ country }) => {
  if (!country) {
    return null
  }

  if (!country.found) {
    return (
      <div>
        not found...
      </div>
    )
  }

  return (
    <div>
      <h3>{country.data.name.common} </h3>
      <div>capital {country.data.capital} </div>
      <div>population {country.data.population}</div> 
      <img src={country.data.flags.png} height='100' alt={`flag of ${country.data.name.common}`}/>  
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App