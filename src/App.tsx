import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

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
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllPokemon = async () => {
      try {
        setLoading(true);
        // Get the list of all Pokemon (first 150 for better performance)
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
                front_default: detailResponse.data.sprites.front_default
              }
            };
          })
        );
        
        setPokemonList(pokemonDetails);
        setFilteredPokemon(pokemonDetails);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch Pokemon data');
        setLoading(false);
      }
    };

    fetchAllPokemon();
  }, []);

  useEffect(() => {
    const filtered = pokemonList.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPokemon(filtered);
  }, [searchQuery, pokemonList]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return (
      <div className="App">
        <div className="loading">Loading Pokemon...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Pokemon Search</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Pokemon..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        
        <div className="pokemon-grid">
          {filteredPokemon.map((pokemon) => (
            <div key={pokemon.id} className="pokemon-card">
              <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                className="pokemon-image"
              />
              <h3 className="pokemon-name">{pokemon.name}</h3>
              <p className="pokemon-number">#{pokemon.id.toString().padStart(3, '0')}</p>
            </div>
          ))}
        </div>
        
        {filteredPokemon.length === 0 && searchQuery && (
          <div className="no-results">
            No Pokemon found matching "{searchQuery}"
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
