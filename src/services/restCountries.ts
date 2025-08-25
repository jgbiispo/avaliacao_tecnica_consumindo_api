import axios from 'axios';

const FIELDS = 'name,population,cca3,continents';

export async function fetchAllCountries() {
  const { data } = await axios.get(
    `https://restcountries.com/v3.1/all?fields=${FIELDS}`
  );
  return data;
}

export async function fetchByName(nome: string) {
  try {
    const { data } = await axios.get(
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

export async function fetchByCode(code: string) {
  try {
    const { data } = await axios.get(
      `https://restcountries.com/v3.1/alpha/${code}?fields=${FIELDS}`
    );
    return Array.isArray(data) ? data[0] : data;
  } catch (err: any) {
    if (err.response?.status === 404) return null;
    throw err;
  }
}
