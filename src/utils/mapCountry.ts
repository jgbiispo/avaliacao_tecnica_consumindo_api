import { Country } from '../types/country';
import { RestCountry } from '../types/restCountries';

export function mapCountry(c: RestCountry): Country {
  return {
    nome: c.name.common,
    populacao: c.population,
    continente: Array.isArray(c.continents) ? c.continents[0] : '',
    codigo: c.cca3,
  };
}
