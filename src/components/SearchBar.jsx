import React, { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { GEO_URL, geoOptions } from "../services/geoDbApi";

function SearchBar({ setSearch }) {
  const [city, setCity] = useState(null);

  const handleSearch = (searchData) => {
    setCity(searchData);
    setSearch(formatCityData(searchData));
  };

  // handle current location icon click
  const handleOnClick = () => {
    // check if browser supports geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latLon = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          setSearch(latLon);
        },
        (error) => {
          console.error("Error getting location:", error.message);
        }
      );
    } else {
      console.log("This browser does not support Geolocation");
    }
  };

  // format lat and lon data into object
  const formatCityData = (searchData) => {
    const [lat, lon] = searchData.value.split(" ").map(Number);
    const cityData = {
      lat: lat,
      lon: lon,
    };
    return cityData;
  };

  const loadOptions = async (userInput) => {
    const URL = `${GEO_URL}?minPopulation=1000000&namePrefix=${userInput}`;
    try {
      const response = await fetch(URL, geoOptions);
      const result = await response.json();
      // console.log(result);
      return {
        options: result.data.map((city) => ({
          label: `${city.name}, ${city.countryCode}`,
          value: `${city.latitude} ${city.longitude}`,
        })),
      };
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-row w-full items-center justify-center my-2 space-x-2 pr-1">
      <AsyncPaginate
        className={`text-xl font-light p-1 w-full`}
        placeholder="city name"
        debounceTimeout={700}
        value={city}
        onChange={handleSearch}
        loadOptions={loadOptions}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-10 text-white cursor-pointer hover:scale-125"
        onClick={handleOnClick}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
        />
      </svg>
    </div>
  );
}

export default SearchBar;
