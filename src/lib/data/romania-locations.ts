// Romania: all 42 counties (județe) and all 13,754 localities (orașe, comune, sate).
// Source: virgil-av/judet-oras-localitati-romania (based on official INS SIRUTA data).
// Diacritics normalized to modern Romanian (ț/ș with comma-below, not cedilla).

import raw from "./romania-localitati.json";

interface RawJudet {
  code: string;
  name: string;
  localitati: string[];
}

const DATA = raw.judete as RawJudet[];

export const JUDETE = DATA.map((j) => j.name);
export type Judet = string;

export const LOCALITATI_BY_JUDET: Record<string, string[]> = Object.fromEntries(
  DATA.map((j) => [j.name, j.localitati])
);

export const ALL_LOCALITATI: string[] = DATA.flatMap((j) => j.localitati);
