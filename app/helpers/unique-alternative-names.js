export default function hasUniqueAlternativeNames(account) {
  const orgName = account.gebruiker.achternaam;
  const allUniqueAltNames = [];

  account.gebruiker.bestuurseenheden.forEach((bestuurseenheid) => {
    const alternativeNames = bestuurseenheid.alternatieveNaam || [];
    const uniqueAltNames = alternativeNames.filter(
      (altName) => altName !== orgName,
    );
    allUniqueAltNames.push(...uniqueAltNames);
  });

  return allUniqueAltNames;
}
