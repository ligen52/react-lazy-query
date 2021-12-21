import React from "react";
import "./styles.css";
import useLazyCountries from "./hooks/useLazyCountries";

export default function App() {
  const [fetchCountries, { loading, error, countries }] = useLazyCountries();

  function renderCountryList(country, index) {
    return (
      <div className="list-item" key={index}>
        {country}
      </div>
    );
  }

  if (loading) {
    return <h2>Loading countries</h2>;
  }

  if (error) {
    return <h2>Uppps! There was an error</h2>;
  }

  function onClick() {
    fetchCountries();
  }

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <button onClick={onClick}>Load Countries</button>
      {countries ? countries.map(renderCountryList) : null}
    </div>
  );
}
