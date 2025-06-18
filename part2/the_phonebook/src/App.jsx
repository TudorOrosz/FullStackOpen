import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import Form from './components/Form'
import Notification from './components/Notification'
import Person from './components/Person'

const App = (props) => {
  // Declaring states to use
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [message, setMessage] = useState({text: '', type: ''})

  useEffect(() => {
    personService.getAll().then((initialPersons) =>{
      setPersons(initialPersons)
    })
  }, [])

  // Function: add a name to the phonebook + alert and confirm replacing old number with new number + Confirmation message (Succesful/Info deleted already)
  const addName = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(person => person.name === newName)
    // Checking if person exists => ask user if a number change is wanted
    if (existingPerson){
      if (confirm(`${newName} is already added to phonebook, replace the old number with a new one?`) === true){
        const person = persons.find((n)=> n.name === newName)
        personService
          .update_number(person.id, { ...person, number: newNumber })
          .then((updatedPerson) => {
            setMessage({text: `${newName}'s number was changed to: ${newNumber}`, type: 'success'})
            setTimeout(() => {setMessage({ text: '', type: '' })}, 5000)
            setPersons(persons.map(person =>
            person.name === newName ? updatedPerson : person))
          })
        .catch((error) => {
          setMessage({text: `Information of ${newName} has already been removed from the server`, type: "error"})
          setTimeout(() => {setMessage({ text: '', type: '' })}, 5000)
        })

      }
      return
    }
    // Adding a new person
    const personObject = {
      name: newName,
      number: newNumber 
    }
    personService
      .create(personObject)
      .then((returnedPerson) => {
        setMessage({text: `Added ${newName}`, type: 'success'})
        setTimeout(() => {setMessage({ text: '', type: '' })}, 5000)
        setPersons(persons.concat(returnedPerson))
        setNewName('') 
        setNewNumber('')  
      })
  }

  // Function: filter phonebook by name
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
  
  // Function: Delete a person + Confirmation message (Succesful/Info deleted already)
  const handleDeleteOf = (id, name) => {
    console.log(persons)
    if (confirm(`Delete ${name}?`) === true){
    personService
      .delete_person(id)
      .then(() => {
        setMessage({text: `Deleted ${name}`, type: 'success'})
        setTimeout(() => {setMessage({ text: '', type: '' })}, 5000)
        setPersons(persons.filter(person => person.id !== id))
      })
      .catch((error) => {
        setMessage({text: `Information of ${name} has already been removed from the server`, type: "error"})
        setTimeout(() => {setMessage({ text: '', type: '' })}, 5000)
      })
    }
  }

  // HTML of app
  return (
    <div>
      <h2>Phonebook</h2>
      {message.text && <Notification message={message.text} type={message.type} />}
      <Filter filter={newFilter} handleFilterChange={handleFilterChange}/>
      <h2>add a new</h2>
      <Form addName={addName} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <ul>
        {personsToShow.map((person) => (
          <Person key={person.name} person={person} handleDelete={() => handleDeleteOf(person.id, person.name)}/>
        ))}
      </ul>
    </div>
  )
}

export default App
// Note: Known limitation of the app. I can add the same person twice, by first adding it as a name, 
// and then adding it just as a number. As there is no regex on the number