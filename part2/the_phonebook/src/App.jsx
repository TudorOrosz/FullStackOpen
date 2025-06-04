import { useState, useEffect } from 'react'
import axios from 'axios'
import Person from './components/Person'
import Filter from './components/Filter'
import Form from './components/Form'

const App = (props) => {
  // Declaring states to use
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])

  // Function to add a name to the phonebook + alert if name already exists
  const addName = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)){
      alert(`${newName} is already added to phonebook`)
      return
    }
    const personObject = {
      name: newName,
      number: newNumber 
    }
    setPersons(persons.concat(personObject))
    setNewName('') 
    setNewNumber('')   
  }

  // Function to filter phonebook by name
  const personsToShow = newFilter
    ? persons.filter(person =>
        person.name.toLowerCase().includes(newFilter.toLowerCase())
      )
    : persons

  // Event handlers
  const handleNameChange = (event) => {
  setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
  setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
  setNewFilter(event.target.value)
  }  

  // HTML of app
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={newFilter} handleFilterChange={handleFilterChange}/>
      <h2>add a new</h2>
      <Form addName={addName} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <ul>
        {personsToShow.map((person) => (
          <Person key={person.name} person={person}/>
        ))}
      </ul>
    </div>
  )
}

export default App
// Note: Known limitation of the app. I can add the same person twice, by first adding it as a name, 
// and then adding it just as a number. As there is no regex on the number