import React, { useEffect, useState } from 'react';
// import logo from './logo.jpg';
import './App.css';
import axios from 'axios';

function App() {
  const [pokemon, setPokemon] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('https://pokeapi.co/api/v2/pokemon/pikachu')
      .then(response => {
        setPokemon(response.data);
      })
      .catch(err => {
        setError('API request failed');
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>PokeAPI Test</p>
        {error && <p>{error}</p>}
        {pokemon ? (
          <div>
            <h3>{pokemon.name}</h3>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            <p>Height: {pokemon.height}</p>
            <p>Weight: {pokemon.weight}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </header>
    </div>
  );
}

export default App;
