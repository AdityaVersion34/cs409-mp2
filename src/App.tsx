import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import PokemonList from './components/PokemonList';
import PokemonDetail from './components/PokemonDetail';

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
}

interface PokemonListItem {
  name: string;
  url: string;
}

function App() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllPokemon = async () => {
      try {
        setLoading(true);
        // Get the list of all Pokemon (first 151 for better performance)
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
        const pokemonUrls = response.data.results;

        // Fetch details for each Pokemon
        const pokemonDetails = await Promise.all(
          pokemonUrls.map(async (pokemon: PokemonListItem) => {
            const detailResponse = await axios.get(pokemon.url);
            return {
              id: detailResponse.data.id,
              name: detailResponse.data.name,
              sprites: {
                front_default: detailResponse.data.sprites.front_default,
              },
            };
          })
        );

        setPokemonList(pokemonDetails);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch Pokemon data');
        setLoading(false);
      }
    };

    fetchAllPokemon();
  }, []);

  if (loading) {
    return (
      <div className="App">
        <div className="App-header">
          <div className="loading">Loading Pokemon...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <div className="App-header">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="App-header">
        <Routes>
          <Route 
            path="/" 
            element={<PokemonList pokemonList={pokemonList} />} 
          />
          <Route 
            path="/pokemon/:id" 
            element={<PokemonDetail />} 
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;