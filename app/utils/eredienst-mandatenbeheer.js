import { isSameIsoDate } from './date';

/**
 * Assuming bestuursorganen in tijd are passed linked to mandates.
 * This function sets the einde and expectedEndDate from the array of bestuursorganenInTijd where records are ordered by DESC,
 * so the greatest binding-einde is the expectedEndDate for each selected mandate.
 * @returns an object with warning messages as properties if any warnings need to be shown
 */
export async function setEndDates(store, mandataris, mandaat) {
  const lifetimeMandate =
    'http://data.vlaanderen.be/id/concept/BestuursfunctieCode/5972fccd87f864c4ec06bfbd20b5008b'; // Bestuurslid (van rechtswege) is a lifetime mandate
  let bestuursfunctie = await mandaat.bestuursfunctie;

  const currentEndDate = mandataris.einde;
  let warnings;

  if (bestuursfunctie.uri === lifetimeMandate) {
    mandataris.expectedEndDate = undefined;
    mandataris.einde = undefined;
  } else {
    let bestuursorganenInTijd = await store.query('bestuursorgaan', {
      'filter[bevat][:uri:]': mandaat.uri,
      sort: '-binding-start',
    });
    let plannedEndDates = bestuursorganenInTijd.map(
      (bestuursorgaan) => bestuursorgaan.bindingEinde
    );
    mandataris.expectedEndDate = plannedEndDates[0];
    mandataris.einde = plannedEndDates[0];
  }

  if (!isSameIsoDate(mandataris.einde, currentEndDate)) {
    warnings = {
      einde:
        'De einddatum werd automatisch aangepast naar de nieuwe geplande einddatum. Gelieve de einddatum te controleren',
    };
  }

  return warnings;
}
