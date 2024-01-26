// hooks/useCountry.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useCountry = () => {
  const [allCountries, setAllCountries] = useState([]);
  const [visibleCountries, setVisibleCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);
  const [notFoundMessage, setNotFoundMessage] = useState('');


  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setAllCountries(response.data);
      })
      .catch(error => console.error('Error fetching countries:', error));
  }, []);

  const filterCountries = (filter) => {
    if (!filter) {
      setVisibleCountries([]);
      setSelectedCountry(null);
      setWeather(null);
      setNotFoundMessage('');
      return;
    }
  
    const filtered = allCountries.filter(country =>
      country.name.common.toLowerCase().includes(filter.toLowerCase())
    );
  
    setVisibleCountries(filtered);
  
    if (filtered.length === 0) {
      // No countries found
      setNotFoundMessage('Country not found');
      setSelectedCountry(null);
      setWeather(null);
    } else if (filtered.length === 1) {
      // Automatically select the country if it's the only match
      setSelectedCountry(filtered[0]);
      fetchWeather(filtered[0].capital);
      setNotFoundMessage('');
    } else {
      setSelectedCountry(null);
      setWeather(null);
      setNotFoundMessage('');
    }
  };
  

  const selectCountry = (countryName) => {
    const foundCountry = allCountries.find(c => 
      c.name.common.toLowerCase() === countryName.toLowerCase()
    );

    if (foundCountry) {
      setSelectedCountry(foundCountry);
      fetchWeather(foundCountry.capital);
    }
  };
  const fetchWeather = (capital) => {
    const api_key = import.meta.env.VITE_API_KEY;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`;

    axios.get(weatherUrl)
      .then(response => {
        setWeather(response.data);
      })
      .catch(error => console.error('Error fetching weather:', error));
  };

  return { visibleCountries, selectedCountry, weather, filterCountries, selectCountry, notFoundMessage };
};

