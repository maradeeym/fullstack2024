import React from 'react';

const Persons = ({ persons, showAll, handleDelete }) => {
    return (
      <ul>
        {persons
          .filter(person => person.name.toLowerCase().includes(showAll.toLowerCase()))
          .map(person => (
            <li key={person.id}>{person.name} {person.number}
                <button onClick={() => handleDelete(person.id)}>Delete</button>
            </li>
            
          ))}
      </ul>
    );
  };
  
export default Persons;