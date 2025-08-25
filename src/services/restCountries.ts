import axios from 'axios';
import { RestCountry } from '../types/restCountries';

const FIELDS = 'name,population,cca3,continents';

export async function fetchAllCountries(): Promise<RestCountry[]> {
  const { data } = await axios.get<RestCountry[]>(
    `https://restcountries.com/v3.1/all?fields=${FIELDS}`
  );
  return data;
}

export async function fetchByName(nome: string): Promise<RestCountry[]> {
  try {
    const { data } = await axios.get<RestCountry[]>(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(
        nome
      )}?fullText=false&fields=${FIELDS}`
    );
    return data;
  } catch (err: any) {
    if (err.response?.status === 404) return [];
    throw err;
  }
}

export async function fetchByCode(code: string): Promise<RestCountry | null> {
  try {
    const { data } = await axios.get<RestCountry[]>(
      `https://restcountries.com/v3.1/alpha/${code}?fields=${FIELDS}`
    );
    return Array.isArray(data) ? data[0] : data;
  } catch (err: any) {
    if (err.response?.status === 404) return null;
    throw err;
  }
}
