import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const CountryDetails = () => {
  const { slug } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://frontend-mentor-apis-6efy.onrender.com/countries`
        );
        const countryData = response.data.data.find(
          (c) => c.name.common.toLowerCase().replace(/ /g, "-") === slug
        );
        setCountry(countryData || null);
      } catch (error) {
        console.error("Error loading country details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-infinity loading-lg size-80"></span>
      </div>
    );
  }

  if (!country) {
    return <div>Country not found.</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <Link className="flex my-14 gap-4" to={"/"}>
        <img className="w-5 h-5" src="/src/assets/arrow.svg" alt="" /> Back
      </Link>
      <div className="flex flex-col lg:flex-row justify-between items-center ">
        <img
          src={country.flags.png}
          alt={country.flags.alt}
          className="w-full lg:w-1/2 h-auto object-cover mb-4 lg:mb-0"
        />
        <div className="lg:ml-6">
              <h1 className="text-2xl font-bold mb-6">{country.name.common}</h1>
          <div className="flex items-center justify-between gap-4 mb-20 file:">
            <div>
              <p>
                <strong>Native Name:</strong> {country.name.nativeName}
              </p>
              <p>
                <strong>Population:</strong>{" "}
                {country.population.toLocaleString()}
              </p>
              <p>
                <strong>Region:</strong> {country.region}
              </p>
              <p>
                <strong>Subregion:</strong> {country.subregion}
              </p>
            </div>
            <div>
              <p>
                <strong>Capital:</strong> {country.capital[0]}
              </p>

              <p>
                <strong>Languages:</strong>{" "}
                {Object.values(country.languages).join(", ")}
              </p>
              <p>
                <strong>Currencies:</strong>{" "}
                {Object.values(country.currencies)
                  .map((c) => c.name)
                  .join(", ")}
              </p>
              <p>
                <strong>Area:</strong> {country.area.toLocaleString()} km²
              </p>
            </div>
          </div>
          <p>
            {country.borders.length > 0 ? (
              <ul className="flex gap-5 text-center">
                <strong>Border Countries:</strong>
                {country.borders.map((border, index) => (
                  <li key={index}>
                    <Link
                      to={`/country/${border.common
                        .toLowerCase()
                        .replace(/ /g, "-")}`}
                      className=" btn  "
                    >
                      {border.common}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              " "
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CountryDetails;
