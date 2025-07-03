// Will comment out code since we do not need this anymore. Connection
// to Mongo is done by models -> person


// const mongoose = require('mongoose')

// const password = process.argv[2]

// const url = `mongodb+srv://tudororosz:${password}@cluster0.mtmf7mx.mongodb.net/personApp?retryWrites=true&w=majority&appName=Cluster0`

// mongoose.set('strictQuery',false)

// mongoose.connect(url)

// const personSchema = new mongoose.Schema({
//   name: String,
//   number: String,
// })

// const Person = mongoose.model('Person', personSchema)

// if (process.argv.length < 3) {
//     const person = new Person({
//     name: process.argv[3],
//     number: process.argv[4],
//     })

//     person.save().then(result => {
//     console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
//     mongoose.connection.close()
//     })
// }

// if (process.argv.length === 3) {
//     console.log('only password was given as argument')
//     Person
//         .find({})
//         .then(persons => {
//             persons.forEach(person => {
//             console.log(person)
//         })
//         mongoose.connection.close()
//         process.exit(1)
//     })  
// }

