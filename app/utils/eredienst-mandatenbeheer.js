import { isSameIsoDate } from './date';

/**
 * Assuming bestuursorganen in tijd are passed linked to mandates.
 * This function sets the einde and expectedEndDate from the array of bestuursorganenInTijd where records are ordered by DESC,
 * so the greatest binding-einde is the expectedEndDate for each selected mandate.
 * @returns an object with warning messages as properties if any warnings need to be shown
 */
export async function setMandate(store, mandataris, mandaat) {
  const currentMandate = await mandataris.bekleedt;
  const hasCurrentMandate = Boolean(currentMandate);

  let bestuursfunctie = await mandaat.bestuursfunctie;

  const currentEndDate = mandataris.einde;
  const currentExpectedEndDate = mandataris.expectedEndDate;
  const isCurrentlyEmpty = !currentEndDate;
  const wasDateChangedManually =
    hasCurrentMandate && !isSameIsoDate(currentEndDate, currentExpectedEndDate);

  let warnings;

  //   Scenarios:

  // - er was nog geen mandaat geselecteerd: prefill end date, geen warning
  // - er was een mandaat geselecteerd:
  //     - de einddatum is leeg => prefill end date, warning?
  //     - einddatum is gelijk aan de vorige expected end date
  //         - nieuw mandaat is niet “van rechtswege” => overschrijf met nieuwe expected end date, warning als de nieuwe datum anders is dan de vorige
  //         -  nieuw mandaat is “van rechtswege” => veld leegmaken, warning tonen? (volgens bug issue niet)
  //     - einddatum werd manueel aangepast => niet overschrijven, warning dat de gebruiker het veld moet nakijken (ook voor “van rechtswege”, volgens bug issue niet)?

  // TODO: DRY this up once all the cases are covered so we know the final logic.
  if (!hasCurrentMandate) {
    if (isLifetimeBoardPosition(bestuursfunctie)) {
      mandataris.expectedEndDate = undefined;
      mandataris.einde = undefined;
    } else {
      const expectedEndDate = await getExpectedEndDateForPosition(
        store,
        mandaat
      );
      mandataris.expectedEndDate = expectedEndDate;
      mandataris.einde = expectedEndDate;
    }
  } else if (isCurrentlyEmpty) {
    if (isLifetimeBoardPosition(bestuursfunctie)) {
      mandataris.expectedEndDate = undefined;
      mandataris.einde = undefined;
    } else {
      const expectedEndDate = await getExpectedEndDateForPosition(
        store,
        mandaat
      );
      mandataris.expectedEndDate = expectedEndDate;
      mandataris.einde = expectedEndDate;
    }
  } else if (!wasDateChangedManually) {
    if (isLifetimeBoardPosition(bestuursfunctie)) {
      mandataris.expectedEndDate = undefined;
      mandataris.einde = undefined;
    } else {
      const expectedEndDate = await getExpectedEndDateForPosition(
        store,
        mandaat
      );
      mandataris.expectedEndDate = expectedEndDate;
      mandataris.einde = expectedEndDate;

      if (!isSameIsoDate(expectedEndDate, currentEndDate)) {
        warnings = {
          einde:
            'De einddatum werd automatisch aangepast naar de nieuwe geplande einddatum. Gelieve de einddatum te controleren',
        };
      }
    }
  } else if (wasDateChangedManually) {
    if (!isLifetimeBoardPosition) {
      warnings = {
        einde: 'De functie werd aangepast. Gelieve de einddatum te controleren',
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
