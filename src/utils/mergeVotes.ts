import { Country, CountryWithVotes } from '../types/country';
import { CountryVote } from '@prisma/client';

export function mergeVotes(
  country: Country,
  voteRow?: CountryVote
): CountryWithVotes {
  const likes = voteRow?.likes ?? 0;
  const dislikes = voteRow?.dislikes ?? 0;

  return {
    ...country,
    likes,
    dislikes,
    votosTotais: likes + dislikes,
  };
}
