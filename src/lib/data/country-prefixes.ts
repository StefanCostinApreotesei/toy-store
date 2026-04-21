// National phone number lengths (digits AFTER the country prefix, excluding any leading trunk 0).
// Order: Romania first, Moldova second, then all European countries (plus US/CA) alphabetical by Romanian name.

export interface CountryPrefix {
  code: string;       // ISO 3166-1 alpha-2 (XK used for Kosovo per common practice)
  name: string;       // Romanian display name
  dial: string;       // "+40", "+44", ...
  flag: string;       // emoji flag
  minLength: number;  // min national subscriber digits
  maxLength: number;  // max national subscriber digits
}

export const COUNTRY_PREFIXES: CountryPrefix[] = [
  // 1. Romania (default)
  { code: "RO", name: "România",           dial: "+40",  flag: "🇷🇴", minLength: 9,  maxLength: 9 },
  // 2. Moldova
  { code: "MD", name: "Republica Moldova", dial: "+373", flag: "🇲🇩", minLength: 8,  maxLength: 8 },

  // 3+. Rest alphabetical (by Romanian name)
  { code: "AL", name: "Albania",             dial: "+355", flag: "🇦🇱", minLength: 8,  maxLength: 9 },
  { code: "AD", name: "Andorra",             dial: "+376", flag: "🇦🇩", minLength: 6,  maxLength: 9 },
  { code: "AM", name: "Armenia",             dial: "+374", flag: "🇦🇲", minLength: 8,  maxLength: 8 },
  { code: "AT", name: "Austria",             dial: "+43",  flag: "🇦🇹", minLength: 10, maxLength: 11 },
  { code: "AZ", name: "Azerbaidjan",         dial: "+994", flag: "🇦🇿", minLength: 9,  maxLength: 9 },
  { code: "BY", name: "Belarus",             dial: "+375", flag: "🇧🇾", minLength: 9,  maxLength: 9 },
  { code: "BE", name: "Belgia",              dial: "+32",  flag: "🇧🇪", minLength: 9,  maxLength: 9 },
  { code: "BA", name: "Bosnia și Herțegovina", dial: "+387", flag: "🇧🇦", minLength: 8, maxLength: 8 },
  { code: "BG", name: "Bulgaria",            dial: "+359", flag: "🇧🇬", minLength: 8,  maxLength: 9 },
  { code: "CA", name: "Canada",              dial: "+1",   flag: "🇨🇦", minLength: 10, maxLength: 10 },
  { code: "CZ", name: "Cehia",               dial: "+420", flag: "🇨🇿", minLength: 9,  maxLength: 9 },
  { code: "CY", name: "Cipru",               dial: "+357", flag: "🇨🇾", minLength: 8,  maxLength: 8 },
  { code: "HR", name: "Croația",             dial: "+385", flag: "🇭🇷", minLength: 8,  maxLength: 9 },
  { code: "DK", name: "Danemarca",           dial: "+45",  flag: "🇩🇰", minLength: 8,  maxLength: 8 },
  { code: "CH", name: "Elveția",             dial: "+41",  flag: "🇨🇭", minLength: 9,  maxLength: 9 },
  { code: "EE", name: "Estonia",             dial: "+372", flag: "🇪🇪", minLength: 7,  maxLength: 8 },
  { code: "FI", name: "Finlanda",            dial: "+358", flag: "🇫🇮", minLength: 9,  maxLength: 11 },
  { code: "FR", name: "Franța",              dial: "+33",  flag: "🇫🇷", minLength: 9,  maxLength: 9 },
  { code: "GE", name: "Georgia",             dial: "+995", flag: "🇬🇪", minLength: 9,  maxLength: 9 },
  { code: "DE", name: "Germania",            dial: "+49",  flag: "🇩🇪", minLength: 10, maxLength: 11 },
  { code: "GR", name: "Grecia",              dial: "+30",  flag: "🇬🇷", minLength: 10, maxLength: 10 },
  { code: "IE", name: "Irlanda",             dial: "+353", flag: "🇮🇪", minLength: 7,  maxLength: 9 },
  { code: "IS", name: "Islanda",             dial: "+354", flag: "🇮🇸", minLength: 7,  maxLength: 7 },
  { code: "IT", name: "Italia",              dial: "+39",  flag: "🇮🇹", minLength: 9,  maxLength: 10 },
  { code: "KZ", name: "Kazahstan",           dial: "+7",   flag: "🇰🇿", minLength: 10, maxLength: 10 },
  { code: "XK", name: "Kosovo",              dial: "+383", flag: "🇽🇰", minLength: 8,  maxLength: 8 },
  { code: "LV", name: "Letonia",             dial: "+371", flag: "🇱🇻", minLength: 8,  maxLength: 8 },
  { code: "LI", name: "Liechtenstein",       dial: "+423", flag: "🇱🇮", minLength: 7,  maxLength: 7 },
  { code: "LT", name: "Lituania",            dial: "+370", flag: "🇱🇹", minLength: 8,  maxLength: 8 },
  { code: "LU", name: "Luxemburg",           dial: "+352", flag: "🇱🇺", minLength: 6,  maxLength: 11 },
  { code: "MK", name: "Macedonia de Nord",   dial: "+389", flag: "🇲🇰", minLength: 8,  maxLength: 8 },
  { code: "MT", name: "Malta",               dial: "+356", flag: "🇲🇹", minLength: 8,  maxLength: 8 },
  { code: "GB", name: "Marea Britanie",      dial: "+44",  flag: "🇬🇧", minLength: 10, maxLength: 10 },
  { code: "MC", name: "Monaco",              dial: "+377", flag: "🇲🇨", minLength: 8,  maxLength: 9 },
  { code: "ME", name: "Muntenegru",          dial: "+382", flag: "🇲🇪", minLength: 8,  maxLength: 8 },
  { code: "NO", name: "Norvegia",            dial: "+47",  flag: "🇳🇴", minLength: 8,  maxLength: 8 },
  { code: "NL", name: "Olanda",              dial: "+31",  flag: "🇳🇱", minLength: 9,  maxLength: 9 },
  { code: "PL", name: "Polonia",             dial: "+48",  flag: "🇵🇱", minLength: 9,  maxLength: 9 },
  { code: "PT", name: "Portugalia",          dial: "+351", flag: "🇵🇹", minLength: 9,  maxLength: 9 },
  { code: "RU", name: "Rusia",               dial: "+7",   flag: "🇷🇺", minLength: 10, maxLength: 10 },
  { code: "SM", name: "San Marino",          dial: "+378", flag: "🇸🇲", minLength: 6,  maxLength: 10 },
  { code: "RS", name: "Serbia",              dial: "+381", flag: "🇷🇸", minLength: 8,  maxLength: 9 },
  { code: "SK", name: "Slovacia",            dial: "+421", flag: "🇸🇰", minLength: 9,  maxLength: 9 },
  { code: "SI", name: "Slovenia",            dial: "+386", flag: "🇸🇮", minLength: 8,  maxLength: 8 },
  { code: "ES", name: "Spania",              dial: "+34",  flag: "🇪🇸", minLength: 9,  maxLength: 9 },
  { code: "US", name: "Statele Unite",       dial: "+1",   flag: "🇺🇸", minLength: 10, maxLength: 10 },
  { code: "SE", name: "Suedia",              dial: "+46",  flag: "🇸🇪", minLength: 7,  maxLength: 10 },
  { code: "TR", name: "Turcia",              dial: "+90",  flag: "🇹🇷", minLength: 10, maxLength: 10 },
  { code: "UA", name: "Ucraina",             dial: "+380", flag: "🇺🇦", minLength: 9,  maxLength: 9 },
  { code: "HU", name: "Ungaria",             dial: "+36",  flag: "🇭🇺", minLength: 8,  maxLength: 9 },
  { code: "VA", name: "Vatican",             dial: "+379", flag: "🇻🇦", minLength: 6,  maxLength: 10 },
];

export const DEFAULT_COUNTRY_PREFIX = COUNTRY_PREFIXES[0]; // Romania

export function normalizePhoneDigits(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.startsWith("0") ? digits.slice(1) : digits;
}

export function isPhoneValidForCountry(
  localNumber: string,
  prefix: CountryPrefix
): boolean {
  const digits = normalizePhoneDigits(localNumber);
  return digits.length >= prefix.minLength && digits.length <= prefix.maxLength;
}
