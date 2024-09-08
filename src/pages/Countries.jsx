import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axiosInstance from '../utils/axiosConfig'; // Import the axios instance
import { useNavigate } from 'react-router-dom';
import useDebounce from '../components/useDebounce';

const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [countriesPerPage] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('All');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/countries'); 
        const data = response.data.data || [];
        setCountries(data);
      } catch (error) {
        console.error('Error loading countries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const continents = ['All', 'Africa', 'North America', 'South America', 'Asia', 'Europe', 'Oceania'];

  const filteredCountries = useMemo(() => {
    return countries.filter(country => {
      const matchesSearch = country.name.common.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      const matchesContinent = selectedContinent === 'All' || country.region === selectedContinent;
      return matchesSearch && matchesContinent;
    });
  }, [debouncedSearchQuery, selectedContinent, countries]);

  const indexOfLastCountry = currentPage * countriesPerPage;
  const indexOfFirstCountry = indexOfLastCountry - countriesPerPage;
  const currentCountries = useMemo(() => {
    return filteredCountries.slice(indexOfFirstCountry, indexOfLastCountry);
  }, [filteredCountries, indexOfFirstCountry, indexOfLastCountry]);

  const paginate = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  const totalPages = Math.ceil(filteredCountries.length / countriesPerPage);
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-infinity loading-lg size-80"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 mt-16">
      <div className="flex flex-col md:flex-row mb-4 justify-between items-center">
      <div className="relative mb-3 md:mb-0">
  <svg
    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M13.293 14.293a6.5 6.5 0 111.414-1.414l3.387 3.387a1 1 0 01-1.414 1.414l-3.387-3.387zM8.5 13a4.5 4.5 0 100-9 4.5 4.5 0 000 9z"
      clipRule="evenodd"
    />
  </svg>
  <input
    type="text"
    placeholder="Search for a country..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="input input-bordered w-full md:max-w-xs py-2 pl-10 pr-4 rounded-sm shadow-md focus:outline-none"
  />
</div>
        <select
          value={selectedContinent}
          onChange={(e) => setSelectedContinent(e.target.value)}
          className="select select-bordered w-full md:max-w-xs py-2 pl-10 pr-4 rounded-sm shadow-md focus:outline-none"
        >
          {continents.map((continent) => (
            <option key={continent} value={continent}>
              {continent}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-14 gap-10 items-center">
        {currentCountries.map((country) => (
          <div
            key={country.name.common}
            className="shadow-sm rounded-xl overflow-hidden cursor-pointer w-full h-full"
            onClick={() =>
              navigate(`/country/${country.name.common.toLowerCase().replace(/ /g, '-')}`)
            }
          >
            <img
              src={country.flags.png}
              alt={country.flags.alt}
              className="w-full h-48 object-cover mb-4"
            />
            <div className='p-7'>
              <h2 className="text-xl font-semibold">{country.name.common}</h2>
              <p>Population: {country.population.toLocaleString()}</p>
              <p>Region: {country.region}</p>
              <p>Capital: {country.capital[0]}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center mt-6">
        <div className="flex space-x-2">
          <button
            onClick={handlePreviousPage}
            className="btn"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>{currentPage} / {totalPages}</span>
          <button
            onClick={handleNextPage}
            className="btn"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Countries;