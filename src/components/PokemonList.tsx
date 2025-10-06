import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
}

interface PokemonListProps {
  pokemonList: Pokemon[];
}

const PokemonList: React.FC<PokemonListProps> = ({ pokemonList }) => {
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const filtered = pokemonList.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPokemon(filtered);
  }, [searchQuery, pokemonList]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <h1>Pokédex</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Pokemon..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      
      {filteredPokemon.length === 0 ? (
        <div className="no-results">No Pokemon found matching your search.</div>
      ) : (
        <div className="pokemon-grid">
          {filteredPokemon.map((pokemon) => (
            <Link 
              key={pokemon.id} 
              to={`/pokemon/${pokemon.id}`}
              className="pokemon-card-link"
            >
              <div className="pokemon-card">
                <img
                  src={pokemon.sprites.front_default}
                  alt={pokemon.name}
                  className="pokemon-image"
                />
                <div className="pokemon-name">{pokemon.name}</div>
                <div className="pokemon-number">#{pokemon.id.toString().padStart(3, '0')}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default PokemonList;