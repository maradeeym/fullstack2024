import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [allCountries, setAllCountries] = useState([]);
  const [visibleCountries, setVisibleCountries] = useState([]);
  const [filter, setFilter] = useState('');
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all/';

    axios.get(baseUrl)
      .then(response => {
        setAllCountries(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    filterCountries(event.target.value);
  };



  const filterCountries = (input) => {
    if (input) {
      const filteredCountries = allCountries.filter(country =>
        country.name.common.toLowerCase().includes(input.toLowerCase())
      );
      setVisibleCountries(filteredCountries);
    } else {
      setVisibleCountries([]);
    }
  };
  

  const handleShowCountry = (countryName) => {
    setFilter(countryName);
    filterCountries(countryName);
  };

  useEffect(() => {
    if (visibleCountries.length === 1) {
      const capital = visibleCountries[0].capital[0];
      const api_key = "be507c2cedaeed3b95121b25d34892f4"
      //const api_key = import.meta.env.VITE_SOME_KEY
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`;

      axios.get(weatherUrl)
        .then(response => {
          setWeather(response.data);
        })
        .catch(error => {
          console.error('Error fetching weather:', error);
          setWeather(null); // Reset weather data on error
        });
    } else {
      setWeather(null); // Reset weather data when more than one country is visible
    }
  }, [visibleCountries]);

  return (
    <div>
      <p>Type to search for a country:</p>
      <input 
        value={filter}
        onChange={handleFilterChange}
        placeholder='Enter country name'
      />
  
      {visibleCountries.length === 1 ? (
        <>
          <div>
            <h2>{visibleCountries[0].name.common}</h2>
            <p><strong>Capital:</strong> {visibleCountries[0].capital[0]}</p>
            <p><strong>Population:</strong> {visibleCountries[0].population.toLocaleString()}</p>
            <p><strong>Languages:</strong> {Object.values(visibleCountries[0].languages).join(', ')}</p>
            <img src={visibleCountries[0].flags.png} alt={`Flag of ${visibleCountries[0].name.common}`} style={{ width: '150px' }} />
          </div>
          {weather && (
            <div>
              <h3>Weather in {weather.name}</h3>
              <p><strong>Temperature:</strong> {weather.main.temp}°C</p>
              <p><strong>Condition:</strong> {weather.weather[0].main}</p>
              <img src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`} alt="Weather icon" />
            </div>
          )}
        </>
      ) : (
        <ul>
          {visibleCountries.map((country, index) => (
            <li key={country.name.common + index}>
              {country.name.common}
              <button onClick={() => handleShowCountry(country.name.common)}>Show</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );  
};

export default App;
