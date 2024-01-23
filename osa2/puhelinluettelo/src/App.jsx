import { useState, useEffect } from 'react';
import Persons from './components/persons';
import PersonForm from './components/personform';
import FilterInput from './components/filterinput';
import personsService from './components/personsService';
import Notification from './components/notification';



const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showAll, setShowAll] = useState('')
  const [addMessage, setAddMessage] = useState(null)
  const [addMessageType, setAddMessageType] = useState(null);


  useEffect(() => {
    console.log('effect')
    personsService
      .getAll()
      .then(initialPersons => {
        console.log('promise fulfilled');
        setPersons(initialPersons);
      });
  }, []);
  console.log('render', persons.length, 'persons')

//this sends the data when the button is clicked
const addNote = (event) => {
  event.preventDefault();
   // Validation for name and number length
   if (newName.length < 3 || newNumber.length < 3) {
    setAddMessageType('error');
    setAddMessage('Name and number must be at least 3 characters long.');
    setTimeout(() => {
      setAddMessage(null);
    }, 5000);
    return; // Stop the function if validation fails
  }
  const personWithSameName = persons.find(p => p.name === newName);
  const newPerson = {
    name: newName,
    number: newNumber
  };

  if (personWithSameName) {
    const confirmed = window.confirm(`${newName} is already in the phone book, would you like to update the number associated with this name?`);
    if (confirmed) {
      personsService
        .update(personWithSameName.id, { ...personWithSameName, number: newNumber })
        .then(updatedPerson => {
          setPersons(persons.map(p => p.id !== personWithSameName.id ? p : updatedPerson));
          setAddMessage(`Updated ${newName}'s number successfully.`);
          setAddMessageType('success');
          setTimeout(() => {
            setAddMessage(null);
          }, 5000);
        })
        .catch(error => {
          console.error('Error updating person:', error);
          setAddMessageType('error');
          setAddMessage(`Failed to update ${newName}'s number. It might have been removed from the server.`);
          setTimeout(() => {
            setAddMessage(null);
          }, 5000);
        });
    }
  } else {
    personsService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        setAddMessage(`Added ${newName} successfully.`);
        setAddMessageType('success');
        setTimeout(() => {
          setAddMessage(null);
        }, 2500);
      })
      .catch(error => {
        console.error('Error adding new person:', error);
        setAddMessageType('error');
        setAddMessage(`Failed to add ${newName}.`);
        setTimeout(() => {
          setAddMessage(null);
        }, 5000);
      });
  }

  setNewName('');
  setNewNumber('');
};

// tapahtumankäsittelijä: this updates the value of input in realtime
  const handleNameChange = (event) => {
    //console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    //console.log(event.target.value)
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    //console.log(event.target.value)
    setShowAll(event.target.value)
  }
//this is tapahtumankäsittelijä
  const handleDelete = id => {
    const person = persons.find(p => p.id === id);
    const confirmed = window.confirm(`Are you sure you want to delete ${person.name}?`);
  
    if (confirmed) {
      personsService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id));
          setAddMessage(`${person.name} has been successfully deleted.`);
          setTimeout(() => {
            setAddMessage(null);
          }, 5000);
        })
        .catch(error => {
          console.error('Error deleting person:', error);
          setAddMessageType('error');
          setAddMessage(`Information of ${person.name} has already been removed from server.`);
          setTimeout(() => {
            setAddMessage(null);
          }, 5000);
          // Optionally, you could also filter out the person from your state here, in case it's not already done
          setPersons(persons.filter(p => p.id !== id));
        });
    }
  };
  

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={addMessage} type={addMessageType} />
      <div>
      <FilterInput value={showAll} onChange={handleFilterChange} />
      </div>
      <h2>Add new</h2>
      <PersonForm
        addNote={addNote}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <div>
      <Persons
        persons={persons}
        showAll={showAll}
        handleDelete={handleDelete}
        />
      </div>
    </div>
  )
}

export default App


