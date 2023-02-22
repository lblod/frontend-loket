import moment from 'moment';
/*
 * Assuming bestuursorganen in tijd are passed linked to mandates.
 * This function sets the expectedEndDate from the array of bestuursorganenInTijd where records are ordered by DESC,
 * so the greatest binding-einde is the expectedEndDate for each selected mandate.
 */
export async function setExpectedEndDate(store, mandataris, mandaat) {
  const lifetimeMandate =
    'http://data.vlaanderen.be/id/concept/BestuursfunctieCode/5972fccd87f864c4ec06bfbd20b5008b'; // Bestuurslid (van rechtswege) is a lifetime mandate
  let bestuursfunctie = await mandaat.bestuursfunctie;

  if (bestuursfunctie.uri === lifetimeMandate) {
    mandataris.expectedEndDate = undefined;
  } else {
    let bestuursorganenInTijd = await store.query('bestuursorgaan', {
      'filter[bevat][:uri:]': mandaat.uri,
      sort: '-binding-start',
    });
    let plannedEndDates = bestuursorganenInTijd.map(
      (bestuursorgaan) => bestuursorgaan.bindingEinde
    );
    mandataris.expectedEndDate = plannedEndDates[0];
  }
}

/**
 * Handling the Mandatee einddatum prefill.
 * @param {Date} userInputEndDate `null` or `Date`
 * @param {Object} worshipMandatee `worship-mandatee` Record
 * @param {Date} endDate Mandate `expectedEndDate` or `this.userInputEndDate`
 * @returns Object containing `worshipMandatee` `userInputEndDate` `warningMessages`
 */
export function handlePrefillEndDate(
  userInputEndDate,
  worshipMandatee,
  endDate
) {
  if (
    worshipMandatee.expectedEndDate &&
    moment(worshipMandatee.expectedEndDate).isSame(moment(endDate))
  ) {
    userInputEndDate = null;
    worshipMandatee.einde = endDate;
  } else if (!worshipMandatee.expectedEndDate) {
    // Handling the case where the mandate is Bestuurslid (van rechtswege)
    worshipMandatee.einde = userInputEndDate || endDate;
  } else {
    userInputEndDate = endDate;
    worshipMandatee.einde = userInputEndDate;
  }

  const warningMessages = userInputEndDate
    ? {
        userInputEndDateMessage:
          'Deze einddatum wordt handmatig ingevoerd, het verdient aanbeveling te controleren of deze geldig is.',
      }
    : {};

  return { worshipMandatee, userInputEndDate, warningMessages };
}
