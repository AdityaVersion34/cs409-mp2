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

type SortProperty = 'name' | 'id';
type SortOrder = 'asc' | 'desc';

const PokemonList: React.FC<PokemonListProps> = ({ pokemonList }) => {
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortProperty, setSortProperty] = useState<SortProperty>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  useEffect(() => {
    let filtered = pokemonList.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      let comparison = 0;

      if (sortProperty === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortProperty === 'id') {
        comparison = a.id - b.id;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredPokemon(filtered);
  }, [searchQuery, pokemonList, sortProperty, sortOrder]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortPropertyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortProperty(e.target.value as SortProperty);
  };

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSortOrder(e.target.value as SortOrder);
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

      <div className="sort-controls">
        <div className="sort-property">
          <label htmlFor="sort-select">Sort by:</label>
          <select
            id="sort-select"
            value={sortProperty}
            onChange={handleSortPropertyChange}
            className="sort-dropdown"
          >
            <option value="id">Pokemon Number</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>

        <div className="sort-order">
          <label>Order:</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="sortOrder"
                value="asc"
                checked={sortOrder === 'asc'}
                onChange={handleSortOrderChange}
              />
              Ascending
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="sortOrder"
                value="desc"
                checked={sortOrder === 'desc'}
                onChange={handleSortOrderChange}
              />
              Descending
            </label>
          </div>
        </div>
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