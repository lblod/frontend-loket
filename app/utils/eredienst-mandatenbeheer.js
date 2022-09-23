/*
 * Assuming bestuursorganen in tijd are passed linked to mandates.
 * This function sets the expectedEndDate from the array of bestuursorganenInTijd where records are ordered by DESC,
 * so the greatest binding-einde is the expectedEndDate for each selected mandate.
 */
export async function setExpectedEndDate(store, mandataris, mandaat) {
  const lifetimeMandate =
    'http://data.vlaanderen.be/id/concept/BestuursfunctieCode/5972fccd87f864c4ec06bfbd20b5008b'; // Bestuurslid (van rechtswege) is a lifetime mandate
  let bestuursfunctie = await mandaat.bestuursfunctie;

  let bestuursorganenInTijd = await store.query('bestuursorgaan', {
    'filter[bevat][:uri:]': mandaat.uri,
    sort: '-binding-start',
  });
  if (bestuursfunctie.uri === lifetimeMandate) {
    mandataris.expectedEndDate = undefined;
  } else {
    let plannedEndDates = bestuursorganenInTijd.map(
      (bestuursorgaan) => bestuursorgaan.bindingEinde
    );
    mandataris.expectedEndDate = plannedEndDates[0];
  }
}
