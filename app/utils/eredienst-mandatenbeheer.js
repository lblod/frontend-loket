export async function fetchBestuursorganenInTijd(store, uri) {
  let bestuursorganenInTijd = await store.query('bestuursorgaan', {
    'filter[bevat][:uri:]': uri,
    sort: '-binding-start',
  });
  return bestuursorganenInTijd;
}

export async function setExpectedEndDate(
  bestuursorganenInTijd,
  mandataris,
  mandaat
) {
  const lifetimeMandate =
    'http://data.vlaanderen.be/id/concept/BestuursfunctieCode/5972fccd87f864c4ec06bfbd20b5008b'; // Bestuurslid (van rechtswege) is a lifetime mandate
  let bestuursfunctie = await mandaat.bestuursfunctie;
  if (bestuursfunctie.uri === lifetimeMandate) {
    mandataris.expectedEndDate = undefined;
  } else {
    let plannedEndDates = bestuursorganenInTijd.map(
      (bestuursorgan) => bestuursorgan.bindingEinde
    );
    mandataris.expectedEndDate =
      plannedEndDates[0] === undefined ? undefined : plannedEndDates[0];
  }
}
