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
 * Gets `activeTimePeriodes` for the selected `mandate`.
 * @param {Object} mandate Mandate record
 * @param {Object} store Ember store
 * @returns {Object} Active time periodes
 */
export async function getActiveTimePeriodes(mandate, store) {
  let bestuursorganenInTijd = await store.query('bestuursorgaan', {
    'filter[bevat][:uri:]': mandate.uri,
    sort: 'binding-start',
  });

  let activeTimePeriodes = bestuursorganenInTijd.map((bestuursorgaan) => {
    return {
      bindingStart: bestuursorgaan.bindingStart,
      bindingEinde: bestuursorgaan.bindingEinde,
    };
  });

  return activeTimePeriodes;
}

/**
 * Checks the mandate time periode limit, if it falls outside, we show a warning message to the user.
 *
 * NB : Lifetime mandates does not trigger warning messages.
 * @param {Object} mandate Mandate record
 * @param {Object} store Ember store
 * @param {Date} startDate Mandate starting date
 * @param {Date} endDate Mandate ending date
 * @returns {Object} Corresponding warning message with the {startDate} and {endDate} cases.
 */
export async function warnOnMandateExceededTimePeriode(
  mandate,
  store,
  startDate,
  endDate
) {
  if (!(await mandate)) {
    return; // Handling the case where we create a new worship-mandatee.
  }
  const activeTimePeriodes = await getActiveTimePeriodes(mandate, store);
  let activeTimePeriodeLimitStart;
  let activeTimePeriodeLimitEnd;
  let warningMessages = {};
  const { label } = await mandate.bestuursfunctie;
  // Maybe we should use uri instead
  switch (label) {
    case 'Voorzitter van het bestuur van de eredienst':
    case 'Penningmeester van het bestuur van de eredienst':
    case 'Secretaris van het bestuur van de eredienst':
      activeTimePeriodeLimitStart = activeTimePeriodes[0].bindingStart;
      activeTimePeriodeLimitEnd = activeTimePeriodes[0].bindingEinde;
      break;
    case 'Bestuurslid van het bestuur van de eredienst (Grote Helft)':
    case 'Bestuurslid van het bestuur van de eredienst (Kleine Helft)':
      activeTimePeriodeLimitStart = activeTimePeriodes[0].bindingStart;
      activeTimePeriodeLimitEnd = activeTimePeriodes[1].bindingEinde;
      break;
    case 'Bestuurslid (van rechtswege) van het bestuur van de eredienst':
      return; // no warnings needed for lifetime mandate
    default:
    // Handle unexpected ministerType
  }

  if (moment(startDate).isBefore(activeTimePeriodeLimitStart)) {
    warningMessages.startDateMessage = `Deze startdatum ${moment(
      startDate
    ).format(
      'DD-MM-YYYY'
    )} valt buiten het start van deze actieve tijdsperiode ${moment(
      activeTimePeriodeLimitStart
    ).format('DD-MM-YYYY')}.`;
  }
  if (moment(endDate).isAfter(activeTimePeriodeLimitEnd)) {
    warningMessages.endDateMessage = `Deze einddatum ${moment(endDate).format(
      'DD-MM-YYYY'
    )} valt buiten het einde van deze actieve tijdsperiode ${moment(
      activeTimePeriodeLimitEnd
    ).format('DD-MM-YYYY')}.`;
  }

  return warningMessages;
}
