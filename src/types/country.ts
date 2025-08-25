export interface Country {
  nome: string;
  populacao: number;
  continente: string;
  codigo: string;
}

export interface CountryWithVotes extends Country {
  likes: number;
  dislikes: number;
  votosTotais: number;
}
