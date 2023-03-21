import { isSameIsoDate } from './date';

/**
 * Assuming bestuursorganen in tijd are passed linked to mandates.
 * This function sets the mandate and the end dates from the array of bestuursorganenInTijd where records are ordered by DESC,
 * so the greatest binding-einde is the expectedEndDate for each selected mandate.
 * @returns an object with warning messages as properties if any warnings need to be shown
 */
export async function setMandate(store, mandataris, mandaat) {
  const currentMandate = await mandataris.bekleedt;
  const hasCurrentMandate = Boolean(currentMandate);

  const bestuursfunctie = await mandaat.bestuursfunctie;

  const currentEndDate = mandataris.einde;
  const isCurrentlyEmpty = !currentEndDate;
  const shouldShowWarning = hasCurrentMandate && !isCurrentlyEmpty;

  let warnings;

  if (isLifetimeBoardPosition(bestuursfunctie)) {
    mandataris.expectedEndDate = undefined;
    mandataris.einde = undefined;

    if (shouldShowWarning) {
      warnings = {
        einde:
          'De einddatum werd automatisch aangepast. Gelieve de einddatum te controleren',
      };
    }
  } else {
    const expectedEndDate = await getExpectedEndDateForPosition(store, mandaat);
    mandataris.expectedEndDate = expectedEndDate;
    mandataris.einde = expectedEndDate;

    if (shouldShowWarning && !isSameIsoDate(expectedEndDate, currentEndDate)) {
      warnings = {
        einde:
          'De einddatum werd automatisch aangepast naar de nieuwe geplande einddatum. Gelieve de einddatum te controleren',
      };
    }
  }

  mandataris.bekleedt = mandaat;
  mandataris.errors.remove('bekleedt');
  return warnings;
}

async function getExpectedEndDateForPosition(store, mandaat) {
  let bestuursorganenInTijd = await store.query('bestuursorgaan', {
    'filter[bevat][:uri:]': mandaat.uri,
    sort: '-binding-start',
  });
  let expectedEndDates = bestuursorganenInTijd.map(
    (bestuursorgaan) => bestuursorgaan.bindingEinde
  );

  return expectedEndDates[0];
}

export function isLifetimeBoardPosition(boardPosition) {
  const lifetimeBoardPosition =
    'http://data.vlaanderen.be/id/concept/BestuursfunctieCode/5972fccd87f864c4ec06bfbd20b5008b'; // Bestuurslid (van rechtswege) is a lifetime mandate

  return boardPosition.uri === lifetimeBoardPosition;
}
