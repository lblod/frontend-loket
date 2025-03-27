import { helper } from '@ember/component/helper';

export function hasUniqueAlternativeNames([account]) {
  const orgName = account.gebruiker.achternaam;

  return account.gebruiker.bestuurseenheden.some((bestuurseenheid) => {
    if (!bestuurseenheid.alternatieveNaam) {
      return false;
    }

    return bestuurseenheid.alternatieveNaam.some(
      (altName) => altName != orgName,
    );
  });
}

export default helper(hasUniqueAlternativeNames);
