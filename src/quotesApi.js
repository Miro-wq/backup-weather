// quotesApi.js

const cityAuthorMapping = {
  'New York': {
    author: 'Mark Twain',
    quote: 'The secret of getting ahead is getting started.',
  },
  Paris: {
    author: 'Victor Hugo',
    quote: 'He who opens a school door, closes a prison.',
  },
  London: {
    author: 'William Shakespeare',
    quote: 'To be, or not to be, that is the question.',
  },
  Vienna: {
    author: 'Sigmund Freud',
    quote: 'Being entirely honest with oneself is a good exercise.',
  },
  Rome: {
    author: 'Marcus Aurelius',
    quote:
      'The happiness of your life depends upon the quality of your thoughts.',
  },
  Tokyo: {
    author: 'Haruki Murakami',
    quote:
      'And once the storm is over, you won’t remember how you made it through.',
  },
  Dublin: {
    author: 'James Joyce',
    quote:
      'A man of genius makes no mistakes. His errors are volitional and are the portals of discovery.',
  },
  Moscow: {
    author: 'Leo Tolstoy',
    quote:
      'Everyone thinks of changing the world, but no one thinks of changing himself.',
  },
  Berlin: {
    author: 'Albert Einstein',
    quote:
      'Life is like riding a bicycle. To keep your balance, you must keep moving.',
  },
  Athens: {
    author: 'Plato',
    quote: 'The greatest wealth is to live content with little.',
  },
  Beijing: {
    author: 'Confucius',
    quote: 'It does not matter how slowly you go as long as you do not stop.',
  },
  Madrid: {
    author: 'Miguel de Cervantes',
    quote: 'The pen is the tongue of the mind.',
  },
  Cairo: {
    author: 'Naguib Mahfouz',
    quote:
      'You can tell whether a man is clever by his answers. You can tell whether a man is wise by his questions.',
  },
  Lisbon: {
    author: 'Fernando Pessoa',
    quote: 'Literature is the most agreeable way of ignoring life.',
  },
  'Buenos Aires': {
    author: 'Jorge Luis Borges',
    quote: 'I have always imagined that Paradise will be a kind of library.',
  },
  'Mexico City': {
    author: 'Octavio Paz',
    quote: 'Solitude is the profoundest fact of the human condition.',
  },
  Istanbul: {
    author: 'Orhan Pamuk',
    quote: 'Real museums are places where Time is transformed into Space.',
  },
  Sydney: {
    author: 'Patrick White',
    quote:
      "Life is always going to be stranger than fiction, because fiction has to be convincing, and life doesn't.",
  },
  Johannesburg: {
    author: 'Nelson Mandela',
    quote: 'It always seems impossible until it’s done.',
  },
  // Orașe din România
  Bucharest: {
    author: 'Mihai Eminescu',
    quote: 'Toate-s vechi și nouă toate.',
  },
  'Cluj-Napoca': {
    author: 'Lucian Blaga',
    quote: 'Eu nu strivesc corola de minuni a lumii.',
  },
  Timișoara: {
    author: 'Ioan Slavici',
    quote: 'Nu există prietenie mai frumoasă decât a unui om cu o carte.',
  },
  Iași: {
    author: 'Mihail Sadoveanu',
    quote: 'Adevărul este comoara cea mai de preț a omului.',
  },
  Constanța: {
    author: 'Ovidiu',
    quote:
      'Găsesc în fiecare zi, fără excepție, o bucurie deosebită în studiu.',
  },
  Sibiu: {
    author: 'Emil Cioran',
    quote: 'Pe culmile disperării.',
  },
  Brașov: {
    author: 'George Coșbuc',
    quote: 'De la lume adunate și-napoi la lume date.',
  },
  Craiova: {
    author: 'Marin Sorescu',
    quote: 'Timpul este un tren care ne duce pe toți.',
  },
  Oradea: {
    author: 'Ady Endre',
    quote: 'Viața este un cântec nesfârșit.',
  },
  Arad: {
    author: 'Ioan Slavici',
    quote: 'Nu există prietenie mai frumoasă decât a unui om cu o carte.',
  },
  Ploiești: {
    author: 'Nichita Stănescu',
    quote: 'Ce bine că ești, ce mirare că sunt.',
  },
  Galați: {
    author: 'Fănuș Neagu',
    quote: 'În fiecare om sălășluiește o poveste.',
  },
  Pitești: {
    author: 'Ion Minulescu',
    quote: 'Într-o zi toate visele vor deveni amintiri.',
  },
  Suceava: {
    author: 'Eugen Lovinescu',
    quote: 'Literatura este arta de a exprima frumosul.',
  },
  Bacău: {
    author: 'George Bacovia',
    quote: 'Plouă, plouă, plouă...',
  },
  'Târgu Mureș': {
    author: 'Liviu Rebreanu',
    quote: 'Cărțile sunt prietenii cei mai liniștiți și constanți.',
  },
  'Baia Mare': {
    author: 'Ion Creangă',
    quote: 'Amintirile din copilărie sunt povestite cu sufletul unui om mare.',
  },
  Buzău: {
    author: 'Vasile Voiculescu',
    quote: 'Poezia este o stare de grație.',
  },
  'Satu Mare': {
    author: 'Ady Endre',
    quote: 'Viața este un cântec nesfârșit.',
  },
  Brăila: {
    author: 'Panait Istrati',
    quote: 'Omul este măsura tuturor lucrurilor.',
  },
  // Orașe cele mai căutate în lume
  'Los Angeles': {
    author: 'Ray Bradbury',
    quote:
      'You don’t have to burn books to destroy a culture. Just get people to stop reading them.',
  },
  'San Francisco': {
    author: 'Jack London',
    quote: 'The proper function of man is to live, not to exist.',
  },
  'Hong Kong': {
    author: 'Eileen Chang',
    quote: 'Every form of happiness is private.',
  },
  Singapore: {
    author: 'Lee Kuan Yew',
    quote:
      'The first thing you must remember is that Singapore is an artificial creation.',
  },
  Dubai: {
    author: 'Mohammed bin Rashid Al Maktoum',
    quote: 'The race for excellence has no finish line.',
  },
  Bangkok: {
    author: 'Pridi Banomyong',
    quote: 'Peace is preferable to war.',
  },
  Toronto: {
    author: 'Margaret Atwood',
    quote: 'A word after a word after a word is power.',
  },
  Chicago: {
    author: 'Ernest Hemingway',
    quote:
      'There is nothing to writing. All you do is sit down at a typewriter and bleed.',
  },
  Seoul: {
    author: 'Han Kang',
    quote: 'The more precious something is, the more you want to avoid it.',
  },
};

export async function getAuthorByCity(city) {
  // Returnează autorul în funcție de oraș
  return cityAuthorMapping[city] || null;
}

export async function getQuoteByAuthor(authorData) {
  if (authorData) {
    return authorData.quote;
  }
  return `No quotes found for the specified city.`;
}
