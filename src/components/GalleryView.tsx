import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
}

interface GalleryViewProps {
  pokemonList: Pokemon[];
}

const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

const GalleryView: React.FC<GalleryViewProps> = ({ pokemonList }) => {
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    if (selectedType === null) {
      setFilteredPokemon(pokemonList);
    } else {
      const filtered = pokemonList.filter(pokemon =>
        pokemon.types.some(typeInfo => typeInfo.type.name === selectedType)
      );
      setFilteredPokemon(filtered);
    }
  }, [selectedType, pokemonList]);

  const handleTypeClick = (type: string) => {
    if (selectedType === type) {
      setSelectedType(null);
    } else {
      setSelectedType(type);
    }
  };

  return (
    <>
      <h1>Gallery View</h1>

      <div className="type-filters">
        {POKEMON_TYPES.map(type => (
          <button
            key={type}
            className={`type-filter-button type-${type} ${selectedType === type ? 'selected' : ''}`}
            onClick={() => handleTypeClick(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {filteredPokemon.length === 0 ? (
        <div className="no-results">No Pokemon found for this type.</div>
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
                <div className="pokemon-types-small">
                  {pokemon.types.map((typeInfo, index) => (
                    <span
                      key={index}
                      className={`pokemon-type-badge type-${typeInfo.type.name}`}
                    >
                      {typeInfo.type.name}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default GalleryView;
