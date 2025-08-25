export interface Country {
  nome: string;
  populacao: number;
  continente: string;
  codigo: string;
}

export function mapCountry(c: any): Country {
  return {
    nome: c?.name?.common ?? '',
    populacao: c?.population ?? 0,
    continente: Array.isArray(c?.continents)
      ? c.continents[0]
      : c?.continents ?? '',
    codigo: c?.cca3 ?? '',
  };
}
