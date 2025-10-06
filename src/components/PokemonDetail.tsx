import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

interface PokemonDetailType {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: {
    front_default: string;
    back_default: string;
    front_shiny: string;
    back_shiny: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
    };
    is_hidden: boolean;
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  species: {
    name: string;
    url: string;
  };
}

interface PokemonSpecies {
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
    };
  }>;
}

const PokemonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<PokemonDetailType | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemonDetail = async () => {
      try {
        setLoading(true);
        
        // Fetch Pokemon details
        const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        setPokemon(pokemonResponse.data);
        
        // Fetch Pokemon species for description
        const speciesResponse = await axios.get(pokemonResponse.data.species.url);
        setSpecies(speciesResponse.data);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch Pokemon details');
        setLoading(false);
      }
    };

    if (id) {
      fetchPokemonDetail();
    }
  }, [id]);

  const getDescription = () => {
    if (!species) return '';
    const englishEntry = species.flavor_text_entries.find(
      entry => entry.language.name === 'en'
    );
    return englishEntry?.flavor_text.replace(/\f/g, ' ') || '';
  };

  const formatStatName = (statName: string) => {
    switch (statName) {
      case 'hp': return 'HP';
      case 'attack': return 'Attack';
      case 'defense': return 'Defense';
      case 'special-attack': return 'Sp. Attack';
      case 'special-defense': return 'Sp. Defense';
      case 'speed': return 'Speed';
      default: return statName;
    }
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC',
    };
    return colors[type] || '#68A090';
  };

  if (loading) {
    return (
      <div className="pokemon-detail">
        <div className="loading">Loading Pokemon details...</div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="pokemon-detail">
        <div className="error">{error || 'Pokemon not found'}</div>
        <Link to="/" className="back-button">Back to Pokédex</Link>
      </div>
    );
  }

  return (
    <div className="pokemon-detail">
      <Link to="/" className="back-button">← Back to Pokédex</Link>
      
      <div className="pokemon-detail-content">
        <div className="pokemon-detail-header">
          <div className="pokemon-detail-image">
            <img
              src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
              alt={pokemon.name}
              className="pokemon-artwork"
            />
          </div>
          
          <div className="pokemon-detail-info">
            <h1 className="pokemon-detail-name">
              {pokemon.name}
              <span className="pokemon-detail-number">#{pokemon.id.toString().padStart(3, '0')}</span>
            </h1>
            
            <div className="pokemon-types">
              {pokemon.types.map((typeInfo, index) => (
                <span
                  key={index}
                  className="pokemon-type"
                  style={{ backgroundColor: getTypeColor(typeInfo.type.name) }}
                >
                  {typeInfo.type.name}
                </span>
              ))}
            </div>
            
            <p className="pokemon-description">{getDescription()}</p>
            
            <div className="pokemon-basic-info">
              <div className="info-item">
                <span className="info-label">Height:</span>
                <span className="info-value">{(pokemon.height / 10).toFixed(1)} m</span>
              </div>
              <div className="info-item">
                <span className="info-label">Weight:</span>
                <span className="info-value">{(pokemon.weight / 10).toFixed(1)} kg</span>
              </div>
              <div className="info-item">
                <span className="info-label">Base Experience:</span>
                <span className="info-value">{pokemon.base_experience}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pokemon-abilities">
          <h3>Abilities</h3>
          <div className="abilities-list">
            {pokemon.abilities.map((abilityInfo, index) => (
              <span
                key={index}
                className={`ability ${abilityInfo.is_hidden ? 'hidden-ability' : ''}`}
              >
                {abilityInfo.ability.name}
                {abilityInfo.is_hidden && ' (Hidden)'}
              </span>
            ))}
          </div>
        </div>
        
        <div className="pokemon-stats">
          <h3>Base Stats</h3>
          <div className="stats-container">
            {pokemon.stats.map((statInfo, index) => (
              <div key={index} className="stat-item">
                <div className="stat-name">{formatStatName(statInfo.stat.name)}</div>
                <div className="stat-bar-container">
                  <div
                    className="stat-bar"
                    style={{ width: `${(statInfo.base_stat / 255) * 100}%` }}
                  ></div>
                </div>
                <div className="stat-value">{statInfo.base_stat}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pokemon-sprites">
          <h3>Sprites</h3>
          <div className="sprites-grid">
            <div className="sprite-item">
              <img src={pokemon.sprites.front_default} alt="Front" />
              <span>Front</span>
            </div>
            <div className="sprite-item">
              <img src={pokemon.sprites.back_default} alt="Back" />
              <span>Back</span>
            </div>
            {pokemon.sprites.front_shiny && (
              <div className="sprite-item">
                <img src={pokemon.sprites.front_shiny} alt="Shiny Front" />
                <span>Shiny Front</span>
              </div>
            )}
            {pokemon.sprites.back_shiny && (
              <div className="sprite-item">
                <img src={pokemon.sprites.back_shiny} alt="Shiny Back" />
                <span>Shiny Back</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;